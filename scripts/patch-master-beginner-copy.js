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

const helperData = [
  'const MASTER_CASE_EMOJI = {',
  '  AAPL:"🍎", KO:"🥤", AXP:"💳", BAC:"🏦", CVX:"⛽", OXY:"🛢️", AMZN:"📦", MCO:"📊",',
  '  TSLA:"🚗", COIN:"🪙", ROKU:"📺", ZM:"🎥", HOOD:"📱", CRSP:"🧬", SHOP:"🛍️", PATH:"🤖",',
  '  NVDA:"🧠", MSFT:"🪟", GOOGL:"🔎", PANW:"🛡️", AVGO:"💾", TEM:"🩺", VST:"⚡", CRM:"☁️"',
  '};',
  '',
  'const MASTER_CASE_BEGINNER_COPY = {',
  '  AAPL:"아이폰과 앱·서비스로 돈을 버는 회사예요. 사람들이 오래 쓰는 브랜드와 꾸준히 현금을 버는 힘을 본 사례예요.",',
  '  KO:"코카콜라 같은 음료를 전 세계에 파는 회사예요. 한 번 사고 끝나는 제품이 아니라 사람들이 계속 다시 사는 소비 습관이 강점이에요.",',
  '  AXP:"카드 결제와 회원 서비스를 운영하는 회사예요. 충성도 높은 고객과 넓은 결제망이 오래 돈을 버는 구조예요.",',
  '  BAC:"예금과 대출을 다루는 큰 은행이에요. 위기 뒤에도 버틸 수 있는 자본력과 다시 성장할 가능성을 본 사례예요.",',
  '  CVX:"석유와 가스를 생산·판매하는 에너지 회사예요. 큰 현금을 벌어 배당이나 자사주 매입으로 주주에게 돌려줄 수 있다는 점이 핵심이에요.",',
  '  OXY:"석유와 가스를 개발하는 에너지 회사예요. 가진 자원의 가치와 꾸준히 현금을 만들어내는 힘에 주목한 사례예요.",',
  '  AMZN:"온라인 쇼핑몰뿐 아니라 AWS라는 기업용 클라우드로도 돈을 버는 회사예요. 서로 다른 큰 사업이 함께 성장할 수 있다는 점이 핵심이에요.",',
  '  MCO:"기업과 국가의 신용등급을 매기는 회사예요. 꼭 필요한 평가 시장에서 경쟁자가 적고 반복적으로 수수료를 받을 수 있어요.",',
  '  TSLA:"전기차를 만들지만 소프트웨어·자율주행·에너지까지 확장하려는 회사예요. 지금보다 앞으로 시장을 바꿀 가능성에 투자한 사례예요.",',
  '  COIN:"가상자산을 사고팔고 보관하도록 돕는 거래 플랫폼이에요. 코인 가격 자체보다 시장이 커질 때 필요한 기반 시설에 주목한 사례예요.",',
  '  ROKU:"TV에서 넷플릭스 같은 앱을 볼 수 있게 해주는 플랫폼이에요. 방송 시청이 인터넷 중심으로 바뀌면 광고와 플랫폼 수익이 커질 수 있어요.",',
  '  ZM:"화상회의 서비스를 만드는 회사예요. 원격근무가 일시적인 유행이 아니라 일상적인 업무 도구가 될 가능성을 본 사례예요.",',
  '  HOOD:"스마트폰으로 주식 거래를 쉽게 해주는 증권 플랫폼이에요. 젊은 개인투자자가 늘면 함께 성장할 수 있다는 관점이에요.",',
  '  CRSP:"유전자를 정밀하게 고쳐 질병을 치료하는 기술을 개발해요. 성공하면 의료 방식을 바꿀 수 있지만 위험도 큰 미래 기술 투자예요.",',
  '  SHOP:"작은 사업자가 자기 온라인 쇼핑몰을 만들고 운영하도록 돕는 회사예요. 아마존에 입점하지 않아도 직접 판매할 수 있게 해주는 도구예요.",',
  '  PATH:"사람이 반복해서 하는 컴퓨터 업무를 소프트웨어 로봇이 대신하게 해줘요. 기업의 자동화 수요가 커질 가능성을 본 사례예요.",',
  '  NVDA:"AI 계산에 필요한 고성능 반도체와 소프트웨어를 만드는 회사예요. AI 서비스가 늘수록 핵심 장비 수요도 커질 수 있어요.",',
  '  MSFT:"윈도우·오피스·클라우드·AI 서비스를 운영해요. 개인과 기업이 매달 쓰는 서비스가 많아 꾸준히 돈을 버는 구조예요.",',
  '  GOOGL:"검색과 유튜브 광고가 주 수익원이고 AI·클라우드로 확장하는 회사예요. 많은 사용자와 데이터가 큰 경쟁력이에요.",',
  '  PANW:"기업의 컴퓨터와 클라우드를 해킹에서 지키는 보안 회사예요. 온라인 업무가 늘수록 보안 지출도 함께 커질 수 있어요.",',
  '  AVGO:"통신·데이터센터에 쓰이는 반도체와 기업용 소프트웨어를 만들어요. AI 인프라가 커질 때 필요한 부품과 시스템을 공급해요.",',
  '  TEM:"의료 데이터를 모아 AI로 분석하고 치료 결정을 돕는 회사예요. 의료와 AI가 결합하는 초기 성장 가능성에 주목한 사례예요.",',
  '  VST:"미국에서 전기를 생산하고 판매하는 회사예요. AI 데이터센터 때문에 전력 사용이 늘면 발전 회사가 수혜를 볼 수 있다는 관점이에요.",',
  '  CRM:"기업이 고객 정보와 영업 과정을 관리하도록 돕는 클라우드 소프트웨어예요. 기업들이 매달 구독료를 내는 반복 수익 구조가 특징이에요."',
  '};',
  ''
].join('\n');

