const fs=require('fs');
const path=require('path');
const indexPath=path.join(process.cwd(),'pages','index.js');
let source=fs.readFileSync(indexPath,'utf8');

function injectObjectEntries(name,sentinel,entries){
  if(source.includes(sentinel)){console.log(`${name} Korean entries already applied.`);return;}
  const start=source.indexOf(`const ${name} = {`);
  if(start<0)throw new Error(`${name} start not found`);
  const end=source.indexOf('\n};',start);
  if(end<0)throw new Error(`${name} end not found`);
  source=source.slice(0,end)+',\n'+entries+source.slice(end);
  console.log(`${name} Korean entries applied.`);
}

injectObjectEntries('MASTER_PROFILES','parkYoungOk:{',String.raw`  parkYoungOk:{region:"kr",shortName:"박영옥",name:"박영옥 · 주식농부",eyebrow:"기업과 함께 오래 가는 투자",emoji:"🌾",description:"주식을 사고파는 종이가 아니라 ‘기업의 주인이 되는 일’로 보는 투자자예요. 5% 이상 지분 공시와 주주제안 기록이 있어 국내 투자자 중에서도 발자취를 비교적 또렷하게 따라갈 수 있어요.",tags:["장기보유","기업가치","주주행동"],cases:[
    {stock:"Daedong",ticker:"000490.KS",name:"대동",year:2008,note:"농기계 1등 기업의 장기 경쟁력을 보고 큰 지분을 보유한 사례"},
    {stock:"Samchuly Bicycle",ticker:"024950.KQ",name:"삼천리자전거",year:2015,note:"자전거 이용 확대라는 생활 변화를 장기 성장 기회로 본 사례"},
    {stock:"Very Good Tour",ticker:"094850.KQ",name:"참좋은여행",year:2013,note:"여행·레저 소비의 성장 가능성을 보고 큰 지분을 보유한 사례"},
    {stock:"Chokwang Leather",ticker:"004700.KS",name:"조광피혁",year:2010,note:"오랜 기간 보유하며 주주환원과 기업가치 개선을 요구한 사례"}]},
  kangBangCheon:{region:"kr",shortName:"강방천",name:"강방천",eyebrow:"생활의 변화에서 찾는 투자",emoji:"🔭",description:"숫자만 보기보다 사람들이 어디에 돈과 시간을 쓰는지가 어떻게 바뀌는지 관찰해 좋은 기업을 찾는 것으로 유명해요. 본인이 회고한 성공 사례와 공개 인터뷰에서 설명한 기업을 중심으로 구성했어요.",tags:["생활변화","좋은 비즈니스","장기성장"],cases:[
    {stock:"Hanjin",ticker:"002320.KS",name:"한진",year:1998,note:"홈쇼핑 성장 뒤에 따라올 택배 수요를 미리 연결해 본 대표 성공 사례"},
    {stock:"Samsung Electronics Preferred",ticker:"005935.KS",name:"삼성전자우",year:1998,note:"보통주보다 싸지만 배당 매력은 높았던 우선주의 가치를 본 사례"},
    {stock:"Kakao",ticker:"035720.KS",name:"카카오",year:2021,note:"고객이 계속 늘고 쌓이는 플랫폼 비즈니스를 강조한 공개 관점 사례"},
    {stock:"Hyundai Mobis",ticker:"012330.KS",name:"현대모비스",year:2021,note:"자동차 산업 변화 속 핵심 부품 기업의 경쟁력을 본 공개 관점 사례"}]},
  leeChaeWon:{region:"kr",shortName:"이채원",name:"이채원",eyebrow:"싸게 사서 제값을 기다리는 가치투자",emoji:"🧮",description:"회사의 실제 가치보다 주가가 충분히 싸다고 판단될 때 사고, 시장이 그 가치를 알아볼 때까지 기다리는 한국 가치투자 1세대예요. 실제 펀드 운용과 인터뷰로 확인되는 사례를 중심으로 골랐어요.",tags:["저평가","내재가치","긴 호흡"],cases:[
    {stock:"Lotte Chilsung Beverage",ticker:"005300.KS",name:"롯데칠성",year:1998,note:"주가보다 공장 부지와 사업의 내재가치가 훨씬 크다고 보고 비중을 늘린 대표 사례"},
    {stock:"Nongshim",ticker:"004370.KS",name:"농심",year:2004,note:"꾸준한 소비와 브랜드 경쟁력을 가진 가치주 장기 성과 사례"},
    {stock:"Shinsegae",ticker:"004170.KS",name:"신세계",year:2002,note:"시장 유행보다 개별 기업의 내재가치에 집중했던 가치주 보유 사례"}]}}`);

