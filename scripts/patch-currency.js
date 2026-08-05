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
  '        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>\n          <div style={sec}>',
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 14px",padding:"0 16px"}}>',
    '          <div style={{padding:"18px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"18px"}}>',
    '            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",marginBottom:"12px"}}>',
    '              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>',
    '                <span style={{fontSize:"20px"}}>🦜</span>',
    '                <div>',
    '                  <div style={{fontSize:"15px",fontWeight:"800",color:T.text,letterSpacing:"-0.3px"}}>오늘의 껄무새</div>',
    '                  <div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px"}}>매일 하나의 역사적 순간을 껄해봐요</div>',
    '                </div>',
    '              </div>',
    '              <div style={{fontSize:"10px",fontWeight:"700",color:T.accent,background:T.presetActive,border:"1px solid "+T.borderActive+"55",padding:"4px 7px",borderRadius:"999px"}}>TODAY</div>',
    '            </div>',
    '            <div style={{fontSize:"20px",lineHeight:1.45,fontWeight:"800",color:T.text,letterSpacing:"-0.6px",marginBottom:"8px"}}>버핏이 애플을 공시에 올린 2016년,<br/>나도 100만원을 넣었다면?</div>',
    '            <div style={{fontSize:"12px",lineHeight:1.55,color:T.textSub,marginBottom:"14px"}}>버튼을 누르면 계산기가 <strong style={{color:T.text}}>애플 · 2016년 · 100만원</strong>으로 자동 설정돼요.</div>',
    '            <button type="button" onClick={()=>{',
    '              setActiveTab("us");',
    '              setSelectedStock({ticker:"AAPL",yahooTicker:"AAPL",name:"애플"});',
    '              setInvestYear(2016);',
    '              setInvestAmount("100");',
    '              setShowKRW(false);',
    '              setResult(null);',
    '              setSearchQuery("");',
    '              setTimeout(()=>{',
    '                const note=document.getElementById("daily-change-note");',
    '                if(note){note.style.display="block";}',
    '                document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"});',
    '              },120);',
    '            }} style={{width:"100%",padding:"13px 16px",border:"none",borderRadius:"12px",background:`linear-gradient(135deg,${T.accentDim},#15803d)`,color:"#fff",fontSize:"14px",fontWeight:"800",cursor:"pointer"}}>2016년 Apple 결과 보기</button>',
    '            <div style={{fontSize:"10px",lineHeight:1.45,color:T.textMuted,marginTop:"10px"}}>공개된 과거 자료를 활용한 체험 콘텐츠이며, 투자 권유가 아니에요.</div>',
    '          </div>',
    '        </div>',
    '',
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div id="daily-change-note" style={{display:"none",margin:"0 0 12px",padding:"11px 12px",background:T.presetActive,border:"1px solid "+T.borderActive+"66",borderRadius:"11px",color:T.accent,fontSize:"12px",fontWeight:"800",textAlign:"center"}}>✓ 애플 · 2016년 · 100만원으로 설정했어요</div>',
    '          <div style={{fontSize:"18px",fontWeight:"800",color:T.text,letterSpacing:"-0.4px",margin:"4px 0 14px"}}>직접 껄해보기</div>',
    '          <div style={sec}>'
  ].join('\n'),
  'Today StockParrot home patch'
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
