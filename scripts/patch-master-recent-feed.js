const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

function replaceOnce(from,to,label){
  if(s.includes(to)){console.log(label+' already applied.');return;}
  if(!s.includes(from)){console.warn(label+' target not found. Skipping.');return;}
  s=s.replace(from,to);console.log(label+' applied.');
}

if(!s.includes('const MASTER_RECENT_ACTIVITY = {')){
  const anchor='export default function Home(){';
  if(!s.includes(anchor))throw new Error('Home anchor not found');
  const recent=[
    'const MASTER_RECENT_ACTIVITY = {',
    '  buffett:{',
    '    title:"🧓 버핏의 버크셔는 최근 뭐 샀지?",',
    '    subtitle:"가장 최근 공개된 버크셔의 주식 변화를 쉬운 말로 정리했어요.",',
    '    freshness:"2026년 1분기 보유현황 · 2026-05-15 공개",',
    '    note:"💡 2026년 현재 버크셔의 주식 운용 대부분은 CEO 그렉 아벨이 맡고 있어요. 그래서 아래 내역을 ‘워런 버핏 개인의 매수’라고 단정하지 않고 버크셔의 공개 포트폴리오 변화로 표시해요.",',
    '    items:[',
    '      {emoji:"✈️",name:"델타항공",ticker:"DAL",badge:"🟢 새로 담음",eventDate:"2026-03-31",period:"2026 Q1",scale:"39,809,456주 · 약 $2.65B",summary:"버크셔가 델타항공을 새 포지션으로 공개했어요. 항공주에 다시 들어왔다는 점 때문에 특히 주목받았어요.",cta:"3/31 기준으로 계산해보기 →",sourceLabel:"SEC 13F",sourceUrl:"https://www.sec.gov/Archives/edgar/data/1067983/000119312526226661/0001193125-26-226661-index.htm",market:"us"},',
    '      {emoji:"🔎",name:"알파벳",ticker:"GOOGL",badge:"⬆️ 크게 늘림",eventDate:"2026-03-31",period:"2026 Q1",scale:"분기말 약 $16.6B 규모",summary:"구글의 모회사 알파벳 보유를 3배 이상 늘린 것으로 공개됐어요. 버크셔의 대형 기술주 비중 변화로 볼 만한 움직임이에요.",cta:"3/31 기준으로 계산해보기 →",sourceLabel:"SEC 13F · Reuters",sourceUrl:"https://www.reuters.com/legal/legalindustry/berkshire-invests-delta-sheds-several-stocks-including-amazon-unitedhealth-2026-05-15/",market:"us"},',
    '      {emoji:"🏬",name:"메이시스",ticker:"M",badge:"🟢 새로 담음",eventDate:"2026-03-31",period:"2026 Q1",scale:"약 304만주 · 약 $55M",summary:"미국 백화점 메이시스도 새로 등장했어요. 전체 포트폴리오에서는 작은 편이지만 신규 종목이라는 점이 포인트예요.",cta:"3/31 기준으로 계산해보기 →",sourceLabel:"SEC 13F · Reuters",sourceUrl:"https://www.reuters.com/legal/legalindustry/berkshire-invests-delta-sheds-several-stocks-including-amazon-unitedhealth-2026-05-15/",market:"us"}',
    '    ]',
    '  },',
    '  ark:{',
    '    title:"🚀 캐시 우드는 최근 뭐 샀지?",',
    '    subtitle:"ARK는 거래가 끝난 뒤 매매 내역을 공개해서 ‘최근 뭐 샀지?’에 가장 가까운 고수예요.",',
    '    freshness:"ARK Trade Notifications · 최근 공개 거래 기준",',
    '    note:"💡 ARK 거래 파일은 하루의 모든 거래를 완전히 보여주는 회계장부는 아니에요. 그래도 실제 ETF 조정 내역을 빠르게 볼 수 있는 공식 공개자료예요.",',
    '    items:[',
    '      {emoji:"🪙",name:"코인베이스",ticker:"COIN",badge:"🟢 더 담음",eventDate:"2026-08-03",period:"2026-08-03",scale:"합계 $8M+ 매수 공개",summary:"가상자산 거래소 코인베이스를 여러 ARK ETF에서 추가로 샀어요. 가격이 흔들릴 때 비중을 늘린 움직임이에요.",cta:"그날 나도 샀다면? →",sourceLabel:"ARK Trade Notifications",sourceUrl:"https://www.ark-funds.com/ark-trade-notifications",market:"us"},',
    '      {emoji:"⭕",name:"서클",ticker:"CRCL",badge:"🟢 더 담음",eventDate:"2026-08-03",period:"2026-08-03",scale:"약 $1.39M 매수 공개",summary:"스테이블코인 USDC를 운영하는 서클도 추가 매수했어요. ARK의 디지털 금융 인프라 투자 흐름으로 보기 쉬워요.",cta:"그날 나도 샀다면? →",sourceLabel:"ARK Trade Notifications",sourceUrl:"https://www.ark-funds.com/ark-trade-notifications",market:"us"},',
    '      {emoji:"🚀",name:"SpaceX",ticker:"SPCX",badge:"🟢 더 담음",eventDate:"2026-07-28",period:"2026-07-28",scale:"105,108주 · 약 $12.2M",summary:"주가 조정 구간에서 SpaceX를 여러 ETF에 나눠 추가 매수했어요. 우주·위성 인프라에 대한 ARK의 높은 관심이 드러난 거래예요.",cta:"그날 나도 샀다면? →",sourceLabel:"ARK Trade Notifications",sourceUrl:"https://www.ark-funds.com/ark-trade-notifications",market:"us"}',
    '    ]',
    '  },',
    '  pelosi:{',
    '    title:"👀 펠로시 일가는 최근 뭐 거래했지?",',
    '    subtitle:"미 의회에 신고된 최근 거래를 보여줘요. ‘누가, 언제, 어느 범위의 금액을 거래했는지’를 확인할 수 있어요.",',
    '    freshness:"미 하원 PTR · 2026-01 공개 거래",',
    '    note:"💡 아래 거래의 소유자 표기 SP는 배우자(Spouse)를 뜻해요. 낸시 펠로시 본인의 직접 매수라고 표시하지 않아요. 옵션 거래는 실제 주식 매수와 수익 구조도 달라요.",',
    '    items:[',
    '      {emoji:"🏦",name:"AllianceBernstein",ticker:"AB",badge:"🟢 주식 매수",eventDate:"2026-01-16",period:"2026-01-16",scale:"25,000주 · $1M~$5M",summary:"배우자 명의로 자산운용사 얼라이언스번스타인 주식 2만5천주 매수가 신고됐어요.",cta:"그날 나도 샀다면? →",sourceLabel:"U.S. House PTR",sourceUrl:"https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20033725.pdf",market:"us"},',
    '      {emoji:"🔎",name:"알파벳",ticker:"GOOGL",badge:"🟢 옵션 행사",eventDate:"2026-01-16",period:"2026-01-16",scale:"50계약 행사 → 5,000주",summary:"예전에 사둔 콜옵션을 행사해 알파벳 주식 5,000주를 취득한 거래가 신고됐어요.",cta:"그날 주식을 샀다면? →",sourceLabel:"U.S. House PTR",sourceUrl:"https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20033725.pdf",market:"us"},',
    '      {emoji:"📦",name:"아마존",ticker:"AMZN",badge:"🟢 콜옵션 매수",eventDate:"2025-12-30",period:"2025-12-30",scale:"20계약 · $100K~$250K",summary:"배우자 명의로 아마존 콜옵션 20계약을 매수한 거래가 공개됐어요. 주식을 산 것과는 다른 파생상품 거래예요.",cta:"그날 주식을 샀다면? →",sourceLabel:"U.S. House PTR",sourceUrl:"https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20033725.pdf",market:"us"}',
    '    ]',
    '  },',
    '  parkYoungOk:{title:"🌾 박영옥은 최근 뭐 공개했지?",subtitle:"국내 개인투자자는 미국처럼 모든 거래가 정기적으로 공개되지는 않아요.",freshness:"5% 공시·주주행동 공개자료 기준",note:"💡 최근 매수 내역을 억지로 추정하지 않고, 확인 가능한 공개 기록만 아래 레전드 투자에서 보여드려요.",items:[]},',
    '  kangBangCheon:{title:"🔭 강방천은 최근 뭐 공개했지?",subtitle:"개인 포트폴리오의 일별·분기별 매매가 공개되는 구조가 아니에요.",freshness:"본인 인터뷰·공개 발언 기준",note:"💡 ‘최근 샀다’고 확인되지 않은 종목은 최근 매수처럼 표시하지 않아요. 아래에는 본인이 직접 설명한 대표 투자 기록을 모았어요.",items:[]},',
    '  leeChaeWon:{title:"🧮 이채원은 최근 뭐 공개했지?",subtitle:"펀드 운용 기록과 인터뷰는 있지만 개인의 최신 매매를 실시간으로 확인하기는 어려워요.",freshness:"펀드 운용·인터뷰 공개자료 기준",note:"💡 확인 가능한 실제 운용 사례를 레전드 투자로 보여드리고, 최신 매수라고 추정해서 쓰지는 않아요.",items:[]}',
    '};',
    ''
  ].join('\n');
  s=s.replace(anchor,recent+anchor);
  console.log('Master recent activity data injected.');
}

