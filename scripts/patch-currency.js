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

replaceOnce(
  'function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}',
  'function getCurrency(yt){if(!yt)return "USD";if(yt==="^KS11"||yt.endsWith(".KS")||yt.endsWith(".KQ"))return "KRW";return CURRENCY_MAP[yt]||"USD";}',
  'Currency patch: .KS/.KQ tickers now use KRW'
);

replaceOnce(
  '<div style={{padding:"36px 20px 16px",textAlign:"center",position:"relative"}}>',
  '<div style={{padding:"28px 20px 12px",textAlign:"center",position:"relative"}}>',
  'Header padding patch'
);

replaceOnce(
  'width:"240px",\n    maxWidth:"78%",',
  'width:"150px",\n    maxWidth:"68%",',
  'Header logo size patch'
);

replaceOnce(
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 8px",padding:"0 16px"}}>',
    '          <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 16px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",minHeight:"44px"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>',
    '              <div style={{position:"relative",width:"8px",height:"8px",flexShrink:0}}>',
    '                <span style={{position:"absolute",inset:0,background:T.accent,borderRadius:"50%",animation:"liveRing 2s ease-out infinite",opacity:0}}/>',
    '                <span style={{position:"absolute",inset:"1px",background:T.accent,borderRadius:"50%"}}/>',
    '              </div>',
    '              <span style={{fontSize:"11px",fontWeight:"600",color:T.accent}}>Live</span>',
    '            </div>',
    '            <div style={{width:"1px",height:"14px",background:T.border,flexShrink:0}}/>',
    '            <span style={{',
    '              fontSize:"13px",',
    '              color:T.textSub,',
    '              fontWeight:"400",',
    '              overflow:"hidden",',
    '              textOverflow:"ellipsis",',
    '              whiteSpace:"nowrap",',
    '              opacity:liveFeedVisible?1:0,',
    '              transition:"opacity 0.4s ease"',
    '            }}>',
    '              {recentFeed.length > 0 ? (()=>{',
    '                const item = recentFeed[liveFeedIdx % recentFeed.length];',
    '                const template = FEED_TEMPLATES[(liveFeedIdx + recentFeed.indexOf(item)) % FEED_TEMPLATES.length];',
    '                const timeAgo = getTimeAgo(item.timestamp);',
    '                return <span>',
    '                  <strong style={{color:T.text,fontWeight:"600"}}>{template(item.ticker)}</strong>',
    '                  {timeAgo && <span style={{color:T.textMuted,fontWeight:"400"}}> · {timeAgo}</span>}',
    '                </span>;',
    '              })() : <span>🦜 껄무새들의 실시간 후회가 모이는 곳</span>}',
    '            </span>',
    '          </div>',
    '        </div>',
    ''
  ].join('\n'),
  '        {/* top live feed removed */}\n',
  'Remove top live feed'
);

