const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

function rep(from,to,label){
  if(s.includes(to)){console.log(label+' already applied.');return;}
  if(!s.includes(from)){console.warn(label+' target not found.');return;}
  s=s.replace(from,to);console.log(label+' applied.');
}

// Remove per-card source rows introduced by v5.
rep(
  '{showSharedMeta&&item.sourceUrl&&<div style={{marginTop:"8px",display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",color:T.textMuted}}><span>출처 · {item.sourceLabel||"공개자료"}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{color:T.accent,textDecoration:"none",fontWeight:"700"}}>원문 ↗</a></div>}',
  '',
  'Remove per-card source links'
);

// Add one primary source for the visible recent/history view.
rep(
  '  const masterHistoryHasMore=masterActivityView==="history"&&masterHistoryItems.length>masterHistoryVisibleCount;',
  '  const masterHistoryHasMore=masterActivityView==="history"&&masterHistoryItems.length>masterHistoryVisibleCount;\n  const masterActivityPrimarySource=masterActivityItems.find(x=>x?.sourceUrl)||null;',
  'Derive one primary source'
);

rep(
  '{masterActivityView==="history"&&masterHistoryHasMore&&<button type="button" onClick={()=>setMasterHistoryVisibleCount(n=>n+10)} style={{width:"100%",marginTop:"10px",padding:"11px 12px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"11px",color:T.textSub,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>이전 기록 10개 더 보기 ↓</button>}</div>:<div',
  '{masterActivityView==="history"&&masterHistoryHasMore&&<button type="button" onClick={()=>setMasterHistoryVisibleCount(n=>n+10)} style={{width:"100%",marginTop:"10px",padding:"11px 12px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"11px",color:T.textSub,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>이전 기록 10개 더 보기 ↓</button>}{masterActivityPrimarySource&&<div style={{marginTop:"10px",display:"flex",alignItems:"center",gap:"6px",fontSize:"10px",color:T.textMuted}}><span>주요 출처 · {masterActivityPrimarySource.sourceLabel||"공개자료"}</span><a href={masterActivityPrimarySource.sourceUrl} target="_blank" rel="noreferrer" style={{color:T.accent,textDecoration:"none",fontWeight:"700"}}>원문 ↗</a></div>}</div>:<div',
  'Add one section-level primary source'
);

fs.writeFileSync(p,s);
console.log('Master storyline v6 patch applied.');
