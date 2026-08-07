const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

function rep(from,to,label){
  if(s.includes(to)){console.log(`${label} already applied.`);return;}
  if(!s.includes(from)){console.warn(`${label} target not found.`);return;}
  s=s.replace(from,to);
  console.log(`${label} applied.`);
}

rep(
  'const kr=item.market==="kr"||/\\.(KS|KQ)$/.test(item.ticker);const price=v=>kr?formatKRW(v):formatUSD(v);return <div',
  'const kr=item.market==="kr"||/\\.(KS|KQ)$/.test(item.ticker);const price=v=>kr?formatKRW(v):formatUSD(v);const unit=kr?"원":"달러";return <div',
  'Add explicit activity currency unit'
);

rep(
  '<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}><div style={{fontSize:"12px",color:T.textSub}}>{/13F|보유/.test((item.sourceLabel||"")+" "+(item.basis||""))?"공개 기준":"그때"} <strong style={{color:T.text}}>{price(perf.buyPrice)}</strong> <span style={{color:T.textMuted}}>→</span> 지금 <strong style={{color:T.text}}>{price(perf.currentPrice)}</strong></div><strong style={{fontSize:"15px",color:perf.returnPct>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{perf.returnPct>=0?"+":""}{perf.returnPct.toFixed(1)}%</strong></div>',
  '<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",minWidth:0}}><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>{/13F|보유/.test((item.sourceLabel||"")+" "+(item.basis||""))?"공개 기준 주가":"그때 주가"} · {unit}</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.buyPrice)}</strong></div><span style={{color:T.textMuted}}>→</span><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>지금 주가 · {unit}</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.currentPrice)}</strong></div></div><strong style={{fontSize:"15px",color:perf.returnPct>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{perf.returnPct>=0?"+":""}{perf.returnPct.toFixed(1)}%</strong></div>',
  'Label activity prices with currency'
);

rep(
  '{masterLegendBuyPrice&&masterLegendCurrentPrice&&<div style={{marginTop:"12px",display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:T.textSub}}><strong style={{color:T.text}}>{masterLegendDisplayPrice(masterLegendBuyPrice)}</strong><span style={{color:T.textMuted}}>→</span><strong style={{color:T.text}}>{masterLegendDisplayPrice(masterLegendCurrentPrice)}</strong>{masterLegendReturnPct!==null&&<span style={{marginLeft:"auto",fontSize:"11px",color:T.textMuted}}>{formatMultiple(masterLegendCurrentPrice,masterLegendBuyPrice)}</span>}</div>}',
  '{masterLegendBuyPrice&&masterLegendCurrentPrice&&<div style={{marginTop:"12px",display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:T.textSub}}><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>그때 주가 · {masterLegendMarket==="kr"?"원":"달러"}</div><strong style={{color:T.text}}>{masterLegendDisplayPrice(masterLegendBuyPrice)}</strong></div><span style={{color:T.textMuted}}>→</span><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>지금 주가 · {masterLegendMarket==="kr"?"원":"달러"}</div><strong style={{color:T.text}}>{masterLegendDisplayPrice(masterLegendCurrentPrice)}</strong></div>{masterLegendReturnPct!==null&&<span style={{marginLeft:"auto",fontSize:"11px",color:T.textMuted}}>{formatMultiple(masterLegendCurrentPrice,masterLegendBuyPrice)}</span>}</div>}',
  'Label legend prices with currency'
);

rep(
  '<div id="master-amount-step" style={{marginBottom:"30px",paddingTop:"10px"}}>\n            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>\n              <span style={snStyle}>03</span>\n              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>나도 그때 샀다면?</span>\n              <div style={{flex:1,height:"1px",background:T.border}}/>\n            </div>',
  '<div id="master-amount-step" style={{marginBottom:"30px",paddingTop:"0"}}>\n            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px",paddingTop:"18px",borderTop:`1px solid ${T.border}`}}>\n              <span style={{fontSize:"16px",fontWeight:"700",color:T.text,letterSpacing:"-0.3px"}}>나도 그때 샀다면?</span>\n              <div style={{flex:1,height:"1px",background:T.border}}/>\n            </div>',
  'Merge legend simulation into step 02'
);

rep(
  '{id:"history",label:"지난 기록"}',
  '{id:"history",label:"지난 기록 전체"}',
  'Rename history tab'
);

rep(
  'const masterHistoryItems=MASTER_ACTIVITY_HISTORY[selectedMasterId]||[];',
  'const masterHistoryItems=[...(MASTER_ACTIVITY_HISTORY[selectedMasterId]||[])].sort((a,b)=>String(b.eventDate||"").localeCompare(String(a.eventDate||"")));',
  'Sort all master history newest first'
);

fs.writeFileSync(p,s);
console.log('Master storyline v4 patch applied.');
