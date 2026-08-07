const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

// The earlier UI patch could inject JSX that referenced these helpers without
// successfully injecting the helper declarations. Add them reliably here.
if(!s.includes('const formatMasterMoney=n=>')){
  const anchor='  const [masterQuickLoading,setMasterQuickLoading]=useState(false);';
  if(!s.includes(anchor))throw new Error('master quick loading state anchor not found');
  const helpers=`
  const formatMasterMoney=n=>{
    const v=Math.round(Number(n)||0);
    const sign=v<0?'-':'';
    const a=Math.abs(v);
    if(a>=100000000){
      const eok=Math.floor(a/100000000);
      const man=Math.round(((a%100000000)/10000)/100)*100;
      return sign+(man?eok+'억 '+man.toLocaleString('ko-KR')+'만원':eok+'억원');
    }
    if(a>=10000)return sign+Math.round(a/10000).toLocaleString('ko-KR')+'만원';
    return sign+a.toLocaleString('ko-KR')+'원';
  };
  const handleMasterQuickCalculate=async()=>{
    if(!masterQuickItem||masterQuickLoading)return;
    const amount=Number(masterQuickAmount);
    if(!Number.isFinite(amount)||amount<=0){
      setMasterQuickResult({error:true,message:'투자금액을 확인해주세요.'});
      return;
    }
    setMasterQuickLoading(true);
    setMasterQuickResult(null);
    try{
      const yt=getYahooTicker(masterQuickItem.ticker);
      const exact=/^\\d{4}-\\d{2}-\\d{2}$/.test(masterQuickItem.eventDate||'')?masterQuickItem.eventDate:'';
      const date=exact||getSameDayOfYear(Number(masterQuickItem.year)||2020);
      const [bp,cp]=await Promise.all([fetchYahooPrice(yt,date),fetchCurrentPrice(yt)]);
      if(!(bp>0)||!(cp>0))throw new Error('price unavailable');
      const principal=amount*10000;
      const ratio=cp/bp;
      const currentValue=principal*ratio;
      const profit=currentValue-principal;
      const returnPct=(ratio-1)*100;
      setMasterQuickResult({buyPrice:bp,currentPrice:cp,principal,currentValue,profit,returnPct,date});
    }catch(e){
      console.error('Master quick calculation error:',e);
      setMasterQuickResult({error:true,message:'이 날짜의 시세를 불러오지 못했어요. 다른 사례를 골라보세요.'});
    }finally{
      setMasterQuickLoading(false);
    }
  };`;
  s=s.replace(anchor,anchor+helpers);
  console.log('Master quick calculator helpers injected.');
}else{
  console.log('Master quick calculator helpers already exist.');
}

// Show the detailed error message if available.
s=s.replace(
  '>이 날짜의 시세를 불러오지 못했어요. 다른 사례를 골라보세요.</div>',
  '>{masterQuickResult.message||"이 날짜의 시세를 불러오지 못했어요. 다른 사례를 골라보세요."}</div>'
);

// User asked to remove the expand affordance entirely. Cases are already all visible.
s=s.replace(/\{selectedMaster\.cases\.length>4&&<div style=\{\{display:"flex",justifyContent:"center",padding:"4px 0 8px"\}\}>[\s\S]*?<\/div>\}/g,'');
s=s.replace(/\{tA\.cases\.length>4&&[\s\S]*?\}\),?/g,'');
s=s.split('전체 사례 보기 +4').join('');
s=s.split('전체 사례 보기 +').join('');

fs.writeFileSync(p,s);
console.log('Master quick runtime fix applied.');
