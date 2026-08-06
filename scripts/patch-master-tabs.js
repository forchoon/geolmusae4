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
  '  const [masterApplied,setMasterApplied]=useState("");',
  [
    '  const [masterApplied,setMasterApplied]=useState("");',
    '  const [homeMode,setHomeMode]=useState("direct");',
    '  const [masterResult,setMasterResult]=useState(null);',
    '  const [masterResultLoading,setMasterResultLoading]=useState(false);',
    '  const [masterResultError,setMasterResultError]=useState("");'
  ].join('\n'),
  'Home mode and master result state patch'
);

replaceOnce(
  '        <div style={{maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>',
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 14px",padding:"0 16px"}}>',
    '          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",padding:"4px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"14px"}}>',
    '            <button type="button" onClick={()=>setHomeMode("direct")} style={{padding:"11px 8px",border:"none",borderRadius:"10px",background:homeMode==="direct"?T.bgCard:"transparent",color:homeMode==="direct"?T.text:T.textSub,fontSize:"13px",fontWeight:"900",cursor:"pointer",boxShadow:homeMode==="direct"?"0 1px 5px rgba(0,0,0,.12)":"none"}}>직접 계산하기</button>',
    '            <button type="button" onClick={()=>setHomeMode("master")} style={{padding:"11px 8px",border:"none",borderRadius:"10px",background:homeMode==="master"?T.bgCard:"transparent",color:homeMode==="master"?T.text:T.textSub,fontSize:"13px",fontWeight:"900",cursor:"pointer",boxShadow:homeMode==="master"?"0 1px 5px rgba(0,0,0,.12)":"none"}}>👣 거장의 발자취</button>',
    '          </div>',
    '        </div>',
    '',
    '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>'
  ].join('\n'),
  'Restore top mode tabs'
);

replaceOnce(
  '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
  '        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
  'Toggle direct calculator visibility'
);

source = source.split('setMasterApplied("");').join('setMasterApplied("");setMasterResult(null);setMasterResultError("");');