replaceOnce(
  '        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>\n          <div style={sec}>',
  [
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div style={{margin:"0 0 12px"}}>',
    '            <div style={{fontSize:"13px",fontWeight:"800",color:T.text,marginBottom:"8px"}}>어떻게 껄해볼까요?</div>',
    '            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",padding:"4px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"13px"}}>',
    '              <button id="direct-mode-btn" type="button" onClick={()=>{',
    '                const panel=document.getElementById("master-preset-panel");',
    '                if(panel)panel.style.display="none";',
    '                const direct=document.getElementById("direct-mode-btn");',
    '                const master=document.getElementById("master-mode-btn");',
    '                if(direct){direct.style.background=T.bgCard;direct.style.color=T.text;direct.style.boxShadow="0 1px 4px rgba(0,0,0,.12)";}',
    '                if(master){master.style.background="transparent";master.style.color=T.textSub;master.style.boxShadow="none";}',
    '              }} style={{padding:"10px 8px",border:"none",borderRadius:"10px",background:T.bgCard,color:T.text,fontSize:"13px",fontWeight:"800",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,.12)"}}>직접 고르기</button>',
    '              <button id="master-mode-btn" type="button" onClick={()=>{',
    '                const panel=document.getElementById("master-preset-panel");',
    '                if(panel)panel.style.display="block";',
    '                const direct=document.getElementById("direct-mode-btn");',
    '                const master=document.getElementById("master-mode-btn");',
    '                if(master){master.style.background=T.bgCard;master.style.color=T.text;master.style.boxShadow="0 1px 4px rgba(0,0,0,.12)";}',
    '                if(direct){direct.style.background="transparent";direct.style.color=T.textSub;direct.style.boxShadow="none";}',
    '              }} style={{padding:"10px 8px",border:"none",borderRadius:"10px",background:"transparent",color:T.textSub,fontSize:"13px",fontWeight:"800",cursor:"pointer"}}>👣 거장 따라보기</button>',
    '            </div>',
    '          </div>',
    '',
    '          <div id="master-preset-panel" style={{display:"none",margin:"0 0 12px",padding:"12px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"14px"}}>',
    '            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",marginBottom:"9px"}}>',
    '              <div style={{fontSize:"12px",fontWeight:"800",color:T.text}}>어떤 발자취를 볼까요?</div>',
    '              <div style={{fontSize:"10px",color:T.textMuted}}>대표 사례 6개</div>',
    '            </div>',
    '            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"7px"}}>',
    '              {[',
    '                {label:"버핏",stock:"Apple",ticker:"AAPL",name:"애플",year:2016},',
    '                {label:"버핏",stock:"Amazon",ticker:"AMZN",name:"아마존",year:2019},',
    '                {label:"캐시 우드",stock:"Tesla",ticker:"TSLA",name:"테슬라",year:2018},',
    '                {label:"캐시 우드",stock:"Coinbase",ticker:"COIN",name:"코인베이스",year:2021},',
    '                {label:"펠로시",stock:"NVIDIA",ticker:"NVDA",name:"엔비디아",year:2021},',
    '                {label:"펠로시",stock:"Microsoft",ticker:"MSFT",name:"마이크로소프트",year:2021}',
    '              ].map(master=>(',
    '                <button key={`${master.label}-${master.ticker}-${master.year}`} type="button" onClick={()=>{',
    '                  setActiveTab("us");',
    '                  setSelectedStock({ticker:master.ticker,yahooTicker:master.ticker,name:master.name});',
    '                  setInvestYear(master.year);',
    '                  setInvestAmount("100");',
    '                  setShowKRW(false);',
    '                  setResult(null);',
    '                  setSearchQuery("");',
    '                  const note=document.getElementById("master-change-note");',
    '                  if(note){note.textContent=`✓ ${master.label} × ${master.name} · ${master.year}년 · 100만원`;note.style.display="block";}',
    '                }} style={{minWidth:0,padding:"10px 9px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"11px",cursor:"pointer",color:T.text,textAlign:"left"}}>',
    '                  <div style={{fontSize:"10px",fontWeight:"800",color:T.accent,marginBottom:"3px"}}>{master.label}</div>',
    '                  <div style={{fontSize:"12px",fontWeight:"800",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{master.stock}</div>',
    '                  <div style={{fontSize:"10px",color:T.textSub,marginTop:"3px"}}>{master.year}년</div>',
    '                </button>',
    '              ))}',
    '            </div>',
    '            <div style={{fontSize:"10px",lineHeight:1.45,color:T.textMuted,marginTop:"8px"}}>공개된 과거 자료를 바탕으로 한 체험 프리셋이에요. 정확한 매수일·단가를 뜻하지 않으며, 선택 후 값은 자유롭게 바꿀 수 있어요.</div>',
    '          </div>',
    '',
    '          <div id="master-change-note" style={{display:"none",margin:"0 0 10px",padding:"10px 12px",background:T.presetActive,border:"1px solid "+T.borderActive+"66",borderRadius:"11px",color:T.accent,fontSize:"12px",fontWeight:"800",textAlign:"center"}}></div>',
    '          <div style={sec}>'
  ].join('\n'),
  'Calculator entry mode patch'
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