injectObjectEntries('MASTER_CASE_META','"000490.KS":{sector:',String.raw`  "000490.KS":{sector:"농기계",theme:"1등 기업·장기 성장",source:"금감원 5% 공시 인용 자료",type:"대량보유 공개",summary:"국내 농기계 시장의 강한 지위와 장기 성장 가능성을 보고 큰 지분을 보유한 사례"},
  "024950.KQ":{sector:"자전거",theme:"생활 패턴 변화",source:"금감원 5% 공시 인용 자료",type:"대량보유 공개",summary:"자전거 이용 인구가 늘어나는 변화를 단순 테마가 아니라 산업의 구조 변화로 본 사례"},
  "094850.KQ":{sector:"여행·레저",theme:"여가 소비 성장",source:"공개 지분 보유 자료",type:"대량보유 공개",summary:"여행과 레저 소비가 장기적으로 커질 가능성을 보고 큰 지분을 보유한 사례"},
  "004700.KS":{sector:"피혁",theme:"자산가치·주주환원",source:"주주제안·공개 지분 자료",type:"장기 보유·주주행동",summary:"오랫동안 큰 지분을 보유하며 배당과 자사주 등 주주환원 개선을 요구한 사례"},
  "002320.KS":{sector:"물류",theme:"홈쇼핑→택배 성장",source:"본인 저서·인터뷰 회고",type:"대표 성공 사례",summary:"홈쇼핑 주문이 늘면 물건을 배달하는 회사도 성장한다는 생활 변화의 연결고리를 찾은 사례"},
  "005935.KS":{sector:"반도체·전자",theme:"우선주 할인·배당",source:"본인 저서·인터뷰 회고",type:"대표 성공 사례",summary:"같은 기업인데 의결권이 없다는 이유로 싸게 거래되던 우선주의 가격과 가치 차이를 본 사례"},
  "035720.KS":{sector:"플랫폼",theme:"고객 축적·네트워크",source:"2021년 공개 인터뷰",type:"공개 투자 관점",summary:"사람이 많이 모일수록 서비스 가치가 커지는 플랫폼 비즈니스의 힘을 강조한 사례"},
  "012330.KS":{sector:"자동차 부품",theme:"미래 모빌리티",source:"2021년 공개 인터뷰",type:"공개 투자 관점",summary:"자동차가 전기·전자 중심으로 바뀔 때 핵심 부품 기업의 역할을 본 사례"},
  "005300.KS":{sector:"음료",theme:"내재가치·자산가치",source:"펀드 운용 회고·인터뷰",type:"실제 운용 사례",summary:"주가가 떨어져도 사업과 부동산 등 실제 가치가 훼손되지 않았다고 보고 오히려 비중을 늘린 대표 가치투자 사례"},
  "004370.KS":{sector:"식품",theme:"브랜드·반복 소비",source:"펀드매니저 인터뷰",type:"장기 성과 사례",summary:"반복해서 사는 강한 식품 브랜드의 안정적인 가치를 본 사례"},
  "004170.KS":{sector:"유통",theme:"저평가 가치주",source:"펀드 운용 보도",type:"공개 보유 사례",summary:"시장 분위기보다 개별 기업의 내재가치와 가격의 차이를 먼저 본 사례"}`);

injectObjectEntries('MASTER_CASE_EMOJI','"000490.KS":"🚜"',String.raw`  "000490.KS":"🚜","024950.KQ":"🚲","094850.KQ":"✈️","004700.KS":"👜","002320.KS":"📦","005935.KS":"📱","035720.KS":"💬","012330.KS":"🚙","005300.KS":"🥤","004370.KS":"🍜","004170.KS":"🏬"`);

