const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

function replaceOnce(from, to, label) {
  if (source.includes(to)) {
    console.log(`${label} already applied.`);
    return;
  }
  if (!source.includes(from)) {
    console.warn(`${label} target not found. Skipping.`);
    return;
  }
  source = source.replace(from, to);
  console.log(`${label} applied.`);
}

replaceOnce(
  'export default function Home(){',
  [
    'const MASTER_CASE_META = {',
    '  AAPL:{sector:"빅테크",theme:"브랜드·생태계",source:"버크셔 공개 보유자료",type:"공개 보유",summary:"하드웨어와 서비스가 결합된 강한 생태계에 주목한 대표 사례"},',
    '  AMZN:{sector:"커머스·클라우드",theme:"사업 확장성",source:"버크셔 공개 보유자료",type:"공개 보유",summary:"소비자 플랫폼과 클라우드가 함께 성장하는 구조를 본 사례"},',
    '  CVX:{sector:"에너지",theme:"현금흐름·주주환원",source:"버크셔 공개 보유자료",type:"공개 보유",summary:"대형 에너지 기업의 현금 창출력과 주주환원에 주목한 사례"},',
    '  KO:{sector:"소비재",theme:"브랜드·유통망",source:"버크셔 공개 보유자료",type:"장기 보유",summary:"세계적인 브랜드와 반복 소비 구조를 상징하는 장기 보유 사례"},',
    '  TSLA:{sector:"전기차·에너지",theme:"파괴적 혁신",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"전기차와 소프트웨어가 결합된 장기 성장 가능성에 집중한 사례"},',
    '  COIN:{sector:"디지털 자산",theme:"금융 인프라 혁신",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"가상자산 생태계가 커질 때 필요한 거래 인프라에 주목한 사례"},',
    '  ROKU:{sector:"스트리밍 플랫폼",theme:"TV 플랫폼 전환",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"방송 시청이 소프트웨어 플랫폼 중심으로 이동한다는 관점의 사례"},',
    '  ZM:{sector:"협업 소프트웨어",theme:"비대면 업무",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"영상 협업 도구가 일상적인 업무 인프라가 될 가능성에 주목한 사례"},',
    '  NVDA:{sector:"AI 반도체",theme:"컴퓨팅 플랫폼",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"AI 연산 수요 확대와 함께 주목도가 커진 기술주 거래 사례"},',
    '  MSFT:{sector:"클라우드·AI",theme:"플랫폼 지배력",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"클라우드와 업무 소프트웨어의 장기 성장성을 함께 보는 사례"},',
    '  GOOGL:{sector:"광고·AI",theme:"데이터·플랫폼",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"검색과 광고를 기반으로 AI 플랫폼까지 확장하는 기업의 사례"},',
    '  PANW:{sector:"사이버보안",theme:"보안 수요 증가",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"클라우드 전환과 함께 커지는 기업 보안 수요에 주목한 사례"}',
    '};',
    '',
    'export default function Home(){'
  ].join('\n'),
  'Master case metadata patch'
);

replaceOnce(
  '  const [masterResultError,setMasterResultError]=useState("");',
  '  const [masterResultError,setMasterResultError]=useState("");\n  const [masterAnimKey,setMasterAnimKey]=useState(0);',
  'Master animation state patch'
);

replaceOnce(
  '  const selectedMasterCase=selectedMaster.cases[selectedMasterCaseIndex]||selectedMaster.cases[0];',
  [
    '  const selectedMasterCase=selectedMaster.cases[selectedMasterCaseIndex]||selectedMaster.cases[0];',
    '  const selectedMasterCaseMeta=MASTER_CASE_META[selectedMasterCase.ticker]||{sector:"미국주식",theme:selectedMaster.eyebrow,source:"공개자료",type:"대표 사례",summary:selectedMasterCase.note};'
  ].join('\n'),
  'Master selected case metadata patch'
);

