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

// Enrich the selected master description without repeating the name or emoji.
replaceOnce(
  '              <div style={{padding:"13px 14px 14px",borderTop:`1px solid ${T.border}`,background:T.inputBg}}>\n                <div style={{fontSize:"13px",lineHeight:1.6,color:T.textSub}}>{selectedMaster.description}</div>\n                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"9px"}}>{selectedMaster.tags.map(tag=><span key={tag} style={{fontSize:"11px",fontWeight:"500",color:T.accent,background:T.presetActive,padding:"5px 8px",borderRadius:"999px"}}>{tag}</span>)}</div>\n              </div>',
  '              <div style={{padding:"14px 14px 15px",borderTop:`1px solid ${T.border}`,background:T.inputBg}}>\n                <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub}}>{selectedMaster.description}</div>\n                <div style={{marginTop:"9px",paddingTop:"9px",borderTop:`1px solid ${T.border}`,fontSize:"12px",lineHeight:1.6,color:T.textMuted}}>{selectedMasterId==="buffett"?"버크셔 해서웨이의 공개 보유자료와 주주서한에서 반복적으로 확인되는 장기 보유·기업 경쟁력 관점을 중심으로 구성했어요.":selectedMasterId==="ark"?"ARK가 공개하는 ETF 보유 내역과 투자 리서치에서 자주 등장하는 파괴적 혁신 테마를 중심으로 구성했어요.":"미 의회 정기거래보고서(PTR)에 공개된 배우자 거래를 바탕으로 구성했으며, 펠로시 본인의 직접 투자로 단정하지 않아요."}</div>\n                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"10px"}}>{selectedMaster.tags.map(tag=><span key={tag} style={{fontSize:"11px",fontWeight:"500",color:T.accent,background:T.presetActive,padding:"5px 8px",borderRadius:"999px"}}>{tag}</span>)}</div>\n              </div>',
  'Enrich master profile explanation'
);

// Remove the count badge from the section title.
replaceOnce(
  '              <span style={{fontSize:"11px",fontWeight:"600",color:T.accent,background:T.presetActive,padding:"4px 7px",borderRadius:"999px"}}>{selectedMaster.cases.length}개</span>\n',
  '',
  'Remove master case count badge'
);

// Make case selection follow the same active/inactive visual language as the direct calculator.
replaceOnce(
  '              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"1px",background:T.border}}>',
  '              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"8px",padding:"8px",background:T.bgCard}}>',
  'Unify master case grid spacing'
);

replaceOnce(
  '                  return <button key={`${item.ticker}-${item.year}`} type="button" onClick={()=>{setSelectedMasterCaseIndex(originalIndex);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"72px",padding:"11px 12px",background:active?(isDark?"rgba(74,222,128,.14)":T.presetActive):T.bgCard,border:"none",cursor:"pointer",textAlign:"left",transition:"all .2s",boxShadow:active?`inset 3px 0 ${T.accent}`:"none"}}>',
  '                  return <button key={`${item.ticker}-${item.year}`} type="button" onClick={()=>{setSelectedMasterCaseIndex(originalIndex);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"68px",padding:"10px 11px",background:active?T.presetActive:T.inputBg,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"11px",cursor:"pointer",textAlign:"left",transition:"all .2s",boxShadow:active?`0 0 0 2px ${T.accent}12`:"none"}}>',
  'Unify master case focus style'
);

// Turn the full-width divider button into a quieter inline disclosure control.
replaceOnce(
  '              {selectedMaster.cases.length>4&&<button type="button" onClick={()=>setShowAllMasterCases(v=>!v)} style={{width:"100%",padding:"10px 12px",border:"none",borderTop:`1px solid ${T.border}`,background:T.inputBg,color:T.textSub,fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>{showAllMasterCases?"사례 접기":`사례 ${selectedMaster.cases.length-4}개 더 보기`}</button>}',
  '              {selectedMaster.cases.length>4&&<div style={{display:"flex",justifyContent:"center",padding:"2px 8px 10px"}}><button type="button" onClick={()=>setShowAllMasterCases(v=>!v)} style={{padding:"7px 10px",border:"none",background:"transparent",color:T.accent,fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>{showAllMasterCases?"접기 ↑":`전체 사례 보기 +${selectedMaster.cases.length-4}`}</button></div>}',
  'Refine master case disclosure control'
);

