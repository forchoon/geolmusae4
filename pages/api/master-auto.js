const XLSX=require('xlsx');
const pdfParse=require('pdf-parse');
const AdmZip=require('adm-zip');

const BROWSER_UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0 Safari/537.36';
const KRW_PER_USD=1380;

async function getBuffer(url,headers={}){
  const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':BROWSER_UA,'Accept':'*/*',...headers}});
  if(!r.ok)throw new Error(`${r.status} ${url}`);
  return {buf:Buffer.from(await r.arrayBuffer()),contentType:r.headers.get('content-type')||''};
}
function krwFromUsd(n){
  const w=n*KRW_PER_USD;
  if(w>=1e12)return `약 ${(w/1e12).toFixed(w>=1e13?1:2).replace(/\.0+$/,'')}조원`;
  if(w>=1e8)return `약 ${(w/1e8).toFixed(w>=1e9?1:2).replace(/\.0+$/,'')}억원`;
  if(w>=1e4)return `약 ${Math.round(w/1e4).toLocaleString('ko-KR')}만원`;
  return `약 ${Math.round(w).toLocaleString('ko-KR')}원`;
}
function rangeKrw(lo,hi){return `${krwFromUsd(lo)}~${krwFromUsd(hi).replace(/^약 /,'')}`;}
function isoFromUS(s){const m=String(s).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);return m?`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`:'';}
function excelDate(v){
  if(v instanceof Date)return v.toISOString().slice(0,10);
  if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}
  const s=String(v||'').trim();
  const ymd=s.match(/(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})/);if(ymd)return `${ymd[1]}-${ymd[2].padStart(2,'0')}-${ymd[3].padStart(2,'0')}`;
  return isoFromUS(s);
}
function emoji(name){const s=String(name).toUpperCase();if(s.includes('APPLE'))return'🍎';if(s.includes('ALPHABET')||s.includes('GOOGLE'))return'🔎';if(s.includes('AMAZON'))return'📦';if(s.includes('INTEL')||s.includes('NVIDIA'))return'🧠';if(s.includes('COINBASE'))return'🪙';if(s.includes('TESLA'))return'🚗';if(s.includes('ROKU'))return'📺';if(s.includes('ROBINHOOD'))return'🏹';if(s.includes('CIRCLE'))return'⭕';if(s.includes('UBER'))return'🚕';return'📈';}
function cleanHeader(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9%]+/g,'');}

function parseArkWorkbook(buf){
  const wb=XLSX.read(buf,{type:'buffer',cellDates:true});
  const out=[];
  for(const sheet of wb.SheetNames){
    const matrix=XLSX.utils.sheet_to_json(wb.Sheets[sheet],{header:1,defval:'',raw:true});
    let hi=-1,headers=[];
    for(let i=0;i<Math.min(matrix.length,15);i++){
      const h=matrix[i].map(cleanHeader);
      const nonEmpty=h.filter(Boolean);
      if(nonEmpty.length<5)continue;
      const score=['fund','date','direction','ticker','name','shares'].filter(k=>h.includes(k)).length;
      if(score>=5){hi=i;headers=h;break;}
    }
    if(hi<0)continue;
    const idx=re=>headers.findIndex(x=>re.test(x));
    const dateI=idx(/^date$/),fundI=idx(/^fund$/),dirI=idx(/^direction$/),tickerI=idx(/^ticker$/),companyI=idx(/^name$|company|securityname/),sharesI=idx(/^shares$/);
    for(let i=hi+1;i<matrix.length;i++){
      const row=matrix[i];
      if(!row||!row.some(v=>String(v).trim()))continue;
      out.push({
        fund:fundI>=0?String(row[fundI]||'').trim():'',
        date:dateI>=0?excelDate(row[dateI]):'',
        direction:dirI>=0?String(row[dirI]||'').trim():'',
        ticker:tickerI>=0?String(row[tickerI]||'').trim():'',
        company:companyI>=0?String(row[companyI]||'').trim():'',
        shares:sharesI>=0?Number(String(row[sharesI]||'').replace(/,/g,''))||0:0
      });
    }
  }
  return out;
}
async function getArk(){
  const url='https://etfs.ark-funds.com/hubfs/idt/trades/ARK_Trades.xls';
  const {buf,contentType}=await getBuffer(url,{
    'Referer':'https://www.ark-funds.com/ark-trade-notifications',
    'Accept':'application/vnd.ms-excel,application/octet-stream;q=0.9,*/*;q=0.8'
  });
  if(buf.length<500)throw new Error(`ARK file too small ${buf.length} ${contentType}`);
  const rows=parseArkWorkbook(buf);
  const buys=rows.filter(x=>x.date&&x.ticker&&/^buy$/i.test(x.direction));
  buys.sort((a,b)=>b.date.localeCompare(a.date));
  const latest=buys[0]?.date;
  if(!latest){const sample=rows.slice(0,4).map(x=>`${x.date}|${x.direction}|${x.ticker}`).join(';');throw new Error(`ARK rows=${rows.length}, buys=0, sample=${sample}`);}
  const grouped=new Map();
  for(const x of buys.filter(x=>x.date===latest)){
    const k=x.ticker;
    if(!grouped.has(k))grouped.set(k,{...x,shares:0,funds:new Set()});
    const g=grouped.get(k);g.shares+=x.shares;if(x.fund)g.funds.add(x.fund);
  }
  const items=[...grouped.values()].sort((a,b)=>b.shares-a.shares).slice(0,3).map(x=>({
    emoji:emoji(x.company||x.ticker),name:x.company||x.ticker,ticker:x.ticker,badge:'🟢 더 담음',eventDate:x.date,period:x.date,
    scale:x.shares?`${Math.round(x.shares).toLocaleString('en-US')}주 매수 공개`:'매수 공개',rawScale:'',
    summary:`${[...x.funds].join('·')||'ARK ETF'}에서 ${x.ticker}을(를) 추가 매수한 내역이 공식 최신 거래 파일에 공개됐어요.`,
    cta:'그날 나도 샀다면? →',sourceLabel:'ARK 공식 거래 알림',sourceUrl:'https://www.ark-funds.com/ark-trade-notifications',market:'us',basis:'ARK가 공개한 거래일 기준'
  }));
  return {title:'🚀 캐시 우드는 최근 뭐 샀지?',subtitle:'ARK가 장 마감 뒤 공개하는 최신 거래 파일을 자동으로 확인해요.',freshness:`ARK 공식 공개 거래 · ${latest}`,note:'💡 ARK 거래 알림은 장 마감 뒤 공개돼요. IPO·ETF 설정·환매 등 일부 거래는 파일에서 빠질 수 있어요.',items,updatedAt:new Date().toISOString()};
}

