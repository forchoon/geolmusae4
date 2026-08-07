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

const formatAnchor = 'function formatUSD(v){return`$${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}';
const easyHelpers = [
  formatAnchor,
  'function formatBigKRW(v){',
  '  const a=Math.abs(v);',
  '  if(a>=1e12){',
  '    const jo=Math.floor(a/1e12);',
  '    const eok=Math.round(((a-jo*1e12)/1e8)/100)*100;',
  '    return eok>0?`${jo}조 ${eok.toLocaleString()}억원`:`${jo}조원`;',
  '  }',
  '  if(a>=1e8){const n=a/1e8;return`${n>=100?Math.round(n):n.toFixed(1).replace(".0","")}억원`;}',
  '  if(a>=1e4){return`${Math.round(a/1e4).toLocaleString()}만원`;}',
  '  return`${Math.round(a).toLocaleString()}원`;',
  '}',
  'function getEvidenceScaleKrw(text,rate){',
  '  if(!text||!rate)return null;',
  '  const matches=[...String(text).matchAll(/\\$([\\d,.]+)\\s*([KMB])?/gi)];',
  '  if(!matches.length)return null;',
  '  const mult={K:1e3,M:1e6,B:1e9};',
  '  const values=matches.map(m=>{const n=parseFloat(m[1].replace(/,/g,""));const unit=(m[2]||"").toUpperCase();return formatBigKRW(n*(mult[unit]||1)*rate);});',
  '  const unique=[...new Set(values)];',
  '  return unique.length===1?`약 ${unique[0]}`:`약 ${unique.join(" ~ ")}`;',
  '}',
  'function getEvidenceGlossary(evidence){',
  '  const src=String(evidence?.sourceLabel||"");',
  '  const scale=String(evidence?.scale||"");',
  '  const status=String(evidence?.status||"");',
  '  const items=[];',
  '  if(src.includes("13F"))items.push({term:"13F",desc:"미국에서 일정 규모 이상의 큰 투자기관이 SEC에 분기마다 내는 ‘보유 주식 목록’이에요. 어떤 주식을 몇 주 갖고 있는지는 보이지만, 정확히 언제 얼마에 샀는지는 보통 알 수 없어요."});',
  '  if(src.includes("SEC")||src.includes("13F")||src.includes("10-K")||src.includes("8-K"))items.push({term:"SEC",desc:"미국 증권시장을 감독하고 기업 공시를 받는 기관이에요. 한국의 금융당국과 비슷한 역할이라고 생각하면 쉬워요."});',
  '  if(src.includes("10-K"))items.push({term:"10-K",desc:"미국 상장회사가 1년에 한 번 내는 상세 사업·재무 보고서예요."});',
  '  if(src.includes("8-K"))items.push({term:"8-K",desc:"회사의 중요한 사건이나 큰 계약 같은 내용을 투자자에게 빠르게 알리는 공시예요."});',
  '  if(src.includes("Annual Report")||src.includes("주주서한"))items.push({term:"연차보고서",desc:"회사가 1년 동안 어떻게 사업했고 돈을 얼마나 벌었는지 정리한 연간 보고서예요."});',
  '  if(src.includes("PTR"))items.push({term:"PTR",desc:"미국 의회 관계자의 주식·옵션 같은 금융 거래를 공개하는 신고서예요. 정확한 금액 대신 일정 범위로 공개되는 경우가 많아요."});',
  '  if(src.includes("ARK")||status.includes("ETF")||scale.includes("ETF"))items.push({term:"ETF",desc:"여러 주식이나 자산을 한 바구니에 담아 주식처럼 사고팔 수 있게 만든 투자 상품이에요."});',
  '  if(scale.includes("콜")||status.includes("콜옵션"))items.push({term:"콜옵션",desc:"정해진 가격에 주식을 살 수 있는 ‘권리’예요. 주식 자체를 바로 산 것과는 달라요."});',
  '  if(status.includes("워런트")||scale.includes("워런트"))items.push({term:"워런트",desc:"미리 정한 가격에 주식을 살 수 있는 권리예요. 일반 주식 매수와 거래 구조가 달라요."});',
  '  if(/\\$[\\d,.]+\\s*[KMB]?/i.test(scale))items.push({term:"$ · K/M/B",desc:"달러 금액 표기예요. K=천 달러, M=100만 달러, B=10억 달러예요. 아래에 현재 환율 기준 한화도 같이 보여드려요."});',
  '  return items.slice(0,3);',
  '}'
].join('\n');

