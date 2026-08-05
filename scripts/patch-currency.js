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
    '      const params=new URLSearchParams(window.location.search);',
    '      const masterTicker=params.get("masterTicker");',
    '      let prefill=null;',
    '      if(masterTicker){',
    '        prefill={',
    '          source:"masters-lite",',
    '          ticker:masterTicker,',
    '          yahooTicker:masterTicker,',
    '          name:params.get("masterName")||masterTicker,',
    '          year:Number(params.get("masterYear")||2016),',
    '          amount:params.get("masterAmount")||"100",',
    '          market:"us",',
    '        };',
    '        window.history.replaceState(null,"",window.location.pathname);',
    '      }else{',
    '        const raw=localStorage.getItem("masterPrefill");',
    '        if(raw){',
    '          prefill=JSON.parse(raw);',
    '          localStorage.removeItem("masterPrefill");',
    '        }',
    '      }',
    '      if(!prefill||!prefill.yahooTicker)return;',
    '      setActiveTab(prefill.market||"us");',
    '      setSelectedStock({ticker:prefill.ticker||prefill.yahooTicker,yahooTicker:prefill.yahooTicker,name:prefill.name||prefill.yahooTicker});',
    '      setInvestYear(Number(prefill.year)||2016);',
    '      setInvestAmount(String(prefill.amount||"100"));',
    '      setShowKRW(false);',
    '      setResult(null);',
    '      setSearchQuery("");',
    '      setTimeout(()=>{document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"});},250);',
    '    }catch(e){}',
    '  },[]);',
    ''
  ].join('\n'),
  'const masterTicker=params.get("masterTicker")',
  'Master query prefill patch'
);

replaceOnce(
  '        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>\n          <div style={sec}>',
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 8px",padding:"0 16px"}}>',
    '          <button type="button" onClick={()=>{',
    '            setActiveTab("us");',
    '            setSelectedStock({ticker:"AAPL",yahooTicker:"AAPL",name:"애플"});',
    '            setInvestYear(2016);',
    '            setInvestAmount("100");',
    '            setShowKRW(false);',
    '            setResult(null);',
    '            setSearchQuery("");',
    '            setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
    '          }} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",minHeight:"46px",padding:"10px 13px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"13px",cursor:"pointer",textAlign:"left",color:T.text}}>',
    '            <div style={{width:"30px",height:"30px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:"1px solid "+T.borderActive+"55",fontSize:"17px",flexShrink:0}}>👣</div>',
    '            <div style={{flex:1,minWidth:0}}>',
    '              <div style={{fontSize:"13px",fontWeight:"800",color:T.text,letterSpacing:"-0.2px",marginBottom:"1px"}}>거장의 발자취</div>',
    '              <div style={{fontSize:"12px",color:T.textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>버핏이 애플을 공시에 올린 2016년으로 바로 껄해보기</div>',
    '            </div>',
    '            <div style={{fontSize:"16px",color:T.textMuted,fontWeight:"700"}}>›</div>',
    '          </button>',
    '        </div>',
    '',
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div style={sec}>'
  ].join('\n'),
  'Home masters direct action patch'
);

replaceOnce(
  [
    '            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>',
    '            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all 0.2s"}}>',
    '              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}',
    '            </button>',
    '            <div style={{marginTop:"20px"}}><CoupangBanner isDark={isDark} T={T}/></div>'
  ].join('\n'),
  [
    '            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>',
    '            <div style={{marginBottom:"16px"}}><CoupangBanner isDark={isDark} T={T}/></div>',
    '            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all 0.2s"}}>',
    '              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}',
    '            </button>'
  ].join('\n'),
  'Move pre-result Coupang banner above calculate button'
);

fs.writeFileSync(indexPath, source);
