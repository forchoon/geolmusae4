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
  '  const [masterApplied,setMasterApplied]=useState("");\n  const [homeMode,setHomeMode]=useState("direct");',
  'Home mode state patch'
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

replaceOnce(
  '              setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);\n              setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
  '              setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);\n              setHomeMode("direct");\n              setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
  'Switch to calculator after master apply'
);

fs.writeFileSync(indexPath, source);