replaceOnce(
  [
    '            <button type="button" disabled={!investAmount||Number(investAmount)<=0} onClick={()=>{',
    '              setActiveTab("us");',
    '              setSelectedStock({ticker:selectedMasterCase.ticker,yahooTicker:selectedMasterCase.ticker,name:selectedMasterCase.name});',
    '              setInvestYear(selectedMasterCase.year);',
    '              setShowKRW(false);',
    '              setResult(null);',
    '              setSearchQuery("");',
    '              setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);',
    '              setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
    '            }} style={{width:"100%",padding:"14px 16px",border:"none",borderRadius:"13px",background:(!investAmount||Number(investAmount)<=0)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,color:"#fff",fontSize:"14px",fontWeight:"900",cursor:(!investAmount||Number(investAmount)<=0)?"not-allowed":"pointer"}}>{selectedMaster.name}의 {selectedMasterCase.stock} 발자취로 계산하기</button>',
    '            {masterApplied&&<div style={{marginTop:"9px",padding:"9px 10px",background:T.presetActive,border:"1px solid "+T.borderActive+"55",borderRadius:"10px",color:T.accent,fontSize:"10px",fontWeight:"800",textAlign:"center"}}>{masterApplied}</div>}'
  ].join('\n'),
  [
    '            <button type="button" disabled={masterResultLoading||!investAmount||Number(investAmount)<=0} onClick={async()=>{',
    '              setMasterResultLoading(true);',
    '              setMasterResult(null);',
    '              setMasterResultError("");',
    '              setMasterApplied("");',
    '              try{',
    '                const dateStr=getSameDayOfYear(selectedMasterCase.year);',
    '                const [bp,cp]=await Promise.all([fetchYahooPrice(selectedMasterCase.ticker,dateStr),fetchCurrentPrice(selectedMasterCase.ticker)]);',
    '                if(!bp||!cp)throw new Error("price unavailable");',
    '                const investKRW=Number(investAmount)*10000;',
    '                const priceRatio=cp/bp;',
    '                const currentValueKRW=investKRW*priceRatio;',
    '                const profitKRW=currentValueKRW-investKRW;',
    '                const returnPct=((priceRatio-1)*100).toFixed(1);',
    '                const exactYears=(new Date()-new Date(dateStr))/(1000*60*60*24*365.25);',
    '                const cagr=((Math.pow(priceRatio,1/Math.max(exactYears,0.1))-1)*100).toFixed(1);',
    '                const resultData={masterName:selectedMaster.name,stock:selectedMasterCase.stock,stockName:selectedMasterCase.name,year:selectedMasterCase.year,amount:Number(investAmount),buyPrice:bp,currentPrice:cp,investKRW,currentValueKRW,profitKRW,returnPct,cagr,multipleText:formatMultiple(currentValueKRW,investKRW),isProfit:profitKRW>=0};',
    '                setMasterResult(resultData);',
    '                setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);',
    '                setTimeout(()=>document.getElementById("master-inline-result")?.scrollIntoView({behavior:"smooth",block:"center"}),120);',
    '              }catch(e){',
    '                setMasterResultError("시세를 불러오지 못했어요. 잠시 후 다시 계산해 주세요.");',
    '              }',
    '              setMasterResultLoading(false);',
    '            }} style={{width:"100%",padding:"14px 16px",border:"none",borderRadius:"13px",background:(masterResultLoading||!investAmount||Number(investAmount)<=0)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,color:"#fff",fontSize:"14px",fontWeight:"900",cursor:(masterResultLoading||!investAmount||Number(investAmount)<=0)?"not-allowed":"pointer"}}>{masterResultLoading?"🦜 발자취 계산 중…":`${selectedMaster.name}의 ${selectedMasterCase.stock} 발자취 계산하기`}</button>',
    '            {masterResultError&&<div style={{marginTop:"10px",padding:"11px 12px",background:"#ef444418",border:"1px solid #ef444455",borderRadius:"11px",color:"#f87171",fontSize:"11px",fontWeight:"700",textAlign:"center"}}>{masterResultError}</div>}',
    '            {masterResult&&<div id="master-inline-result" style={{marginTop:"14px",padding:"18px",background:T.bgDeep,border:"1px solid "+(masterResult.isProfit?T.borderActive+"77":"#ef444466"),borderRadius:"16px",textAlign:"center"}}>',
    '              <div style={{fontSize:"10px",fontWeight:"900",letterSpacing:"1px",color:T.textMuted,marginBottom:"8px"}}>거장의 발자취 결과</div>',
    '              <div style={{fontSize:"13px",lineHeight:1.55,color:T.textSub,marginBottom:"10px"}}><strong style={{color:T.text}}>{masterResult.year}년 {masterResult.stockName}</strong>에<br/><strong style={{color:T.text}}>{masterResult.amount.toLocaleString()}만원</strong>을 넣었다면</div>',
    '              <div style={{fontSize:"11px",color:T.textMuted,marginBottom:"4px"}}>지금</div>',
    '              <div style={{fontSize:"30px",fontWeight:"900",letterSpacing:"-1px",color:masterResult.isProfit?T.accent:"#f87171",marginBottom:"7px"}}>{formatKRW(Math.round(masterResult.currentValueKRW))}</div>',
    '              <div style={{fontSize:"13px",fontWeight:"800",color:masterResult.isProfit?T.accent:"#f87171",marginBottom:"5px"}}>{masterResult.profitKRW>=0?"+":""}{formatKRW(Math.round(masterResult.profitKRW))} · {masterResult.profitKRW>=0?"+":""}{masterResult.returnPct}%</div>',
    '              {masterResult.multipleText&&<div style={{fontSize:"12px",fontWeight:"800",color:T.text,marginBottom:"12px"}}>{masterResult.multipleText}</div>}',
    '              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"9px"}}>',
    '                <div style={{padding:"9px",background:T.bgSoft,borderRadius:"10px"}}><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"3px"}}>당시 주가</div><div style={{fontSize:"12px",fontWeight:"800",color:T.text}}>{formatUSD(masterResult.buyPrice)}</div></div>',
    '                <div style={{padding:"9px",background:T.bgSoft,borderRadius:"10px"}}><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"3px"}}>현재 주가</div><div style={{fontSize:"12px",fontWeight:"800",color:T.text}}>{formatUSD(masterResult.currentPrice)}</div></div>',
    '              </div>',
    '              <div style={{fontSize:"10px",color:T.textMuted}}>연평균 수익률 {masterResult.cagr}% · 현재 환율 변동은 단순화했어요</div>',
    '            </div>}'
  ].join('\n'),
  'Calculate and show master result inline'
);

fs.writeFileSync(indexPath, source);
