const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

// Ensure the live state exists.
if(!s.includes('const [masterRecentLive,setMasterRecentLive]')){
  const a='  const [directExactDate,setDirectExactDate]=useState("");';
  if(!s.includes(a))throw new Error('master live state anchor missing');
  s=s.replace(a,a+'\n  const [masterRecentLive,setMasterRecentLive]=useState(MASTER_RECENT_ACTIVITY);');
}

// The recent UI is an IIFE, not a derived variable. Read live data first.
const staticRecent='const recent=MASTER_RECENT_ACTIVITY[selectedMasterId]||{title:"최근 공개 내역",subtitle:"",freshness:"",note:"",items:[]}';
const liveRecent='const recent=masterRecentLive[selectedMasterId]||MASTER_RECENT_ACTIVITY[selectedMasterId]||{title:"최근 공개 내역",subtitle:"",freshness:"",note:"",items:[]}';
if(s.includes(staticRecent)){
  s=s.replace(staticRecent,liveRecent);
  console.log('Recent IIFE now reads live state.');
}else if(!s.includes(liveRecent)){
  throw new Error('Recent IIFE anchor missing');
}

// Load official-source adapters once. Only non-empty results replace current cards.
if(!s.includes("fetch('/api/master-auto')")){
  const hookAnchor='  const [masterQuickLoading,setMasterQuickLoading]=useState(false);';
  const fallbackAnchor='  const [masterRecentLive,setMasterRecentLive]=useState(MASTER_RECENT_ACTIVITY);';
  const a=s.includes(hookAnchor)?hookAnchor:fallbackAnchor;
  if(!s.includes(a))throw new Error('master API hook anchor missing');
  const effect=`
  useEffect(()=>{
    let cancelled=false;
    const loadMasterRecent=async()=>{
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
    loadMasterRecent().catch(()=>{});
    return()=>{cancelled=true;};
  },[]);`;
  s=s.replace(a,a+effect);
  console.log('Official master source loader injected.');
}

// Recent activity CTA stays in the master tab and moves to step 03.
const recentClick=/onClick=\{\(\)=>\{setHomeMode\("direct"\);setActiveTab\(item\.market\|\|"us"\);[\s\S]*?\}\}(?= style=\{\{padding:"10px 11px")/g;
if(recentClick.test(s)){
  s=s.replace(recentClick,'onClick={()=>{setMasterQuickItem({...item,basis:item.basis||item.period||item.eventDate});setMasterQuickResult(null);setTimeout(()=>document.getElementById("master-amount-step")?.scrollIntoView({behavior:"smooth",block:"start"}),80);}}');
  console.log('Recent card CTAs kept inside master tab.');
}

// Legacy investment CTA also uses the same step 03 calculator.
const legacyClick=/onClick=\{\(\)=>\{const exact=\/\^\\\\d\{4\}-\\\\d\{2\}-\\\\d\{2\}\$\/[\s\S]*?\}\}(?= style=\{\{padding:"10px 11px")/g;
if(legacyClick.test(s)){
  s=s.replace(legacyClick,'onClick={()=>{const exact=/^\\d{4}-\\d{2}-\\d{2}$/.test(selectedMasterEvidence.eventDate||"")?selectedMasterEvidence.eventDate:"";setMasterQuickItem({emoji:MASTER_CASE_EMOJI[selectedMasterCase.ticker]||"📈",name:selectedMasterCase.name,ticker:selectedMasterCase.ticker,eventDate:exact,year:selectedMasterCase.year,period:selectedMasterCase.year+"년 대표 사례",basis:exact?"공개자료의 거래일 또는 기준일":"대표 기준연도"});setMasterQuickResult(null);setTimeout(()=>document.getElementById("master-amount-step")?.scrollIntoView({behavior:"smooth",block:"start"}),80);}}');
  console.log('Legacy CTAs kept inside master tab.');
}

fs.writeFileSync(p,s);
console.log('Master auto adapters v3 applied.');