injectObjectEntries('MASTER_CASE_BEGINNER_COPY','"000490.KS":"트랙터',String.raw`  "000490.KS":"트랙터와 농기계를 만드는 회사예요. 농사를 지을 때 꼭 필요한 장비를 만드는 국내 대표 기업이라는 점에서 ‘오래 살아남을 1등 기업’을 보는 사례로 이해하면 쉬워요.",
  "024950.KQ":"자전거를 만드는 회사예요. 사람들이 건강·여가·친환경 이동에 더 관심을 가지면 자전거 이용도 늘 수 있다는 생활 변화에 주목한 사례예요.",
  "094850.KQ":"해외여행 상품을 판매하는 여행사예요. 소득이 늘고 여가를 즐기는 사람이 많아질수록 여행 소비가 커질 수 있다는 관점이에요.",
  "004700.KS":"가죽을 만드는 오래된 제조업체예요. 화려한 성장보다 회사가 가진 자산과 현금, 주주에게 얼마나 돌려주는지를 중요하게 본 사례예요.",
  "002320.KS":"택배와 물류를 하는 회사예요. 홈쇼핑 주문이 많아지면 결국 물건을 배달하는 회사도 바빠진다는 아주 직관적인 아이디어에서 출발했어요.",
  "005935.KS":"삼성전자와 같은 회사에 투자하지만 의결권이 없는 우선주예요. 대신 더 싸고 배당이 유리할 수 있어 같은 기업을 더 싼 가격에 사는 방법으로 본 사례예요.",
  "035720.KS":"카카오톡을 중심으로 광고·결제·콘텐츠를 연결하는 회사예요. 사용자가 많아질수록 플랫폼의 가치도 함께 커지는 구조에 주목했어요.",
  "012330.KS":"자동차 핵심 부품을 만드는 회사예요. 차가 전기차·자율주행차로 바뀌어도 꼭 필요한 전장 부품과 시스템의 역할을 본 사례예요.",
  "005300.KS":"칠성사이다 같은 음료를 파는 회사예요. 당시 주가만 보지 않고 회사가 가진 공장 부지와 사업의 실제 가치까지 계산해 ‘너무 싸다’고 판단한 사례예요.",
  "004370.KS":"신라면·짜파게티 같은 익숙한 식품을 파는 회사예요. 경기가 달라져도 반복해서 사 먹는 강한 브랜드가 꾸준히 돈을 벌 수 있다는 사례예요.",
  "004170.KS":"백화점과 유통 사업을 하는 회사예요. 인기 테마를 쫓기보다 회사가 실제로 벌어들이는 돈과 가진 자산에 비해 주가가 싼지를 따져본 사례예요."`);

