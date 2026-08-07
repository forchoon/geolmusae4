const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');
const tail='note:"시장 유행보다 내재가치에 집중했던 가치주 사례"}]}}\n};';
const fixed='note:"시장 유행보다 내재가치에 집중했던 가치주 사례"}]}\n};';
if(s.includes(tail)){
  s=s.replace(tail,fixed);
  console.log('Korean master object closing brace fixed.');
}else if(s.includes(fixed)){
  console.log('Korean master object closing brace already fixed.');
}else{
  throw new Error('Korean master closing brace target not found');
}
fs.writeFileSync(p,s);
