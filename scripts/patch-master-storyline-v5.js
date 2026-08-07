const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

function rep(from,to,label){
  if(s.includes(to)){console.log(label+' already applied.');return;}
  if(!s.includes(from)){console.warn(label+' target not found.');return;}
  s=s.replace(from,to);console.log(label+' applied.');
}

// 1) History stays archived indefinitely, but the UI reveals only 10 at a time.
rep(
  '  const [masterArchivedHistory,setMasterArchivedHistory]=useState([]);',
  '  const [masterArchivedHistory,setMasterArchivedHistory]=useState([]);\n  const [masterHistoryVisibleCount,setMasterHistoryVisibleCount]=useState(10);',
  'Add history reveal count'
);
rep(
  '  const masterActivityItems=masterActivityView==="recent"?(masterRecentSource.items||[]):masterHistoryItems;',
  '  const masterActivityItems=masterActivityView==="recent"?(masterRecentSource.items||[]):masterHistoryItems.slice(0,masterHistoryVisibleCount);\n  const masterHistoryHasMore=masterActivityView==="history"&&masterHistoryItems.length>masterHistoryVisibleCount;',
  'Limit visible history records'
);
rep(
  '    setMasterActivityView("recent");\n    setMasterLegendResult(null);',
  '    setMasterActivityView("recent");\n    setMasterHistoryVisibleCount(10);\n    setMasterLegendResult(null);',
  'Reset history count on master change'
);

// 2) Currency belongs on the number itself, not in the label.
rep(
  'const kr=item.market==="kr"||/\\.(KS|KQ)$/.test(item.ticker);const price=v=>kr?formatKRW(v):formatUSD(v);const unit=kr?"원":"달러";return <div',
  'const kr=item.market==="kr"||/\\.(KS|KQ)$/.test(item.ticker);const price=v=>kr?`${Math.round(v).toLocaleString("ko-KR")}원`:formatUSD(v);const prevItem=idx>0?masterActivityItems[idx-1]:null;const sourceChanged=!prevItem||prevItem.sourceUrl!==item.sourceUrl;const helpType=action.term||(/13F|보유자료|보유 공개/.test((item.sourceLabel||"")+" "+(item.basis||""))?"holding":"");const prevAction=prevItem?easyMasterAction(prevItem):null;const prevHelpType=prevItem?(prevAction.term||(/13F|보유자료|보유 공개/.test((prevItem.sourceLabel||"")+" "+(prevItem.basis||""))?"holding":"")):"";const showSharedMeta=idx===0||sourceChanged||helpType!==prevHelpType;return <div',
  'Put currency on price numbers and derive shared metadata'
);

const oldPrice='<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",minWidth:0}}><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>{/13F|보유/.test((item.sourceLabel||"")+" "+(item.basis||""))?"공개 기준 주가":"그때 주가"} · {unit}</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.buyPrice)}</strong></div><span style={{color:T.textMuted}}>→</span><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>지금 주가 · {unit}</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.currentPrice)}</strong></div></div><strong style={{fontSize:"15px",color:perf.returnPct>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{perf.returnPct>=0?"+":""}{perf.returnPct.toFixed(1)}%</strong></div>';
const newPrice='<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",minWidth:0}}><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>{/13F|보유/.test((item.sourceLabel||"")+" "+(item.basis||""))?"공개 기준 주가":"그때 주가"}</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.buyPrice)}</strong></div><span style={{color:T.textMuted}}>→</span><div><div style={{fontSize:"9px",color:T.textMuted,marginBottom:"2px"}}>지금 주가</div><strong style={{fontSize:"12px",color:T.text}}>{price(perf.currentPrice)}</strong></div></div><strong style={{fontSize:"15px",color:perf.returnPct>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{perf.returnPct>=0?"+":""}{perf.returnPct.toFixed(1)}%</strong></div>';
rep(oldPrice,newPrice,'Remove textual currency units');
rep('<div style={{fontSize:"10px",color:T.textMuted,marginTop:"5px"}}>그날 이후 주가 변화 기준</div>','','Remove redundant performance caption');

// 3) Generic explanation/source are shown once per source/type batch, left aligned and compact.
rep(
  '{(action.term||/13F|보유자료|보유 공개/.test((item.sourceLabel||"")+" "+(item.basis||"")))&&<div style={{marginTop:"9px",padding:"9px 10px",background:T.inputBg,borderRadius:"10px",fontSize:"10px",lineHeight:1.6,color:T.textMuted}}>{action.term&&<strong style={{color:T.text,marginRight:"4px"}}>{action.term}이 뭐예요?</strong>}{masterActivityHelp(item)}</div>}',
  '{showSharedMeta&&(action.term||/13F|보유자료|보유 공개/.test((item.sourceLabel||"")+" "+(item.basis||"")))&&<div style={{marginTop:"9px",padding:"9px 10px",background:T.inputBg,borderRadius:"10px",fontSize:"10px",lineHeight:1.6,color:T.textMuted}}>{action.term&&<strong style={{color:T.text,marginRight:"4px"}}>{action.term}이 뭐예요?</strong>}{masterActivityHelp(item)}</div>}',
  'Deduplicate repeated help copy'
);
rep(
  '{item.sourceUrl&&<div style={{marginTop:"9px",textAlign:"right"}}><a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{fontSize:"10px",color:T.textMuted,textDecoration:"none"}}>원문 확인 ↗</a></div>}',
  '{showSharedMeta&&item.sourceUrl&&<div style={{marginTop:"8px",display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",color:T.textMuted}}><span>출처 · {item.sourceLabel||"공개자료"}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{color:T.accent,textDecoration:"none",fontWeight:"700"}}>원문 ↗</a></div>}',
  'Show one compact source link per batch'
);