injectObjectEntries('MASTER_EVIDENCE','"000490.KS":{quality:',String.raw`  "000490.KS":{quality:"공시 인용 자료",eventDate:"2008년 10월",disclosureDate:"2008년 공개",scale:"지분 약 13.24%",status:"대량보유",fact:"2008년 금융감독원 공시를 인용한 보도에서 박영옥 대표가 대동공업 지분 13.24%를 보유한 것으로 확인됩니다. 2010년에는 약 13.4%의 2대주주로 주주제안에도 참여했습니다.",rationale:"좋은 기업의 주주가 되어 장기간 동행하는 ‘주식농부’ 철학을 보여주는 사례예요.",note:"정확한 최초 매수일과 평균 매수단가는 공개자료만으로 확정하기 어려워 2008년을 대표 기준연도로 사용합니다.",sourceLabel:"금감원 공시 인용 보도",sourceUrl:"https://www.hankyung.com/article/2008101525821",timeline:[{date:"2008",label:"13.24% 공개"},{date:"2010",label:"2대주주·주주제안"}]},
  "024950.KQ":{quality:"5% 공시 인용",eventDate:"2015-04-28",disclosureDate:"2015-04-28",scale:"706,525주 · 5.32%",status:"5% 이상 대량보유",fact:"2015년 4월 박영옥 대표가 삼천리자전거 706,525주, 지분 5.32%를 보유했다고 공시한 사실이 확인됩니다.",rationale:"자전거를 단기 테마가 아니라 이용 인구 확대라는 ‘패러다임 변화’로 봤다고 설명했습니다.",note:"2007년 첫 투자 후 지분 변동이 있었고 2015년 공개 시점을 대표 기준으로 사용합니다.",sourceLabel:"금감원 5% 공시 인용",sourceUrl:"https://www.fnnews.com/news/201504290835574593",timeline:[{date:"2007",label:"첫 투자"},{date:"2015",label:"5.32% 공개"}]},
  "094850.KQ":{quality:"공개 지분 자료",eventDate:"2013년",disclosureDate:"2013년 공개",scale:"지분 약 12.27%",status:"2대주주",fact:"2013년 공개 보도에서 박영옥 대표가 참좋은레져 지분 12.27%를 보유해 2대주주로 이름을 올린 사실이 확인됩니다.",rationale:"여행·레저 소비가 커지는 산업을 장기 관점에서 본 흐름으로 이해할 수 있어요.",note:"정확한 최초 매수일·평균단가는 공개되지 않아 2013년 공개 시점을 대표 기준으로 사용합니다.",sourceLabel:"공개 지분 보도",sourceUrl:"https://www.etoday.co.kr/news/view/773187",timeline:[{date:"2008",label:"8%대 보유"},{date:"2013",label:"12.27% 공개"}]},
  "004700.KS":{quality:"장기 보유 공개",eventDate:"2010년 주주제안",disclosureDate:"2010-02-11",scale:"장기 대량보유",status:"주주제안·장기 보유",fact:"박영옥 대표는 2010년 조광피혁을 포함한 투자기업에 주주제안을 했고 이후에도 장기간 대규모 지분을 보유한 것으로 공개돼 왔습니다.",rationale:"기업의 주주로 오래 머물면서 배당·자사주 등 주주환원을 개선해야 한다는 철학을 보여주는 사례예요.",note:"2010년 당시 정확한 매입단가는 공개자료만으로 확정할 수 없어 주주제안 시점을 대표 기준으로 사용합니다.",sourceLabel:"주주제안 공개 보도",sourceUrl:"https://www.hankyung.com/article/2010021125426",timeline:[{date:"2010",label:"주주제안"},{date:"이후",label:"장기 대량보유"}]},
  "002320.KS":{quality:"본인 회고",eventDate:"1990년대 후반",disclosureDate:"2021년 공개",scale:"수십억원대 수익 회고",status:"대표 성공 사례",fact:"강방천은 투자 인생에서 가장 기억에 남는 종목 중 하나로 한진택배를 꼽았고, TV홈쇼핑 성장에 따라 택배업체가 수혜를 볼 것이라고 판단해 수십억원의 수익을 냈다고 회고했습니다.",rationale:"‘홈쇼핑 성장 → 주문 증가 → 택배 물량 증가’처럼 생활 변화의 다음 수혜자를 찾는 관점을 잘 보여줘요.",note:"정확한 최초 매수일·매수금액·평균단가는 공개되지 않았습니다. 1998년은 대표 시뮬레이션 기준입니다.",sourceLabel:"강방천 저서·인터뷰 회고",sourceUrl:"https://www.mk.co.kr/news/stock/9785564",timeline:[{date:"1990s",label:"홈쇼핑 성장 포착"},{date:"2021",label:"성공 사례 회고"}]},
  "005935.KS":{quality:"본인 회고",eventDate:"1990년대 후반",disclosureDate:"2021년 공개",scale:"정확한 투자금액 비공개",status:"대표 성공 사례",fact:"강방천은 삼성전자 우선주를 투자 인생에서 기억에 남는 성공 종목으로 꼽았습니다.",rationale:"의결권이 없어 보통주보다 싸게 거래되지만 배당 매력은 높을 수 있다는 가격과 가치의 차이에 주목했어요.",note:"정확한 체결일과 평균 매수단가는 공개되지 않았고 1998년은 대표 시뮬레이션 기준입니다.",sourceLabel:"강방천 저서·인터뷰 회고",sourceUrl:"https://www.mk.co.kr/news/stock/9785564",timeline:[{date:"1990s",label:"우선주 가치 주목"},{date:"2021",label:"성공 사례 회고"}]},
  "035720.KS":{quality:"공개 인터뷰",eventDate:"2021-06",disclosureDate:"2021-06-07",scale:"개인 거래 규모 비공개",status:"공개 투자 관점",fact:"강방천은 2021년 인터뷰와 저서에서 카카오를 좋은 기업의 대표 사례로 반복해서 강조했습니다.",rationale:"고객이 쉽게 떠나지 않고 고객 수가 늘면서 데이터와 서비스가 쌓이는 플랫폼 구조를 좋은 비즈니스의 조건으로 설명했어요.",note:"개인의 정확한 매매 공시가 아니라 공개된 투자 관점입니다. 2021년을 대표 언급 시점으로 사용합니다.",sourceLabel:"2021 공개 인터뷰",sourceUrl:"https://economist.co.kr/article/view/ecn202106070028",timeline:[{date:"2021",label:"좋은 기업으로 공개 언급"}]},
  "012330.KS":{quality:"공개 인터뷰",eventDate:"2021-06",disclosureDate:"2021-06-07",scale:"개인 거래 규모 비공개",status:"공개 투자 관점",fact:"강방천은 2021년 인터뷰에서 카카오와 함께 현대모비스를 투자 유망 기업으로 지목했습니다.",rationale:"자동차 산업이 소프트웨어·전장·자율주행 중심으로 바뀔 때 핵심 부품 기업의 경쟁력을 보는 관점이에요.",note:"개인의 실제 매수 공시가 아니라 공개 투자 관점이므로 2021년을 대표 기준으로 사용합니다.",sourceLabel:"2021 공개 인터뷰",sourceUrl:"https://economist.co.kr/article/view/ecn202106070028",timeline:[{date:"2021",label:"투자 유망 기업 언급"}]},
  "005300.KS":{quality:"실제 펀드 운용 회고",eventDate:"1998년부터",disclosureDate:"2009년 인터뷰",scale:"최대 약 18.4% 보유 회고",status:"비중 확대·장기 보유",fact:"이채원은 1998년부터 롯데칠성을 8만원대에서 사들이기 시작했고 주가가 더 떨어진 뒤에도 내재가치가 훼손되지 않았다고 보고 비중을 늘려 최대 약 18.4%까지 보유했다고 회고했습니다.",rationale:"당시 주가보다 공장 부지와 사업 가치가 훨씬 크다고 판단했고 롯데칠성 투자로 약 400% 수익을 거둔 대표 사례로 소개됐습니다.",note:"운용 과정의 모든 체결 내역이 공개된 것은 아니며 화면은 1998년을 대표 기준으로 계산합니다.",sourceLabel:"펀드 운용 인터뷰",sourceUrl:"https://www.hankyung.com/article/2009111259886",timeline:[{date:"1998",label:"8만원대 매수 시작"},{date:"1999",label:"하락에도 비중 확대"},{date:"이후",label:"약 400% 수익 회고"}]},
  "004370.KS":{quality:"펀드매니저 인터뷰",eventDate:"2000년대 초",disclosureDate:"2004년 공개",scale:"200~400%대 성과 사례군",status:"장기 가치주 사례",fact:"이채원은 롯데칠성·태평양·농심 등에 장기 투자해 200~400% 수준의 고수익을 낸 경험을 공개 인터뷰에서 설명했습니다.",rationale:"반복 소비되는 강한 브랜드와 안정적인 수익성을 가진 회사를 내재가치보다 싸게 사는 방식의 사례예요.",note:"농심의 정확한 최초 체결일·개별 수익률은 공개자료에 분리되어 있지 않아 2004년 공개 시점을 대표 기준으로 사용합니다.",sourceLabel:"2004 펀드매니저 인터뷰",sourceUrl:"https://www.hankyung.com/article/2004062071721",timeline:[{date:"2000s",label:"장기 가치주 운용"},{date:"2004",label:"성과 사례 공개"}]},
  "004170.KS":{quality:"펀드 운용 보도",eventDate:"2001년 운용",disclosureDate:"2002년 공개",scale:"펀드 보유 종목",status:"가치주 보유 사례",fact:"2002년 보도에서 이채원이 운용한 펀드가 태평양·롯데칠성·신세계 같은 가치주를 많이 보유해 시장 대비 높은 수익을 기록한 것으로 소개됐습니다.",rationale:"경제 전망보다 개별 기업의 내재가치와 현재 가격의 차이를 먼저 보는 상향식 가치투자의 사례예요.",note:"신세계의 정확한 개별 매수일·매수단가는 공개되지 않아 2002년 공개 시점을 대표 기준으로 사용합니다.",sourceLabel:"2002 가치투자 운용 보도",sourceUrl:"https://www.hankyung.com/article/2002041438951",timeline:[{date:"2001",label:"가치주 중심 운용"},{date:"2002",label:"시장 초과 성과 공개"}]}`);

