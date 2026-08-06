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
  'function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}',
  'function getCurrency(yt){if(!yt)return "USD";if(yt==="^KS11"||yt.endsWith(".KS")||yt.endsWith(".KQ"))return "KRW";return CURRENCY_MAP[yt]||"USD";}',
  'Currency patch: .KS/.KQ tickers now use KRW'
);

replaceOnce(
  '<div style={{padding:"36px 20px 16px",textAlign:"center",position:"relative"}}>',
  '<div style={{padding:"28px 20px 12px",textAlign:"center",position:"relative"}}>',
  'Header padding patch'
);

replaceOnce(
  'width:"240px",\n    maxWidth:"78%",',
  'width:"150px",\n    maxWidth:"68%",',
  'Header logo size patch'
);

replaceOnce(
  'export default function Home(){',
  [
    'const MASTER_PROFILES = {',
    '  buffett:{',
    '    name:"워런 버핏",eyebrow:"장기 가치투자",emoji:"🧓",',
    '    description:"좋은 기업을 합리적인 가격에 사고 오랫동안 보유하는 투자로 유명해요.",',
    '    tags:["장기보유","현금흐름","강한 브랜드"],',
    '    cases:[',
    '      {stock:"Apple",ticker:"AAPL",name:"애플",year:2016,note:"버크셔의 대표적인 빅테크 투자 사례"},',
    '      {stock:"Amazon",ticker:"AMZN",name:"아마존",year:2019,note:"전통적인 가치투자 범위를 넓힌 사례"},',
    '      {stock:"Chevron",ticker:"CVX",name:"셰브론",year:2020,note:"에너지 업종의 대형 투자 사례"},',
    '      {stock:"Coca-Cola",ticker:"KO",name:"코카콜라",year:1988,note:"버핏식 장기 보유를 상징하는 사례"}',
    '    ]',
    '  },',
    '  ark:{',
    '    name:"캐시 우드",eyebrow:"파괴적 혁신 투자",emoji:"🚀",',
    '    description:"전기차·핀테크·플랫폼처럼 미래 산업의 높은 성장 가능성에 집중해요.",',
    '    tags:["고성장","혁신기술","높은 변동성"],',
    '    cases:[',
    '      {stock:"Tesla",ticker:"TSLA",name:"테슬라",year:2018,note:"ARK의 대표적인 혁신기업 투자 사례"},',
    '      {stock:"Coinbase",ticker:"COIN",name:"코인베이스",year:2021,note:"가상자산 생태계에 대한 투자 사례"},',
    '      {stock:"Roku",ticker:"ROKU",name:"로쿠",year:2019,note:"스트리밍 플랫폼 성장에 베팅한 사례"},',
    '      {stock:"Zoom",ticker:"ZM",name:"줌",year:2020,note:"비대면 협업 기술의 성장 사례"}',
    '    ]',
    '  },',
    '  pelosi:{',
    '    name:"낸시 펠로시 일가",eyebrow:"공개 거래 추적",emoji:"👀",',
    '    description:"의회 재산공개에 등장한 배우자 거래를 바탕으로 살펴보는 사례예요. 전문 운용사의 포트폴리오와는 성격이 달라요.",',
    '    tags:["기술주","공개공시","옵션 포함"],',
    '    cases:[',
    '      {stock:"NVIDIA",ticker:"NVDA",name:"엔비디아",year:2021,note:"AI 반도체 성장과 함께 주목받은 거래 사례"},',
    '      {stock:"Microsoft",ticker:"MSFT",name:"마이크로소프트",year:2021,note:"대형 기술주 관련 공개 거래 사례"},',
    '      {stock:"Alphabet",ticker:"GOOGL",name:"알파벳",year:2021,note:"플랫폼 기업 관련 공개 거래 사례"},',
    '      {stock:"Palo Alto Networks",ticker:"PANW",name:"팔로알토 네트웍스",year:2024,note:"사이버보안 기업 관련 공개 거래 사례"}',
    '    ]',
    '  }',
    '};',
    '',
    'export default function Home(){'
  ].join('\n'),
  'Master profile data patch'
);

