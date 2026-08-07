const XLSX = require('xlsx');
const pdfParse = require('pdf-parse');

const UA='StockParrot/1.0 contact: to.choon@gmail.com';
const KRW_PER_USD=1380;

const FALLBACK={
  buffett:{
    title:'🧓 버핏의 버크셔는 최근 뭐 샀지?',
    subtitle:'가장 최근 공개된 버크셔의 주식 변화를 쉬운 말로 정리했어요.',
    freshness:'2026년 1분기 보유현황 · 2026-05-15 공개',
    note:'💡 버크셔의 13F는 분기말 보유현황이라 정확한 매수 날짜와 가격은 알 수 없어요. 아래 계산은 분기말 기준으로 보여줘요.',
    items:[
      {emoji:'✈️',name:'델타항공',ticker:'DAL',badge:'🟢 새로 담음',eventDate:'2026-03-31',period:'2026 Q1',scale:'39,809,456주 · 약 36.6조원',rawScale:'미화 약 26억5천만달러',summary:'버크셔가 델타항공을 새 보유 종목으로 공개했어요.',cta:'3월 31일 기준으로 계산해보기 →',sourceLabel:'SEC 13F',sourceUrl:'https://www.sec.gov/Archives/edgar/data/1067983/000119312526226661/0001193125-26-226661-index.htm',market:'us',basis:'분기말 보유현황 기준'},
      {emoji:'🔎',name:'알파벳',ticker:'GOOGL',badge:'⬆️ 크게 늘림',eventDate:'2026-03-31',period:'2026 Q1',scale:'약 22.9조원 규모',rawScale:'미화 약 166억달러',summary:'구글의 모회사 알파벳 보유가 크게 늘어난 것으로 공개됐어요.',cta:'3월 31일 기준으로 계산해보기 →',sourceLabel:'SEC 13F',sourceUrl:'https://www.sec.gov/Archives/edgar/data/1067983/000119312526226661/0001193125-26-226661-index.htm',market:'us',basis:'분기말 보유현황 기준'},
      {emoji:'🏬',name:'메이시스',ticker:'M',badge:'🟢 새로 담음',eventDate:'2026-03-31',period:'2026 Q1',scale:'약 759억원 규모',rawScale:'미화 약 5,500만달러',summary:'미국 백화점 메이시스도 새 보유 종목으로 등장했어요.',cta:'3월 31일 기준으로 계산해보기 →',sourceLabel:'SEC 13F',sourceUrl:'https://www.sec.gov/Archives/edgar/data/1067983/000119312526226661/0001193125-26-226661-index.htm',market:'us',basis:'분기말 보유현황 기준'}
    ]
  },
  ark:{title:'🚀 캐시 우드는 최근 뭐 샀지?',subtitle:'ARK가 장 마감 뒤 공개하는 최신 거래 파일을 자동으로 읽어요.',freshness:'ARK 최신 공개 거래 기준',note:'💡 ARK 거래 알림은 실제 ETF 조정 내역이지만 IPO·ETF 설정/환매 등 일부 거래는 제외될 수 있어요.',items:[]},
  pelosi:{title:'👀 펠로시 일가는 최근 뭐 거래했지?',subtitle:'미 하원에 새 PTR 신고서가 올라오면 자동으로 최신 내역을 확인해요.',freshness:'미 하원 최신 PTR 공개자료 기준',note:'💡 신고는 실제 거래보다 늦게 공개될 수 있어요. SP는 배우자(Spouse)를 뜻하고, 옵션은 주식 매수와 다른 거래예요.',items:[]}
};

