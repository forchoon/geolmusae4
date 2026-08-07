const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

if(!s.includes('const [masterQuickItem,setMasterQuickItem]')){
  const anchor='  const [directExactDate,setDirectExactDate]=useState("");';
  if(!s.includes(anchor))throw new Error('master live state anchor not found');
  s=s.replace(anchor,anchor+'\n  const [masterRecentLive,setMasterRecentLive]=useState(MASTER_RECENT_ACTIVITY);\n  const [masterQuickItem,setMasterQuickItem]=useState(null);\n  const [masterQuickAmount,setMasterQuickAmount]=useState(100);\n  const [masterQuickResult,setMasterQuickResult]=useState(null);\n  const [masterQuickLoading,setMasterQuickLoading]=useState(false);');
}

s=s.replace(/const recentActivity=MASTER_RECENT_ACTIVITY\[selectedMaster\]\|\|MASTER_RECENT_ACTIVITY\.buffett;/,
`const recentActivity=masterRecentLive[selectedMaster]||MASTER_RECENT_ACTIVITY[selectedMaster]||MASTER_RECENT_ACTIVITY.buffett;
  useEffect(()=>{
    let cancelled=false;
    fetch('/api/master-recent').then(r=>r.ok?r.json():Promise.reject(new Error('recent api'))).then(data=>{
      if(cancelled||!data)return;
      setMasterRecentLive(prev=>({...prev,...data}));
    }).catch(()=>{});
    return()=>{cancelled=true;};
  },[]);`);

const handlerRe=/const handleRecentActivityClick=\(?item\)?=>\{[\s\S]*?\n\s*\};\n(?=\s*const )/;
if(handlerRe.test(s)){
  s=s.replace(handlerRe,`const handleRecentActivityClick=item=>{
    setMasterQuickItem(item);
    setMasterQuickResult(null);
    setTimeout(()=>document.getElementById('master-amount-step')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  };
  const formatMasterMoney=n=>{
    const v=Math.round(Number(n)||0);
    const sign=v<0?'-':'';const a=Math.abs(v);
    if(a>=100000000)return sign+(a/100000000).toFixed(a>=1000000000?1:2).replace(/\\.0+$/,'')+'억원';
    if(a>=10000)return sign+Math.round(a/10000).toLocaleString('ko-KR')+'만원';
    return sign+a.toLocaleString('ko-KR')+'원';
  };
  const handleMasterQuickCalculate=async()=>{
    if(!masterQuickItem||masterQuickLoading)return;
    setMasterQuickLoading(true);setMasterQuickResult(null);
    try{
      const yt=getYahooTicker(masterQuickItem.ticker);
      const date=masterQuickItem.eventDate||getSameDayOfYear(masterQuickItem.year||2020);
      const[bp,cp]=await Promise.all([fetchYahooPrice(yt,date),fetchCurrentPrice(yt)]);
      if(!bp||!cp)throw new Error('price');
      const principal=(Number(masterQuickAmount)||0)*10000;
      const currentValue=principal*(cp/bp);
      const profit=currentValue-principal;
      const returnPct=((cp/bp)-1)*100;
      setMasterQuickResult({buyPrice:bp,currentPrice:cp,principal,currentValue,profit,returnPct,date});
    }catch(e){setMasterQuickResult({error:true});}
    finally{setMasterQuickLoading(false);}
  };
  const `);
}

s=s.replace(/const visibleMasterCases=showAllMasterCases\?selectedMaster\.cases:selectedMaster\.cases\.slice\(0,4\);/g,'const visibleMasterCases=selectedMaster.cases;');
s=s.replace(/<div style=\{\{display:"flex",justifyContent:"center",padding:"4px 0 8px"\}\}>\s*<button[^>]*onClick=\{\(\)=>setShowAllMasterCases\(!showAllMasterCases\)\}[^>]*>[\s\S]*?<\/button>\s*<\/div>/g,'');