replaceOnce(
  '  const [showIosInstallSheet,setShowIosInstallSheet]=useState(false);',
  [
    '  const [showIosInstallSheet,setShowIosInstallSheet]=useState(false);',
    '  const [selectedMasterId,setSelectedMasterId]=useState("buffett");',
    '  const [selectedMasterCaseIndex,setSelectedMasterCaseIndex]=useState(0);',
    '  const [masterApplied,setMasterApplied]=useState("");'
  ].join('\n'),
  'Master card state patch'
);

replaceOnce(
  '  const T=isDark?THEMES.dark:THEMES.light;\n  const isUSD=currency==="USD";',
  [
    '  const T=isDark?THEMES.dark:THEMES.light;',
    '  const selectedMaster=MASTER_PROFILES[selectedMasterId];',
    '  const selectedMasterCase=selectedMaster.cases[selectedMasterCaseIndex]||selectedMaster.cases[0];',
    '  const isUSD=currency==="USD";'
  ].join('\n'),
  'Master card derived state patch'
);

replaceOnce(
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 8px",padding:"0 16px"}}>',
    '          <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 16px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",minHeight:"44px"}}>',
    '            <div style={{display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>',
    '              <div style={{position:"relative",width:"8px",height:"8px",flexShrink:0}}>',
    '                <span style={{position:"absolute",inset:0,background:T.accent,borderRadius:"50%",animation:"liveRing 2s ease-out infinite",opacity:0}}/>',
    '                <span style={{position:"absolute",inset:"1px",background:T.accent,borderRadius:"50%"}}/>',
    '              </div>',
    '              <span style={{fontSize:"11px",fontWeight:"600",color:T.accent}}>Live</span>',
    '            </div>',
    '            <div style={{width:"1px",height:"14px",background:T.border,flexShrink:0}}/>',
    '            <span style={{',
    '              fontSize:"13px",',
    '              color:T.textSub,',
    '              fontWeight:"400",',
    '              overflow:"hidden",',
    '              textOverflow:"ellipsis",',
    '              whiteSpace:"nowrap",',
    '              opacity:liveFeedVisible?1:0,',
    '              transition:"opacity 0.4s ease"',
    '            }}>',
    '              {recentFeed.length > 0 ? (()=>{',
    '                const item = recentFeed[liveFeedIdx % recentFeed.length];',
    '                const template = FEED_TEMPLATES[(liveFeedIdx + recentFeed.indexOf(item)) % FEED_TEMPLATES.length];',
    '                const timeAgo = getTimeAgo(item.timestamp);',
    '                return <span>',
    '                  <strong style={{color:T.text,fontWeight:"600"}}>{template(item.ticker)}</strong>',
    '                  {timeAgo && <span style={{color:T.textMuted,fontWeight:"400"}}> · {timeAgo}</span>}',
    '                </span>;',
    '              })() : <span>🦜 껄무새들의 실시간 후회가 모이는 곳</span>}',
    '            </span>',
    '          </div>',
    '        </div>',
    ''
  ].join('\n'),
  '        {/* top live feed removed */}\n',
  'Remove top live feed'
);

