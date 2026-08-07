const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

const oldMerge='setMasterRecentLive(prev=>({...prev,...data}));';
const safeMerge=`setMasterRecentLive(prev=>{const next={...prev};['buffett','ark','pelosi'].forEach(k=>{if(data[k]&&Array.isArray(data[k].items)&&data[k].items.length)next[k]=data[k];});return next;});`;
if(s.includes(oldMerge)){
  s=s.replace(oldMerge,safeMerge);
  console.log('Master recent live merge safety applied.');
}else if(s.includes(safeMerge)){
  console.log('Master recent live merge safety already applied.');
}else{
  console.warn('Master recent live merge target not found.');
}

// Remove the obsolete show-all control now that every legacy case is rendered.
const phrase='전체 사례 보기 +4';
let idx=s.indexOf(phrase);
if(idx>=0){
  const buttonStart=s.lastIndexOf('<button',idx);
  const buttonEnd=s.indexOf('</button>',idx);
  if(buttonStart>=0&&buttonEnd>=0){
    let start=buttonStart,end=buttonEnd+'</button>'.length;
    const divStart=s.lastIndexOf('<div',buttonStart);
    const divEnd=s.indexOf('</div>',end);
    if(divStart>=0&&divEnd>=0&&buttonStart-divStart<220){start=divStart;end=divEnd+'</div>'.length;}
    s=s.slice(0,start)+s.slice(end);
    console.log('Obsolete master show-all control removed.');
  }
}
s=s.split('펼쳐보기 +').join('');

fs.writeFileSync(p,s);