const masterStart = '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart = '        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const startIndex = source.indexOf(masterStart);
const endIndex = source.indexOf(calculatorStart, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.warn('Unified master experience target not found. Skipping.');
} else {
  const redesignedMaster = [
    '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>',
    '          <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,margin:"4px 0 8px"}}>공개자료에 등장한 대표 사례를 골라, 같은 조건으로 지금의 가치를 확인해보세요.</div>',
    '',
    '          <div style={sec}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>',
    '              <span style={snStyle}>01</span>',
    '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>거장 선택</span>',
    '              <div style={{flex:1,height:"1px",background:T.border}}/>',
    '            </div>',
    '            <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"8px",marginBottom:"12px"}}>',
    '              {Object.entries(MASTER_PROFILES).map(([id,m])=>{',
    '                const active=selectedMasterId===id;',
    '                const shortName=id==="buffett"?"워런 버핏":id==="ark"?"캐시 우드":"펠로시 일가";',
    '                return <button key={id} type="button" onClick={()=>{setSelectedMasterId(id);setSelectedMasterCaseIndex(0);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"96px",padding:"12px 8px",background:active?T.presetActive:T.presetInactive,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"14px",cursor:"pointer",color:active?T.accent:T.textSub,textAlign:"center",transition:"all .2s"}}>',
    '                  <div style={{fontSize:"25px",lineHeight:1,marginBottom:"8px"}}>{m.emoji}</div>',
    '                  <div style={{fontSize:"13px",fontWeight:"600",color:active?T.accent:T.text,letterSpacing:"-0.2px"}}>{shortName}</div>',
    '                  <div style={{fontSize:"11px",fontWeight:"400",color:active?T.accent:T.textMuted,marginTop:"4px",lineHeight:1.35}}>{m.eyebrow}</div>',
    '                </button>;',
    '              })}',
    '            </div>',
    '            <div style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"14px 16px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"14px"}}>',
    '              <div style={{width:"44px",height:"44px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:`1px solid ${T.borderActive}55`,fontSize:"23px",flexShrink:0}}>{selectedMaster.emoji}</div>',
    '              <div style={{minWidth:0,flex:1}}>',
    '                <div style={{display:"flex",alignItems:"center",gap:"7px",flexWrap:"wrap",marginBottom:"5px"}}><strong style={{fontSize:"15px",fontWeight:"600",color:T.text}}>{selectedMaster.name}</strong><span style={{fontSize:"11px",color:T.accent,fontWeight:"500"}}>{selectedMaster.eyebrow}</span></div>',
    '                <div style={{fontSize:"13px",lineHeight:1.6,color:T.textSub}}>{selectedMaster.description}</div>',
    '                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"9px"}}>{selectedMaster.tags.map(tag=><span key={tag} style={{fontSize:"11px",fontWeight:"500",color:T.accent,background:T.presetActive,padding:"5px 8px",borderRadius:"999px"}}>{tag}</span>)}</div>',
    '              </div>',
    '            </div>',
    '          </div>',
    '',
    '          <div style={sec}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>',
    '              <span style={snStyle}>02</span>',
    '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>대표 투자 사례</span>',
    '              <div style={{flex:1,height:"1px",background:T.border}}/>',
    '            </div>',
    '            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"8px",marginBottom:"12px"}}>',
    '              {selectedMaster.cases.map((item,idx)=>{',
    '                const active=selectedMasterCaseIndex===idx;',
    '                const meta=MASTER_CASE_META[item.ticker]||{};',
    '                return <button key={`${item.ticker}-${item.year}`} type="button" onClick={()=>{setSelectedMasterCaseIndex(idx);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{padding:"13px",background:active?T.presetActive:T.bgCard,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"14px",cursor:"pointer",textAlign:"left",transition:"all .2s",minHeight:"108px"}}>',
    '                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",marginBottom:"9px"}}>',
    '                    <div style={{width:"34px",height:"34px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",background:active?T.bgCard:T.presetActive,color:T.accent,fontSize:"12px",fontWeight:"700",border:`1px solid ${active?T.borderActive:T.border}`}}>{item.ticker.slice(0,2)}</div>',
    '                    <span style={{fontSize:"11px",fontWeight:"500",color:active?T.accent:T.textMuted}}>{item.year}년</span>',
    '                  </div>',
    '                  <div style={{fontSize:"14px",fontWeight:"600",color:T.text,marginBottom:"3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>',
    '                  <div style={{fontSize:"12px",color:T.textSub,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{meta.sector||item.stock}</div>',
    '                </button>;',
    '              })}',
    '            </div>',
    '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>',
    '              <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`}}>',
    '                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px"}}>',
    '                  <div><div style={{fontSize:"18px",fontWeight:"600",color:T.text,letterSpacing:"-0.4px"}}>{selectedMasterCase.name}</div><div style={{fontSize:"12px",color:T.textMuted,marginTop:"3px"}}>{selectedMasterCase.stock} · {selectedMasterCase.ticker}</div></div>',
    '                  <span style={{fontSize:"11px",fontWeight:"500",color:T.accent,background:T.presetActive,padding:"6px 9px",borderRadius:"999px",whiteSpace:"nowrap"}}>대표 기준 {selectedMasterCase.year}</span>',
    '                </div>',
    '              </div>',
    '              <div style={{padding:"16px"}}>',
    '                <div style={{display:"grid",gridTemplateColumns:"auto minmax(0,1fr) auto",alignItems:"center",gap:"10px",marginBottom:"16px"}}>',
    '                  <div style={{fontSize:"12px",fontWeight:"500",color:T.textSub,textAlign:"left"}}>{selectedMasterCase.year}<br/><span style={{fontSize:"11px",color:T.textMuted,fontWeight:"400"}}>대표 기준</span></div>',
    '                  <div style={{height:"24px",position:"relative"}}><div style={{position:"absolute",left:0,right:0,top:"11px",height:"2px",background:T.border}}/><div style={{position:"absolute",left:0,top:"6px",width:"12px",height:"12px",borderRadius:"50%",background:T.accent,border:"3px solid "+T.bgCard}}/><div style={{position:"absolute",right:0,top:"6px",width:"12px",height:"12px",borderRadius:"50%",background:T.accent,border:"3px solid "+T.bgCard}}/><div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",padding:"3px 8px",borderRadius:"999px",background:T.presetActive,color:T.accent,fontSize:"11px",fontWeight:"600"}}>{Math.max(1,CURRENT_YEAR-selectedMasterCase.year)}년의 흐름</div></div>',
    '                  <div style={{fontSize:"12px",fontWeight:"500",color:T.textSub,textAlign:"right"}}>오늘<br/><span style={{fontSize:"11px",color:T.textMuted,fontWeight:"400"}}>현재 가치</span></div>',
    '                </div>',
    '                <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"8px",marginBottom:"14px"}}>',
    '                  {[{label:"분야",value:selectedMasterCaseMeta.sector},{label:"투자 관점",value:selectedMasterCaseMeta.theme},{label:"공개자료",value:selectedMasterCaseMeta.type}].map(item=><div key={item.label} style={{padding:"10px 8px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",textAlign:"center"}}><div style={{fontSize:"11px",color:T.textMuted,marginBottom:"4px"}}>{item.label}</div><div style={{fontSize:"12px",fontWeight:"600",color:T.text,lineHeight:1.4,wordBreak:"keep-all"}}>{item.value}</div></div>)}',
    '                </div>',
    '                <div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,marginBottom:"10px"}}>{selectedMasterCaseMeta.summary}</div>',
    '                <div style={{fontSize:"11px",lineHeight:1.5,color:T.textMuted}}>자료 구분: {selectedMasterCaseMeta.source} · 연도는 체험을 위한 대표 기준이며 정확한 매수일이나 단가를 의미하지 않아요.</div>',
    '              </div>',
    '            </div>',
    '          </div>',
    '',
    '          <div style={sec}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>',
    '              <span style={snStyle}>03</span>',
    '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>투자 금액 설정</span>',
    '              <div style={{flex:1,height:"1px",background:T.border}}/>',
    '            </div>',
    '            <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"12px"}}>',
    '              {amountOptions.map(a=>{const n=parseInt(a);const label=n>=10000?`${n/10000}억원`:n>=1000?`${n/1000}천만원`:`${n}만원`;return <button key={a} type="button" onClick={()=>{setInvestAmount(a);setMasterResult(null);}} style={{padding:"8px 12px",background:investAmount===a?T.presetActive:T.presetInactive,border:`1px solid ${investAmount===a?T.borderActive:T.border}`,borderRadius:"8px",cursor:"pointer",color:investAmount===a?T.accent:T.presetInactiveText,fontSize:"13px",fontWeight:"400",transition:"all .15s"}}>{label}</button>;})}',
    '            </div>',
    '            <div style={{position:"relative"}}><input type="number" value={investAmount} onChange={e=>{setInvestAmount(e.target.value);setMasterResult(null);}} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"13px 60px 13px 16px",color:T.text,fontSize:"16px",fontWeight:"400",outline:"none",textAlign:"right"}} placeholder="직접 입력"/><span style={{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",color:T.textSub,fontSize:"13px",fontWeight:"400"}}>만원</span></div>',
    '            <div style={{marginTop:"12px",padding:"14px 16px",background:`${T.accent}08`,borderRadius:"14px",border:`1px solid ${T.accent}25`,fontSize:"14px",color:T.text,lineHeight:1.6}}>🦜 <strong style={{color:T.accent,fontWeight:"700"}}>{selectedMaster.name}</strong>의 {selectedMasterCase.name} 사례를 {Number(investAmount||0).toLocaleString()}만원으로 계산합니다.</div>',
    '          </div>',
    '',
    '          <div style={{marginBottom:"52px",paddingTop:"4px"}}>',
    '            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>',
    '            <button type="button" disabled={masterResultLoading||!investAmount||Number(investAmount)<=0} onClick={async()=>{',
    '              setMasterResultLoading(true);setMasterResult(null);setMasterResultError("");setMasterApplied("");',
    '              try{',
    '                const dateStr=getSameDayOfYear(selectedMasterCase.year);',
    '                const [bp,cp]=await Promise.all([fetchYahooPrice(selectedMasterCase.ticker,dateStr),fetchCurrentPrice(selectedMasterCase.ticker)]);',
    '                if(!bp||!cp)throw new Error("price unavailable");',
    '                const investKRW=Number(investAmount)*10000;const priceRatio=cp/bp;const currentValueKRW=investKRW*priceRatio;const profitKRW=currentValueKRW-investKRW;const returnPct=((priceRatio-1)*100).toFixed(1);',
    '                const exactYears=(new Date()-new Date(dateStr))/(1000*60*60*24*365.25);const cagr=((Math.pow(priceRatio,1/Math.max(exactYears,.1))-1)*100).toFixed(1);const sharesCount=Math.floor((investKRW/usdToKrw)/bp);',
    '                const resultData={masterName:selectedMaster.name,masterEmoji:selectedMaster.emoji,stock:selectedMasterCase.stock,stockName:selectedMasterCase.name,ticker:selectedMasterCase.ticker,year:selectedMasterCase.year,amount:Number(investAmount),buyDateStr:dateStr,years:Math.floor(exactYears),buyPrice:bp,currentPrice:cp,investKRW,currentValueKRW,profitKRW,returnPct,cagr,multipleText:formatMultiple(currentValueKRW,investKRW),sharesCount,isProfit:profitKRW>=0,caseMeta:selectedMasterCaseMeta};',
    '                if(profitKRW>=0){if(window.confetti)window.confetti({particleCount:150,spread:70,origin:{y:.6},colors:[T.accent,"#fbbf24","#ffffff"]});if(navigator.vibrate)navigator.vibrate([50,30,50]);}else if(navigator.vibrate)navigator.vibrate(200);',
    '                setMasterResult(resultData);setMasterAnimKey(k=>k+1);setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);',
    '                setTimeout(()=>document.getElementById("master-inline-result")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
    '              }catch(e){setMasterResultError("시세를 불러오지 못했어요. 잠시 후 다시 계산해 주세요.");}',
    '              setMasterResultLoading(false);',
    '            }} style={{width:"100%",padding:"18px",background:(masterResultLoading||!investAmount||Number(investAmount)<=0)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(masterResultLoading||!investAmount||Number(investAmount)<=0)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all .2s"}}>{masterResultLoading?"🦜 껄무새 계산 중…":"📈 발자취 수익률 계산하기"}</button>',
    '            {masterResultError&&<div style={{marginTop:"12px",padding:"12px 14px",background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.35)",borderRadius:"12px",color:"#f87171",fontSize:"13px",textAlign:"center"}}>{masterResultError}</div>}',
    '          </div>',
    '',
    '          {masterResult&&<div id="master-inline-result" key={masterAnimKey} style={{marginBottom:"48px",animation:"slideUp .5s cubic-bezier(.16,1,.3,1)"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}><span style={snStyle}>04</span><span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>결과</span><div style={{flex:1,height:"1px",background:T.border}}/></div>',
    '            <div style={{position:"relative",background:T.bgResult,border:`1px solid ${masterResult.isProfit?T.accentDim+"80":"#ef444460"}`,borderRadius:"20px",boxShadow:masterResult.isProfit?`0 8px 40px ${T.accent}15`:"0 8px 40px rgba(239,68,68,.12)"}}>',
    '              <div style={{padding:"22px 20px 0",borderBottom:`1px solid ${T.border}40`}}>',
    '                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}><div><div style={{fontSize:"20px",color:masterResult.isProfit?T.accent:"#f87171",fontWeight:"700",letterSpacing:"-0.5px",lineHeight:1,marginBottom:"5px"}}>{masterResult.stockName}</div><div style={{fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>{masterResult.buyDateStr}<br/>→ 오늘 · {masterResult.years}년 흐름</div></div><div style={{fontSize:"28px"}}>{masterResult.isProfit?(parseFloat(masterResult.returnPct)>1000?"🦜🦜🦜":parseFloat(masterResult.returnPct)>300?"🦜🦜":"🦜"):(parseFloat(masterResult.returnPct)<-40?"😭":"😩")}</div></div>',
    '                <div style={{textAlign:"center",marginBottom:"20px"}}>',
    '                  <div style={{fontSize:"40px",fontWeight:"700",color:masterResult.isProfit?T.accent:"#f87171",letterSpacing:"-2px",lineHeight:1,marginBottom:"10px"}}>{masterResult.isProfit?"+":""}{masterResult.returnPct}%</div>',
    '                  {masterResult.multipleText&&<div style={{fontSize:"18px",fontWeight:"800",color:masterResult.isProfit?T.accent:"#f87171",marginBottom:"12px",letterSpacing:"-0.3px"}}>{masterResult.multipleText}</div>}',
    '                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginBottom:"10px"}}><div style={{textAlign:"center"}}><div style={{fontSize:"11px",color:T.textMuted,marginBottom:"2px"}}>투자 원금</div><div style={{fontSize:"14px",color:T.textSub,fontWeight:"700"}}>{formatKRW(masterResult.investKRW)}</div></div><div style={{fontSize:"18px",color:T.textMuted}}>→</div><div style={{textAlign:"center"}}><div style={{fontSize:"11px",color:T.textMuted,marginBottom:"2px"}}>현재 가치</div><div style={{fontSize:"22px",fontWeight:"700",color:masterResult.isProfit?T.accent:"#f87171",letterSpacing:"-0.5px"}}><CountUp key={masterAnimKey} target={masterResult.currentValueKRW} duration={1500}/></div><div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px"}}>{formatUSD(masterResult.currentValueKRW/usdToKrw)}</div></div></div>',
    '                  <div style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 16px",background:masterResult.isProfit?`${T.accent}15`:"rgba(239,68,68,.12)",borderRadius:"20px"}}><span style={{fontSize:"13px",color:masterResult.isProfit?T.accent:"#f87171"}}>{masterResult.isProfit?"▲":"▼"}</span><span style={{fontSize:"14px",fontWeight:"700",color:masterResult.isProfit?T.accent:"#f87171"}}>{formatKRW(Math.abs(masterResult.profitKRW))} {masterResult.isProfit?"수익":"손실"}</span></div>',
    '                </div>',
    '                <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>{[{label:"매수가",value:formatUSD(masterResult.buyPrice)},{label:"현재가",value:formatUSD(masterResult.currentPrice)},{label:"연평균",value:`${masterResult.isProfit?"+":""}${masterResult.cagr}%`,h:true}].map(item=><div key={item.label} style={{flex:1,padding:"10px 8px",textAlign:"center",background:item.h?(masterResult.isProfit?`${T.accent}15`:"rgba(239,68,68,.1)"):isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.03)",borderRadius:"10px",border:`1px solid ${item.h?(masterResult.isProfit?T.accent+"35":"#ef444435"):T.border}`}}><div style={{fontSize:"11px",color:T.textSub,marginBottom:"4px",fontWeight:"600"}}>{item.label}</div><div style={{fontSize:"13px",fontWeight:"700",color:item.h?(masterResult.isProfit?T.accent:"#f87171"):T.text,wordBreak:"break-all"}}>{item.value}</div></div>)}</div>',
    '                {masterResult.sharesCount>0&&<div style={{marginBottom:"20px",padding:"12px 16px",background:isDark?"rgba(255,255,255,.03)":"rgba(0,0,0,.02)",borderRadius:"12px",textAlign:"center"}}><span style={{fontSize:"14px",color:T.textSub}}>😱 당시 가격으로 약 <strong style={{color:masterResult.isProfit?T.accent:"#f87171",fontWeight:"700",fontSize:"16px"}}>{masterResult.sharesCount.toLocaleString()}주</strong>를 살 수 있었어요!</span></div>}',
    '              </div>',
    '              <div style={{padding:"16px 20px 22px"}}>',
    '                <div style={{display:"flex",alignItems:"flex-start",gap:"12px",padding:"14px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"14px",marginBottom:"14px"}}><div style={{fontSize:"22px"}}>{masterResult.masterEmoji}</div><div><div style={{fontSize:"14px",fontWeight:"600",color:T.text,marginBottom:"4px"}}>{masterResult.masterName} · {masterResult.caseMeta.theme}</div><div style={{fontSize:"12px",lineHeight:1.6,color:T.textSub}}>{masterResult.caseMeta.summary}</div><div style={{fontSize:"11px",color:T.textMuted,marginTop:"6px"}}>{masterResult.caseMeta.source} · {masterResult.caseMeta.type}</div></div></div>',
    '                <div style={{fontSize:"14px",color:T.textMuted,textAlign:"center",lineHeight:1.7,marginBottom:"4px"}}>“결과보다 중요한 건, 어떤 관점으로 오래 지켜봤는지예요.”</div>',
    '              </div>',
    '            </div>',
    '          </div>}',
    '        </div>',
    ''
  ].join('\n');

  source = source.slice(0, startIndex) + redesignedMaster + source.slice(endIndex);
  console.log('Unified master experience redesign applied.');
}

fs.writeFileSync(indexPath, source);