replaceOnce(
  '        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>\n          <div style={sec}>',
  [
    '        <div style={{maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>',
    '          <div style={{padding:"18px",background:T.bgCard,border:"1px solid "+T.border,borderRadius:"20px",boxShadow:isDark?"0 14px 36px rgba(0,0,0,.18)":"0 12px 30px rgba(15,23,42,.08)"}}>',
    '            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px",marginBottom:"16px"}}>',
    '              <div style={{display:"flex",alignItems:"center",gap:"11px"}}>',
    '                <div style={{width:"42px",height:"42px",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:"1px solid "+T.borderActive+"55",fontSize:"22px",flexShrink:0}}>👣</div>',
    '                <div>',
    '                  <div style={{fontSize:"17px",fontWeight:"900",color:T.text,letterSpacing:"-0.4px"}}>거장의 발자취</div>',
    '                  <div style={{fontSize:"11px",color:T.textMuted,marginTop:"3px"}}>거장과 대표 사례를 골라 같은 조건으로 껄해봐요</div>',
    '                </div>',
    '              </div>',
    '              <div style={{fontSize:"9px",fontWeight:"800",color:T.accent,background:T.presetActive,border:"1px solid "+T.borderActive+"55",padding:"5px 7px",borderRadius:"999px",whiteSpace:"nowrap"}}>공개자료 기반</div>',
    '            </div>',
    '',
    '            <label style={{display:"block",fontSize:"11px",fontWeight:"800",color:T.textSub,marginBottom:"6px"}}>거장 선택</label>',
    '            <select value={selectedMasterId} onChange={e=>{setSelectedMasterId(e.target.value);setSelectedMasterCaseIndex(0);setMasterApplied("");}} style={{width:"100%",padding:"13px 40px 13px 13px",background:T.bgDeep,border:"1px solid "+T.border,borderRadius:"12px",color:T.text,fontSize:"14px",fontWeight:"800",outline:"none",marginBottom:"12px"}}>',
    '              {Object.entries(MASTER_PROFILES).map(([id,m])=><option key={id} value={id}>{m.emoji} {m.name} · {m.eyebrow}</option>)}',
    '            </select>',
    '',
    '            <div style={{display:"flex",gap:"12px",padding:"13px",background:T.bgSoft,border:"1px solid "+T.border,borderRadius:"14px",marginBottom:"14px"}}>',
    '              <div style={{width:"46px",height:"46px",borderRadius:"14px",background:T.bgCard,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"25px",flexShrink:0}}>{selectedMaster.emoji}</div>',
    '              <div style={{minWidth:0,flex:1}}>',
    '                <div style={{fontSize:"14px",fontWeight:"900",color:T.text,marginBottom:"4px"}}>{selectedMaster.name}</div>',
    '                <div style={{fontSize:"11px",lineHeight:1.55,color:T.textSub,marginBottom:"8px"}}>{selectedMaster.description}</div>',
    '                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>{selectedMaster.tags.map(tag=><span key={tag} style={{fontSize:"9px",fontWeight:"700",color:T.accent,background:T.presetActive,padding:"4px 6px",borderRadius:"999px"}}>{tag}</span>)}</div>',
    '              </div>',
    '            </div>',
    '',
    '            <label style={{display:"block",fontSize:"11px",fontWeight:"800",color:T.textSub,marginBottom:"6px"}}>대표 투자 사례</label>',
    '            <select value={selectedMasterCaseIndex} onChange={e=>{setSelectedMasterCaseIndex(Number(e.target.value));setMasterApplied("");}} style={{width:"100%",padding:"13px 40px 13px 13px",background:T.bgDeep,border:"1px solid "+T.border,borderRadius:"12px",color:T.text,fontSize:"14px",fontWeight:"800",outline:"none",marginBottom:"8px"}}>',
    '              {selectedMaster.cases.map((item,idx)=><option key={`${item.ticker}-${item.year}`} value={idx}>{item.stock} · {item.year}년</option>)}',
    '            </select>',
    '            <div style={{padding:"10px 12px",background:T.bgSoft,borderRadius:"11px",marginBottom:"14px"}}>',
    '              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}>',
    '                <span style={{fontSize:"12px",fontWeight:"900",color:T.text}}>{selectedMasterCase.stock}</span>',
    '                <span style={{fontSize:"10px",fontWeight:"800",color:T.accent}}>{selectedMasterCase.year}년 기준</span>',
    '              </div>',
    '              <div style={{fontSize:"10px",lineHeight:1.45,color:T.textMuted,marginTop:"4px"}}>{selectedMasterCase.note}</div>',
    '            </div>',
    '',
    '            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",marginBottom:"7px"}}>',
    '              <label style={{fontSize:"11px",fontWeight:"800",color:T.textSub}}>투자금액</label>',
    '              <div style={{fontSize:"10px",color:T.textMuted}}>만원 단위</div>',
    '            </div>',
    '            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"6px",marginBottom:"8px"}}>',
    '              {["10","100","500","1000","3000"].map(amount=><button key={amount} type="button" onClick={()=>{setInvestAmount(amount);setMasterApplied("");}} style={{padding:"9px 3px",borderRadius:"10px",border:"1px solid "+(investAmount===amount?T.borderActive:T.border),background:investAmount===amount?T.presetActive:T.bgSoft,color:investAmount===amount?T.accent:T.textSub,fontSize:"10px",fontWeight:"800",cursor:"pointer"}}>{Number(amount).toLocaleString()}</button>)}',
    '            </div>',
    '            <div style={{position:"relative",marginBottom:"14px"}}>',
    '              <input inputMode="numeric" value={investAmount} onChange={e=>{setInvestAmount(e.target.value.replace(/[^0-9]/g,""));setMasterApplied("");}} placeholder="직접 금액 입력" style={{width:"100%",boxSizing:"border-box",padding:"13px 48px 13px 13px",background:T.bgDeep,border:"1px solid "+T.border,borderRadius:"12px",color:T.text,fontSize:"15px",fontWeight:"900",outline:"none"}}/>',
    '              <span style={{position:"absolute",right:"13px",top:"50%",transform:"translateY(-50%)",fontSize:"12px",fontWeight:"800",color:T.textMuted}}>만원</span>',
    '            </div>',
    '',
    '            <button type="button" disabled={!investAmount||Number(investAmount)<=0} onClick={()=>{',
    '              setActiveTab("us");',
    '              setSelectedStock({ticker:selectedMasterCase.ticker,yahooTicker:selectedMasterCase.ticker,name:selectedMasterCase.name});',
    '              setInvestYear(selectedMasterCase.year);',
    '              setShowKRW(false);',
    '              setResult(null);',
    '              setSearchQuery("");',
    '              setMasterApplied(`✓ ${selectedMaster.name} × ${selectedMasterCase.name} · ${selectedMasterCase.year}년 · ${Number(investAmount).toLocaleString()}만원`);',
    '              setTimeout(()=>document.getElementById("calculator-start")?.scrollIntoView({behavior:"smooth",block:"start"}),120);',
    '            }} style={{width:"100%",padding:"14px 16px",border:"none",borderRadius:"13px",background:(!investAmount||Number(investAmount)<=0)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,color:"#fff",fontSize:"14px",fontWeight:"900",cursor:(!investAmount||Number(investAmount)<=0)?"not-allowed":"pointer"}}>{selectedMaster.name}의 {selectedMasterCase.stock} 발자취로 계산하기</button>',
    '            {masterApplied&&<div style={{marginTop:"9px",padding:"9px 10px",background:T.presetActive,border:"1px solid "+T.borderActive+"55",borderRadius:"10px",color:T.accent,fontSize:"10px",fontWeight:"800",textAlign:"center"}}>{masterApplied}</div>}',
    '            <div style={{fontSize:"9px",lineHeight:1.45,color:T.textMuted,marginTop:"10px"}}>연도는 공개자료를 바탕으로 단순화한 대표 기준이며 정확한 매수일·단가를 의미하지 않아요. 투자 권유가 아닙니다.</div>',
    '          </div>',
    '        </div>',
    '',
    '        <div id="calculator-start" style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>',
    '          <div style={sec}>'
  ].join('\n'),
  'Master footprint card patch'
);

replaceOnce(
  [
    '            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>',
    '            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all 0.2s"}}>',
    '              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}',
    '            </button>',
    '            <div style={{marginTop:"20px"}}><CoupangBanner isDark={isDark} T={T}/></div>'
  ].join('\n'),
  [
    '            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>',
    '            <div style={{marginBottom:"16px"}}><CoupangBanner isDark={isDark} T={T}/></div>',
    '            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all 0.2s"}}>',
    '              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}',
    '            </button>'
  ].join('\n'),
  'Move pre-result Coupang banner above calculate button'
);

fs.writeFileSync(indexPath, source);
