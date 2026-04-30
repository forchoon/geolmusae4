// pages/api/search.js

const KR_STOCKS = [
  // 반도체/전자
  {name:"삼성전자",ticker:"005930.KS",sector:"반도체"},
  {name:"SK하이닉스",ticker:"000660.KS",sector:"반도체"},
  {name:"삼성전기",ticker:"009150.KS",sector:"전자부품"},
  {name:"LG이노텍",ticker:"011070.KS",sector:"전자부품"},
  {name:"DB하이텍",ticker:"000990.KS",sector:"반도체"},
  {name:"리노공업",ticker:"058470.KS",sector:"반도체"},
  {name:"원익IPS",ticker:"240810.KS",sector:"반도체"},
  {name:"HPSP",ticker:"403870.KS",sector:"반도체"},

  // 배터리/2차전지
  {name:"LG에너지솔루션",ticker:"373220.KS",sector:"배터리"},
  {name:"삼성SDI",ticker:"006400.KS",sector:"배터리"},
  {name:"LG화학",ticker:"051910.KS",sector:"화학/배터리"},
  {name:"포스코퓨처엠",ticker:"003670.KS",sector:"배터리소재"},
  {name:"에코프로",ticker:"086520.KS",sector:"배터리소재"},
  {name:"에코프로비엠",ticker:"247540.KS",sector:"배터리소재"},
  {name:"엘앤에프",ticker:"066970.KS",sector:"배터리소재"},
  {name:"코스모신소재",ticker:"005070.KS",sector:"배터리소재"},
  {name:"천보",ticker:"278280.KS",sector:"배터리소재"},
  {name:"솔브레인",ticker:"357780.KS",sector:"배터리소재"},

  // 자동차
  {name:"현대차",ticker:"005380.KS",sector:"자동차"},
  {name:"기아",ticker:"000270.KS",sector:"자동차"},
  {name:"현대모비스",ticker:"012330.KS",sector:"자동차부품"},
  {name:"현대위아",ticker:"011210.KS",sector:"자동차부품"},
  {name:"만도",ticker:"204320.KS",sector:"자동차부품"},
  {name:"HL만도",ticker:"204320.KS",sector:"자동차부품"},
  {name:"현대글로비스",ticker:"086280.KS",sector:"물류"},

  // 플랫폼/IT
  {name:"카카오",ticker:"035720.KS",sector:"플랫폼"},
  {name:"NAVER",ticker:"035420.KS",sector:"플랫폼"},
  {name:"카카오뱅크",ticker:"323410.KS",sector:"인터넷은행"},
  {name:"카카오페이",ticker:"377300.KS",sector:"핀테크"},
  {name:"크래프톤",ticker:"259960.KS",sector:"게임"},
  {name:"넥슨게임즈",ticker:"225570.KS",sector:"게임"},
  {name:"엔씨소프트",ticker:"036570.KS",sector:"게임"},
  {name:"넷마블",ticker:"251270.KS",sector:"게임"},
  {name:"펄어비스",ticker:"263750.KS",sector:"게임"},
  {name:"카카오게임즈",ticker:"293490.KS",sector:"게임"},
  {name:"더블유게임즈",ticker:"192080.KS",sector:"게임"},

  // 바이오/제약
  {name:"삼성바이오로직스",ticker:"207940.KS",sector:"바이오"},
  {name:"셀트리온",ticker:"068270.KS",sector:"바이오"},
  {name:"셀트리온헬스케어",ticker:"091990.KS",sector:"바이오"},
  {name:"유한양행",ticker:"000100.KS",sector:"제약"},
  {name:"한미약품",ticker:"128940.KS",sector:"제약"},
  {name:"동아에스티",ticker:"170900.KS",sector:"제약"},
  {name:"종근당",ticker:"185750.KS",sector:"제약"},
  {name:"대웅제약",ticker:"069620.KS",sector:"제약"},
  {name:"보령",ticker:"003850.KS",sector:"제약"},
  {name:"HK이노엔",ticker:"195940.KS",sector:"제약"},
  {name:"알테오젠",ticker:"196170.KS",sector:"바이오"},
  {name:"리가켐바이오",ticker:"141080.KS",sector:"바이오"},
  {name:"오스코텍",ticker:"039200.KS",sector:"바이오"},
  {name:"메드팩토",ticker:"235980.KS",sector:"바이오"},

  // 금융
  {name:"KB금융",ticker:"105560.KS",sector:"금융"},
  {name:"신한지주",ticker:"055550.KS",sector:"금융"},
  {name:"하나금융지주",ticker:"086790.KS",sector:"금융"},
  {name:"우리금융지주",ticker:"316140.KS",sector:"금융"},
  {name:"기업은행",ticker:"024110.KS",sector:"금융"},
  {name:"삼성생명",ticker:"032830.KS",sector:"보험"},
  {name:"삼성화재",ticker:"000810.KS",sector:"보험"},
  {name:"메리츠금융지주",ticker:"138040.KS",sector:"금융"},
  {name:"미래에셋증권",ticker:"006800.KS",sector:"증권"},
  {name:"한국금융지주",ticker:"071050.KS",sector:"증권"},
  {name:"키움증권",ticker:"039490.KS",sector:"증권"},

  // 철강/소재
  {name:"POSCO홀딩스",ticker:"005490.KS",sector:"철강"},
  {name:"현대제철",ticker:"004020.KS",sector:"철강"},
  {name:"고려아연",ticker:"010130.KS",sector:"비철금속"},
  {name:"영풍",ticker:"000670.KS",sector:"비철금속"},

  // 에너지/화학
  {name:"SK이노베이션",ticker:"096770.KS",sector:"에너지"},
  {name:"S-Oil",ticker:"010950.KS",sector:"에너지"},
  {name:"한화솔루션",ticker:"009830.KS",sector:"화학"},
  {name:"롯데케미칼",ticker:"011170.KS",sector:"화학"},
  {name:"금호석유",ticker:"011780.KS",sector:"화학"},
  {name:"OCI홀딩스",ticker:"010060.KS",sector:"화학"},

  // 건설/부동산
  {name:"현대건설",ticker:"000720.KS",sector:"건설"},
  {name:"GS건설",ticker:"006360.KS",sector:"건설"},
  {name:"대우건설",ticker:"047040.KS",sector:"건설"},
  {name:"DL이앤씨",ticker:"375500.KS",sector:"건설"},
  {name:"HDC현대산업개발",ticker:"294870.KS",sector:"건설"},

  // 유통/소비
  {name:"이마트",ticker:"139480.KS",sector:"유통"},
  {name:"롯데쇼핑",ticker:"023530.KS",sector:"유통"},
  {name:"현대백화점",ticker:"069960.KS",sector:"유통"},
  {name:"BGF리테일",ticker:"282330.KS",sector:"유통"},
  {name:"GS리테일",ticker:"007070.KS",sector:"유통"},
  {name:"CJ제일제당",ticker:"097950.KS",sector:"식품"},
  {name:"오리온",ticker:"271560.KS",sector:"식품"},
  {name:"농심",ticker:"004370.KS",sector:"식품"},
  {name:"하이트진로",ticker:"000080.KS",sector:"식음료"},
  {name:"롯데칠성",ticker:"005300.KS",sector:"식음료"},
  {name:"삼양식품",ticker:"003230.KS",sector:"식품"},
  {name:"빙그레",ticker:"005180.KS",sector:"식품"},

  // 통신
  {name:"SK텔레콤",ticker:"017670.KS",sector:"통신"},
  {name:"KT",ticker:"030200.KS",sector:"통신"},
  {name:"LG유플러스",ticker:"032640.KS",sector:"통신"},

  // 엔터/미디어
  {name:"하이브",ticker:"352820.KS",sector:"엔터"},
  {name:"SM엔터테인먼트",ticker:"041510.KS",sector:"엔터"},
  {name:"JYP엔터테인먼트",ticker:"035900.KS",sector:"엔터"},
  {name:"YG엔터테인먼트",ticker:"122870.KS",sector:"엔터"},
  {name:"CJ ENM",ticker:"035760.KS",sector:"미디어"},
  {name:"스튜디오드래곤",ticker:"253450.KS",sector:"미디어"},
  {name:"콘텐트리중앙",ticker:"036420.KS",sector:"미디어"},

  // 항공/운송
  {name:"대한항공",ticker:"003490.KS",sector:"항공"},
  {name:"아시아나항공",ticker:"020560.KS",sector:"항공"},
  {name:"제주항공",ticker:"089590.KS",sector:"항공"},
  {name:"HMM",ticker:"011200.KS",sector:"해운"},
  {name:"팬오션",ticker:"028670.KS",sector:"해운"},

  // 방산
  {name:"한화에어로스페이스",ticker:"012450.KS",sector:"방산"},
  {name:"LIG넥스원",ticker:"079550.KS",sector:"방산"},
  {name:"현대로템",ticker:"064350.KS",sector:"방산"},
  {name:"한국항공우주",ticker:"047810.KS",sector:"방산"},

  // 반도체 장비/소재
  {name:"이오테크닉스",ticker:"039030.KS",sector:"반도체장비"},
  {name:"피에스케이",ticker:"319660.KS",sector:"반도체장비"},
  {name:"주성엔지니어링",ticker:"036930.KS",sector:"반도체장비"},
  {name:"한미반도체",ticker:"042700.KS",sector:"반도체장비"},
  {name:"동진쎄미켐",ticker:"005290.KS",sector:"반도체소재"},
  {name:"SK머티리얼즈",ticker:"036490.KS",sector:"반도체소재"},
  {name:"레이크머티리얼즈",ticker:"281740.KS",sector:"반도체소재"},

  // 디스플레이
  {name:"LG디스플레이",ticker:"034220.KS",sector:"디스플레이"},
  {name:"덕산네오룩스",ticker:"213420.KS",sector:"디스플레이"},
  {name:"천보",ticker:"278280.KS",sector:"디스플레이"},

  // 헬스케어/의료기기
  {name:"오스템임플란트",ticker:"048260.KS",sector:"의료기기"},
  {name:"레이",ticker:"228670.KS",sector:"의료기기"},
  {name:"뷰노",ticker:"338220.KS",sector:"의료AI"},
  {name:"루닛",ticker:"328130.KS",sector:"의료AI"},

  // 화장품/뷰티
  {name:"아모레퍼시픽",ticker:"090430.KS",sector:"뷰티"},
  {name:"LG생활건강",ticker:"051900.KS",sector:"뷰티"},
  {name:"코스맥스",ticker:"044820.KS",sector:"뷰티"},
  {name:"한국콜마",ticker:"161890.KS",sector:"뷰티"},
  {name:"클리오",ticker:"237880.KS",sector:"뷰티"},

  // 로봇/AI
  {name:"레인보우로보틱스",ticker:"277810.KS",sector:"로봇"},
  {name:"두산로보틱스",ticker:"454910.KS",sector:"로봇"},
  {name:"HD현대",ticker:"267250.KS",sector:"중공업"},
  {name:"두산에너빌리티",ticker:"034020.KS",sector:"에너지"},
  {name:"두산퓨얼셀",ticker:"336260.KS",sector:"수소"},

  // 리츠/인프라
  {name:"맥쿼리인프라",ticker:"088980.KS",sector:"인프라"},

  // 기타 대형주
  {name:"SK",ticker:"034730.KS",sector:"지주"},
  {name:"LG",ticker:"003550.KS",sector:"지주"},
  {name:"롯데지주",ticker:"004990.KS",sector:"지주"},
  {name:"GS",ticker:"078930.KS",sector:"지주"},
  {name:"한화",ticker:"000880.KS",sector:"지주"},
  {name:"CJ",ticker:"001040.KS",sector:"지주"},
  {name:"LS",ticker:"006260.KS",sector:"지주"},
  {name:"효성",ticker:"004800.KS",sector:"지주"},
  {name:"두산",ticker:"000150.KS",sector:"지주"},
  {name:"코오롱",ticker:"002020.KS",sector:"지주"},

  // 코스닥 주요 종목
  {name:"셀트리온제약",ticker:"068760.KQ",sector:"제약"},
  {name:"휴젤",ticker:"145020.KQ",sector:"바이오"},
  {name:"파마리서치",ticker:"214450.KQ",sector:"바이오"},
  {name:"클래시스",ticker:"214150.KQ",sector:"의료기기"},
  {name:"제이시스메디칼",ticker:"287410.KQ",sector:"의료기기"},
  {name:"ISC",ticker:"095340.KQ",sector:"반도체"},
  {name:"이수페타시스",ticker:"007660.KQ",sector:"PCB"},
  {name:"심텍",ticker:"036710.KQ",sector:"PCB"},
  {name:"오픈엣지테크놀로지",ticker:"394280.KQ",sector:"반도체AI"},
  {name:"가온칩스",ticker:"399720.KQ",sector:"반도체"},
  {name:"HPSP",ticker:"403870.KQ",sector:"반도체"},
  {name:"어보브반도체",ticker:"102120.KQ",sector:"반도체"},
  {name:"솔루엠",ticker:"248070.KQ",sector:"전자"},
  {name:"파트론",ticker:"091700.KQ",sector:"전자부품"},
  {name:"비에이치",ticker:"090460.KQ",sector:"전자부품"},
  {name:"덕산테코피아",ticker:"317080.KQ",sector:"소재"},
  {name:"원바이오젠",ticker:"082850.KQ",sector:"바이오"},
  {name:"실리콘투",ticker:"257720.KQ",sector:"뷰티유통"},
  {name:"와이지엔터테인먼트",ticker:"122870.KQ",sector:"엔터"},
];