if (!source.includes('function getEvidenceScaleKrw(')) {
  replaceOnce(formatAnchor, easyHelpers, 'Evidence currency and glossary helpers');
}

const oldGrid = '                      {[{label:"거래·기준일",value:selectedMasterEvidence.eventDate},{label:"신고·제출일",value:selectedMasterEvidence.disclosureDate},{label:"공개 규모",value:selectedMasterEvidence.scale},{label:"변화·상태",value:selectedMasterEvidence.status}].map(item=><div key={item.label} style={{padding:"9px 10px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"10px",minWidth:0}}><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"4px"}}>{item.label}</div><div style={{fontSize:"11px",fontWeight:"650",lineHeight:1.45,color:T.text,wordBreak:"keep-all"}}>{item.value}</div></div>)}';
const newGrid = '                      {[{label:"거래·기준일",value:selectedMasterEvidence.eventDate},{label:"신고·제출일",value:selectedMasterEvidence.disclosureDate},{label:"공개 규모",value:selectedMasterEvidence.scale},{label:"변화·상태",value:selectedMasterEvidence.status}].map(item=>{const krw=item.label==="공개 규모"?getEvidenceScaleKrw(item.value,usdToKrw):null;return <div key={item.label} style={{padding:"9px 10px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"10px",minWidth:0}}><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"4px"}}>{item.label}</div><div style={{fontSize:"11px",fontWeight:"650",lineHeight:1.45,color:T.text,wordBreak:"keep-all"}}>{item.value}</div>{krw&&<div style={{fontSize:"11px",fontWeight:"800",lineHeight:1.45,color:T.accent,marginTop:"5px"}}>≈ {krw}<div style={{fontSize:"9px",fontWeight:"500",color:T.textMuted,marginTop:"2px"}}>1달러 ≈ {Math.round(usdToKrw).toLocaleString()}원 기준</div></div>}</div>})}';
replaceOnce(oldGrid, newGrid, 'Add KRW translation to disclosed amounts');

const timelineAnchor = '                    {selectedMasterEvidence.timeline?.length>0&&<div style={{display:"grid",gridTemplateColumns:`repeat(${selectedMasterEvidence.timeline.length},minmax(0,1fr))`,gap:"4px",padding:"10px 8px",background:T.bgDeep,borderRadius:"10px",marginBottom:"11px"}}>{selectedMasterEvidence.timeline.map((item,idx)=><div key={`${item.date}-${idx}`} style={{position:"relative",textAlign:"center",padding:"0 2px"}}>{idx>0&&<span style={{position:"absolute",top:"8px",left:"-7px",width:"10px",height:"1px",background:T.border}}/>}<div style={{width:"6px",height:"6px",borderRadius:"50%",background:idx===selectedMasterEvidence.timeline.length-1?T.accent:T.borderActive,margin:"5px auto 6px"}}/><div style={{fontSize:"9px",fontWeight:"700",color:idx===selectedMasterEvidence.timeline.length-1?T.accent:T.textSub}}>{item.date}</div><div style={{fontSize:"9px",lineHeight:1.35,color:T.textMuted,marginTop:"2px"}}>{item.label}</div></div>)}</div>}';
const glossaryAndTimeline = [
  '                    {getEvidenceGlossary(selectedMasterEvidence).length>0&&<div style={{padding:"11px 12px",background:T.bgDeep,borderRadius:"10px",marginBottom:"11px",border:`1px solid ${T.border}`}}>',
  '                      <div style={{fontSize:"11px",fontWeight:"800",color:T.text,marginBottom:"8px"}}>🧩 처음 보는 말, 이렇게 보면 쉬워요</div>',
  '                      <div style={{display:"grid",gap:"7px"}}>{getEvidenceGlossary(selectedMasterEvidence).map(item=><div key={item.term} style={{fontSize:"11px",lineHeight:1.55,color:T.textSub}}><strong style={{color:T.accent,fontWeight:"800"}}>{item.term}</strong><span style={{color:T.textMuted}}> · </span>{item.desc}</div>)}</div>',
  '                    </div>}',
  timelineAnchor
].join('\n');
replaceOnce(timelineAnchor, glossaryAndTimeline, 'Add beginner finance glossary');

const oldFact = '<div style={{fontSize:"12px",lineHeight:1.6,color:T.textSub}}>{selectedMasterEvidence.fact}</div>';
const newFact = '<div style={{fontSize:"12px",lineHeight:1.65,color:T.textSub}}>{selectedMasterEvidence.fact}</div>';
replaceOnce(oldFact, newFact, 'Relax evidence fact line height');

fs.writeFileSync(indexPath, source);
