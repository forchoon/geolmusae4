const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

function replaceOnce(from, to, label) {
  if (to && source.includes(to)) {
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

// Replace the old pre-calculation ranking with a compact post-result discovery block.
const rankingStart = source.indexOf('function RankingSection(');
const homeStart = source.indexOf('export default function Home(){', rankingStart);
if (rankingStart === -1 || homeStart === -1) {
  console.warn('Ranking component target not found. Skipping.');
} else {
  const rankingComponent = `function RankingSection({activeTab,T,isDark,onSelect}){
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let alive=true;
    const fetchRanking=async()=>{
      try{
        const res=await fetch(\`/api/ranking?tab=\${activeTab}\`);
        const data=await res.json();
        if(alive)setRanking(Array.isArray(data.ranking)?data.ranking:[]);
      }catch(e){
        if(alive)setRanking([]);
      }finally{
        if(alive)setLoading(false);
      }
    };
    setLoading(true);
    fetchRanking();
    return()=>{alive=false;};
  },[activeTab]);

  if(loading||ranking.length===0)return null;
  const medals=["🥇","🥈","🥉"];
  const medalColors=isDark?["#fbbf24","#c4c8d0","#d99559"]:["#d97706","#7b8491","#b45309"];

  return(
    <div style={{marginTop:"18px",marginBottom:"48px",animation:"slideUp 0.45s cubic-bezier(0.16,1,0.3,1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
        <span style={{fontSize:"14px",fontWeight:"700",color:T.text}}>🦜 껄무새 TOP 3</span>
        <span style={{fontSize:"10px",fontWeight:"700",color:T.accent,background:T.presetActive,border:\`1px solid \${T.borderActive}55\`,padding:"4px 7px",borderRadius:"999px"}}>최근 7일</span>
        <div style={{flex:1,height:"1px",background:T.border}}/>
      </div>
      <div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted,marginBottom:"10px"}}>다른 껄무새들이 실제로 많이 계산한 종목과 연도예요.</div>
      <div style={{background:T.bgCard,border:\`1px solid \${T.border}\`,borderRadius:"14px",overflow:"hidden"}}>
        {ranking.slice(0,3).map((item,idx)=>(
          <button key={\`\${item.ticker}-\${item.year}-\${idx}\`} type="button" onClick={()=>onSelect&&onSelect(item)} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"12px 13px",border:"none",borderBottom:idx<Math.min(ranking.length,3)-1?\`1px solid \${T.border}\`:"none",background:"transparent",cursor:"pointer",textAlign:"left",color:T.text,transition:"background .15s"}}>
            <span style={{width:"24px",fontSize:"15px",textAlign:"center",color:medalColors[idx],flexShrink:0}}>{medals[idx]}</span>
            <span style={{minWidth:0,flex:1}}>
              <span style={{display:"block",fontSize:"13px",fontWeight:"700",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name||item.ticker}</span>
              <span style={{display:"block",fontSize:"11px",color:T.textMuted,marginTop:"3px"}}>{item.year?\`\${item.year}년에 살걸\`:"많이 계산한 종목"}</span>
            </span>
            <span style={{fontSize:"11px",fontWeight:"700",color:T.accent,whiteSpace:"nowrap"}}>{Number(item.count||0).toLocaleString()}회</span>
            <span style={{fontSize:"12px",color:T.textMuted}}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

`;
  source = source.slice(0, rankingStart) + rankingComponent + source.slice(homeStart);
  console.log('Ranking component rebuilt for post-result placement.');
}

// Remove the old ranking block between stock selection and buy timing.
replaceOnce(
  '          <RankingSection activeTab={activeTab} T={T} isDark={isDark} onLiveFeed={msg=>setLiveFeedMsg(msg)} />\n\n',
  '',
  'Remove pre-calculation ranking'
);

// Record the exact stock and selected year for future TOP 3 interactions.
replaceOnce(
  '      body: JSON.stringify({ ticker: selectedStock.name || selectedStock.ticker, tabType: activeTab })',
  '      body: JSON.stringify({ ticker: selectedStock.yahooTicker || selectedStock.ticker, name: selectedStock.name || selectedStock.ticker, year: investYear, tabType: activeTab })',
  'Record ranking stock and year'
);

// Add a handler that restores a ranked stock/year into the direct calculator.
const homeReturn = '  return(\n    <>\n      <Head>';
if (source.includes('  const handleRankingSelect=(item)=>{')) {
  console.log('Ranking selection handler already applied.');
} else if (!source.includes(homeReturn)) {
  console.warn('Home return target not found. Skipping ranking handler.');
} else {
  const handler = `  const handleRankingSelect=(item)=>{
    if(!item)return;
    const yahooTicker=item.ticker||"";
    const name=item.name||item.ticker||"종목";
    const presetGroups={us:US_PRESETS,kr:KR_PRESETS,index:INDEX_PRESETS,coin:COIN_PRESETS};
    const presets=presetGroups[activeTab]||[];
    const preset=presets.find(p=>p.ticker===yahooTicker||getYahooTicker(p.ticker)===yahooTicker||p.name===name);
    const nextStock=preset
      ? {ticker:preset.ticker,yahooTicker:getYahooTicker(preset.ticker),name:preset.name}
      : {ticker:yahooTicker,yahooTicker,name};
    setSelectedStock(nextStock);
    if(item.year)setInvestYear(Number(item.year));
    setResult(null);
    setCompareStock(null);
    setCompareResult(null);
    setSearchQuery("");
    setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),80);
  };

`;
  source = source.replace(homeReturn, handler + homeReturn);
  console.log('Ranking selection handler applied.');
}

// Place TOP 3 after the direct calculation result card.
replaceOnce(
  '          )}\n\n        </div>\n\n        <footer',
  '          )}\n\n          {result&&<RankingSection activeTab={activeTab} T={T} isDark={isDark} onSelect={handleRankingSelect}/>}\n\n        </div>\n\n        <footer',
  'Place ranking after result'
);

// Align the master tab start with the direct calculator and move its intro below step 01.
const masterStart = '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart = '        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const ms = source.indexOf(masterStart);
const me = source.indexOf(calculatorStart, ms);
if (ms === -1 || me === -1) {
  console.warn('Master alignment target not found. Skipping.');
} else {
  let block = source.slice(ms, me);
  const intro = '          <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,margin:"4px 0 8px"}}>공개자료에 등장한 대표 사례를 골라, 같은 조건으로 지금의 가치를 확인해보세요.</div>\n';
  block = block.replace(intro, '');
  block = block.replace(
    '          <div style={{...sec,marginBottom:"30px",paddingTop:"10px"}}>',
    '          <div style={{...sec,marginBottom:"30px",paddingTop:"16px"}}>'
  );
  const stepOneHeader = '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>거장 선택</span>\n              <div style={{flex:1,height:"1px",background:T.border}}/>\n            </div>\n';
  const movedIntro = stepOneHeader + '            <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,margin:"-2px 0 12px"}}>공개자료에 등장한 대표 사례를 골라, 같은 조건으로 지금의 가치를 확인해보세요.</div>\n';
  if (!block.includes('margin:"-2px 0 12px"')) block = block.replace(stepOneHeader, movedIntro);
  source = source.slice(0, ms) + block + source.slice(me);
  console.log('Master tab start aligned and intro moved below step 01.');
}

fs.writeFileSync(indexPath, source);
