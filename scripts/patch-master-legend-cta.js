const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

const marker='onClick={()=>{const exact=/^\\d{4}-\\d{2}-\\d{2}$/.test(selectedMasterEvidence.eventDate||"")';
const start=s.indexOf(marker);
if(start>=0){
  const style=s.indexOf(' style={{padding:"10px 11px"',start);
  if(style>start){
    const click='onClick={()=>{const exact=/^\\d{4}-\\d{2}-\\d{2}$/.test(selectedMasterEvidence.eventDate||"")?selectedMasterEvidence.eventDate:"";setMasterQuickItem({emoji:MASTER_CASE_EMOJI[selectedMasterCase.ticker]||"📈",name:selectedMasterCase.name,ticker:selectedMasterCase.ticker,eventDate:exact,year:selectedMasterCase.year,period:selectedMasterCase.year+"년 대표 사례",basis:exact?"공개자료의 거래일 또는 기준일":"대표 기준연도"});setMasterQuickResult(null);setTimeout(()=>document.getElementById("master-amount-step")?.scrollIntoView({behavior:"smooth",block:"start"}),80);}}';
    s=s.slice(0,start)+click+s.slice(style);
    console.log('Legend investment CTA kept inside master tab.');
  }else console.warn('Legend CTA style boundary not found.');
}else if(s.includes('setMasterQuickItem({emoji:MASTER_CASE_EMOJI[selectedMasterCase.ticker]')){
  console.log('Legend investment CTA already in master tab.');
}else{
  console.warn('Legend investment CTA marker not found.');
}

fs.writeFileSync(p,s);