if (!source.includes('const MASTER_CASE_EMOJI = {')) {
  replaceOnce('const MASTER_CASE_META = {', helperData + 'const MASTER_CASE_META = {', 'Master case emoji and beginner copy data');
}

const masterStart = '        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>';
const calculatorStart = '        <div id="calculator-start" style={{display:homeMode==="direct"?"block":"none",maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>';
const startIndex = source.indexOf(masterStart);
const endIndex = source.indexOf(calculatorStart, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.warn('Master beginner-friendly block target not found. Skipping.');
} else {
  let masterBlock = source.slice(startIndex, endIndex);

  if (!masterBlock.includes('회사를 잘 몰라도 괜찮아요.')) {
    masterBlock = masterBlock.replace(
      [
        '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>대표 투자 사례</span>',
        '              <div style={{flex:1,height:"1px",background:T.border}}/>',
        '            </div>',
        '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>'
      ].join('\n'),
      [
        '              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>대표 투자 사례</span>',
        '              <div style={{flex:1,height:"1px",background:T.border}}/>',
        '            </div>',
        '            <div style={{fontSize:"12px",lineHeight:1.6,color:T.textSub,margin:"-2px 0 12px"}}>회사를 잘 몰라도 괜찮아요. 사례를 누르면 <strong style={{color:T.text,fontWeight:"700"}}>무슨 회사인지</strong>와 <strong style={{color:T.text,fontWeight:"700"}}>왜 주목받았는지</strong>를 쉽게 풀어드려요.</div>',
        '            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden"}}>'
      ].join('\n')
    );
  }

  masterBlock = masterBlock.replace(
    'style={{minHeight:"68px",padding:"10px 11px",background:active?T.presetActive:T.inputBg,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"11px",cursor:"pointer",textAlign:"left",transition:"all .2s",boxShadow:active?`0 0 0 2px ${T.accent}12`:"none"}}>',
    'style={{minHeight:"86px",padding:"10px 11px",background:active?T.presetActive:T.inputBg,border:`1px solid ${active?T.borderActive:T.border}`,borderRadius:"11px",cursor:"pointer",textAlign:"left",transition:"all .2s",boxShadow:active?`0 0 0 2px ${T.accent}12`:"none"}}>'
  );

  if (!masterBlock.includes('{MASTER_CASE_EMOJI[item.ticker]||"📈"}')) {
    masterBlock = masterBlock.replace(
      [
        '                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"8px"}}>',
        '                      <div style={{minWidth:0}}>',
        '                        <div style={{fontSize:"14px",fontWeight:"700",color:active?T.accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>',
        '                        <div style={{fontSize:"11px",color:T.textMuted,marginTop:"4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.stock}</div>',
        '                      </div>',
        '                      <span style={{fontSize:"11px",fontWeight:"600",color:active?T.accent:T.textMuted,whiteSpace:"nowrap"}}>{item.year}</span>',
        '                    </div>'
      ].join('\n'),
      [
        '                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"8px"}}>',
        '                      <div style={{display:"flex",alignItems:"flex-start",gap:"8px",minWidth:0}}>',
        '                        <span style={{width:"30px",height:"30px",borderRadius:"9px",display:"flex",alignItems:"center",justifyContent:"center",background:active?T.bgCard:T.presetActive,border:`1px solid ${active?T.borderActive:T.border}`,fontSize:"17px",flexShrink:0}}>{MASTER_CASE_EMOJI[item.ticker]||"📈"}</span>',
        '                        <div style={{minWidth:0}}>',
        '                          <div style={{fontSize:"14px",fontWeight:"700",color:active?T.accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div>',
        '                          <div style={{fontSize:"11px",color:T.textMuted,marginTop:"4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.stock}</div>',
        '                        </div>',
        '                      </div>',
        '                      <span style={{fontSize:"11px",fontWeight:"600",color:active?T.accent:T.textMuted,whiteSpace:"nowrap"}}>{item.year}</span>',
        '                    </div>'
      ].join('\n')
    );
  }

  if (!masterBlock.includes('{MASTER_CASE_EMOJI[selectedMasterCase.ticker]||"📈"}')) {
    masterBlock = masterBlock.replace(
      '<div style={{minWidth:0}}><div style={{fontSize:"18px",fontWeight:"700",color:T.text,letterSpacing:"-0.4px"}}>{selectedMasterCase.name}</div><div style={{fontSize:"12px",color:T.textMuted,marginTop:"3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selectedMasterCase.stock}</div></div>',
      '<div style={{display:"flex",alignItems:"center",gap:"10px",minWidth:0}}><span style={{width:"40px",height:"40px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:T.presetActive,border:`1px solid ${T.borderActive}`,fontSize:"22px",flexShrink:0}}>{MASTER_CASE_EMOJI[selectedMasterCase.ticker]||"📈"}</span><div style={{minWidth:0}}><div style={{fontSize:"18px",fontWeight:"700",color:T.text,letterSpacing:"-0.4px"}}>{selectedMasterCase.name}</div><div style={{fontSize:"12px",color:T.textMuted,marginTop:"3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selectedMasterCase.stock}</div></div></div>'
    );
  }

  if (!masterBlock.includes('주식을 처음 봐도 이렇게 이해하면 돼요')) {
    masterBlock = masterBlock.replace(
      '                  {masterPreviewLoading?(',
      [
        '                  <div style={{padding:"13px 14px",background:`${T.accent}0D`,border:`1px solid ${T.accent}30`,borderRadius:"12px",marginBottom:"10px"}}>',
        '                    <div style={{fontSize:"12px",fontWeight:"800",color:T.accent,marginBottom:"6px"}}>🦜 주식을 처음 봐도 이렇게 이해하면 돼요</div>',
        '                    <div style={{fontSize:"13px",lineHeight:1.7,color:T.textSub}}>{MASTER_CASE_BEGINNER_COPY[selectedMasterCase.ticker]||selectedMasterCaseMeta.summary}</div>',
        '                    <div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted,marginTop:"8px",paddingTop:"8px",borderTop:`1px solid ${T.border}`}}>아래 숫자는 이 회사의 주가가 과거와 비교해 얼마나 달라졌는지 보여주는 참고용 계산이에요.</div>',
        '                  </div>',
        '                  {masterPreviewLoading?('
      ].join('\n')
    );
  }

  masterBlock = masterBlock
    .replace('[{label:"분야",value:selectedMasterCaseMeta.sector},{label:"관점",value:selectedMasterCaseMeta.theme},{label:"자료",value:selectedMasterCaseMeta.type}]', '[{label:"무슨 회사?",value:selectedMasterCaseMeta.sector},{label:"왜 주목?",value:selectedMasterCaseMeta.theme},{label:"어디서 확인?",value:selectedMasterCaseMeta.type}]')
    .replace('>확인된 사실</div>', '>공개자료에서 확인된 내용</div>')
    .replace('>직접 발언·투자 논리</div>', '>공개 발언 또는 알려진 투자 관점</div>')
    .replace('>껄무새의 사례 해석</div>', '>쉽게 풀어보면</div>')
    .replace('표시 가격은 {selectedMasterCase.year}년의 같은 날짜와 현재 시세를 비교한 체험용 값이에요. 실제 매수일·매수가와는 다를 수 있습니다.', '쉽게 말해 {selectedMasterCase.year}년에 이 주식을 샀다고 가정해 오늘까지 얼마나 변했는지 보는 계산이에요. 실제 거장의 정확한 매수일·가격과는 다를 수 있어요.');

  source = source.slice(0, startIndex) + masterBlock + source.slice(endIndex);
  console.log('Beginner-friendly master case UI applied.');
}

fs.writeFileSync(indexPath, source);