injectObjectEntries('DIRECT_MASTER_MARKERS','master:"박영옥"',String.raw`  "000490.KS":[{master:"박영옥",shortName:"박영옥",emoji:"🌾",year:2008,dateLabel:"2008 공개",label:"지분 13.24% 공개",kind:"period"}],
  "024950.KQ":[{master:"박영옥",shortName:"박영옥",emoji:"🌾",year:2015,dateLabel:"2015-04-28",label:"지분 5.32% 공개",kind:"date"}],
  "094850.KQ":[{master:"박영옥",shortName:"박영옥",emoji:"🌾",year:2013,dateLabel:"2013 공개",label:"지분 12.27% 공개",kind:"period"}],
  "004700.KS":[{master:"박영옥",shortName:"박영옥",emoji:"🌾",year:2010,dateLabel:"2010-02",label:"주주제안",kind:"period"}],
  "002320.KS":[{master:"강방천",shortName:"강방천",emoji:"🔭",year:1998,dateLabel:"1990년대 후반",label:"한진택배 성공 사례 회고",kind:"period"}],
  "005935.KS":[{master:"강방천",shortName:"강방천",emoji:"🔭",year:1998,dateLabel:"1990년대 후반",label:"삼성전자우 성공 사례 회고",kind:"period"}],
  "035720.KS":[{master:"강방천",shortName:"강방천",emoji:"🔭",year:2021,dateLabel:"2021-06",label:"좋은 기업으로 공개 언급",kind:"period"}],
  "012330.KS":[{master:"강방천",shortName:"강방천",emoji:"🔭",year:2021,dateLabel:"2021-06",label:"투자 유망 기업 언급",kind:"period"}],
  "005300.KS":[{master:"이채원",shortName:"이채원",emoji:"🧮",year:1998,dateLabel:"1998~1999",label:"롯데칠성 매수·비중 확대",kind:"period"}],
  "004370.KS":[{master:"이채원",shortName:"이채원",emoji:"🧮",year:2004,dateLabel:"2000년대 초",label:"장기 가치주 성과 사례",kind:"period"}],
  "004170.KS":[{master:"이채원",shortName:"이채원",emoji:"🧮",year:2002,dateLabel:"2001~2002",label:"가치주 보유 사례",kind:"period"}]`);

