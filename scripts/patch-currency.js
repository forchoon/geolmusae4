const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

function replaceOnce(from, to, label) {
  if (source.includes(to)) {
    console.log(`${label} already applied.`);
    return;
  }

  if (!source.includes(from)) {
    console.warn(`${label} target not found. Skipping.`);
    return;
  }

  source = source.replace(from, to);
  console.log(`${label} applied.`);
}

function insertBeforeOnce(marker, insertion, sentinel, label) {
  if (source.includes(sentinel)) {
    console.log(`${label} already applied.`);
    return;
  }

  if (!source.includes(marker)) {
    console.warn(`${label} marker not found. Skipping.`);
    return;
  }

  source = source.replace(marker, `${insertion}\n${marker}`);
  console.log(`${label} applied.`);
}

replaceOnce(
  'function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}',
  'function getCurrency(yt){if(!yt)return "USD";if(yt==="^KS11"||yt.endsWith(".KS")||yt.endsWith(".KQ"))return "KRW";return CURRENCY_MAP[yt]||"USD";}',
  'Currency patch: .KS/.KQ tickers now use KRW'
);

replaceOnce(
  '<div style={{padding:"36px 20px 16px",textAlign:"center",position:"relative"}}>',
  '<div style={{padding:"32px 20px 14px",textAlign:"center",position:"relative"}}>',
  'Header padding patch'
);

replaceOnce(
  'width:"240px",\n    maxWidth:"78%",',
  'width:"160px",\n    maxWidth:"72%",',
  'Header logo size patch'
);

insertBeforeOnce(
  '  const searchTimeout=useRef(null);',
  [
    '  useEffect(()=>{',
    '    try{',
    '      const raw=localStorage.getItem("masterPrefill");',
    '      if(!raw)return;',
    '      const prefill=JSON.parse(raw);',
    '      localStorage.removeItem("masterPrefill");',
    '      if(!prefill||!prefill.yahooTicker)return;',
    '      setActiveTab(prefill.market||"us");',
    '      setSelectedStock({ticker:prefill.ticker||prefill.yahooTicker,yahooTicker:prefill.yahooTicker,name:prefill.name||prefill.yahooTicker});',
    '      setInvestYear(Number(prefill.year)||2016);',
    '      setInvestAmount(prefill.amount||"100");',
    '      setShowKRW(false);',
    '      setResult(null);',
    '      setSearchQuery("");',
    '      setTimeout(()=>{document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"});},250);',
    '    }catch(e){}',
    '  },[]);',
    ''
  ].join('\n'),
  'localStorage.getItem("masterPrefill")',
  'Master prefill patch'
);

replaceOnce(
  '        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>\n          <div style={sec}>',
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 10px",padding:"0 16px"}}>',
    '          <a href="/masters" style={{textDecoration:"none",display:"block"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"13px 14px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"14px",boxShadow:"0 8px 28px rgba(0,0,0,0.12)"}}>',
    '              <div style={{width:"40px",height:"40px",borderRadius:"13px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:"1px solid "+T.borderActive+"66",fontSize:"22px",flexShrink:0}}>👣</div>',
    '              <div style={{flex:1,minWidth:0}}>',
    '                <div style={{fontSize:"14px",fontWeight:"800",color:T.text,letterSpacing:"-0.3px",marginBottom:"2px"}}>거장의 발자취</div>',
    '                <div style={{fontSize:"12px",color:T.textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>버핏은 그때 뭘 샀을까? 과거 공시로 껄해보기</div>',
    '              </div>',
    '              <div style={{fontSize:"18px",color:T.textMuted,fontWeight:"700"}}>›</div>',
    '            </div>',
    '          </a>',
    '        </div>',
    '',
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div style={sec}>'
  ].join('\n'),
  'Home masters entry patch'
);

fs.writeFileSync(indexPath, source);