// Put evidence and interpretation before price data, while clearly separating facts from inference.
replaceOnce(
  '                <div style={{padding:"0 14px 14px"}}>\n                  {masterPreviewLoading?(',
  '                <div style={{padding:"0 14px 14px"}}>\n                  <div style={{padding:"13px 14px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"12px",marginBottom:"10px"}}>\n                    <div style={{fontSize:"11px",fontWeight:"700",color:T.accent,marginBottom:"5px"}}>이 사례를 보는 이유</div>\n                    <div style={{fontSize:"13px",lineHeight:1.6,color:T.textSub}}>{selectedMasterCaseMeta.summary}</div>\n                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px",paddingTop:"9px",marginTop:"9px",borderTop:`1px solid ${T.border}`}}>\n                      <span style={{fontSize:"11px",color:T.textMuted,whiteSpace:"nowrap"}}>확인된 공개자료</span>\n                      <strong style={{fontSize:"11px",fontWeight:"600",lineHeight:1.45,color:T.text,textAlign:"right"}}>{selectedMasterCaseMeta.source} · {selectedMasterCaseMeta.type}</strong>\n                    </div>\n                    <div style={{fontSize:"10px",lineHeight:1.5,color:T.textMuted,marginTop:"7px"}}>공개자료는 보유·거래 사실을 보여주지만, 실제 의사결정 이유 전체를 의미하지는 않아요.</div>\n                  </div>\n                  {masterPreviewLoading?(',
  'Add evidence before master price preview'
);

// Remove the premature fixed-amount simulation from step 02.
replaceOnce(
  '                    <div style={{padding:"12px 14px",background:`${T.accent}0D`,border:`1px solid ${T.accent}30`,borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",marginBottom:"12px"}}><div><div style={{fontSize:"11px",color:T.textMuted,marginBottom:"3px"}}>100만원을 같은 기준일에 넣었다면</div><div style={{fontSize:"13px",color:T.textSub}}>대표 기준일 → 오늘</div></div><div style={{fontSize:"18px",fontWeight:"800",color:Number(masterPreviewReturnPct)>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{formatKRW(Math.round(masterPreviewMillionValue))}</div></div>\n',
  '',
  'Remove premature one-million-won preview'
);

// Avoid repeating the interpretation below the chart; keep only compact classification and methodology.
replaceOnce(
  '                  <div style={{fontSize:"13px",lineHeight:1.6,color:T.textSub,marginBottom:"8px"}}>{selectedMasterCaseMeta.summary}</div>\n                  <div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted}}>자료 구분: {selectedMasterCaseMeta.source} · 표시 가격은 {selectedMasterCase.year}년 오늘과 현재 시세를 비교한 체험용 값이며, 실제 거래일·거래 단가를 의미하지 않아요.</div>',
  '                  <div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted}}>표시 가격은 {selectedMasterCase.year}년의 같은 날짜와 현재 시세를 비교한 체험용 값이에요. 실제 매수일·매수가와는 다를 수 있습니다.</div>',
  'Remove duplicated master case explanation'
);

// Clarify price labels.
replaceOnce(
  '[{label:"기준일 1주",value:formatUSD(masterPreview.buyPrice)},{label:"현재 1주",value:formatUSD(masterPreview.currentPrice)},{label:"1주 변화",value:`${Number(masterPreviewReturnPct)>=0?"+":""}${masterPreviewReturnPct}%`,highlight:true}]',
  '[{label:"기준 연도 주가",value:formatUSD(masterPreview.buyPrice)},{label:"현재 주가",value:formatUSD(masterPreview.currentPrice)},{label:"주가 변화",value:`${Number(masterPreviewReturnPct)>=0?"+":""}${masterPreviewReturnPct}%`,highlight:true}]',
  'Clarify master preview labels'
);

// Tighten the vertical rhythm only inside the master flow.
const masterStart = '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart = '        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const startIndex = source.indexOf(masterStart);
const endIndex = source.indexOf(calculatorStart, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.warn('Master spacing target not found. Skipping.');
} else {
  let masterBlock = source.slice(startIndex, endIndex);
  let remaining = 3;
  masterBlock = masterBlock.replace(/          <div style=\{sec\}>/g, match => {
    if (remaining <= 0) return match;
    remaining -= 1;
    return '          <div style={{...sec,marginBottom:"30px",paddingTop:"10px"}}>';
  });
  masterBlock = masterBlock.replace(/gap:"12px",marginBottom:"18px"/g, 'gap:"12px",marginBottom:"14px"');
  source = source.slice(0, startIndex) + masterBlock + source.slice(endIndex);
  console.log('Tightened master step spacing.');
}

fs.writeFileSync(indexPath, source);