if(!s.includes('const [directExactDate,setDirectExactDate]=useState("");')){
  const a='  const [showIosInstallSheet,setShowIosInstallSheet]=useState(false);';
  if(!s.includes(a))throw new Error('Direct exact date state anchor not found');
  s=s.replace(a,a+'\n  const [directExactDate,setDirectExactDate]=useState("");');
  console.log('Direct exact date state injected.');
}

replaceOnce('>거장 사례</button>','>👀 고수들은 뭐 샀지?</button>','Rename master tab');

replaceOnce(
  '        const dateStr=getSameDayOfYear(investYear);\n        const[bp,cp,rate]=await Promise.all([fetchYahooPrice(selectedStock.yahooTicker,dateStr),fetchCurrentPrice(selectedStock.yahooTicker),fetchUsdToKrw()]);',
  '        const dateStr=directExactDate||getSameDayOfYear(investYear);\n        const[bp,cp,rate]=await Promise.all([fetchYahooPrice(selectedStock.yahooTicker,dateStr),fetchCurrentPrice(selectedStock.yahooTicker),fetchUsdToKrw()]);',
  'Use exact public-trade date in direct price lookup'
);
replaceOnce('  },[selectedStock.yahooTicker,investYear]);','  },[selectedStock.yahooTicker,investYear,directExactDate]);','Watch direct exact date');
replaceOnce('    setResult(null);setSearchQuery("");\n    const map={us:US_PRESETS[0],kr:KR_PRESETS[0],index:INDEX_PRESETS[0],coin:COIN_PRESETS[0]};','    setResult(null);setSearchQuery("");setDirectExactDate("");\n    const map={us:US_PRESETS[0],kr:KR_PRESETS[0],index:INDEX_PRESETS[0],coin:COIN_PRESETS[0]};','Clear exact date on market tab change');
replaceOnce('const handleSelectPreset=s=>{const yt=getYahooTicker(s.ticker);setSelectedStock({ticker:s.ticker,yahooTicker:yt,name:s.name});setCurrency(getCurrency(yt));setResult(null);setInvestYear(Math.floor((getIpoYear(yt)+lastYear)/2));};','const handleSelectPreset=s=>{const yt=getYahooTicker(s.ticker);setDirectExactDate("");setSelectedStock({ticker:s.ticker,yahooTicker:yt,name:s.name});setCurrency(getCurrency(yt));setResult(null);setInvestYear(Math.floor((getIpoYear(yt)+lastYear)/2));};','Clear exact date on preset selection');
replaceOnce('const handleSelectSearch=stock=>{setSearchQuery("");setSearchResults([]);setShowDropdown(false);setResult(null);const yt=stock.ticker;setSelectedStock({ticker:yt,yahooTicker:yt,name:stock.nameKo||stock.name});setCurrency(getCurrency(yt));const ipoYear=stock.ipoYear||getIpoYear(yt)||2000;IPO_YEAR[yt]=ipoYear;setInvestYear(Math.floor((ipoYear+lastYear)/2));};','const handleSelectSearch=stock=>{setDirectExactDate("");setSearchQuery("");setSearchResults([]);setShowDropdown(false);setResult(null);const yt=stock.ticker;setSelectedStock({ticker:yt,yahooTicker:yt,name:stock.nameKo||stock.name});setCurrency(getCurrency(yt));const ipoYear=stock.ipoYear||getIpoYear(yt)||2000;IPO_YEAR[yt]=ipoYear;setInvestYear(Math.floor((ipoYear+lastYear)/2));};','Clear exact date on search selection');
replaceOnce('onClick={()=>{if(investYear>firstYear){setInvestYear(y=>y-1);setResult(null);}}}','onClick={()=>{if(investYear>firstYear){setDirectExactDate("");setInvestYear(y=>y-1);setResult(null);}}}','Clear exact date on previous year');
replaceOnce('onClick={()=>{if(investYear<lastYear){setInvestYear(y=>y+1);setResult(null);}}}','onClick={()=>{if(investYear<lastYear){setDirectExactDate("");setInvestYear(y=>y+1);setResult(null);}}}','Clear exact date on next year');
replaceOnce('onChange={e => {setInvestYear(parseInt(e.target.value)); setResult(null);}}','onChange={e => {setDirectExactDate("");setInvestYear(parseInt(e.target.value)); setResult(null);}}','Clear exact date on year slider');
replaceOnce('{investYear}년 오늘, <strong','{directExactDate?`${directExactDate} 거래일`:`${investYear}년 오늘`}, <strong','Show exact date in price card');
replaceOnce('{getTodayMMDD()} {displayPrice(buyPrice)}','{directExactDate?directExactDate.slice(5).replace("-","/"):getTodayMMDD()} {displayPrice(buyPrice)}','Show exact date beside buy price');
replaceOnce('const exactYears=(new Date()-new Date(getSameDayOfYear(investYear)))/(1000*60*60*24*365.25);','const exactYears=(new Date()-new Date(directExactDate||getSameDayOfYear(investYear)))/(1000*60*60*24*365.25);','Use exact date for direct CAGR');
replaceOnce('buyDateStr:getSameDayOfYear(investYear),sharesCount','buyDateStr:directExactDate||getSameDayOfYear(investYear),sharesCount','Store exact direct buy date');
replaceOnce('⚠️ 차트는 실시간 API 데이터 · 매수가/현재가/수익률은 100% 정확','⚠️ 시세는 외부 데이터 기준이며 실제 체결가와 차이가 있을 수 있어요.','Soften direct price accuracy claim');