const replacements=[
  ['약 $2.65B','약 3조 6,600억원'],['분기말 약 $16.6B 규모','약 22조 9,000억원 규모'],['약 $55M','약 759억원'],
  ['$1M~$5M','약 13억 8,000만~69억원'],['$500K~$1M','약 6억 9,000만~13억 8,000만원'],['$250K~$500K','약 3억 4,500만~6억 9,000만원'],
  ['$100K~$250K','약 1억 3,800만~3억 4,500만원'],['$50K~$100K','약 6,900만~1억 3,800만원'],['$15K~$50K','약 2,070만~6,900만원'],
  ['$1,000,001~$5,000,000','약 13억 8,000만~69억원'],['$500,001~$1,000,000','약 6억 9,000만~13억 8,000만원'],['$250,001~$500,000','약 3억 4,500만~6억 9,000만원'],['$100,001~$250,000','약 1억 3,800만~3억 4,500만원']
];
for(const [a,b] of replacements)s=s.split(a).join(b);

if(!s.includes('id="master-amount-step"')){
  const detailsStart=s.indexOf('<details style={{marginBottom:20');
  if(detailsStart<0)throw new Error('master legacy details not found');
  const detailsEnd=s.indexOf('</details>',detailsStart);
  if(detailsEnd<0)throw new Error('master legacy details end not found');
  const insertAt=detailsEnd+'</details>'.length;
  const block=`
            <div id="master-amount-step" style={{marginBottom:30,paddingTop:10}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <span style={{fontSize:12,fontWeight:500,color:T.textMuted,letterSpacing:1,flexShrink:0}}>03</span>
                <span style={{fontSize:17,fontWeight:650,color:T.text,letterSpacing:"-0.3px"}}>얼마 넣어볼까?</span>
                <div style={{flex:1,height:1,background:T.border}}/>
              </div>
              {masterQuickItem?(
                <>
                  <div style={{padding:"12px 13px",background:T.card,border:"1px solid "+T.border,borderRadius:12,marginBottom:12}}>
                    <div style={{fontSize:12,color:T.textMuted,marginBottom:4}}>선택한 내역</div>
                    <div style={{fontSize:15,fontWeight:750,color:T.text}}>{masterQuickItem.emoji||'📈'} {masterQuickItem.name} <span style={{fontSize:11,color:T.textMuted}}>{masterQuickItem.ticker}</span></div>
                    <div style={{fontSize:11,color:T.accent,marginTop:5}}>{masterQuickItem.basis||masterQuickItem.period||masterQuickItem.eventDate}</div>
                  </div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
                    {[10,100,500,1000,3000,5000].map(v=><button key={v} type="button" onClick={()=>{setMasterQuickAmount(v);setMasterQuickResult(null);}} style={{padding:"8px 11px",border:"1px solid "+(masterQuickAmount===v?T.accent:T.border),borderRadius:8,background:masterQuickAmount===v?T.accentSoft:T.card,color:masterQuickAmount===v?T.accent:T.textMuted,fontSize:12,fontWeight:650,cursor:"pointer"}}>{v>=1000?(v/1000)+'천만원':v+'만원'}</button>)}
                  </div>
                  <div style={{position:"relative",marginBottom:12}}>
                    <input type="number" min="1" value={masterQuickAmount} onChange={e=>{setMasterQuickAmount(e.target.value);setMasterQuickResult(null);}} style={{width:"100%",background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:"13px 60px 13px 16px",color:T.text,fontSize:16,outline:"none",textAlign:"right"}}/>
                    <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:T.textSub,fontSize:13}}>만원</span>
                  </div>
                  <button type="button" onClick={handleMasterQuickCalculate} disabled={masterQuickLoading||!masterQuickAmount} style={{width:"100%",padding:16,border:"none",borderRadius:13,background:T.accent,color:"#07110a",fontSize:15,fontWeight:800,cursor:masterQuickLoading?"wait":"pointer"}}>{masterQuickLoading?'계산 중…':'그날 나도 샀다면? 🦜'}</button>
                  {masterQuickResult&&<div style={{marginTop:12,padding:15,background:T.card,border:"1px solid "+(masterQuickResult.error?'#ef444466':T.accent+'66'),borderRadius:14}}>
                    {masterQuickResult.error?<div style={{fontSize:12,color:T.textSub,textAlign:"center"}}>이 날짜의 시세를 불러오지 못했어요. 다른 사례를 골라보세요.</div>:<>
                      <div style={{fontSize:11,color:T.textMuted,marginBottom:5}}>{masterQuickResult.date}에 {formatMasterMoney(masterQuickResult.principal)}을 넣었다면</div>
                      <div style={{fontSize:25,fontWeight:850,color:masterQuickResult.profit>=0?T.accent:'#fb7185',letterSpacing:"-0.8px"}}>지금 약 {formatMasterMoney(masterQuickResult.currentValue)}</div>
                      <div style={{fontSize:12,color:T.textSub,marginTop:6}}>수익 {masterQuickResult.profit>=0?'+':''}{formatMasterMoney(masterQuickResult.profit)} · 수익률 {masterQuickResult.returnPct>=0?'+':''}{masterQuickResult.returnPct.toFixed(1)}%</div>
                      {masterQuickItem.basis&&<div style={{fontSize:10,lineHeight:1.55,color:T.textMuted,marginTop:9}}>※ {masterQuickItem.basis}. 옵션 사례는 옵션 자체 수익이 아니라 같은 날 해당 주식을 샀다고 가정해 계산해요.</div>}
                    </>}
                  </div>}
                </>
              ):<div style={{padding:"15px 13px",background:T.card,border:"1px dashed "+T.border,borderRadius:12,fontSize:12,lineHeight:1.65,color:T.textMuted,textAlign:"center"}}>위 최근 공개 내역이나 레전드 투자에서 종목을 하나 골라주세요.<br/>고른 뒤 여기서 투자금액을 바로 계산할 수 있어요.</div>}
            </div>`;
  s=s.slice(0,insertAt)+block+s.slice(insertAt);
}