function findPelosiFilings(txt,year){
  const lines=txt.split(/\r?\n/).filter(Boolean),found=[];
  for(const line of lines){
    if(!/pelosi/i.test(line))continue;
    const c=line.split('\t').map(v=>v.trim());
    if(!c.some(v=>v==='P'))continue;
    const doc=c.find(v=>/^2\d{7}$/.test(v));
    const filingDate=c.find(v=>/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(v));
    if(doc)found.push({doc,filingDate:filingDate||'',year});
  }
  found.sort((a,b)=>(isoFromUS(b.filingDate)||b.doc).localeCompare(isoFromUS(a.filingDate)||a.doc));
  return found;
}
function parsePelosiTransactions(text){
  const compact=text.replace(/\u0000/g,'').replace(/\r/g,' ').replace(/\n+/g,' ').replace(/\s+/g,' ');
  const out=[];
  const re=/(SP|JT|DC|DEP)\s*(.{3,240}?)\s*(P|S \(partial\)|S|E)(\d{2}\/\d{2}\/\d{4})(\d{2}\/\d{2}\/\d{4})\$([\d,]+(?:\.\d+)?)\s*-\s*\$([\d,]+(?:\.\d+)?)/g;
  let m;
  while((m=re.exec(compact))&&out.length<40){
    out.push({owner:m[1],asset:m[2].trim(),type:m[3],date:m[4],notify:m[5],lo:Number(m[6].replace(/,/g,'')),hi:Number(m[7].replace(/,/g,''))});
  }
  return out;
}
async function getPelosi(){
  const year=new Date().getUTCFullYear();
  const zipUrl=`https://disclosures-clerk.house.gov/public_disc/financial-pdfs/${year}FD.ZIP`;
  const {buf}=await getBuffer(zipUrl,{'Accept':'application/zip,application/octet-stream,*/*'});
  const zip=new AdmZip(buf);
  const entries=zip.getEntries();
  const txtEntry=entries.find(e=>new RegExp(`${year}FD\\.txt$`,'i').test(e.entryName))||entries.find(e=>/\.txt$/i.test(e.entryName));
  if(!txtEntry)throw new Error('House yearly TXT index missing');
  const filings=findPelosiFilings(txtEntry.getData().toString('utf8'),year);
  if(!filings.length)throw new Error('Pelosi PTR not found in yearly index');
  let chosen=null,transactions=[];
  for(const filing of filings.slice(0,12)){
    try{
      const url=`https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/${year}/${filing.doc}.pdf`;
      const {buf:pdf}=await getBuffer(url,{'Referer':'https://disclosures-clerk.house.gov/FinancialDisclosure'});
      const parsed=await pdfParse(pdf);
      const buys=parsePelosiTransactions(parsed.text).filter(x=>x.type==='P');
      if(buys.length){chosen={...filing,url};transactions=buys;break;}
    }catch{}
  }
  if(!chosen)throw new Error(`Pelosi checked ${Math.min(12,filings.length)} PTRs, no purchase rows parsed`);
  const items=[];
  for(const x of transactions){
    const tick=(x.asset.match(/\(([A-Z.]{1,7})\)/)||[])[1]||'';
    if(!tick)continue;
    const option=/\[OP\]|option|call/i.test(x.asset);
    const name=x.asset.replace(/\s*\([^)]*\)[\s\S]*$/,'').replace(/\s*-\s*(Common|Class).*$/i,'').trim();
    items.push({emoji:emoji(name),name:name||tick,ticker:tick,badge:option?'🟢 콜옵션 매수':'🟢 매수·취득 신고',eventDate:isoFromUS(x.date),period:isoFromUS(x.date),scale:rangeKrw(x.lo,x.hi),rawScale:`미화 ${x.lo.toLocaleString('en-US')}~${x.hi.toLocaleString('en-US')}달러`,summary:`${x.owner==='SP'?'배우자 명의로 ':''}${tick} 관련 ${option?'콜옵션':'주식'} 거래가 미 하원에 신고됐어요.`,cta:option?'그날 주식을 샀다면? →':'그날 나도 샀다면? →',sourceLabel:'미 하원 거래 신고(PTR)',sourceUrl:chosen.url,market:'us',basis:option?'옵션 수익이 아니라 같은 날 기초 주식을 샀다고 가정':'신고된 거래일 기준'});
    if(items.length>=3)break;
  }
  if(!items.length)throw new Error(`Pelosi PTR ${chosen.doc} purchases had no ticker symbols`);
  return {title:'👀 펠로시 일가는 최근 뭐 거래했지?',subtitle:'미 하원의 공식 연간 인덱스에서 최근 매수·취득 신고를 자동으로 찾아요.',freshness:`미 하원 최근 매수 신고 · ${chosen.filingDate||chosen.doc}`,note:'💡 PTR은 거래가 일어난 즉시 공개되는 자료가 아니고 신고 뒤 공개돼요. SP는 배우자(Spouse)예요. 옵션은 주식과 다른 상품이라 계산에서는 같은 날 해당 주식을 샀다고 가정해요.',items,updatedAt:new Date().toISOString()};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');
  const [ark,pelosi]=await Promise.allSettled([getArk(),getPelosi()]);
  res.status(200).json({
    ark:ark.status==='fulfilled'?ark.value:null,
    pelosi:pelosi.status==='fulfilled'?pelosi.value:null,
    meta:{checkedAt:new Date().toISOString(),cacheHours:6,ark:ark.status==='fulfilled'?'ok':String(ark.reason?.message||ark.reason),pelosi:pelosi.status==='fulfilled'?'ok':String(pelosi.reason?.message||pelosi.reason)}
  });
}