const masterStart='        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart='        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const a=s.indexOf(masterStart);
const b=s.indexOf(calculatorStart,a);
if(a<0||b<0)throw new Error('Final master section anchors not found');
if(!s.slice(a,b).includes('최근 공개 내역을 먼저 보여줘요')){
  const m=[
    masterStart,
    '          <div style={{marginBottom:"30px",paddingTop:"16px"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}}><span style={snStyle}>01</span><span style={{fontSize:"17px",fontWeight:"600",color:T.text,letterSpacing:"-0.3px"}}>누구 거 볼까?</span><div style={{flex:1,height:"1px",background:T.border}}/></div>',
    '            <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,margin:"-2px 0 12px"}}>어려운 투자 용어보다 <strong style={{color:T.text,fontWeight:"700"}}>누가 최근 뭘 샀는지</strong>부터 가볍게 구경해보세요. 최근 공개 내역을 먼저 보여줘요.</div>',
    '            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",padding:"4px",background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:"12px",marginBottom:"10px"}}>',
    '              <button type="button" onClick={()=>{setMasterRegion("global");setSelectedMasterId("buffett");setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{padding:"9px 8px",border:`1px solid ${masterRegion==="global"?T.borderActive:"transparent"}`,borderRadius:"9px",background:masterRegion==="global"?T.presetActive:"transparent",color:masterRegion==="global"?T.accent:T.textMuted,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>🇺🇸 해외</button>',
    '              <button type="button" onClick={()=>{setMasterRegion("kr");setSelectedMasterId("parkYoungOk");setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{padding:"9px 8px",border:`1px solid ${masterRegion==="kr"?T.borderActive:"transparent"}`,borderRadius:"9px",background:masterRegion==="kr"?T.presetActive:"transparent",color:masterRegion==="kr"?T.accent:T.textMuted,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>🇰🇷 국내</button>',
    '            </div>',
    '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>',
    '              <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"6px",padding:"6px"}}>',
    '                {Object.entries(MASTER_PROFILES).filter(([,profile])=>(profile.region||"global")===masterRegion).map(([id,profile])=>{const active=selectedMasterId===id;return <button key={id} type="button" onClick={()=>{setSelectedMasterId(id);setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"88px",padding:"10px 6px",background:active?T.presetActive:"transparent",border:`2px solid ${active?T.borderActive:"transparent"}`,borderRadius:"12px",cursor:"pointer",textAlign:"center",transition:"all .2s",boxShadow:active?`0 0 0 3px ${T.accent}18`:"none"}}><div style={{fontSize:"23px",lineHeight:1,marginBottom:"7px"}}>{profile.emoji}</div><div style={{fontSize:"13px",fontWeight:"700",color:active?T.accent:T.text,letterSpacing:"-0.2px"}}>{profile.shortName||profile.name}</div><div style={{fontSize:"11px",fontWeight:"400",color:active?T.accent:T.textMuted,marginTop:"3px",lineHeight:1.3}}>{profile.eyebrow}</div></button>})}',
    '              </div>',
    '              <div style={{padding:"13px 14px 14px",borderTop:`1px solid ${T.border}`}}><div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub}}>{selectedMaster.description}</div></div>',
    '            </div>',
    '          </div>',
    '',
    '          {(()=>{const recent=MASTER_RECENT_ACTIVITY[selectedMasterId]||{title:"최근 공개 내역",subtitle:"",freshness:"",note:"",items:[]};return <div style={{marginBottom:"30px",paddingTop:"10px"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}><span style={snStyle}>02</span><span style={{fontSize:"17px",fontWeight:"650",color:T.text,letterSpacing:"-0.3px"}}>{recent.title}</span><div style={{flex:1,height:"1px",background:T.border}}/></div>',
    '            <div style={{fontSize:"12px",lineHeight:1.6,color:T.textSub,marginBottom:"5px"}}>{recent.subtitle}</div>',
    '            <div style={{fontSize:"10px",fontWeight:"700",color:T.accent,marginBottom:"11px"}}>🕒 {recent.freshness}</div>',
    '            {recent.items.length>0?<div style={{display:"grid",gap:"9px"}}>{recent.items.map((item,idx)=><div key={`${item.ticker}-${item.eventDate}-${idx}`} style={{padding:"14px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px"}}>',
    '              <div style={{display:"flex",alignItems:"flex-start",gap:"10px"}}><div style={{width:"40px",height:"40px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,fontSize:"21px",flexShrink:0}}>{item.emoji}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}><div style={{fontSize:"15px",fontWeight:"750",color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name} <span style={{fontSize:"11px",fontWeight:"600",color:T.textMuted}}>{item.ticker}</span></div><span style={{fontSize:"10px",fontWeight:"750",color:T.accent,background:T.presetActive,padding:"5px 7px",borderRadius:"999px",whiteSpace:"nowrap"}}>{item.badge}</span></div><div style={{fontSize:"11px",color:T.textMuted,marginTop:"4px"}}>{item.period}</div></div></div>',
    '              <div style={{marginTop:"11px",fontSize:"18px",fontWeight:"800",color:T.accent,letterSpacing:"-0.5px"}}>{item.scale}</div>',
    '              <div style={{fontSize:"12px",lineHeight:1.65,color:T.textSub,marginTop:"6px"}}>{item.summary}</div>',
    '              <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:"7px",marginTop:"11px"}}><button type="button" onClick={()=>{setHomeMode("direct");setActiveTab(item.market||"us");setResult(null);setSearchQuery("");setTimeout(()=>{setSelectedStock({ticker:item.ticker,yahooTicker:item.ticker,name:item.name});setCurrency(item.market==="kr"?"KRW":"USD");setInvestYear(Number(item.eventDate.slice(0,4)));setDirectExactDate(item.eventDate);setResult(null);setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),60);},90);}} style={{padding:"10px 11px",border:"none",borderRadius:"10px",background:T.presetActive,color:T.accent,fontSize:"11px",fontWeight:"750",cursor:"pointer",textAlign:"left"}}>{item.cta}</button><a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",padding:"10px",border:`1px solid ${T.border}`,borderRadius:"10px",color:T.textMuted,fontSize:"10px",fontWeight:"650",textDecoration:"none"}}>{item.sourceLabel} ↗</a></div>',
    '            </div>)}</div>:<div style={{padding:"16px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px",fontSize:"12px",lineHeight:1.65,color:T.textSub}}>📭 <strong style={{color:T.text}}>최신 매수라고 확인할 수 있는 정기 데이터가 없어요.</strong><br/>추측해서 채우지 않고, 아래에 공개자료로 확인되는 투자 기록만 보여드릴게요.</div>}',
    '            <div style={{marginTop:"10px",padding:"10px 11px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"11px",fontSize:"10px",lineHeight:1.6,color:T.textMuted}}>{recent.note}</div>',
    '          </div>})()}',
    '',
    '          <details style={{marginBottom:"20px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>',
    '            <summary style={{listStyle:"none",cursor:"pointer",padding:"15px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}><div><div style={{fontSize:"14px",fontWeight:"750",color:T.text}}>📚 {selectedMaster.shortName||selectedMaster.name}의 레전드 투자</div><div style={{fontSize:"11px",color:T.textMuted,marginTop:"4px"}}>애플·코카콜라 같은 유명 사례와 원문 근거는 여기서 볼 수 있어요.</div></div><span style={{fontSize:"12px",color:T.accent,fontWeight:"700"}}>펼쳐보기 +</span></summary>',
    '            <div style={{padding:"0 10px 12px",borderTop:`1px solid ${T.border}`}}>',
    '              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"8px",paddingTop:"10px"}}>{visibleMasterCases.map((item,idx)=>{const active=selectedMasterCaseIndex===idx;const meta=MASTER_CASE_META[item.ticker]||{};return <button key={`${item.ticker}-${item.year}`} type="button" onClick={()=>{setSelectedMasterCaseIndex(idx);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"82px",padding:"10px 11px",background:active?T.presetActive:T.bgCard,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"11px",cursor:"pointer",textAlign:"left",transition:"all .2s"}}><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"8px"}}><div style={{display:"flex",gap:"8px",minWidth:0}}><span style={{width:"30px",height:"30px",borderRadius:"9px",display:"flex",alignItems:"center",justifyContent:"center",background:T.bgDeep,fontSize:"17px",flexShrink:0}}>{MASTER_CASE_EMOJI[item.ticker]||"📈"}</span><div style={{minWidth:0}}><div style={{fontSize:"13px",fontWeight:"700",color:active?T.accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div><div style={{fontSize:"10px",color:T.textMuted,marginTop:"3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{meta.theme||item.note}</div></div></div><span style={{fontSize:"10px",fontWeight:"650",color:active?T.accent:T.textMuted,whiteSpace:"nowrap"}}>{item.year}</span></div></button>})}</div>',
    '              {selectedMaster.cases.length>4&&<div style={{display:"flex",justifyContent:"center",padding:"4px 0 8px"}}><button type="button" onClick={()=>setShowAllMasterCases(v=>!v)} style={{padding:"7px 10px",border:"none",background:"transparent",color:T.accent,fontSize:"11px",fontWeight:"650",cursor:"pointer"}}>{showAllMasterCases?"대표 사례 접기":`전체 사례 보기 +${Math.max(0,selectedMaster.cases.length-4)}`}</button></div>}',
    '              <div style={{padding:"13px",background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:"12px"}}>',
    '                <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"10px"}}><span style={{fontSize:"22px"}}>{MASTER_CASE_EMOJI[selectedMasterCase.ticker]||"📈"}</span><div><div style={{fontSize:"15px",fontWeight:"750",color:T.text}}>{selectedMasterCase.name}</div><div style={{fontSize:"10px",color:T.textMuted,marginTop:"2px"}}>{selectedMasterCase.year}년 대표 사례 · {selectedMasterCaseMeta.source}</div></div></div>',
    '                <div style={{fontSize:"12px",lineHeight:1.7,color:T.textSub,marginBottom:"9px"}}>🦜 {MASTER_CASE_BEGINNER_COPY[selectedMasterCase.ticker]||selectedMasterCase.note}</div>',
    '                <div style={{padding:"10px",background:T.bgCard,borderRadius:"10px",marginBottom:"8px"}}><div style={{fontSize:"10px",fontWeight:"750",color:T.accent,marginBottom:"4px"}}>공개자료에서 확인된 내용</div><div style={{fontSize:"11px",lineHeight:1.65,color:T.textSub}}>{selectedMasterEvidence.fact}</div></div>',
    '                <div style={{fontSize:"10px",lineHeight:1.6,color:T.textMuted,marginBottom:"10px"}}>{selectedMasterEvidence.note}</div>',
    '                <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) auto",gap:"7px"}}><button type="button" onClick={()=>{const exact=/^\\d{4}-\\d{2}-\\d{2}$/.test(selectedMasterEvidence.eventDate||"")?selectedMasterEvidence.eventDate:"";const market=/\\.(KS|KQ)$/.test(selectedMasterCase.ticker)?"kr":"us";setHomeMode("direct");setActiveTab(market);setTimeout(()=>{setSelectedStock({ticker:selectedMasterCase.ticker,yahooTicker:selectedMasterCase.ticker,name:selectedMasterCase.name});setCurrency(market==="kr"?"KRW":"USD");setInvestYear(selectedMasterCase.year);setDirectExactDate(exact);setResult(null);setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),60);},90);}} style={{padding:"10px 11px",border:"none",borderRadius:"10px",background:T.presetActive,color:T.accent,fontSize:"11px",fontWeight:"750",cursor:"pointer",textAlign:"left"}}>그때 나도 샀다면? →</button><a href={selectedMasterEvidence.sourceUrl} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",padding:"10px",border:`1px solid ${T.border}`,borderRadius:"10px",color:T.textMuted,fontSize:"10px",fontWeight:"650",textDecoration:"none"}}>원문 ↗</a></div>',
    '              </div>',
    '            </div>',
    '          </details>',
    '          <div style={{marginBottom:"24px"}}><CoupangBanner isDark={isDark} T={T}/></div>',
    '        </div>',
    ''
  ].join('\n');
  s=s.slice(0,a)+m+s.slice(b);
  console.log('Master recent-first UX applied.');
}else console.log('Master recent-first UX already applied.');

fs.writeFileSync(p,s);
