const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

if(s.includes("fetch('/api/master-auto')")){
  console.log('Master auto adapters already applied.');
  process.exit(0);
}
const fetchPos=s.indexOf("fetch('/api/master-recent')");
if(fetchPos<0)throw new Error('master recent fetch anchor not found');
const endToken='  },[]);';
const end=s.indexOf(endToken,fetchPos);
if(end<0)throw new Error('master recent useEffect end not found');
const insertAt=end+endToken.length;
const block=`
  useEffect(()=>{
    let cancelled=false;
    fetch('/api/master-auto').then(r=>r.ok?r.json():Promise.reject(new Error('master auto api'))).then(data=>{
      if(cancelled||!data)return;
      setMasterRecentLive(prev=>{
        const next={...prev};
        ['ark','pelosi'].forEach(k=>{if(data[k]&&Array.isArray(data[k].items)&&data[k].items.length)next[k]=data[k];});
        return next;
      });
    }).catch(()=>{});
    return()=>{cancelled=true;};
  },[]);`;
s=s.slice(0,insertAt)+block+s.slice(insertAt);
fs.writeFileSync(p,s);
console.log('Master auto adapters applied.');