function fetchText(url,opts={}){
  return fetch(url,{...opts,headers:{'User-Agent':UA,'Accept':'*/*',...(opts.headers||{})}}).then(async r=>{if(!r.ok)throw new Error(`${r.status} ${url}`);return r.text();});
}
function fetchBuffer(url,opts={}){
  return fetch(url,{...opts,headers:{'User-Agent':UA,'Accept':'*/*',...(opts.headers||{})}}).then(async r=>{if(!r.ok)throw new Error(`${r.status} ${url}`);return Buffer.from(await r.arrayBuffer());});
}
function stripNs(xml){return xml.replace(/<\/?[A-Za-z0-9_]+:/g,m=>m.replace(/([A-Za-z0-9_]+:)/,''));}
function tag(block,name){const m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'));return m?m[1].replace(/<[^>]+>/g,'').trim():'';}
function fullUsd(n){return `${Math.round(n).toLocaleString('en-US')}달러`;}
function krwTextFromUsd(n){const w=n*KRW_PER_USD;if(w>=1e12)return `약 ${(w/1e12).toFixed(w>=1e13?1:2).replace(/\.0+$/,'')}조원`;if(w>=1e8)return `약 ${(w/1e8).toFixed(w>=1e9?1:2).replace(/\.0+$/,'')}억원`;if(w>=1e4)return `약 ${Math.round(w/1e4).toLocaleString('ko-KR')}만원`;return `약 ${Math.round(w).toLocaleString('ko-KR')}원`;}
function usdScale(n){return {scale:krwTextFromUsd(n),rawScale:`미화 ${fullUsd(n)}`};}
function usdRangeText(raw){
  const nums=(raw.match(/[\d,]+/g)||[]).map(x=>Number(x.replace(/,/g,''))).filter(Boolean);
  if(nums.length<1)return {scale:raw,rawScale:''};
  if(nums.length===1){const a=usdScale(nums[0]);return a;}
  return {scale:`${krwTextFromUsd(nums[0]).replace('약 ','약 ')}~${krwTextFromUsd(nums[1]).replace('약 ','')}`,rawScale:`미화 ${fullUsd(nums[0])}~${fullUsd(nums[1])}`};
}
async function yahooTicker(name){
  try{
    const j=await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=5&newsCount=0`,{headers:{'User-Agent':UA}}).then(r=>r.json());
    const q=(j.quotes||[]).find(x=>x.quoteType==='EQUITY'&&x.symbol&&!x.symbol.includes('.'))||(j.quotes||[]).find(x=>x.symbol);
    return q?.symbol||'';
  }catch{return '';}
}
function emojiFor(name){const s=name.toUpperCase();if(s.includes('ALPHABET'))return '🔎';if(s.includes('APPLE'))return '🍎';if(s.includes('AMAZON'))return '📦';if(s.includes('DELTA'))return '✈️';if(s.includes('MACY'))return '🏬';if(s.includes('OCCIDENTAL'))return '🛢️';if(s.includes('CHEVRON'))return '⛽';if(s.includes('BANK'))return '🏦';return '📈';}
async function get13FInfo(accession){
  const acc=accession.replace(/-/g,'');
  const base=`https://www.sec.gov/Archives/edgar/data/1067983/${acc}`;
  const idx=JSON.parse(await fetchText(`${base}/index.json`));
  const names=(idx.directory?.item||[]).map(x=>x.name);
  const xml=names.find(n=>/\.xml$/i.test(n)&&n!=='primary_doc.xml')||names.find(n=>/\.xml$/i.test(n));
  if(!xml)throw new Error('13F info xml not found');
  const raw=stripNs(await fetchText(`${base}/${xml}`));
  const blocks=raw.match(/<infoTable>[\s\S]*?<\/infoTable>/gi)||[];
  return blocks.map(b=>({name:tag(b,'nameOfIssuer'),cusip:tag(b,'cusip'),value:Number(tag(b,'value').replace(/,/g,''))||0,shares:Number(tag(b,'sshPrnamt').replace(/,/g,''))||0}));
}
async function getBuffett(){
  const sub=JSON.parse(await fetchText('https://data.sec.gov/submissions/CIK0001067983.json'));
  const rec=sub.filings?.recent||{};
  const rows=(rec.form||[]).map((form,i)=>({form,acc:rec.accessionNumber[i],filed:rec.filingDate[i],period:rec.reportDate[i]})).filter(x=>x.form==='13F-HR').slice(0,2);
  if(rows.length<2)throw new Error('not enough 13F filings');
  const [latest,prev]=rows;
  const [a,b]=await Promise.all([get13FInfo(latest.acc),get13FInfo(prev.acc)]);
  const pm=new Map(b.map(x=>[x.cusip,x]));
  const changed=a.map(x=>{const p=pm.get(x.cusip);const delta=p?x.shares-p.shares:x.shares;return {...x,prevShares:p?.shares||0,delta,isNew:!p};}).filter(x=>x.delta>0).sort((x,y)=>(y.value-x.value));
  const pick=[...changed.filter(x=>x.isNew),...changed.filter(x=>!x.isNew)].filter((x,i,arr)=>arr.findIndex(y=>y.cusip===x.cusip)===i).slice(0,3);
  const items=[];
  for(const x of pick){
    const ticker=await yahooTicker(x.name);
    if(!ticker)continue;
    const money=usdScale(x.value);
    const pct=x.prevShares?Math.round((x.delta/x.prevShares)*100):0;
    items.push({emoji:emojiFor(x.name),name:x.name.replace(/ INC.*$/i,'').replace(/ CORP.*$/i,''),ticker,badge:x.isNew?'🟢 새로 담음':`⬆️ ${pct?`${pct}% `:''}늘림`,eventDate:latest.period,period:`${latest.period} 분기말`,scale:`${x.shares.toLocaleString('en-US')}주 · ${money.scale}`,rawScale:money.rawScale,summary:x.isNew?'이전 분기에는 없던 종목이 이번 분기 보유목록에 새로 나타났어요.':'이전 분기보다 보유 주식 수가 늘어난 종목이에요.',cta:`${latest.period.slice(5).replace('-','/')} 기준으로 계산해보기 →`,sourceLabel:'SEC 13F',sourceUrl:`https://www.sec.gov/Archives/edgar/data/1067983/${latest.acc.replace(/-/g,'')}/${latest.acc}-index.htm`,market:'us',basis:'분기말 보유현황 기준'});
  }
  const d=new Date(latest.filed+'T00:00:00Z');
  const q=Math.floor((Number(latest.period.slice(5,7))-1)/3)+1;
  return {title:'🧓 버핏의 버크셔는 최근 뭐 샀지?',subtitle:'SEC에 새 13F가 올라오면 이전 분기와 비교해서 자동으로 바뀌어요.',freshness:`${latest.period.slice(0,4)}년 ${q}분기 보유현황 · ${latest.filed} 공개`,note:'💡 13F는 분기말에 무엇을 얼마나 보유했는지 보여주는 신고서예요. 정확한 매수 날짜·가격은 알 수 없어 계산은 분기말 기준으로 해요.',items:items.length?items:FALLBACK.buffett.items,updatedAt:new Date().toISOString()};
}
async function getArk(){
  const buf=await fetchBuffer('https://etfs.ark-funds.com/hubfs/idt/trades/ARK_Trades.xls');
  const wb=XLSX.read(buf,{type:'buffer'});const ws=wb.Sheets[wb.SheetNames[0]];const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
  const norm=rows.map(r=>{const e=Object.entries(r);const val=(re)=>String((e.find(([k])=>re.test(String(k)))||[])[1]||'').trim();return {date:val(/date/i),fund:val(/fund/i),direction:val(/direction|buy\/sell|trade/i),ticker:val(/ticker/i),company:val(/company|name/i),shares:Number(val(/shares/i).replace(/,/g,''))||0};});
  const buys=norm.filter(x=>/buy|purchase/i.test(x.direction)&&x.ticker&&x.date).slice(0,12);
  const byTicker=new Map();for(const x of buys){const k=x.ticker;if(!byTicker.has(k))byTicker.set(k,{...x,shares:0});byTicker.get(k).shares+=x.shares;}
  const items=[...byTicker.values()].slice(0,3).map(x=>({emoji:emojiFor(x.company||x.ticker),name:x.company||x.ticker,ticker:x.ticker,badge:'🟢 더 담음',eventDate:new Date(x.date).toISOString().slice(0,10),period:new Date(x.date).toISOString().slice(0,10),scale:x.shares?`${Math.round(x.shares).toLocaleString('en-US')}주 매수 공개`:'매수 공개',rawScale:'',summary:`ARK ETF가 ${x.ticker}을(를) 추가 매수한 것으로 최신 거래 파일에 공개됐어요.`,cta:'그날 나도 샀다면? →',sourceLabel:'ARK Trade Notifications',sourceUrl:'https://www.ark-funds.com/ark-trade-notifications',market:'us',basis:'공개 거래일 기준'}));
  const latest=items[0]?.eventDate||'';
  return {title:'🚀 캐시 우드는 최근 뭐 샀지?',subtitle:'ARK의 최신 거래 파일을 읽어서 새 파일이 올라오면 자동으로 바뀌어요.',freshness:latest?`ARK 공개 거래 · ${latest}`:'ARK 최신 공개 거래 기준',note:'💡 ARK 거래 알림은 장 마감 뒤 공개돼요. IPO·ETF 설정/환매 등 일부 거래는 파일에서 빠질 수 있어요.',items,updatedAt:new Date().toISOString()};
}
function htmlUnescape(s){return s.replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"');}
async function getPelosi(){
  const year=new Date().getUTCFullYear();
  const body=new URLSearchParams({LastName:'Pelosi',FilingYear:String(year),State:'',District:''});
  const html=await fetchText('https://disclosures-clerk.house.gov/FinancialDisclosure/ViewMemberSearchResult',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
  const links=[...html.matchAll(/href=["']([^"']*ptr-pdfs[^"']*\.pdf)["']/gi)].map(m=>htmlUnescape(m[1]));
  if(!links.length)throw new Error('Pelosi PTR not found');
  const url=new URL(links[0],'https://disclosures-clerk.house.gov/').toString();
  const pdf=await fetchBuffer(url);const text=(await pdfParse(pdf)).text.replace(/\s+/g,' ');
  const tx=[];
  const re=/(SP|JT|DC|DEP)?\s*([^\n]{3,120}?)\s+(P|S \(partial\)|S)\s+(\d{2}\/\d{2}\/\d{4})\s+\d{2}\/\d{2}\/\d{4}\s+\$([\d,]+)\s*-\s*\$([\d,]+)/g;
  let m;while((m=re.exec(text))&&tx.length<12){tx.push({owner:m[1]||'',asset:m[2].trim(),type:m[3],date:m[4],lo:Number(m[5].replace(/,/g,'')),hi:Number(m[6].replace(/,/g,''))});}
  const buys=tx.filter(x=>x.type==='P').slice(0,3);
  const items=[];
  for(const x of buys){const tickerMatch=x.asset.match(/\(([A-Z.]{1,6})\)/);const ticker=tickerMatch?.[1]||await yahooTicker(x.asset);if(!ticker)continue;const mm=usdRangeText(`$${x.lo} - $${x.hi}`);const iso=x.date.split('/');const d=`${iso[2]}-${iso[0]}-${iso[1]}`;items.push({emoji:emojiFor(x.asset),name:x.asset.replace(/\s*\([^)]*\).*/,'').replace(/\s*-\s*Common Stock.*/i,''),ticker,badge:/option/i.test(x.asset)?'🟢 옵션 관련 거래':'🟢 매수 신고',eventDate:d,period:d,scale:mm.scale,rawScale:mm.rawScale,summary:`${x.owner==='SP'?'배우자 명의로 ':''}${ticker} 관련 매수 거래가 미 하원 PTR에 신고됐어요.`,cta:/option/i.test(x.asset)?'그날 주식을 샀다면? →':'그날 나도 샀다면? →',sourceLabel:'U.S. House PTR',sourceUrl:url,market:'us',basis:/option/i.test(x.asset)?'기초 주식의 당일 가격으로 계산':'신고된 거래일 기준'});}
  return {title:'👀 펠로시 일가는 최근 뭐 거래했지?',subtitle:'미 하원 검색 결과에서 가장 최신 PTR 신고서를 자동으로 확인해요.',freshness:`미 하원 최신 PTR · ${url.match(/(\d{8})\.pdf/)?.[1]||'최신 신고'}`,note:'💡 PTR은 거래 직후 실시간 공개가 아니라 신고 뒤 공개돼요. SP는 배우자(Spouse)예요. 옵션 거래의 계산은 옵션 수익이 아니라 같은 날 기초 주식을 샀다고 가정해요.',items,updatedAt:new Date().toISOString()};
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');
  const result={};
  const jobs=await Promise.allSettled([getBuffett(),getArk(),getPelosi()]);
  result.buffett=jobs[0].status==='fulfilled'?jobs[0].value:{...FALLBACK.buffett,error:'fallback'};
  result.ark=jobs[1].status==='fulfilled'&&jobs[1].value.items.length?jobs[1].value:{...FALLBACK.ark,error:'fallback'};
  result.pelosi=jobs[2].status==='fulfilled'&&jobs[2].value.items.length?jobs[2].value:{...FALLBACK.pelosi,error:'fallback'};
  result.meta={checkedAt:new Date().toISOString(),cacheHours:6};
  res.status(200).json(result);
}