if(!source.includes('const [masterRegion,setMasterRegion]=useState("global");')){
  const a=source.includes('  const [showAllMasterCases,setShowAllMasterCases]=useState(false);')?'  const [showAllMasterCases,setShowAllMasterCases]=useState(false);':'  const [masterApplied,setMasterApplied]=useState("");';
  if(!source.includes(a))throw new Error('master region state anchor not found');
  source=source.replace(a,a+'\n  const [masterRegion,setMasterRegion]=useState("global");');
  console.log('Master region state applied.');
}

if(!source.includes('function formatMasterCasePrice(')){
  const a='function formatUSD(v){return`$${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}';
  if(!source.includes(a))throw new Error('formatUSD anchor not found');
  source=source.replace(a,a+'\nfunction formatMasterCasePrice(ticker,v){if(v===null||v===undefined)return"-";return /\\.(KS|KQ)$/.test(ticker)?formatKRW(v):formatUSD(v);}');
  console.log('Master KRW price formatter applied.');
}

source=source.replace('{Object.entries(MASTER_PROFILES).map(([id,m])=>{','{Object.entries(MASTER_PROFILES).filter(([,m])=>(m.region||"global")===masterRegion).map(([id,m])=>{');
source=source.replace('const shortName=id==="buffett"?"워런 버핏":id==="ark"?"캐시 우드":"펠로시 일가";','const shortName=m.shortName||m.name;');

