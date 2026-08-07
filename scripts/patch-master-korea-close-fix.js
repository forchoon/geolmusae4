const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');
const bad='    {stock:"Shinsegae",ticker:"004170.KS",name:"신세계",year:2002,note:"시장 유행보다 내재가치에 집중했던 가치주 사례"}]}}\n};';
const good='    {stock:"Shinsegae",ticker:"004170.KS",name:"신세계",year:2002,note:"시장 유행보다 내재가치에 집중했던 가치주 사례"}]}\n};';
if(s.includes(bad)){
  s=s.replace(bad,good);
  console.log('Korean master object closing brace fixed.');
}else if(s.includes(good)){
  console.log('Korean master object closing brace already fixed.');
}else{
  throw new Error('Korean master closing brace target not found');
}
fs.writeFileSync(p,s);
