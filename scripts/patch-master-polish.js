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

// Header: left aligned and roughly 20% smaller than the current 150px patched logo.
replaceOnce(
  '<div style={{padding:"28px 20px 12px",textAlign:"center",position:"relative"}}>',
  '<div style={{maxWidth:"600px",margin:"0 auto",padding:"22px 20px 10px",textAlign:"left",position:"relative"}}>',
  'Left-align compact header'
);

replaceOnce(
  'width:"150px",\n    maxWidth:"68%",\n    height:"auto",\n    display:"block",\n    margin:"0 auto"',
  'width:"120px",\n    maxWidth:"55%",\n    height:"auto",\n    display:"block",\n    margin:"0"',
  'Reduce and left-align logo'
);

// Make the two modes parallel in naming and much clearer in dark mode.
replaceOnce(
  '<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",padding:"4px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"14px"}}>',
  '<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",padding:"4px",background:T.bgDeep,border:"1px solid "+T.border,borderRadius:"14px"}}>',
  'Strengthen mode switch container'
);

replaceOnce(
  '<button type="button" onClick={()=>setHomeMode("direct")} style={{padding:"11px 8px",border:"none",borderRadius:"10px",background:homeMode==="direct"?T.bgCard:"transparent",color:homeMode==="direct"?T.text:T.textSub,fontSize:"13px",fontWeight:"900",cursor:"pointer",boxShadow:homeMode==="direct"?"0 1px 5px rgba(0,0,0,.12)":"none"}}>직접 계산하기</button>',
  '<button type="button" onClick={()=>setHomeMode("direct")} style={{padding:"11px 8px",border:`1px solid ${homeMode==="direct"?T.accent:"transparent"}`,borderRadius:"10px",background:homeMode==="direct"?T.accent:"transparent",color:homeMode==="direct"?(isDark?"#07110a":"#fff"):T.textSub,fontSize:"13px",fontWeight:"700",cursor:"pointer",boxShadow:homeMode==="direct"?`0 0 0 3px ${T.accent}22`:"none",transition:"all .2s"}}>직접 계산</button>',
  'Rename and strengthen direct mode'
);

replaceOnce(
  '<button type="button" onClick={()=>setHomeMode("master")} style={{padding:"11px 8px",border:"none",borderRadius:"10px",background:homeMode==="master"?T.bgCard:"transparent",color:homeMode==="master"?T.text:T.textSub,fontSize:"13px",fontWeight:"900",cursor:"pointer",boxShadow:homeMode==="master"?"0 1px 5px rgba(0,0,0,.12)":"none"}}>👣 거장의 발자취</button>',
  '<button type="button" onClick={()=>setHomeMode("master")} style={{padding:"11px 8px",border:`1px solid ${homeMode==="master"?T.accent:"transparent"}`,borderRadius:"10px",background:homeMode==="master"?T.accent:"transparent",color:homeMode==="master"?(isDark?"#07110a":"#fff"):T.textSub,fontSize:"13px",fontWeight:"700",cursor:"pointer",boxShadow:homeMode==="master"?`0 0 0 3px ${T.accent}22`:"none",transition:"all .2s"}}>거장 사례</button>',
  'Rename and strengthen master mode'
);

