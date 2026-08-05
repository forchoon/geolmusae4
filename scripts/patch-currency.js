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
    '        <div style={{maxWidth:"600px",margin:"0 auto 10px",padding:"0 16px"}}>',
    '          <div style={{padding:"14px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"16px"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>',
    '              <div style={{width:"32px",height:"32px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:"1px solid "+T.borderActive+"55",fontSize:"18px",flexShrink:0}}>👣</div>',
    '              <div style={{flex:1,minWidth:0}}>',
    '                <div style={{fontSize:"14px",fontWeight:"800",color:T.text,letterSpacing:"-0.2px"}}>거장의 발자취</div>',
    '                <div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px"}}>하나를 고르면 종목 · 매수연도 · 100만원이 자동으로 바뀌어요</div>',
    '              </div>',
    '            </div>',
    '            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px"}}>',
    '              {[',
    '                {label:"버핏",stock:"Apple",ticker:"AAPL",name:"애플",year:2016,emoji:"🧓"},',
    '                {label:"캐시 우드",stock:"Tesla",ticker:"TSLA",name:"테슬라",year:2020,emoji:"🚀"},',
    '                {label:"펠로시",stock:"NVIDIA",ticker:"NVDA",name:"엔비디아",year:2021,emoji:"👀"}',
    '              ].map(master=>(',
    '                <button key={master.ticker} type="button" onClick={()=>{',
    '                  setActiveTab("us");',
    '                  setSelectedStock({ticker:master.ticker,yahooTicker:master.ticker,name:master.name});',
    '                  setInvestYear(master.year);',
    '                  setInvestAmount("100");',
    '                  setShowKRW(false);',
    '                  setResult(null);',
    '                  setSearchQuery("");',
    '                  setTimeout(()=>{',
    '                    const note=document.getElementById("master-change-note");',
    '                    if(note){note.textContent=`✓ ${master.name} · ${master.year}년 · 100만원으로 바뀌었어요`;note.style.display="block";}',
    '                    document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"});',
    '                  },120);',
    '                }} style={{minWidth:0,padding:"10px 6px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"12px",cursor:"pointer",color:T.text,textAlign:"center"}}>',
    '                  <div style={{fontSize:"18px",marginBottom:"4px"}}>{master.emoji}</div>',
    '                  <div style={{fontSize:"11px",fontWeight:"800",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{master.label}</div>',
    '                  <div style={{fontSize:"10px",color:T.textSub,marginTop:"3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{master.stock}</div>',
    '                  <div style={{fontSize:"10px",color:T.accent,marginTop:"2px",fontWeight:"700"}}>{master.year}년</div>',
    '                </button>',
    '              ))}',
    '            </div>',
    '            <div style={{fontSize:"10px",color:T.textMuted,lineHeight:1.45,marginTop:"9px"}}>과거 공개 자료를 바탕으로 한 체험용 프리셋이며, 정확한 매수일·단가 또는 투자 권유를 의미하지 않아요.</div>',
    '          </div>',
    '        </div>',
    '',
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div id="master-change-note" style={{display:"none",margin:"0 0 10px",padding:"10px 12px",background:T.presetActive,border:"1px solid "+T.borderActive+"66",borderRadius:"11px",color:T.accent,fontSize:"12px",fontWeight:"700",textAlign:"center"}}></div>',
    '          <div style={sec}>'
  ].join('\n'),
  'Home masters multi-preset patch'
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