export default async function handler(req, res) {
  const { query, market } = req.body;

  if (!query || query.trim().length < 1) {
    return res.status(400).json({ error: 'Query too short' });
  }

  // 국내주식 탭이면 한글/영어 모두 로컬 검색
  if (market === 'kr') {
    const q = query.toLowerCase().trim();
    const results = KR_STOCKS.filter(stock =>
      stock.name.toLowerCase().includes(q) ||
      stock.ticker.toLowerCase().includes(q) ||
      (stock.sector && stock.sector.toLowerCase().includes(q))
    ).slice(0, 8).map(stock => ({
      ticker: stock.ticker,
      name: stock.name,
      nameKo: stock.name,
      sector: stock.sector,
      ipoYear: 2000,
    }));
    return res.json(results);
  }

  // 미국주식/코인/ETF는 야후 파이낸스 검색
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=8&newsCount=0`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    const quotes = data?.quotes || [];

    const filtered = quotes.filter(q => {
      if (market === 'coin') return q.quoteType === 'CRYPTOCURRENCY';
      if (market === 'index') return q.quoteType === 'ETF' || q.quoteType === 'INDEX' || q.quoteType === 'MUTUALFUND';
      return q.quoteType === 'EQUITY' && !q.symbol.includes('.');
    });

    const results = filtered.slice(0, 8).map(q => ({
      ticker: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      nameKo: q.shortname || q.longname || q.symbol,
      ipoYear: null,
    }));

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Search failed', details: error.message });
  }
}