// Expand each profile to eight publicly documented or representative cases.
// The year remains a clearly labelled representative simulation year, not an exact trade date.
replaceOnce(
  [
    '      {stock:"Apple",ticker:"AAPL",name:"애플",year:2016,note:"버크셔의 대표적인 빅테크 투자 사례"},',
    '      {stock:"Amazon",ticker:"AMZN",name:"아마존",year:2019,note:"전통적인 가치투자 범위를 넓힌 사례"},',
    '      {stock:"Chevron",ticker:"CVX",name:"셰브론",year:2020,note:"에너지 업종의 대형 투자 사례"},',
    '      {stock:"Coca-Cola",ticker:"KO",name:"코카콜라",year:1988,note:"버핏식 장기 보유를 상징하는 사례"}'
  ].join('\n'),
  [
    '      {stock:"Apple",ticker:"AAPL",name:"애플",year:2016,note:"버크셔의 대표적인 빅테크 투자 사례"},',
    '      {stock:"Coca-Cola",ticker:"KO",name:"코카콜라",year:1988,note:"버핏식 장기 보유를 상징하는 사례"},',
    '      {stock:"American Express",ticker:"AXP",name:"아메리칸 익스프레스",year:1991,note:"브랜드와 결제 네트워크에 주목한 장기 보유 사례"},',
    '      {stock:"Bank of America",ticker:"BAC",name:"뱅크오브아메리카",year:2011,note:"금융위기 이후 대형 은행의 회복 가능성에 주목한 사례"},',
    '      {stock:"Chevron",ticker:"CVX",name:"셰브론",year:2020,note:"에너지 업종의 대형 투자 사례"},',
    '      {stock:"Occidental Petroleum",ticker:"OXY",name:"옥시덴털 페트롤리엄",year:2019,note:"에너지 기업의 현금흐름과 자산가치에 주목한 사례"},',
    '      {stock:"Amazon",ticker:"AMZN",name:"아마존",year:2019,note:"전통적인 가치투자 범위를 넓힌 사례"},',
    '      {stock:"Moody’s",ticker:"MCO",name:"무디스",year:2001,note:"높은 진입장벽을 가진 신용평가 사업의 사례"}'
  ].join('\n'),
  'Expand Buffett cases'
);

replaceOnce(
  [
    '      {stock:"Tesla",ticker:"TSLA",name:"테슬라",year:2018,note:"ARK의 대표적인 혁신기업 투자 사례"},',
    '      {stock:"Coinbase",ticker:"COIN",name:"코인베이스",year:2021,note:"가상자산 생태계에 대한 투자 사례"},',
    '      {stock:"Roku",ticker:"ROKU",name:"로쿠",year:2019,note:"스트리밍 플랫폼 성장에 베팅한 사례"},',
    '      {stock:"Zoom",ticker:"ZM",name:"줌",year:2020,note:"비대면 협업 기술의 성장 사례"}'
  ].join('\n'),
  [
    '      {stock:"Tesla",ticker:"TSLA",name:"테슬라",year:2018,note:"ARK의 대표적인 혁신기업 투자 사례"},',
    '      {stock:"Coinbase",ticker:"COIN",name:"코인베이스",year:2021,note:"가상자산 생태계에 대한 투자 사례"},',
    '      {stock:"Roku",ticker:"ROKU",name:"로쿠",year:2019,note:"스트리밍 플랫폼 성장에 베팅한 사례"},',
    '      {stock:"Zoom",ticker:"ZM",name:"줌",year:2020,note:"비대면 협업 기술의 성장 사례"},',
    '      {stock:"Robinhood Markets",ticker:"HOOD",name:"로빈후드",year:2021,note:"개인 투자 플랫폼의 확장 가능성에 주목한 사례"},',
    '      {stock:"CRISPR Therapeutics",ticker:"CRSP",name:"크리스퍼 테라퓨틱스",year:2017,note:"유전자 편집 기술의 장기 성장 가능성을 본 사례"},',
    '      {stock:"Shopify",ticker:"SHOP",name:"쇼피파이",year:2022,note:"독립 커머스 생태계의 플랫폼 성장 사례"},',
    '      {stock:"UiPath",ticker:"PATH",name:"유아이패스",year:2021,note:"업무 자동화 소프트웨어 확산에 주목한 사례"}'
  ].join('\n'),
  'Expand ARK cases'
);