// Turn the legacy investment section into an always-open block. No '펼쳐보기 +' affordance.
const dStart=s.indexOf('<details style={{marginBottom:20');
if(dStart>=0){
  s=s.slice(0,dStart)+s.slice(dStart).replace('<details ','<div ').replace('</details>','</div>');
  const sumStart=s.indexOf('<summary ',dStart);
  const sumEnd=sumStart>=0?s.indexOf('</summary>',sumStart):-1;
  if(sumStart>=0&&sumEnd>=0){
    const segment=s.slice(sumStart,sumEnd+10).replace('<summary ','<div ').replace('</summary>','</div>').replace(/<span style=\{\{fontSize:12,color:T\.accent,fontWeight:700\}\}>[^<]*<\/span>/,'');
    s=s.slice(0,sumStart)+segment+s.slice(sumEnd+10);
  }
}
s=s.split('펼쳐보기 +').join('');

// Legacy CTA should feed the same 03 amount step when the exact replacement is available.
s=s.replace(/onClick=\{handleMasterCalculate\}([^>]*)>그때 나도 샀다면\? →<\/button>/g,`onClick={()=>handleRecentActivityClick({emoji:selectedMasterCaseEmoji,name:selectedMasterCase.company,ticker:selectedMasterCase.ticker,eventDate:selectedMasterEvidence?.eventDate||'',year:selectedMasterCase.year,period:selectedMasterCase.year+'년 대표 사례',basis:selectedMasterEvidence?.eventDate?'공개자료의 기준일 또는 거래일 기준':'대표 기준연도 기준'})}$1>그때 나도 샀다면? →</button>`);

fs.writeFileSync(p,s);
console.log('Master live flow v2 patch applied.');