const regionAnchor='<div style={{fontSize:"13px",lineHeight:1.65,color:T.textSub,margin:"-2px 0 12px"}}>공개자료에 등장한 대표 사례를 골라, 같은 조건으로 지금의 가치를 확인해보세요.</div>';
if(!source.includes('>🇰🇷 국내</button>')){
  if(!source.includes(regionAnchor))throw new Error('master region UI anchor not found');
  const lines=[
    regionAnchor,
    '            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",padding:"4px",background:T.bgDeep,border:`1px solid ${T.border}`,borderRadius:"12px",marginBottom:"10px"}}>',
    '              <button type="button" onClick={()=>{setMasterRegion("global");setSelectedMasterId("buffett");setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{padding:"9px 8px",border:`1px solid ${masterRegion==="global"?T.borderActive:"transparent"}`,borderRadius:"9px",background:masterRegion==="global"?T.presetActive:"transparent",color:masterRegion==="global"?T.accent:T.textMuted,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>🇺🇸 해외</button>',
    '              <button type="button" onClick={()=>{setMasterRegion("kr");setSelectedMasterId("parkYoungOk");setSelectedMasterCaseIndex(0);setShowAllMasterCases(false);setMasterApplied("");setMasterResult(null);setMasterResultError("");}} style={{padding:"9px 8px",border:`1px solid ${masterRegion==="kr"?T.borderActive:"transparent"}`,borderRadius:"9px",background:masterRegion==="kr"?T.presetActive:"transparent",color:masterRegion==="kr"?T.accent:T.textMuted,fontSize:"12px",fontWeight:"700",cursor:"pointer"}}>🇰🇷 국내</button>',
    '            </div>',
    '            {masterRegion==="kr"&&<div style={{fontSize:"11px",lineHeight:1.55,color:T.textMuted,background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"9px 10px",marginBottom:"10px"}}>💡 국내는 미국 13F처럼 모든 매매가 정기적으로 공개되지는 않아요. <strong style={{color:T.textSub}}>5% 공시·본인 인터뷰·펀드 운용 기록</strong>으로 확인되는 시점을 사용하며, 대표 기준연도가 정확한 체결일을 뜻하지 않는 경우는 따로 표시해요.</div>}'
  ];
  source=source.replace(regionAnchor,lines.join('\n'));
  console.log('Korean/global master region switch applied.');
}

source=source.split('formatUSD(masterPreview.buyPrice)').join('formatMasterCasePrice(selectedMasterCase.ticker,masterPreview.buyPrice)');
source=source.split('formatUSD(masterPreview.currentPrice)').join('formatMasterCasePrice(selectedMasterCase.ticker,masterPreview.currentPrice)');
source=source.split('displayPrice={formatUSD}').join('displayPrice={v=>formatMasterCasePrice(selectedMasterCase.ticker,v)}');
source=source.split('formatUSD(masterResult.buyPrice)').join('formatMasterCasePrice(selectedMasterCase.ticker,masterResult.buyPrice)');
source=source.split('formatUSD(masterResult.currentPrice)').join('formatMasterCasePrice(selectedMasterCase.ticker,masterResult.currentPrice)');
source=source.replace('<div style={{fontSize:"10px",color:T.textMuted}}>연평균 수익률 {masterResult.cagr}% · 현재 환율 변동은 단순화했어요</div>','<div style={{fontSize:"10px",color:T.textMuted}}>연평균 수익률 {masterResult.cagr}% · {/\\.(KS|KQ)$/.test(selectedMasterCase.ticker)?"국내주식 원화 기준":"현재 환율 변동은 단순화했어요"}</div>');
console.log('Domestic master price display applied.');

fs.writeFileSync(indexPath,source);