replaceOnce(
  [
    '      {stock:"NVIDIA",ticker:"NVDA",name:"엔비디아",year:2021,note:"AI 반도체 성장과 함께 주목받은 거래 사례"},',
    '      {stock:"Microsoft",ticker:"MSFT",name:"마이크로소프트",year:2021,note:"대형 기술주 관련 공개 거래 사례"},',
    '      {stock:"Alphabet",ticker:"GOOGL",name:"알파벳",year:2021,note:"플랫폼 기업 관련 공개 거래 사례"},',
    '      {stock:"Palo Alto Networks",ticker:"PANW",name:"팔로알토 네트웍스",year:2024,note:"사이버보안 기업 관련 공개 거래 사례"}'
  ].join('\n'),
  [
    '      {stock:"NVIDIA",ticker:"NVDA",name:"엔비디아",year:2021,note:"AI 반도체 성장과 함께 주목받은 거래 사례"},',
    '      {stock:"Microsoft",ticker:"MSFT",name:"마이크로소프트",year:2021,note:"대형 기술주 관련 공개 거래 사례"},',
    '      {stock:"Alphabet",ticker:"GOOGL",name:"알파벳",year:2021,note:"플랫폼 기업 관련 공개 거래 사례"},',
    '      {stock:"Palo Alto Networks",ticker:"PANW",name:"팔로알토 네트웍스",year:2024,note:"사이버보안 기업 관련 공개 거래 사례"},',
    '      {stock:"Broadcom",ticker:"AVGO",name:"브로드컴",year:2024,note:"반도체·인프라 소프트웨어 관련 공개 거래 사례"},',
    '      {stock:"Tempus AI",ticker:"TEM",name:"템퍼스 AI",year:2025,note:"의료 데이터와 AI를 결합한 기업 관련 공개 거래 사례"},',
    '      {stock:"Vistra",ticker:"VST",name:"비스트라",year:2025,note:"전력 수요 증가와 관련해 주목받은 공개 거래 사례"},',
    '      {stock:"Salesforce",ticker:"CRM",name:"세일즈포스",year:2021,note:"기업용 클라우드 소프트웨어 관련 공개 거래 사례"}'
  ].join('\n'),
  'Expand Pelosi cases'
);

// Add metadata for the expanded cases.
replaceOnce(
  '  PANW:{sector:"사이버보안",theme:"보안 수요 증가",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"클라우드 전환과 함께 커지는 기업 보안 수요에 주목한 사례"}',
  [
    '  PANW:{sector:"사이버보안",theme:"보안 수요 증가",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"클라우드 전환과 함께 커지는 기업 보안 수요에 주목한 사례"},',
    '  AXP:{sector:"결제·금융",theme:"브랜드·네트워크",source:"버크셔 공개 보유자료",type:"장기 보유",summary:"결제 네트워크와 프리미엄 고객 기반의 장기 경쟁력을 본 사례"},',
    '  BAC:{sector:"은행",theme:"회복력·자본력",source:"버크셔 공개 보유자료",type:"공개 보유",summary:"대형 은행의 자본력과 경기 회복에 따른 수익 정상화를 본 사례"},',
    '  OXY:{sector:"에너지",theme:"현금흐름·자산가치",source:"버크셔 공개 보유자료",type:"공개 보유",summary:"원유·가스 자산과 현금 창출력에 주목한 에너지 투자 사례"},',
    '  MCO:{sector:"금융정보",theme:"높은 진입장벽",source:"버크셔 공개 보유자료",type:"장기 보유",summary:"신용평가 시장의 높은 진입장벽과 반복 수익 구조를 본 사례"},',
    '  HOOD:{sector:"핀테크",theme:"개인투자 플랫폼",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"모바일 중심 개인 투자 플랫폼의 확장 가능성에 주목한 사례"},',
    '  CRSP:{sector:"유전자 편집",theme:"바이오 혁신",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"유전자 편집 기술이 치료 방식 자체를 바꿀 가능성을 본 사례"},',
    '  SHOP:{sector:"커머스 플랫폼",theme:"독립 상거래 생태계",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"브랜드와 판매자가 독립적으로 성장할 수 있는 커머스 인프라 사례"},',
    '  PATH:{sector:"업무 자동화",theme:"소프트웨어 생산성",source:"ARK 공개 포트폴리오",type:"ETF 공개 보유",summary:"반복 업무를 자동화하는 소프트웨어가 기업 생산성을 높인다는 관점의 사례"},',
    '  AVGO:{sector:"반도체·인프라SW",theme:"AI 인프라",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"AI 데이터센터와 인프라 소프트웨어 수요를 함께 보는 공개 거래 사례"},',
    '  TEM:{sector:"의료 AI",theme:"데이터 기반 진료",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"임상·분자 데이터를 AI로 연결하는 의료 기술 기업의 공개 거래 사례"},',
    '  VST:{sector:"전력·유틸리티",theme:"전력 수요 증가",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"데이터센터 확대로 커지는 전력 수요와 발전 자산에 주목한 공개 거래 사례"},',
    '  CRM:{sector:"기업용 SaaS",theme:"클라우드 업무",source:"미 의회 PTR 공개자료",type:"공개 거래",summary:"기업 고객관계 관리가 클라우드 플랫폼으로 이동하는 흐름을 본 사례"}'
  ].join('\n'),
  'Add expanded case metadata'
);