// 4) History uses progressive disclosure instead of becoming an infinitely long screen.
rep(
  '{masterActivityItems.length>0?<div style={{display:"grid",gap:"9px"}}>',
  '{masterActivityItems.length>0?<div><div style={{display:"grid",gap:"9px"}}>',
  'Wrap history list for load-more button'
);
rep(
  '                </div>})}\n              </div>:<div style={{padding:"16px 14px"',
  '                </div>})}\n              </div>{masterActivityView==="history"&&masterHistoryHasMore&&<button type="button" onClick={()=>setMasterHistoryVisibleCount(n=>n+10)} style={{width:"100%",marginTop:"10px",padding:"11px 12px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"11px",color:T.textSub,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>이전 기록 10개 더 보기 ↓</button>}</div>:<div style={{padding:"16px 14px"',
  'Add history load-more button'
);

// 5) SpaceX is a curated ARK legend. Private-era investment is context only; simulation starts at the public IPO.
const home='export default function Home(){';
if(!s.includes('MASTER_EVIDENCE.SPCX={')){
  const extra=`// Curated legend: SpaceX was private when ARK Venture Fund first invested, so public-price simulation begins at IPO.\nif(MASTER_PROFILES?.ark?.cases&&!MASTER_PROFILES.ark.cases.some(x=>x.ticker==="SPCX")){MASTER_PROFILES.ark.cases.push({stock:"SpaceX",ticker:"SPCX",name:"SpaceX",year:2026,timelineLabel:"2023→26",note:"ARK Venture Fund가 2023년 비상장 시절부터 투자했고, 2026년 상장 후에는 공개 주가로도 흐름을 볼 수 있게 된 사례"});}\nMASTER_CASE_EMOJI.SPCX="🚀";\nMASTER_CASE_META.SPCX={sector:"우주·위성",theme:"우주 인프라·위성통신",source:"ARK Venture Fund·SpaceX 공개자료",type:"비상장→상장",summary:"ARK가 비상장 시절부터 보유한 SpaceX가 상장으로 이어진 대표 사례"};\nMASTER_CASE_BEGINNER_COPY.SPCX="ARK Venture Fund는 SpaceX가 비상장이던 2023년부터 투자했어요. 당시에는 일반 투자자가 주식시장에서 SpaceX를 살 수 없었기 때문에, 껄무새 계산은 누구나 살 수 있게 된 2026년 상장일부터 비교해요.";\nMASTER_EVIDENCE.SPCX={quality:"ARK·SpaceX 공식 자료",eventDate:"2026-06-12",disclosureDate:"2026-06 상장",scale:"IPO 공모가 주당 135달러",status:"ARK Venture Fund 첫 투자 2023-10 · 2026 상장",fact:"ARK Venture Fund는 2023년 10월 SpaceX에 처음 투자했고, SpaceX는 2026년 6월 상장했습니다. 비상장 기간에는 일반 투자자가 공개 주식시장에서 같은 조건으로 매수할 수 없었습니다.",rationale:"ARK는 SpaceX를 발사 인프라, 위성 네트워크, AI와 첨단 제조가 결합되는 대표적인 혁신 기업으로 설명합니다.",note:"2023년 ARK의 비상장 투자 수익을 재현하지 않습니다. 아래 그래프와 ‘나도 그때 샀다면?’ 계산은 공개시장 거래가 시작된 2026년 6월 12일을 기준으로 합니다.",sourceLabel:"ARK Venture Fund · SpaceX",sourceUrl:"https://www.ark-funds.com/portfolio",timeline:[{date:"2023-10",label:"ARK 첫 투자"},{date:"2026-06",label:"SpaceX 상장"},{date:"2026",label:"공개주가 추적"}]};\n\n`;
  if(!s.includes(home))throw new Error('Home anchor missing for SpaceX legend');
  s=s.replace(home,extra+home);
  console.log('SpaceX legend added.');
}

rep('>{item.year}</div><div style={{width:"38px"','>{item.timelineLabel||item.year}</div><div style={{width:"38px"','Use legend timeline labels');
rep('{selectedMasterCase.year}년 대표 사례 · {selectedMasterCase.ticker}','{selectedMasterCase.timelineLabel||selectedMasterCase.year+"년"} 대표 사례 · {selectedMasterCase.ticker}','Use legend detail timeline label');

fs.writeFileSync(p,s);
console.log('Master storyline v5 patch applied.');
