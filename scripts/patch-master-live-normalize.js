const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');
const phrase=s.indexOf('의 레전드 투자');
if(phrase>=0){
  const start=s.lastIndexOf('<details',phrase);
  const end=start>=0?s.indexOf('>',start):-1;
  if(start>=0&&end>=0){
    s=s.slice(0,start)+'<details style={{marginBottom:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>'+s.slice(end+1);
    console.log('Master legacy details marker normalized.');
  }else console.warn('Master legacy details tag not found.');
}else console.warn('Master legacy phrase not found.');
fs.writeFileSync(p,s);