// Preview states and a compact "show more" control.
replaceOnce(
  '  const [masterAnimKey,setMasterAnimKey]=useState(0);',
  [
    '  const [masterAnimKey,setMasterAnimKey]=useState(0);',
    '  const [masterPreview,setMasterPreview]=useState(null);',
    '  const [masterPreviewChart,setMasterPreviewChart]=useState(null);',
    '  const [masterPreviewLoading,setMasterPreviewLoading]=useState(false);',
    '  const [showAllMasterCases,setShowAllMasterCases]=useState(false);'
  ].join('\n'),
  'Add master preview states'
);

replaceOnce(
  '  const selectedMasterCaseMeta=MASTER_CASE_META[selectedMasterCase.ticker]||{sector:"미국주식",theme:selectedMaster.eyebrow,source:"공개자료",type:"대표 사례",summary:selectedMasterCase.note};',
  [
    '  const selectedMasterCaseMeta=MASTER_CASE_META[selectedMasterCase.ticker]||{sector:"미국주식",theme:selectedMaster.eyebrow,source:"공개자료",type:"대표 사례",summary:selectedMasterCase.note};',
    '  const visibleMasterCases=showAllMasterCases?selectedMaster.cases:selectedMaster.cases.slice(0,4);',
    '  const masterPreviewReturnPct=masterPreview?((masterPreview.currentPrice/masterPreview.buyPrice-1)*100).toFixed(1):null;',
    '  const masterPreviewMillionValue=masterPreview?1000000*(masterPreview.currentPrice/masterPreview.buyPrice):null;'
  ].join('\n'),
  'Add master preview derived values'
);

replaceOnce(
  '  const shares=calcShares();',
  [
    '  const shares=calcShares();',
    '',
    '  useEffect(()=>{',
    '    let cancelled=false;',
    '    const loadMasterPreview=async()=>{',
    '      setMasterPreviewLoading(true);',
    '      setMasterPreview(null);',
    '      setMasterPreviewChart(null);',
    '      try{',
    '        const dateStr=getSameDayOfYear(selectedMasterCase.year);',
    '        const [bp,cp,apiChart]=await Promise.all([',
    '          fetchYahooPrice(selectedMasterCase.ticker,dateStr),',
    '          fetchCurrentPrice(selectedMasterCase.ticker),',
    '          fetchChartDataAPI(selectedMasterCase.ticker)',
    '        ]);',
    '        if(cancelled)return;',
    '        const fallback=getChartData(selectedMasterCase.ticker);',
    '        setMasterPreviewChart(apiChart&&apiChart.length?apiChart:fallback);',
    '        if(bp&&cp)setMasterPreview({buyPrice:bp,currentPrice:cp,dateStr});',
    '      }catch(e){',
    '        if(!cancelled)setMasterPreviewChart(getChartData(selectedMasterCase.ticker));',
    '      }',
    '      if(!cancelled)setMasterPreviewLoading(false);',
    '    };',
    '    loadMasterPreview();',
    '    return()=>{cancelled=true;};',
    '  },[selectedMasterCase.ticker,selectedMasterCase.year]);'
  ].join('\n'),
  'Load live master case preview'
);

// Rebuild only steps 01 and 02. Steps 03, calculation, animation and results remain shared.
const masterStart = '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const masterIndex = source.indexOf(masterStart);
const step1Start = source.indexOf('          <div style={sec}>', masterIndex);
const step2Start = source.indexOf('          <div style={sec}>', step1Start + 1);
const step3Start = source.indexOf('          <div style={sec}>', step2Start + 1);

