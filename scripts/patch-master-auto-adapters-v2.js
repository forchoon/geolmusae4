const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

// Ensure live state exists even if an earlier exact-string patch missed its anchor.
if(!s.includes('const [masterRecentLive,setMasterRecentLive]')){
  const candidates=[
    '  const [directExactDate,setDirectExactDate]=useState("");',
    '  const [showIosInstallSheet,setShowIosInstallSheet]=useState(false);'
  ];
  const a=candidates.find(x=>s.includes(x));
  if(!a)throw new Error('live state insertion anchor not found');
  s=s.replace(a,a+'\n  const [masterRecentLive,setMasterRecentLive]=useState(MASTER_RECENT_ACTIVITY);');
}

// Make the visible recent cards read from live data first.
const recentRe=/const\s+recentActivity\s*=\s*MASTER_RECENT_ACTIVITY\s*\[\s*selectedMaster\s*\]\s*\|\|\s*MASTER_RECENT_ACTIVITY\.buffett\s*;/;
if(recentRe.test(s)){
  s=s.replace(recentRe,'const recentActivity=masterRecentLive[selectedMaster]||MASTER_RECENT_ACTIVITY[selectedMaster]||MASTER_RECENT_ACTIVITY.buffett;');
  console.log('Recent activity switched to live state.');
}else if(!s.includes('const recentActivity=masterRecentLive[selectedMaster]')){
  throw new Error('recentActivity declaration not found');
}

if(!s.includes("fetch('/api/master-auto')")){
  const line='const recentActivity=masterRecentLive[selectedMaster]||MASTER_RECENT_ACTIVITY[selectedMaster]||MASTER_RECENT_ACTIVITY.buffett;';
  const pos=s.indexOf(line);
  if(pos<0)throw new Error('live recentActivity anchor not found');
  const insertAt=pos+line.length;
  const effect=`
  useEffect(()=>{
    let cancelled=false;
    const load=async()=>{
      const next={};
      const settled=await Promise.allSettled([
        fetch('/api/master-recent').then(r=>r.ok?r.json():Promise.reject(new Error('master recent api'))),
        fetch('/api/master-auto').then(r=>r.ok?r.json():Promise.reject(new Error('master auto api')))
      ]);
      if(cancelled)return;
      if(settled[0].status==='fulfilled'){
        const d=settled[0].value||{};
        ['buffett','ark','pelosi'].forEach(k=>{if(d[k]&&Array.isArray(d[k].items)&&d[k].items.length)next[k]=d[k];});
      }
      if(settled[1].status==='fulfilled'){
        const d=settled[1].value||{};
        ['ark','pelosi'].forEach(k=>{if(d[k]&&Array.isArray(d[k].items)&&d[k].items.length)next[k]=d[k];});
      }
      if(Object.keys(next).length)setMasterRecentLive(prev=>({...prev,...next}));
    };
    load().catch(()=>{});
    return()=>{cancelled=true;};
  },[]);`;
  s=s.slice(0,insertAt)+effect+s.slice(insertAt);
  console.log('Master live API effect injected.');
}else{
  console.log('Master live API effect already exists.');
}

fs.writeFileSync(p,s);
console.log('Master auto adapters v2 applied.');
