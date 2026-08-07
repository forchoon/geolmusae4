const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

function replaceOnce(oldText,newText,label){
  if(s.includes(newText)){console.log(label+' already applied.');return true;}
  if(!s.includes(oldText)){console.warn(label+' target not found. Skipping.');return false;}
  s=s.replace(oldText,newText);console.log(label+' applied.');return true;
}

replaceOnce('function formatMasterCasePrice(ticker,v){if(v===null||v===undefined)return"-";return /\\.(KS|KQ)$/.test(ticker)?formatKRW(v):formatUSD(v);}','function formatMasterCasePrice(ticker,v){if(v===null||v===undefined)return"-";return /\\.(KS|KQ)$/.test(ticker)?`₩${Math.round(v).toLocaleString()}`:formatUSD(v);}','Precise KRW share price');

const oldNote='selectedMasterId==="buffett"?"버크셔 해서웨이의 공개 보유자료와 주주서한에서 반복적으로 확인되는 장기 보유·기업 경쟁력 관점을 중심으로 구성했어요.":selectedMasterId==="ark"?"ARK가 공개하는 ETF 보유 내역과 투자 리서치에서 자주 등장하는 파괴적 혁신 테마를 중심으로 구성했어요.":"미 의회 정기거래보고서(PTR)에 공개된 배우자 거래를 바탕으로 구성했으며, 펠로시 본인의 직접 투자로 단정하지 않아요."';
const newNote='selectedMasterId==="buffett"?"버크셔 해서웨이의 공개 보유자료와 주주서한에서 반복적으로 확인되는 장기 보유·기업 경쟁력 관점을 중심으로 구성했어요.":selectedMasterId==="ark"?"ARK가 공개하는 ETF 보유 내역과 투자 리서치에서 자주 등장하는 파괴적 혁신 테마를 중심으로 구성했어요.":selectedMasterId==="pelosi"?"미 의회 정기거래보고서(PTR)에 공개된 배우자 거래를 바탕으로 구성했으며, 펠로시 본인의 직접 투자로 단정하지 않아요.":selectedMasterId==="parkYoungOk"?"금융감독원 5% 대량보유 공시와 주주제안 기록처럼 공개적으로 추적 가능한 지분 변화를 중심으로 구성했어요.":selectedMasterId==="kangBangCheon"?"강방천 본인의 저서·인터뷰에서 직접 회고한 성공 사례와 공개적으로 설명한 투자 관점을 중심으로 구성했어요.":"이채원이 실제 펀드를 운용하며 공개한 회고와 펀드매니저 인터뷰에서 확인되는 가치투자 사례를 중심으로 구성했어요."';
replaceOnce(oldNote,newNote,'Korean master source note');

replaceOnce('                const exactYears=(new Date()-new Date(dateStr))/(1000*60*60*24*365.25);const cagr=((Math.pow(priceRatio,1/Math.max(exactYears,.1))-1)*100).toFixed(1);const sharesCount=Math.floor((investKRW/usdToKrw)/bp);','                const exactYears=(new Date()-new Date(dateStr))/(1000*60*60*24*365.25);const cagr=((Math.pow(priceRatio,1/Math.max(exactYears,.1))-1)*100).toFixed(1);const sharesCount=Math.floor(/\\.(KS|KQ)$/.test(selectedMasterCase.ticker)?investKRW/bp:(investKRW/usdToKrw)/bp);','Korean master shares calculation');

replaceOnce('<div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px"}}>{formatUSD(masterResult.currentValueKRW/usdToKrw)}</div>','{/\\.(KS|KQ)$/.test(selectedMasterCase.ticker)?null:<div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px"}}>{formatUSD(masterResult.currentValueKRW/usdToKrw)}</div>}','Hide USD equivalent for Korean master');

if(!s.includes('term:"5% 공시"')){
  const statusLine='  const status=String(evidence?.status||"");';
  const expanded=[statusLine,'  const fact=String(evidence?.fact||"");','  const rationale=String(evidence?.rationale||"");','  const note=String(evidence?.note||"");','  const quality=String(evidence?.quality||"");'].join('\n');
  replaceOnce(statusLine,expanded,'Korean glossary evidence fields');
  const anchor='  if(src.includes("ARK")||status.includes("ETF")||scale.includes("ETF"))items.push({term:"ETF",desc:"여러 주식이나 자산을 한 바구니에 담아 주식처럼 사고팔 수 있게 만든 투자 상품이에요."});';
  const insert=[anchor,
'  if(src.includes("5%")||status.includes("5%")||status.includes("대량보유")||quality.includes("5%"))items.push({term:"5% 공시",desc:"상장회사 주식을 5% 이상 가지게 되면 ‘누가 이 회사 주식을 많이 갖고 있는지’ 공개하는 제도예요. 이후 지분이 크게 바뀌어도 다시 알려야 해요."});',
'  if(status.includes("주주제안")||fact.includes("주주제안"))items.push({term:"주주제안",desc:"주주가 회사에 배당·이사 선임 같은 안건을 주주총회에서 다뤄달라고 공식적으로 요구하는 거예요."});',
'  if(fact.includes("우선주")||rationale.includes("우선주"))items.push({term:"우선주",desc:"보통주처럼 회사에 투자하지만 의결권이 제한되는 대신 더 싸게 거래되거나 배당 조건이 유리한 경우가 있는 주식이에요."});',
'  if(fact.includes("내재가치")||rationale.includes("내재가치")||note.includes("내재가치"))items.push({term:"내재가치",desc:"오늘 주가와 별개로 회사가 가진 사업·현금·자산과 앞으로 벌 돈을 보고 생각하는 ‘회사 자체의 가치’라고 보면 쉬워요."});'
  ].join('\n');
  replaceOnce(anchor,insert,'Korean beginner glossary');
}else console.log('Korean beginner glossary already applied.');

fs.writeFileSync(p,s);