if (masterIndex === -1 || step1Start === -1 || step2Start === -1 || step3Start === -1) {
  console.warn('Master steps 01/02 target not found. Skipping.');
} else {
  const newSteps = [
    '          <div style={sec}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>',
    '              <span style={snStyle}>01</span>',
    '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>거장 선택</span>',
    '              <div style={{flex:1,height:"1px",background:T.border}}/>',
    '            </div>',
    '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>',
    '              <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"6px",padding:"6px"}}>',
    '                {Object.entries(MASTER_PROFILES).map(([id,m])=>{',
    '                  const active=selectedMasterId===id;',
    '                  const shortName=id==="buffett"?"워런 버핏":id==="ark"?"캐시 우드":"펠로시 일가";',
    '                  return <button key={id} type="button" onClick={()=>{setSelectedMasterId(id);setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"88px",padding:"10px 6px",background:active?(isDark?"rgba(74,222,128,.18)":T.presetActive):"transparent",border:`2px solid ${active?T.accent:"transparent"}`,borderRadius:"12px",cursor:"pointer",textAlign:"center",transition:"all .2s",boxShadow:active?`0 0 0 3px ${T.accent}18`:"none"}}>',
    '                    <div style={{fontSize:"23px",lineHeight:1,marginBottom:"7px"}}>{m.emoji}</div>',
    '                    <div style={{fontSize:"13px",fontWeight:"700",color:active?T.accent:T.text,letterSpacing:"-0.2px"}}>{shortName}</div>',
    '                    <div style={{fontSize:"11px",fontWeight:"400",color:active?T.accent:T.textMuted,marginTop:"3px",lineHeight:1.3}}>{m.eyebrow}</div>',
    '                  </button>;',
    '                })}',
    '              </div>',
    '              <div style={{padding:"13px 14px 14px",borderTop:`1px solid ${T.border}`,background:T.inputBg}}>',
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
    '              <span style={{fontSize:"11px",fontWeight:"600",color:T.accent,background:T.presetActive,padding:"4px 7px",borderRadius:"999px"}}>{selectedMaster.cases.length}개</span>',
    '              <div style={{flex:1,height:"1px",background:T.border}}/>',
    '            </div>',
    '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>',
    '              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"1px",background:T.border}}>',
    '                {visibleMasterCases.map((item,idx)=>{',
    '                  const originalIndex=selectedMaster.cases.findIndex(c=>c.ticker===item.ticker&&c.year===item.year);',
    '                  const active=selectedMasterCaseIndex===originalIndex;',
    '                  return <button key={`${item.ticker}-${item.year}`} type="button" onClick={()=>{setSelectedMasterCaseIndex(originalIndex);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{minHeight:"72px",padding:"11px 12px",background:active?(isDark?"rgba(74,222,128,.14)":T.presetActive):T.bgCard,border:"none",cursor:"pointer",textAlign:"left",transition:"all .2s",boxShadow:active?`inset 3px 0 ${T.accent}`:"none"}}>',
    '                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"8px"}}>',
    '                      <div style={{minWidth:0}}>',
    '                        <div style={{fontSize:"14px",fontWeight:"700",color:active?T.accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>',
    '                        <div style={{fontSize:"11px",color:T.textMuted,marginTop:"4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.stock}</div>',
    '                      </div>',
    '                      <span style={{fontSize:"11px",fontWeight:"600",color:active?T.accent:T.textMuted,whiteSpace:"nowrap"}}>{item.year}</span>',
    '                    </div>',
    '                  </button>;',
    '                })}',
    '              </div>',
    '              {selectedMaster.cases.length>4&&<button type="button" onClick={()=>setShowAllMasterCases(v=>!v)} style={{width:"100%",padding:"10px 12px",border:"none",borderTop:`1px solid ${T.border}`,background:T.inputBg,color:T.textSub,fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>{showAllMasterCases?"사례 접기":`사례 ${selectedMaster.cases.length-4}개 더 보기`}</button>}',
    '              <div style={{borderTop:`1px solid ${T.border}`}}>',
    '                <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px"}}>',
    '                  <div style={{minWidth:0}}><div style={{fontSize:"18px",fontWeight:"700",color:T.text,letterSpacing:"-0.4px"}}>{selectedMasterCase.name}</div><div style={{fontSize:"12px",color:T.textMuted,marginTop:"3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selectedMasterCase.stock}</div></div>',
    '                  <span style={{fontSize:"11px",fontWeight:"600",color:T.accent,background:T.presetActive,padding:"6px 9px",borderRadius:"999px",whiteSpace:"nowrap"}}>{selectedMasterCase.year}년 기준</span>',
    '                </div>',
    '                <div style={{padding:"0 14px 14px"}}>',
    '                  {masterPreviewLoading?(',
    '                    <div style={{padding:"38px 16px",textAlign:"center",background:T.inputBg,borderRadius:"12px",color:T.textMuted,fontSize:"13px"}}>📡 기준일과 현재 시세를 불러오는 중…</div>',
    '                  ):masterPreview?<>',
    '                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"7px",marginBottom:"10px"}}>',
    '                      {[{label:"기준일 1주",value:formatUSD(masterPreview.buyPrice)},{label:"현재 1주",value:formatUSD(masterPreview.currentPrice)},{label:"1주 변화",value:`${Number(masterPreviewReturnPct)>=0?"+":""}${masterPreviewReturnPct}%`,highlight:true}].map(item=><div key={item.label} style={{padding:"10px 7px",background:T.inputBg,border:`1px solid ${item.highlight?T.borderActive:T.border}`,borderRadius:"10px",textAlign:"center"}}><div style={{fontSize:"10px",color:T.textMuted,marginBottom:"4px"}}>{item.label}</div><div style={{fontSize:"12px",fontWeight:"700",color:item.highlight?(Number(masterPreviewReturnPct)>=0?T.accent:"#f87171"):T.text,wordBreak:"break-all"}}>{item.value}</div></div>)}',
    '                    </div>',
    '                    {masterPreviewChart&&masterPreviewChart.length>0&&<div style={{padding:"8px 8px 2px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"12px",marginBottom:"10px"}}><StockChart ticker={selectedMasterCase.ticker} investYear={selectedMasterCase.year} T={T} displayPrice={formatUSD} currentPrice={masterPreview.currentPrice} chartData={masterPreviewChart} buyPrice={masterPreview.buyPrice}/></div>}',
    '                    <div style={{padding:"12px 14px",background:`${T.accent}0D`,border:`1px solid ${T.accent}30`,borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",marginBottom:"12px"}}><div><div style={{fontSize:"11px",color:T.textMuted,marginBottom:"3px"}}>100만원을 같은 기준일에 넣었다면</div><div style={{fontSize:"13px",color:T.textSub}}>대표 기준일 → 오늘</div></div><div style={{fontSize:"18px",fontWeight:"800",color:Number(masterPreviewReturnPct)>=0?T.accent:"#f87171",whiteSpace:"nowrap"}}>{formatKRW(Math.round(masterPreviewMillionValue))}</div></div>',
    '                  </>:(',
    '                    <div style={{padding:"28px 16px",textAlign:"center",background:T.inputBg,borderRadius:"12px",color:T.textMuted,fontSize:"13px"}}>이 사례의 시세 미리보기를 불러오지 못했어요.</div>',
    '                  )}',
    '                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"7px",marginBottom:"10px"}}>',
    '                    {[{label:"분야",value:selectedMasterCaseMeta.sector},{label:"관점",value:selectedMasterCaseMeta.theme},{label:"자료",value:selectedMasterCaseMeta.type}].map(item=><div key={item.label} style={{padding:"9px 7px",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",textAlign:"center"}}><div style={{fontSize:"10px",color:T.textMuted,marginBottom:"3px"}}>{item.label}</div><div style={{fontSize:"11px",fontWeight:"600",color:T.text,lineHeight:1.35,wordBreak:"keep-all"}}>{item.value}</div></div>)}',
    '                  </div>',
    '                  <div style={{fontSize:"13px",lineHeight:1.6,color:T.textSub,marginBottom:"8px"}}>{selectedMasterCaseMeta.summary}</div>',
    '                  <div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted}}>자료 구분: {selectedMasterCaseMeta.source} · 표시 가격은 {selectedMasterCase.year}년 오늘과 현재 시세를 비교한 체험용 값이며, 실제 거래일·거래 단가를 의미하지 않아요.</div>',
    '                </div>',
    '              </div>',
    '            </div>',
    '          </div>',
    ''
  ].join('\n');

  source = source.slice(0, step1Start) + newSteps + source.slice(step3Start);
  console.log('Rebuilt compact connected master steps 01 and 02.');
}

fs.writeFileSync(indexPath, source);
