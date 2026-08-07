const fs=require('fs');
const path=require('path');
const root=process.cwd();
const p=path.join(root,'pages','index.js');
let s=fs.readFileSync(p,'utf8');
const read=name=>fs.readFileSync(path.join(root,'scripts',name),'utf8').trimEnd();

const globals=read('master-storyline-globals.txt');
const component=read('master-storyline-component.txt');
const hooks=read('master-storyline-hooks.txt');
const ui=read('master-storyline-ui.txt');

if(!s.includes('const MASTER_ACTIVITY_HISTORY = {')){
  const a='export default function Home(){';
  if(!s.includes(a))throw new Error('Home anchor missing for master storyline globals');
  s=s.replace(a,globals+'\n\n'+a);
  console.log('Master storyline globals injected.');
}else console.log('Master storyline globals already present.');

if(!s.includes('function MasterLegendChart(')){
  const a='function CoupangBanner(';
  if(!s.includes(a))throw new Error('Coupang component anchor missing for legend chart');
  s=s.replace(a,component+'\n\n'+a);
  console.log('Master legend chart component injected.');
}else console.log('Master legend chart component already present.');

if(!s.includes('const [masterActivityView,setMasterActivityView]')){
  const home=s.indexOf('export default function Home(){');
  const ret=s.indexOf('\n  return(\n    <>',home);
  if(home<0||ret<0)throw new Error('Home return anchor missing for master storyline hooks');
  s=s.slice(0,ret)+'\n'+hooks+'\n'+s.slice(ret);
  console.log('Master storyline hooks injected.');
}else console.log('Master storyline hooks already present.');

const masterStart='        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart='        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const a=s.indexOf(masterStart);
const b=s.indexOf(calculatorStart,a);
if(a<0||b<0)throw new Error('Master storyline section anchors missing');
s=s.slice(0,a)+ui+'\n\n'+s.slice(b);
console.log('Master storyline UI replaced.');

fs.writeFileSync(p,s);
console.log('Master storyline v3 patch applied.');
