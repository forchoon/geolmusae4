import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const TABS = [
  { id: "us", label: "🇺🇸 미국주식" },
  { id: "kr", label: "🇰🇷 국내주식" },
  { id: "index", label: "📊 대표지수" },
  { id: "coin", label: "₿ 코인" },
];
const US_PRESETS = [
  {ticker:"NVDA",name:"엔비디아"},{ticker:"AAPL",name:"애플"},{ticker:"TSLA",name:"테슬라"},
  {ticker:"MSFT",name:"마이크로소프트"},{ticker:"META",name:"메타"},{ticker:"NFLX",name:"넷플릭스"},
  {ticker:"AMZN",name:"아마존"},{ticker:"GOOGL",name:"구글"},
];
const KR_PRESETS = [
  {ticker:"삼성전자",name:"삼성전자"},{ticker:"SK하이닉스",name:"SK하이닉스"},{ticker:"카카오",name:"카카오"},
  {ticker:"NAVER",name:"NAVER"},{ticker:"LG화학",name:"LG화학"},{ticker:"삼성SDI",name:"삼성SDI"},
  {ticker:"삼성바이오",name:"삼성바이오"},{ticker:"현대차",name:"현대차"},
];
const INDEX_PRESETS = [
  {ticker:"SPY",name:"S&P 500",emoji:"🏆"},{ticker:"QQQ",name:"나스닥100",emoji:"💻"},
  {ticker:"DIA",name:"다우존스",emoji:"🏛️"},{ticker:"IWM",name:"러셀2000",emoji:"📈"},
  {ticker:"VTI",name:"전체 미국시장",emoji:"🌎"},{ticker:"GLD",name:"금 ETF",emoji:"🥇"},
  {ticker:"KOSPI",name:"코스피",emoji:"🇰🇷"},
];
const COIN_PRESETS = [
  {ticker:"BTC-USD",name:"비트코인",emoji:"₿"},
  {ticker:"ETH-USD",name:"이더리움",emoji:"🔷"},
  {ticker:"DOGE-USD",name:"도지코인",emoji:"🐕"},
  {ticker:"SOL-USD",name:"솔라나",emoji:"🌟"},
  {ticker:"XRP-USD",name:"리플",emoji:"💫"},
];
const TICKER_MAP = {
  "삼성전자":"005930.KS","SK하이닉스":"000660.KS","카카오":"035720.KS","NAVER":"035420.KS",
  "LG화학":"051910.KS","삼성SDI":"006400.KS","삼성바이오":"207940.KS","현대차":"005380.KS","KOSPI":"^KS11",
};
const CURRENCY_MAP = {
  "005930.KS":"KRW","000660.KS":"KRW","035720.KS":"KRW","035420.KS":"KRW",
  "051910.KS":"KRW","006400.KS":"KRW","207940.KS":"KRW","005380.KS":"KRW","^KS11":"KRW",
};
const CHART_DATA = {
  NVDA:[0.37,0.55,0.30,0.18,0.31,0.42,0.62,0.93,1.85,0.78,1.10,2.88,2.40,2.90,3.60,4.65,3.20,7.40,16.40,13.20,23.50,52.00,82.00,14.60,49.52,134.70,875.0],
  AAPL:[0.10,0.22,0.35,0.51,1.11,0.79,0.43,0.36,0.60,1.08,1.99,2.98,5.69,2.78,5.55,9.29,13.39,18.75,19.55,27.59,26.32,28.96,42.31,39.44,73.41,132.69,177.57,129.93,192.53,250.42,213.0],
  TSLA:[1.60,1.75,3.40,15.31,13.11,8.83,10.91,21.31,18.73,27.99,235.22,352.26,123.18,248.48,403.84,248.0],
  AMZN:[0.15,0.60,3.45,0.91,0.48,0.60,1.25,1.79,1.82,1.75,3.79,2.76,6.09,9.10,8.73,12.57,19.84,15.17,26.89,38.86,59.84,73.44,94.82,163.53,170.40,84.00,153.42,224.19,197.0],
  MSFT:[0.08,0.35,1.01,2.18,3.83,2.22,1.60,1.37,1.45,1.54,1.71,2.14,1.64,1.99,2.08,2.12,2.24,3.14,4.02,4.25,5.16,7.24,9.69,15.72,22.19,33.61,23.97,37.49,420.55,420.0],
  GOOGL:[1.50,3.22,2.41,3.47,1.54,3.10,5.89,6.45,7.30,11.09,13.10,13.40,15.40,19.47,18.38,22.74,35.09,48.43,23.69,33.59,190.17,172.0],
  META:[9.01,19.50,28.07,34.15,39.44,61.20,44.36,67.64,110.75,112.55,52.39,107.45,589.34,520.0],
  NFLX:[0.55,1.20,1.60,1.15,1.41,2.27,1.84,4.39,9.94,7.44,8.62,26.35,25.41,31.52,33.27,55.37,81.77,110.22,193.94,176.02,55.16,131.68,888.15,985.0],
  SPY:[26,31,49,57,68,58,50,38,50,58,62,72,79,50,65,79,76,88,115,126,127,136,165,152,196,232,302,244,299,585,520],
  QQQ:[55,35,23,15,23,27,29,33,42,24,38,49,47,60,82,95,98,103,134,128,167,258,348,249,322,514,470],
  "BTC-USD":[0.08,3,13,732,318,430,952,13800,3700,7200,28990,46200,16600,42500,93500,95000],
  "ETH-USD":[0.43,1.2,8,14,300,140,180,730,170,210,2000,4800,1200,1850,3400,1900],
  "DOGE-USD":[0.0002,0.0003,0.0002,0.0026,0.002,0.0058,0.34,0.16,0.07,0.11,0.17,0.09],
  "SOL-USD":[0.77,1.5,3.0,25,180,100,10,20,110,200,250,145],
  "XRP-USD":[0.005,0.006,0.02,0.25,0.006,0.19,0.48,0.33,0.22,0.50,2.30,0.55],
  "삼성전자":[560,450,720,920,1130,1220,1340,1650,1100,1630,1670,1870,2290,2330,2120,2430,2480,4980,3890,5550,8100,7900,6080,7380,53800,74800],
  "SK하이닉스":[2100,1800,3800,5200,4800,5200,6300,3300,7200,9800,8400,10900,14200,13500,17200,31700,24000,24800,34000,91000,43650,65600,171500,238000],
  "카카오":[3600,4300,5700,13000,47000,11900,16500,38100,42000],
  "NAVER":[7800,10200,12200,15600,24400,33000,31700,43800,52200,49000,55500,105000,259000,91000,116000,187500,195000],
  "현대차":[28000,35000,42000,52000,63000,79000,74000,58000,60000,44000,41000,38000,45000,74000,55000,89000,179500,195000],
  "LG화학":[15000,18000,22000,28000,35000,42000,55000,78000,95000,110000,320000,280000,420000,580000,360000,420000],
  "삼성SDI":[12000,15000,18000,25000,32000,45000,62000,88000,120000,150000,680000,580000,750000,420000,390000],
  "삼성바이오":[80000,120000,180000,250000,320000,380000,420000,780000,850000,680000,920000,780000],
  KOSPI:[504,693,628,810,895,1379,1434,1897,1124,1683,2051,1826,1997,2011,1915,1961,2026,2467,2041,2197,2873,2977,2236,2655,2399,2650],
};
const IPO_YEAR = {
  NVDA:1999,AAPL:1980,TSLA:2010,AMZN:1997,MSFT:1986,GOOGL:2004,META:2012,NFLX:2002,
  "005930.KS":2000,"000660.KS":2001,"035720.KS":2017,"035420.KS":2009,
  "051910.KS":2001,"006400.KS":2001,"207940.KS":2016,"005380.KS":2000,"^KS11":2000,
  SPY:1993,QQQ:1999,DIA:1998,IWM:2000,VTI:2001,GLD:2004,
  "BTC-USD":2010,"ETH-USD":2015,"DOGE-USD":2015,"SOL-USD":2020,"XRP-USD":2014,
  "삼성전자":2000,"SK하이닉스":2001,"카카오":2017,"NAVER":2009,
  "현대차":2000,"LG화학":2001,"삼성SDI":2001,"삼성바이오":2016,"KOSPI":2000,
};
const CURRENT_YEAR = new Date().getFullYear();
const IPO_PRICE = {
  NVDA:12,AAPL:0.10,TSLA:17,AMZN:18,MSFT:0.08,GOOGL:85,META:38,NFLX:15,
  SPY:43,QQQ:54,DIA:78,IWM:42,VTI:60,GLD:44,
  "BTC-USD":0.08,"ETH-USD":0.43,"DOGE-USD":0.0002,"SOL-USD":0.77,"XRP-USD":0.005,
  "005930.KS":560,"000660.KS":2100,"035720.KS":3600,"035420.KS":7800,
  "051910.KS":15000,"006400.KS":12000,"207940.KS":80000,"005380.KS":28000,
};
const SECTOR_MAP = {
  NVDA:"반도체",AAPL:"빅테크",TSLA:"전기차",AMZN:"빅테크",MSFT:"빅테크",GOOGL:"빅테크",META:"소셜미디어",NFLX:"스트리밍",
  SPY:"ETF · S&P500",QQQ:"ETF · 나스닥",DIA:"ETF · 다우",IWM:"ETF · 소형주",VTI:"ETF · 전체시장",GLD:"ETF · 금",
  "BTC-USD":"암호화폐","ETH-USD":"암호화폐","DOGE-USD":"밈코인","SOL-USD":"암호화폐","XRP-USD":"암호화폐",
  "005930.KS":"반도체","000660.KS":"반도체","035720.KS":"플랫폼","035420.KS":"플랫폼",
  "051910.KS":"화학·배터리","006400.KS":"배터리","207940.KS":"바이오","005380.KS":"자동차",
};
function getIpoPrice(yt){return IPO_PRICE[yt]||null;}
function getSector(yt){return SECTOR_MAP[yt]||null;}
function getYahooTicker(t){return TICKER_MAP[t]||t;}
function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}
function getIpoYear(yt){return IPO_YEAR[yt]||2000;}
function getChartData(t){return CHART_DATA[t]||null;}
function getTodayMMDD(){const n=new Date();return `${String(n.getMonth()+1).padStart(2,"0")}/${String(n.getDate()).padStart(2,"0")}`;}
function getSameDayOfYear(yr){const n=new Date();return `${yr}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;}
function formatKRW(v){const a=Math.abs(v),s=v<0?"-":"";if(a>=1e8)return`${s}${(a/1e8).toFixed(1)}억원`;if(a>=1e4)return`${s}${Math.round(a/1e4)}만원`;return`${s}${Math.round(a).toLocaleString()}원`;}
function formatUSD(v){return`$${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}

async function fetchChartDataAPI(yahooTicker) {
  try {
    const res = await fetch(`/api/chart?ticker=${encodeURIComponent(yahooTicker)}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error('Chart fetch error:', error);
    return null;
  }
}

async function fetchYahooPrice(yt,dateStr){
  const d=new Date(dateStr),p1=Math.floor(d.getTime()/1000)-86400,p2=Math.floor(d.getTime()/1000)+86400*4;
  const res=await fetch(`/api/price?ticker=${encodeURIComponent(yt)}&period1=${p1}&period2=${p2}`);
  const json=await res.json();
  const closes=json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
  const ts=json?.chart?.result?.[0]?.timestamps||json?.chart?.result?.[0]?.timestamp;
  if(!closes||!ts)return null;
  const target=d.getTime()/1000;let best=null,bd=Infinity;
  for(let i=0;i<ts.length;i++){const diff=Math.abs(ts[i]-target);if(closes[i]&&diff<bd){bd=diff;best=closes[i];}}
  return best?parseFloat(best.toFixed(2)):null;
}
async function fetchCurrentPrice(yt){
  const res=await fetch(`/api/price?ticker=${encodeURIComponent(yt)}&range=5d`);
  const json=await res.json();
  const closes=json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
  if(!closes)return null;
  for(let i=closes.length-1;i>=0;i--)if(closes[i])return parseFloat(closes[i].toFixed(2));
  return null;
}
async function fetchUsdToKrw(){
  const res=await fetch(`/api/price?ticker=KRW%3DX&range=5d`);
  const json=await res.json();
  const closes=json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
  if(!closes)return 1380;
  for(let i=closes.length-1;i>=0;i--)if(closes[i])return Math.round(closes[i]);
  return 1380;
}

const THEMES = {
  dark:{bg:"#06060f",bgCard:"#0f0f1e",bgDeep:"#0a0a16",bgResult:"linear-gradient(145deg,#0c1c10,#08100a)",border:"#2a2a40",borderActive:"#4ade80",text:"#eeeef8",textSub:"#b0b0c8",textMuted:"#7878a0",textFaint:"#4a4a6a",accent:"#4ade80",accentDim:"#22c55e",tabBg:"#0f0f1e",tabActive:"linear-gradient(135deg,#1a2e1f,#0f1f13)",tabInactive:"#8080a8",presetActive:"#1a2e1f",presetInactive:"#1e1e30",presetInactiveText:"#a0a0c0",inputBg:"#0f0f1e",dropdownBg:"#0f0f1e",isDark:true},
  light:{bg:"#f2f7f3",bgCard:"#ffffff",bgDeep:"#eaf3ec",bgResult:"linear-gradient(145deg,#edfaef,#f0faf2)",border:"#d8eadb",borderActive:"#16a34a",text:"#141f16",textSub:"#3d5c42",textMuted:"#5a7a5e",textFaint:"#a0c0a4",accent:"#16a34a",accentDim:"#22c55e",tabBg:"#e4eee5",tabActive:"linear-gradient(135deg,#d0ead5,#bfe0c8)",tabInactive:"#5a7a5e",presetActive:"#d0ead5",presetInactive:"#f0f7f1",presetInactiveText:"#4a6a4e",inputBg:"#ffffff",dropdownBg:"#ffffff",isDark:false},
};

function StockChart({ticker,investYear,T,displayPrice,currentPrice,chartData,buyPrice}){
  const [hoverIdx,setHoverIdx]=useState(null);
  const data = (chartData && chartData.length > 0) ? chartData : getChartData(ticker);

  if (!data || data.length === 0) {
    return (
      <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"40px 20px",textAlign:"center"}}>
        <div style={{fontSize:"13px",color:T.textMuted}}>차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  const W=480,H=150,P=10;
  const mn=Math.min(...data),mx=Math.max(...data);
  const mi=data.indexOf(mn),xi=data.indexOf(mx);
  const up=data[data.length-1]>=data[0],lc=up?"#4ade80":"#f87171";
  const xs=(W-P*2)/Math.max(data.length-1,1),yr=mx-mn||1;
  const tx=i=>P+i*xs,ty=v=>H-P-((v-mn)/yr)*(H-P*2-18);
  const lp=data.map((v,i)=>`${i===0?"M":"L"}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(" ");
  const fp=`${lp} L${tx(data.length-1).toFixed(1)},${H-P} L${tx(0).toFixed(1)},${H-P} Z`;
  const ipoYr=getIpoYear(getYahooTicker(ticker));
  const bi=Math.max(0,Math.min(data.length-1,Math.round((investYear-ipoYr)/Math.max(CURRENT_YEAR-ipoYr,1)*(data.length-1))));
  const bx=tx(bi),by=ty(data[bi]);
  const hv=hoverIdx!==null?data[hoverIdx]:null,hx=hoverIdx!==null?tx(hoverIdx):null,hy=hoverIdx!==null?ty(hv):null;
  const labelW=70;
  const mnLbX=Math.min(Math.max(tx(mi),labelW/2),W-labelW/2);
  const mxLbX=Math.min(Math.max(tx(xi),labelW/2),W-labelW/2);
  const mnBelow=ty(mn)<H-30;
  const mnLbY=mnBelow?ty(mn)+22:ty(mn)-8;
  const mxLbY=ty(mx)-14;
  const markerLabelX=bx>W-60?Math.max(bx-20,50):Math.min(Math.max(bx,50),W-50);

  return(
    <div style={{padding:"4px 0 0",marginBottom:"4px"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}
        onMouseMove={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          const x=(e.clientX-r.left)/r.width*W;
          const idx=Math.max(0,Math.min(data.length-1,Math.round((x-P)/xs)));
          setHoverIdx(idx);
        }}
        onMouseLeave={()=>setHoverIdx(null)}
      >
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lc} stopOpacity="0.18"/><stop offset="100%" stopColor={lc} stopOpacity="0"/></linearGradient></defs>
        <path d={fp} fill="url(#cg)"/>
        <path d={lp} fill="none" stroke={lc} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={tx(mi).toFixed(1)} cy={ty(mn).toFixed(1)} r="4" fill={T.bg} stroke="#f87171" strokeWidth="2"/>
        <rect x={(mnLbX-34).toFixed(1)} y={(mnLbY-13).toFixed(1)} width="68" height="16" rx="4" fill="#f8717122"/>
        <text x={mnLbX.toFixed(1)} y={mnLbY.toFixed(1)} textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="700">최저 {displayPrice(mn)}</text>
        <circle cx={tx(xi).toFixed(1)} cy={ty(mx).toFixed(1)} r="4" fill={T.bg} stroke="#fbbf24" strokeWidth="2"/>
        <rect x={(mxLbX-34).toFixed(1)} y={(mxLbY-13).toFixed(1)} width="68" height="16" rx="4" fill="#fbbf2422"/>
        <text x={mxLbX.toFixed(1)} y={mxLbY.toFixed(1)} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">최고 {displayPrice(mx)}</text>
        <circle cx={bx.toFixed(1)} cy={by.toFixed(1)} r={5} fill="#60a5fa" stroke={T.bg} strokeWidth="2"/>
        <text x={markerLabelX} y={(by-10).toFixed(1)} textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="700">
          {investYear}년 오늘 {buyPrice ? displayPrice(buyPrice) : displayPrice(data[bi])}
        </text>
        {hoverIdx!==null&&<circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="4" fill={lc} stroke={T.bg} strokeWidth="2"/>}
      </svg>
    </div>
  );
}

function CoupangBanner({isDark,T}){
  return(
    <div style={{marginBottom:"20px",borderRadius:"14px",overflow:"hidden",border:`1px solid ${T.border}`,position:"relative"}}>
      <div style={{position:"absolute",top:"9px",right:"10px",zIndex:2,fontSize:"10px",color:T.textMuted,background:T.bgCard,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${T.border}`,fontWeight:"400"}}>광고 · 쿠팡파트너스</div>
      <div style={{display:"flex",justifyContent:"center",padding:"8px 0",background:T.bgCard}}>
        <iframe src="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width=320&height=100&tsource=" width="320" height="100" frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"></iframe>
      </div>
      <div style={{padding:"5px 12px",background:T.bgDeep,fontSize:"10px",color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
    </div>
  );
}

function CountUp({target,duration=1400}){
  const [d,setD]=useState(0);const st=useRef(null);const raf=useRef(null);
  useEffect(()=>{st.current=null;if(raf.current)cancelAnimationFrame(raf.current);const a=ts=>{if(!st.current)st.current=ts;const p=Math.min((ts-st.current)/duration,1);setD(target*(1-Math.pow(1-p,4)));if(p<1)raf.current=requestAnimationFrame(a);};raf.current=requestAnimationFrame(a);return()=>cancelAnimationFrame(raf.current);},[target]);
  return<span>{formatKRW(d)}</span>;
}

function ShareCard({result,stockName,investYear,investAmount,onClose,isDark,T}){
  const {isProfit,returnPct,currentValueKRW,cagr}=result;
  const [cardStyle,setCardStyle]=useState(null);
  const [saving,setSaving]=useState(false);
  const mc=isProfit?"#4ade80":"#f87171";
  const emoji=isProfit?(parseFloat(returnPct)>1000?"🦜🦜🦜":parseFloat(returnPct)>300?"🦜🦜":"🦜"):(parseFloat(returnPct)<-40?"😭":"😩");

  const handleSaveImage=async()=>{
    setSaving(true);
    try{
      if(!window.html2canvas){
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload=res;s.onerror=rej;
          document.head.appendChild(s);
        });
      }
      const el=document.getElementById("share-card-inner");
      const canvas=await window.html2canvas(el,{backgroundColor:null,scale:3,useCORS:true,logging:false});
      const link=document.createElement("a");
      link.download=`껄무새_${stockName}_${investYear}.png`;
      link.href=canvas.toDataURL("image/png");
      link.click();
    }catch(e){
      alert("이미지 저장에 실패했어요 🦜");
    }
    setSaving(false);
  };

  const styles=[
    {id:"receipt",label:"🧾 영수증",desc:"레트로 감성"},
    {id:"poster",label:"🎬 포스터",desc:"인스타 피드"},
    {id:"news",label:"📺 속보",desc:"바이럴 최강"},
  ];

  const renderCard=()=>{
    if(cardStyle==="receipt") return(
      <div id="share-card-inner" style={{width:"320px",background:"#f5f0e8",borderRadius:"4px",padding:"32px 24px",textAlign:"center",fontFamily:"'Courier New',monospace",color:"#1a1a1a",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
        <div style={{fontSize:"11px",letterSpacing:"4px",marginBottom:"8px",opacity:0.5}}>STOCKPARROT.KR</div>
        <div style={{borderTop:"2px dashed #1a1a1a",borderBottom:"2px dashed #1a1a1a",padding:"12px 0",margin:"12px 0"}}>
          <div style={{fontSize:"18px",fontWeight:"700",marginBottom:"4px"}}>{stockName}</div>
          <div style={{fontSize:"11px",opacity:0.6}}>{investYear}년 → {CURRENT_YEAR}년</div>
        </div>
        <div style={{marginBottom:"8px"}}>
          <div style={{fontSize:"11px",opacity:0.5,marginBottom:"2px"}}>투자 원금</div>
          <div style={{fontSize:"14px"}}>{formatKRW(parseInt(investAmount)*10000)}</div>
        </div>
        <div style={{marginBottom:"8px"}}>
          <div style={{fontSize:"11px",opacity:0.5,marginBottom:"2px"}}>현재 가치</div>
          <div style={{fontSize:"22px",fontWeight:"700"}}>{formatKRW(Math.round(currentValueKRW))}</div>
        </div>
        <div style={{borderTop:"2px dashed #1a1a1a",paddingTop:"12px",marginTop:"12px"}}>
          <div style={{fontSize:"32px",fontWeight:"900",color:isProfit?"#16a34a":"#dc2626"}}>{isProfit?"+":""}{returnPct}%</div>
          <div style={{fontSize:"11px",opacity:0.5,marginTop:"4px"}}>연평균 {isProfit?"+":""}{cagr}% · {emoji}</div>
        </div>
        <div style={{marginTop:"16px",fontSize:"10px",opacity:0.4,letterSpacing:"2px"}}>그때 살 껄 그랬어요 🦜</div>
      </div>
    );

    if(cardStyle==="poster") return(
      <div id="share-card-inner" style={{width:"320px",height:"400px",background:isProfit?"linear-gradient(160deg,#052e16,#14532d,#166534)":"linear-gradient(160deg,#450a0a,#7f1d1d,#991b1b)",borderRadius:"20px",padding:"36px 28px",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-60px",right:"-60px",width:"200px",height:"200px",background:"rgba(255,255,255,0.03)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:"-40px",left:"-40px",width:"160px",height:"160px",background:"rgba(255,255,255,0.03)",borderRadius:"50%"}}/>
        <div style={{fontSize:"10px",letterSpacing:"3px",color:"rgba(255,255,255,0.4)"}}>STOCKPARROT.KR</div>
        <div style={{textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{fontSize:"48px",marginBottom:"12px"}}>{emoji}</div>
          <div style={{fontSize:"15px",color:"rgba(255,255,255,0.6)",marginBottom:"8px"}}>{investYear}년에 <strong style={{color:"#fff"}}>{stockName}</strong>을 샀더라면</div>
          <div style={{fontSize:"52px",fontWeight:"800",color:"#fff",letterSpacing:"-2px",lineHeight:1}}>{isProfit?"+":""}{returnPct}%</div>
          <div style={{fontSize:"18px",color:"rgba(255,255,255,0.8)",marginTop:"8px"}}>{formatKRW(Math.round(currentValueKRW))}</div>
        </div>
        <div style={{fontSize:"11px",color:"rgba(255,255,255,0.3)",textAlign:"center"}}>연평균 {isProfit?"+":""}{cagr}% · {formatKRW(parseInt(investAmount)*10000)} 투자</div>
      </div>
    );

    if(cardStyle==="news") return(
      <div id="share-card-inner" style={{width:"320px",background:"#fff",borderRadius:"8px",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
        <div style={{background:"#dc2626",padding:"10px 16px",display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{background:"#fff",color:"#dc2626",fontSize:"10px",fontWeight:"900",padding:"2px 6px",borderRadius:"2px"}}>BREAKING</span>
          <span style={{color:"#fff",fontSize:"11px",fontWeight:"600",letterSpacing:"1px"}}>껄무새 속보</span>
        </div>
        <div style={{padding:"20px 16px",background:"#fff",color:"#1a1a1a"}}>
          <div style={{fontSize:"18px",fontWeight:"800",lineHeight:"1.4",marginBottom:"14px",color:"#1a1a1a"}}>
            {stockName} {investYear}년 매수자<br/>충격 근황 포착 🦜
          </div>
          <div style={{borderTop:"3px solid #1a1a1a",borderBottom:"1px solid #e5e7eb",padding:"12px 0",margin:"12px 0",textAlign:"center"}}>
            <div style={{fontSize:"44px",fontWeight:"900",color:isProfit?"#16a34a":"#dc2626",letterSpacing:"-2px"}}>{isProfit?"+":""}{returnPct}%</div>
            <div style={{fontSize:"16px",fontWeight:"700",color:"#1a1a1a",marginTop:"4px"}}>{formatKRW(Math.round(currentValueKRW))}</div>
          </div>
          <div style={{fontSize:"12px",color:"#6b7280"}}>
            {formatKRW(parseInt(investAmount)*10000)} 투자 · 연평균 {isProfit?"+":""}{cagr}%
          </div>
        </div>
        <div style={{background:"#f9fafb",padding:"8px 16px",fontSize:"10px",color:"#9ca3af",textAlign:"center"}}>stockparrot.kr · 그때 살 껄 그랬어요</div>
      </div>
    );
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(16px)",overflowY:"auto"}}>
      {!cardStyle ? (
        <>
          <div style={{fontSize:"16px",fontWeight:"600",color:"#fff",marginBottom:"6px"}}>스타일 선택</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",marginBottom:"24px"}}>마음에 드는 카드 스타일을 골라보세요</div>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center",marginBottom:"20px"}}>
            {styles.map(s=>(
              <button key={s.id} onClick={()=>setCardStyle(s.id)} style={{padding:"16px 20px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"14px",cursor:"pointer",color:"#fff",textAlign:"center",minWidth:"90px",transition:"all 0.2s"}}>
                <div style={{fontSize:"24px",marginBottom:"6px"}}>{s.label.split(" ")[0]}</div>
                <div style={{fontSize:"13px",fontWeight:"600"}}>{s.label.split(" ")[1]}</div>
                <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)",marginTop:"2px"}}>{s.desc}</div>
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"13px",cursor:"pointer",padding:"6px"}}>닫기</button>
        </>
      ) : (
        <>
          <div style={{marginBottom:"16px"}}>{renderCard()}</div>
          <div style={{display:"flex",gap:"8px",marginBottom:"12px"}}>
            <button onClick={()=>setCardStyle(null)} style={{padding:"12px 16px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"12px",cursor:"pointer",color:"#fff",fontSize:"13px"}}>← 다시 선택</button>
            <button onClick={handleSaveImage} disabled={saving} style={{padding:"12px 20px",background:"linear-gradient(135deg,#22c55e,#16a34a)",border:"none",borderRadius:"12px",cursor:saving?"not-allowed":"pointer",color:"#fff",fontSize:"13px",fontWeight:"600"}}>
              {saving?"⏳ 저장 중…":"📥 이미지 저장"}
            </button>
            <button onClick={()=>{const txt=`${stockName} ${investYear}년에 샀더라면 ${isProfit?"+":""}${returnPct}%! ${emoji} | stockparrot.kr`;navigator.clipboard?.writeText(txt).then(()=>alert("복사됐어요! 🦜"));}} style={{padding:"12px 16px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"12px",cursor:"pointer",color:"#fff",fontSize:"13px"}}>🔗 복사</button>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:"13px",cursor:"pointer",padding:"6px"}}>닫기</button>
        </>
      )}
    </div>
  );
}

function RankingSection({activeTab, T, isDark, onLiveFeed}){
  const [ranking, setRanking] = useState([]);
  const [lastMsg, setLastMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const RANKING_CONFIG = {
    us: { title:"지금 이 순간 후회 중인 미국 껄무새", messages:["애플"] },
    kr: { title:"지금 이 순간 통곡 중인 국내 껄무새", messages:["삼성전자"] },
    coin: { title:"가즈아! 를 외치고 있는 코인 껄무새", messages:["비트코인"] },
    index: { title:"안전빵인 척하는 ETF 껄무새", messages:["SPY"] },
  };

  const config = RANKING_CONFIG[activeTab];
  const medals = ["🥇","🥈","🥉"];
  const medalColors = isDark
    ? ["#fbbf24","#9ca3af","#f59e0b"]
    : ["#f59e0b","#9ca3af","#d97706"];

  useEffect(()=>{
    setLoading(true);
    const fetchRanking = async () => {
      try {
        const res = await fetch(`/api/ranking?tab=${activeTab}`);
        const data = await res.json();
        setRanking(data.ranking || []);
        if (data.lastTicker) {
          setLastMsg(data.lastTicker);
          onLiveFeed && onLiveFeed(data.lastTicker);
        }
      } catch(e) {
        setRanking([]);
      }
      setLoading(false);
    };
    fetchRanking();
    const interval = setInterval(fetchRanking, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return(
    <div style={{marginBottom:"28px",marginTop:"-16px"}}>
      {/* 헤더 한줄 */}
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
        <span style={{fontSize:"14px",fontWeight:"600",color:T.text}}>🦜 껄무새 TOP 5</span>
        <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
          <span style={{width:"6px",height:"6px",background:T.accent,borderRadius:"50%",display:"inline-block",animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:"11px",fontWeight:"500",color:T.accent}}>Live</span>
        </div>
        <div style={{flex:1,height:"1px",background:T.border}}/>
      </div>

      {loading ? (
        <div style={{padding:"20px 0",color:T.textMuted,fontSize:"13px",fontWeight:"400"}}>
          🦜 껄무새들을 카운팅하는 중…
        </div>
      ) : ranking.length === 0 ? (
        <div style={{padding:"20px 0",textAlign:"center"}}>
          <div style={{fontSize:"28px",marginBottom:"6px"}}>🦜</div>
          <div style={{fontSize:"13px",color:T.textSub,fontWeight:"400",lineHeight:"1.6"}}>아직 아무도 계산하지 않았어요<br/>당신이 첫 번째 껄무새!</div>
        </div>
      ) : (
        <>
          {/* 랭킹 리스트 - 플랫 스타일 */}
          <div style={{marginBottom:"16px"}}>
            {ranking.slice(0,5).map((item,idx)=>(
              <div key={idx} style={{display:"flex",alignItems:"center",gap:"10px",padding:"4px 0",borderBottom:idx<ranking.length-1?`1px solid ${T.border}40`:"none"}}>
                <div style={{fontSize:idx<3?"14px":"12px",minWidth:"22px",textAlign:"center",fontWeight:"600",color:idx>=3?T.textMuted:medalColors[idx]}}>
                  {idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":idx===3?"4️⃣":"5️⃣"}
                </div>
                <div style={{flex:1,fontSize:"12px",fontWeight:idx<3?"600":"400",color:idx<3?T.text:T.textSub}}>{item[0]}</div>
                <div style={{fontSize:"11px",fontWeight:idx<3?"600":"400",flexShrink:0}}>
                  <span style={{color:T.accent,fontWeight:"700"}}>{item[1].toLocaleString()}마리</span>
                  <span style={{color:T.textMuted,fontWeight:"400"}}> 의 껄무새</span>
                </div>
              </div>
            ))}
          </div>

          {/* 마지막 메시지 */}
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}`}</style>
    </div>
  );
}

export default function Home(){
  const [isDark,setIsDark]=useState(true);
  useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");setIsDark(mq.matches);const h=e=>setIsDark(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);

  const [activeTab,setActiveTab]=useState("us");
  const [selectedStock,setSelectedStock]=useState({ticker:"NVDA",yahooTicker:"NVDA",name:"엔비디아"});
  const [investAmount,setInvestAmount]=useState("1000");
  const [investYear,setInvestYear]=useState(2012);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [animKey,setAnimKey]=useState(0);
  const [showShareCard,setShowShareCard]=useState(false);
  const [compareStock,setCompareStock]=useState(null);
  const [compareResult,setCompareResult]=useState(null);
  const [searchQuery,setSearchQuery]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [searching,setSearching]=useState(false);
  const [showDropdown,setShowDropdown]=useState(false);
  const [showKRW,setShowKRW]=useState(false);
  const [usdToKrw,setUsdToKrw]=useState(1380);
  const [rateLoading,setRateLoading]=useState(false);
  const [buyPrice,setBuyPrice]=useState(null);
  const [currentPrice,setCurrentPrice]=useState(null);
  const [currency,setCurrency]=useState("USD");
  const [priceLoading,setPriceLoading]=useState(false);
  const [priceError,setPriceError]=useState(null);
  const [chartData,setChartData]=useState(null);
  const [chartLoading,setChartLoading]=useState(false);
  const [liveFeedMsg,setLiveFeedMsg]=useState("");
  const [liveFeedTime,setLiveFeedTime]=useState("");
  const [liveFeedIdx,setLiveFeedIdx]=useState(0);
  const [liveFeedVisible,setLiveFeedVisible]=useState(true);
  const [recentFeed,setRecentFeed]=useState([]);

  const FEED_TEMPLATES = [
    (t) => `🦜 방금 누군가 '${t}' 껄무새 중`,
    (t) => `😭 '${t}' 후회 중인 껄무새 발견`,
    (t) => `💸 '${t}' 그때 살 껄...`,
    (t) => `🔥 '${t}' 껄무새 발생`,
    (t) => `😤 '${t}' 왜 안 샀지...`,
    (t) => `🤦 '${t}' 살 껄 그랬어`,
    (t) => `📈 '${t}' 지금이라도 살까...`,
    (t) => `😱 '${t}' 수익률 보고 충격`,
  ];

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff/60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff/3600)}시간 전`;
    return `${Math.floor(diff/86400)}일 전`;
  };

  useEffect(()=>{
    if(!recentFeed.length) return;
    const interval = setInterval(()=>{
      setLiveFeedVisible(false);
      setTimeout(()=>{
        setLiveFeedIdx(i=>(i+1)%recentFeed.length);
        setLiveFeedVisible(true);
      }, 400);
    }, 5000);
    return ()=>clearInterval(interval);
  },[recentFeed]);

  // 전체 탭 실시간 피드
  useEffect(()=>{
    const fetchLiveFeed = async () => {
      try {
        const res = await fetch('/api/ranking?tab=all');
        const data = await res.json();
        if (data.lastTicker) setLiveFeedMsg(data.lastTicker);
        if (data.lastTimestamp) setLiveFeedTime(getTimeAgo(data.lastTimestamp));
        if (data.recentFeed) setRecentFeed(data.recentFeed);
      } catch(e) {}
    };
    fetchLiveFeed();
    const interval = setInterval(fetchLiveFeed, 30000);
    return () => clearInterval(interval);
  }, []);
  const searchTimeout=useRef(null);
  const priceTimeout=useRef(null);

  const T=isDark?THEMES.dark:THEMES.light;
  const isUSD=currency==="USD";
  const firstYear=getIpoYear(selectedStock.yahooTicker);
  const lastYear=CURRENT_YEAR;
  const displayPrice=val=>{if(!val&&val!==0)return"-";if(!isUSD)return formatKRW(val);if(showKRW)return`${formatKRW(Math.round(val*usdToKrw))} (${formatUSD(val)})`;return formatUSD(val);};

  const calcShares=()=>{
    if(!buyPrice||!investAmount)return null;
    const investKRW=parseFloat(investAmount)*10000;
    const investInUnit=isUSD?investKRW/usdToKrw:investKRW;
    return Math.floor(investInUnit/buyPrice);
  };
  const shares=calcShares();

  // 차트 데이터 로딩
  useEffect(() => {
    if (!selectedStock.yahooTicker) return;
    const loadChartData = async () => {
      setChartLoading(true);
      const data = await fetchChartDataAPI(selectedStock.yahooTicker);
      if (data && data.length > 0) {
        setChartData(data);
      } else {
        const fallback = getChartData(selectedStock.ticker);
        setChartData(fallback); // null이면 차트 없음 표시
      }
      setChartLoading(false);
    };
    loadChartData();
  }, [selectedStock.yahooTicker]);

  useEffect(()=>{
    if(!selectedStock.yahooTicker)return;
    setBuyPrice(null);setPriceError(null);
    if(priceTimeout.current)clearTimeout(priceTimeout.current);
    priceTimeout.current=setTimeout(async()=>{
      setPriceLoading(true);setRateLoading(true);
      try{
        const dateStr=getSameDayOfYear(investYear);
        const[bp,cp,rate]=await Promise.all([fetchYahooPrice(selectedStock.yahooTicker,dateStr),fetchCurrentPrice(selectedStock.yahooTicker),fetchUsdToKrw()]);
        setBuyPrice(bp);setCurrentPrice(cp);setUsdToKrw(rate);setCurrency(getCurrency(selectedStock.yahooTicker));
        if(!bp)setPriceError(`${investYear}년 거래 데이터가 없어요`);
      }catch{
        setBuyPrice(null);setCurrentPrice(null);
        setCurrency(getCurrency(selectedStock.yahooTicker));
        setPriceError("⚠️ 시세 조회에 실패했어요. 잠시 후 다시 시도해주세요");
      }
      setPriceLoading(false);setRateLoading(false);
    },600);
  },[selectedStock.yahooTicker,investYear]);

  useEffect(()=>{
    setResult(null);setSearchQuery("");
    const map={us:US_PRESETS[0],kr:KR_PRESETS[0],index:INDEX_PRESETS[0],coin:COIN_PRESETS[0]};
    const s=map[activeTab];const yt=getYahooTicker(s.ticker);
    setSelectedStock({ticker:s.ticker,yahooTicker:yt,name:s.name});
    setCurrency(getCurrency(yt));setInvestYear(Math.floor((getIpoYear(yt)+lastYear)/2));
  },[activeTab]);

  useEffect(()=>{
    if(!searchQuery.trim()){setSearchResults([]);setShowDropdown(false);return;}
    if(searchTimeout.current)clearTimeout(searchTimeout.current);
    searchTimeout.current=setTimeout(async()=>{
      setSearching(true);
      try{const res=await fetch("/api/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:searchQuery,market:activeTab})});const data=await res.json();setSearchResults(Array.isArray(data)?data:[]);setShowDropdown(true);}
      catch{setSearchResults([]);}
      setSearching(false);
    },700);
  },[searchQuery,activeTab]);

  useEffect(()=>{
    if(!compareStock||!result)return;
    setCompareResult(null);
    const yt=getYahooTicker(compareStock.ticker);
    const calcCompare=async()=>{
      try{
        const dateStr=getSameDayOfYear(investYear);
        const[bp,cp]=await Promise.all([fetchYahooPrice(yt,dateStr),fetchCurrentPrice(yt)]);
        if(!bp||!cp)throw new Error("no data");
        const pr=cp/bp,investKRW=parseFloat(investAmount)*10000;
        const isUSDc=getCurrency(yt)==="USD";
        const curVal=isUSDc?(investKRW/usdToKrw)*pr*usdToKrw:investKRW*pr;
        const returnPct=((pr-1)*100).toFixed(1);
        const exactYears=(new Date()-new Date(dateStr))/(1000*60*60*24*365.25);
        const cagr=((Math.pow(pr,1/Math.max(exactYears,0.1))-1)*100).toFixed(1);
        setCompareResult({buyPrice:bp,currentPrice:cp,investKRW,currentValueKRW:curVal,profitKRW:curVal-investKRW,returnPct,cagr,isProfit:curVal>=investKRW});
      }catch{
        const fb=getChartData(compareStock.ticker);
        const ipoYr=getIpoYear(yt);
        const idx=Math.round((investYear-ipoYr)/Math.max(CURRENT_YEAR-ipoYr,1)*(fb.length-1));
        const bp=fb[Math.max(0,Math.min(fb.length-1,idx))];
        const cp=fb[fb.length-1];
        const pr=cp/bp,investKRW=parseFloat(investAmount)*10000;
        const curVal=investKRW*pr;
        const returnPct=((pr-1)*100).toFixed(1);
        const exactYears=(new Date()-new Date(getSameDayOfYear(investYear)))/(1000*60*60*24*365.25);
        const cagr=((Math.pow(pr,1/Math.max(exactYears,0.1))-1)*100).toFixed(1);
        setCompareResult({buyPrice:bp,currentPrice:cp,investKRW,currentValueKRW:curVal,profitKRW:curVal-investKRW,returnPct,cagr,isProfit:curVal>=investKRW});
      }
    };
    calcCompare();
  },[compareStock]);

  const handleSelectPreset=s=>{const yt=getYahooTicker(s.ticker);setSelectedStock({ticker:s.ticker,yahooTicker:yt,name:s.name});setCurrency(getCurrency(yt));setResult(null);setInvestYear(Math.floor((getIpoYear(yt)+lastYear)/2));};
  const handleSelectSearch=stock=>{setSearchQuery("");setSearchResults([]);setShowDropdown(false);setResult(null);const yt=stock.ticker;setSelectedStock({ticker:yt,yahooTicker:yt,name:stock.nameKo||stock.name});setCurrency(getCurrency(yt));const ipoYear=stock.ipoYear||getIpoYear(yt)||2000;IPO_YEAR[yt]=ipoYear;setInvestYear(Math.floor((ipoYear+lastYear)/2));};

  const handleCalculate=async()=>{
    if(!buyPrice||!currentPrice)return;setLoading(true);setResult(null);
    const pr=currentPrice/buyPrice,investKRW=parseFloat(investAmount)*10000;
    const curVal=isUSD?(investKRW/usdToKrw)*pr*usdToKrw:investKRW*pr;
    const profitKRW=curVal-investKRW,returnPct=((pr-1)*100).toFixed(1);
    const isProfit = profitKRW >= 0;

    if (isProfit) {
      if (window.confetti) {
        window.confetti({particleCount:150,spread:70,origin:{y:0.6},colors:[T.accent,'#fbbf24','#ffffff']});
      }
      if (navigator.vibrate) navigator.vibrate([50,30,50]);
    } else {
      if (navigator.vibrate) navigator.vibrate(200);
    }

    // 랭킹 데이터 전송 (조용히)
    fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker: selectedStock.name || selectedStock.ticker, tabType: activeTab })
    }).catch(() => {});

    const exactYears=(new Date()-new Date(getSameDayOfYear(investYear)))/(1000*60*60*24*365.25);
    const cagr=((Math.pow(pr,1/Math.max(exactYears,0.1))-1)*100).toFixed(1);
    const investInUnit=isUSD?investKRW/usdToKrw:investKRW;
    const sharesCount=Math.floor(investInUnit/buyPrice);
    setResult({buyPrice,currentPrice,investKRW,currentValueKRW:curVal,profitKRW,returnPct,cagr,years:Math.floor(exactYears),isProfit:profitKRW>=0,buyDateStr:getSameDayOfYear(investYear),sharesCount});

    // 랜덤 비교 종목 자동 선택
    const comparePool = [...US_PRESETS,...KR_PRESETS,...INDEX_PRESETS.slice(0,2),...COIN_PRESETS.slice(0,2)].filter(s=>s.ticker!==selectedStock.ticker);
    const randomCompare = comparePool[Math.floor(Math.random()*comparePool.length)];
    setCompareStock(randomCompare);
    setAnimKey(k=>k+1);setLoading(false);
    setTimeout(()=>{document.getElementById("result-section")?.scrollIntoView({behavior:"smooth",block:"start"});},100);
  };

  const amountOptions=["1","10","100","500","1000","3000","5000","10000"];
  const currentPresets=activeTab==="us"?US_PRESETS:activeTab==="kr"?KR_PRESETS:activeTab==="coin"?COIN_PRESETS:INDEX_PRESETS;
  const sec={marginBottom:"52px",paddingTop:"16px"};
  const snStyle={fontSize:"12px",fontWeight:"500",color:T.textMuted,letterSpacing:"1px",flexShrink:0};
  const witMsgs=result?result.isProfit?[
    "그때 샀으면 지금쯤 람보르기니였는데 🚗",
    "부모님한테 용돈 드릴 수 있었는데... 🥲",
    "그때 친구가 사라고 했는데 내가 말렸지 🤦",
    "전재산 넣을 껄 그랬어 🦜",
    "지금이라도 사야하나... 🤔",
    "분할매수라도 할 껄 그랬어 📈",
    "그냥 눈 감고 샀어야 했는데 😤",
    "코인 대신 이거 살 껄 그랬어 😭",
    "그때 왜 팔았지... 나야 나 🦜",
    "월급 모을 시간에 그냥 살 껄 💸",
  ]:[
    "그냥 예금 넣을 껄 그랬어 🏦",
    "손절이 답이었습니다 ✂️",
    "이럴 줄 알았으면 공매도 할 껄 😅",
    "적금 이자가 더 나았겠다 🥲",
    "현금이 왕이었습니다 👑",
    "분산투자를 했어야 했는데... 📊",
    "친구 말 들을 껄 그랬어 😤",
    "버핏도 안 산 데는 이유가 있었구나 🦜",
  ]:[];

  return(
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
        <title>껄무새 - 그때 살걸! 그때 팔걸!</title>
        <meta name="description" content="그때 그 주식을 샀더라면 지금 얼마일까? 주식 수익률 시뮬레이터"/>
        <meta property="og:title" content="껄무새 - 그때 살걸! 그때 팔걸!"/>
        <meta property="og:description" content="그때 그 주식을 샀더라면 지금 얼마일까?"/>
        <meta property="og:image" content="https://i.ibb.co/QFrhDykb/og-image.png"/>
        <meta property="og:url" content="https://stockparrot.kr"/>
        <meta property="og:type" content="website"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦜</text></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="껄무새"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,overflowX:"hidden",transition:"background 0.3s,color 0.3s",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>

        {showShareCard&&result&&<ShareCard result={result} stockName={selectedStock.name} investYear={investYear} investAmount={investAmount} onClose={()=>setShowShareCard(false)} isDark={isDark} T={T}/>}

        <div style={{padding:"36px 20px 16px",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setIsDark(d=>!d)} style={{position:"absolute",top:"18px",right:"18px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"20px",padding:"7px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",color:T.textSub,fontSize:"13px",fontWeight:"400",zIndex:10}}>
            <span>{isDark?"☀️":"🌙"}</span><span>{isDark?"라이트":"다크"}</span>
          </button>
          <div style={{fontSize:"36px",marginBottom:"4px"}}>🦜</div>
          <h1 style={{fontSize:"32px",fontWeight:"600",margin:0,letterSpacing:"-1px",color:T.accent}}>껄무새</h1>
          <p style={{fontSize:"13px",color:T.accent,margin:"6px 0 2px",fontWeight:"500"}}>그때 살걸!!! 그때 팔걸!!! 껄껄껄 🦜</p>
        </div>

        <div style={{maxWidth:"600px",margin:"0 auto 8px",padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 16px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",minHeight:"44px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"5px",flexShrink:0}}>
              <div style={{position:"relative",width:"8px",height:"8px",flexShrink:0}}>
                <span style={{position:"absolute",inset:0,background:T.accent,borderRadius:"50%",animation:"liveRing 2s ease-out infinite",opacity:0}}/>
                <span style={{position:"absolute",inset:"1px",background:T.accent,borderRadius:"50%"}}/>
              </div>
              <span style={{fontSize:"11px",fontWeight:"600",color:T.accent}}>Live</span>
            </div>
            <div style={{width:"1px",height:"14px",background:T.border,flexShrink:0}}/>
            <span style={{
              fontSize:"13px",
              color:T.textSub,
              fontWeight:"400",
              overflow:"hidden",
              textOverflow:"ellipsis",
              whiteSpace:"nowrap",
              opacity:liveFeedVisible?1:0,
              transition:"opacity 0.4s ease"
            }}>
              {recentFeed.length > 0 ? (()=>{
                const item = recentFeed[liveFeedIdx % recentFeed.length];
                const template = FEED_TEMPLATES[(liveFeedIdx + recentFeed.indexOf(item)) % FEED_TEMPLATES.length];
                const timeAgo = getTimeAgo(item.timestamp);
                return <span>
                  <strong style={{color:T.text,fontWeight:"600"}}>{template(item.ticker)}</strong>
                  {timeAgo && <span style={{color:T.textMuted,fontWeight:"400"}}> · {timeAgo}</span>}
                </span>;
              })() : <span>🦜 껄무새들의 실시간 후회가 모이는 곳</span>}
            </span>
          </div>
        </div>

        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>
          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <span style={snStyle}>01</span>
              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>종목 선택</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",gap:"0px",marginBottom:"16px",borderBottom:`2px solid ${T.border}`,margin:"0 -16px 16px",padding:"0 16px"}}>
              {TABS.map(tab=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,padding:"10px 4px",background:"transparent",border:"none",borderBottom:`2px solid ${activeTab===tab.id?T.accent:"transparent"}`,marginBottom:"-2px",cursor:"pointer",color:activeTab===tab.id?T.accent:T.textMuted,fontSize:"13px",fontWeight:activeTab===tab.id?"700":"400",transition:"all 0.2s"}}>{tab.label}</button>)}
            </div>
            <div style={{marginBottom:"14px",position:"relative"}}>
              <div style={{position:"relative"}}>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={activeTab==="kr"?"🇰🇷 영어로 검색하세요 (예: samsung, kakao)":activeTab==="coin"?"₿ 영어로 검색하세요 (예: bitcoin, ETH)":activeTab==="index"?"📊 티커로 검색하세요 (예: SPY, QQQ, KOSPI)":"🇺🇸 영어로 검색하세요 (예: apple, NVDA)"} style={{width:"100%",background:T.inputBg,border:`1.5px solid ${T.borderActive}60`,borderRadius:"12px",padding:"12px 46px 12px 16px",color:T.text,fontSize:"14px",fontWeight:"400",outline:"none",boxShadow:`0 0 0 3px ${T.accent}10`}}/>
                <span style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",fontSize:"16px"}}>{searching?"⏳":"🔎"}</span>
              </div>
              {showDropdown&&<>
                <div style={{position:"fixed",inset:0,zIndex:98}} onClick={()=>setShowDropdown(false)}/>
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:99,background:T.dropdownBg,border:`1px solid ${T.border}`,borderRadius:"12px",marginTop:"4px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
                  {searchResults.length===0?<div style={{padding:"14px 16px",color:T.textMuted,fontSize:"13px",fontWeight:"400"}}>검색 결과가 없어요 😢</div>
                  :searchResults.map((s,i)=><div key={s.ticker} onClick={()=>handleSelectSearch(s)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:i<searchResults.length-1?`1px solid ${T.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=T.bgDeep} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><div><span style={{color:T.accent,fontWeight:"300",fontSize:"14px",marginRight:"8px"}}>{s.nameKo||s.name}</span><span style={{color:T.textMuted,fontSize:"12px",fontWeight:"400"}}>{s.name}</span></div><span style={{color:T.textMuted,fontSize:"12px",fontWeight:"400"}}>선택 →</span></div>)}
                </div>
              </>}
            </div>
            <div style={{fontSize:"10px",color:T.textMuted,letterSpacing:"1px",marginBottom:"10px",fontWeight:"400"}}>{activeTab==="index"?"대표 지수 · ETF":activeTab==="coin"?"인기 코인":"인기 종목"}</div>
            <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"16px"}}>
              {currentPresets.map(s=><button key={s.ticker} onClick={()=>handleSelectPreset(s)} style={{padding:"6px 10px",background:selectedStock.ticker===s.ticker?T.presetActive:T.presetInactive,border:`1px solid ${selectedStock.ticker===s.ticker?T.borderActive:T.border}`,borderRadius:"8px",cursor:"pointer",color:selectedStock.ticker===s.ticker?T.accent:T.presetInactiveText,fontSize:"12px",fontWeight:"400",transition:"all 0.15s"}}>{s.emoji?`${s.emoji} `:""}{s.name}</button>)}
            </div>
            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px",marginBottom:"16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{background:T.presetActive,borderRadius:"8px",padding:"8px 11px",flexShrink:0}}><div style={{color:T.accent,fontWeight:"500",fontSize:"11px"}}>{isUSD?"USD":"KRW"}</div></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontWeight:"600",fontSize:"15px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selectedStock.name}</div>
                  <div style={{color:T.textSub,fontSize:"13px",fontWeight:"500",marginTop:"2px"}}>{priceLoading?"조회 중…":currentPrice?displayPrice(currentPrice):"-"}</div>
                </div>
                {isUSD&&(
                  <div style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
                    <span style={{fontSize:"11px",color:T.textMuted,fontWeight:"400"}}>{rateLoading?"...":usdToKrw.toLocaleString()+"원"}</span>
                    <div onClick={()=>setShowKRW(v=>!v)} style={{display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",userSelect:"none"}}>
                      <span style={{fontSize:"11px",color:!showKRW?T.accent:T.textMuted,fontWeight:!showKRW?"600":"400"}}>USD</span>
                      <div style={{width:"36px",height:"20px",borderRadius:"10px",background:showKRW?T.accent:T.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:"2px",left:showKRW?"18px":"2px",width:"16px",height:"16px",borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
                      </div>
                      <span style={{fontSize:"11px",color:showKRW?T.accent:T.textMuted,fontWeight:showKRW?"600":"400"}}>KRW</span>
                    </div>
                  </div>
                )}
              </div>
              <div style={{marginTop:"10px",paddingTop:"10px",borderTop:`1px solid ${T.border}`,fontSize:"12px",color:T.textMuted,fontWeight:"400",display:"flex",gap:"12px",flexWrap:"wrap"}}>
                <span>📅 {firstYear}년 상장</span>
                {getIpoPrice(selectedStock.yahooTicker)&&<span>💰 상장가 {isUSD?`$${getIpoPrice(selectedStock.yahooTicker).toLocaleString()}`:formatKRW(getIpoPrice(selectedStock.yahooTicker))}</span>}
                {getSector(selectedStock.yahooTicker)&&<span>🏢 {getSector(selectedStock.yahooTicker)}</span>}
              </div>
            </div>
          </div>

          <RankingSection activeTab={activeTab} T={T} isDark={isDark} onLiveFeed={msg=>setLiveFeedMsg(msg)} />

          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <span style={snStyle}>02</span>
              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>매수 시점 선택</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            {/* 통합 카드 */}
            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",overflow:"hidden",marginBottom:"12px"}}>

              {/* 상단: 수익률 정보 */}
              {(()=>{
                const isUp = buyPrice && currentPrice ? currentPrice >= buyPrice : true;
                const onePct = buyPrice && currentPrice ? ((currentPrice/buyPrice-1)*100).toFixed(1) : null;
                const emoji = onePct ? (parseFloat(onePct)>5000?"🦜🦜🦜":parseFloat(onePct)>1000?"🦜🦜":parseFloat(onePct)>0?"🦜":"😭") : "🦜";
                return(
                  <div style={{padding:"14px 16px",background:isUp?`${T.accent}08`:"rgba(239,68,68,0.05)",borderBottom:`1px solid ${T.border}`,minHeight:"68px"}}>
                    <div style={{fontSize:"12px",color:T.textMuted,fontWeight:"400",marginBottom:"4px"}}>
                      {investYear}년 오늘, <strong style={{color:T.text,fontWeight:"600"}}>{selectedStock.name}</strong>{buyPrice&&!priceLoading?` 1주(${displayPrice(buyPrice)})를 샀다면?`:""}
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontSize:"24px",fontWeight:"800",color:isUp?T.accent:"#f87171",letterSpacing:"-1px"}}>
                        {priceLoading ? <span style={{fontSize:"13px",color:T.textMuted,fontWeight:"400"}}>📡 조회 중…</span>
                          : onePct ? <>{isUp?"+":""}{onePct}% {emoji}</> : <span style={{fontSize:"13px",color:T.textMuted}}>-</span>}
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400"}}>1주 현재가</div>
                        <div style={{fontSize:"14px",fontWeight:"700",color:T.text}}>{currentPrice?displayPrice(currentPrice):"-"}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 중단: 차트 */}
              <div style={{padding:"12px 12px 4px"}}>
                {chartLoading ? (
                  <div style={{padding:"40px 20px",textAlign:"center"}}>
                    <div style={{fontSize:"13px",color:T.textMuted,fontWeight:"400"}}>📊 실시간 차트 로딩 중...</div>
                  </div>
                ) : chartData && chartData.length > 0 ? (
                  <StockChart
                    ticker={selectedStock.ticker}
                    investYear={investYear}
                    T={T}
                    displayPrice={displayPrice}
                    currentPrice={currentPrice}
                    chartData={chartData}
                    buyPrice={buyPrice}
                  />
                ) : (
                  <div style={{padding:"32px 20px",textAlign:"center"}}>
                    <div style={{fontSize:"13px",color:T.textMuted,fontWeight:"400"}}>📊 이 종목은 차트 데이터를 불러올 수 없어요</div>
                    <div style={{fontSize:"12px",color:T.textMuted,marginTop:"4px",fontWeight:"400"}}>매수가 · 현재가 · 수익률은 정확하게 계산됩니다 ✅</div>
                  </div>
                )}
              </div>

              {/* 하단: 슬라이더 */}
              <div style={{padding:"8px 16px 16px",borderTop:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                  <span style={{fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>{firstYear}년</span>
                  <div style={{textAlign:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",justifyContent:"center"}}>
                      <button
                        onClick={()=>{if(investYear>firstYear){setInvestYear(y=>y-1);setResult(null);}}}
                        disabled={investYear<=firstYear}
                        style={{width:"26px",height:"26px",borderRadius:"50%",border:`1px solid ${T.border}`,background:investYear<=firstYear?"transparent":T.presetActive,cursor:investYear<=firstYear?"not-allowed":"pointer",color:investYear<=firstYear?T.textFaint:T.accent,fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"300",flexShrink:0}}
                      >◀</button>
                      <div style={{textAlign:"center",minWidth:"80px"}}>
                        <span style={{fontSize:"18px",color:T.accent,fontWeight:"700"}}>{investYear}년</span>
                        {buyPrice&&!priceLoading
                          ? <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400",marginTop:"1px"}}>{getTodayMMDD()} {displayPrice(buyPrice)}</div>
                          : priceLoading
                            ? <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400",marginTop:"1px",minHeight:"14px"}}>📡 조회 중…</div>
                            : <div style={{minHeight:"14px"}}/>
                        }
                        {priceError&&!priceLoading&&<div style={{fontSize:"10px",color:"#f87171",fontWeight:"400"}}>{priceError}</div>}
                      </div>
                      <button
                        onClick={()=>{if(investYear<lastYear){setInvestYear(y=>y+1);setResult(null);}}}
                        disabled={investYear>=lastYear}
                        style={{width:"26px",height:"26px",borderRadius:"50%",border:`1px solid ${T.border}`,background:investYear>=lastYear?"transparent":T.presetActive,cursor:investYear>=lastYear?"not-allowed":"pointer",color:investYear>=lastYear?T.textFaint:T.accent,fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"300",flexShrink:0}}
                      >▶</button>
                    </div>
                  </div>
                  <span style={{fontSize:"12px",color:T.accent,fontWeight:"500"}}>오늘</span>
                </div>
                <input
                  type="range"
                  min={firstYear}
                  max={lastYear}
                  value={investYear}
                  onChange={e => {setInvestYear(parseInt(e.target.value)); setResult(null);}}
                  style={{
                    width:"100%",
                    height:"6px",
                    borderRadius:"3px",
                    background:`linear-gradient(to right, ${T.accent} 0%, ${T.accent} ${((investYear-firstYear)/(lastYear-firstYear))*100}%, ${T.border} ${((investYear-firstYear)/(lastYear-firstYear))*100}%, ${T.border} 100%)`,
                    outline:"none",
                    WebkitAppearance:"none",
                    cursor:"pointer"
                  }}
                />
              </div>
            </div>
            <div style={{marginBottom:"16px",fontSize:"11px",color:T.textMuted,textAlign:"center",fontWeight:"400"}}>
              ⚠️ 차트는 실시간 API 데이터 · 매수가/현재가/수익률은 100% 정확
            </div>
          </div>

          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <span style={snStyle}>03</span>
              <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>투자 금액 설정</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"12px"}}>
              {amountOptions.map(a=>{
                const n=parseInt(a);
                let label;
                if(n>=10000) label=`${n/10000}억원`;
                else if(n>=1000) label=`${n/1000}천만원`;
                else if(n>=100) label=`${n}만원`;
                else if(n>=10) label=`${n}만원`;
                else label=`${n}만원`;
                return <button key={a} onClick={()=>setInvestAmount(a)} style={{padding:"8px 12px",background:investAmount===a?T.presetActive:T.presetInactive,border:`1px solid ${investAmount===a?T.borderActive:T.border}`,borderRadius:"8px",cursor:"pointer",color:investAmount===a?T.accent:T.presetInactiveText,fontSize:"13px",fontWeight:"400",transition:"all 0.15s"}}>{label}</button>;
              })}
            </div>
            <div style={{position:"relative"}}>
              <input type="number" value={investAmount} onChange={e=>setInvestAmount(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"13px 60px 13px 16px",color:T.text,fontSize:"16px",fontWeight:"400",outline:"none",textAlign:"right"}} placeholder="직접 입력"/>
              <span style={{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",color:T.textSub,fontSize:"13px",fontWeight:"400"}}>만원</span>
            </div>
            {buyPrice&&shares>0&&!priceLoading&&(
              <div style={{marginTop:"12px",padding:"14px 16px",background:isDark?`${T.accent}08`:`${T.accent}08`,borderRadius:"14px",border:`1px solid ${T.accent}25`}}>
                <div style={{fontSize:"14px",color:T.text,fontWeight:"400",lineHeight:"1.6"}}>
                  🦜 {investYear}년 오늘 당시 주가는 <strong style={{color:T.accent,fontWeight:"700"}}>{displayPrice(buyPrice)}</strong>이었어요<br/>
                  지금 선택한 금액으로 <strong style={{color:T.accent,fontWeight:"700"}}>{shares.toLocaleString()}주</strong>나 살 수 있었어요!
                </div>
              </div>
            )}
            <div style={{textAlign:"center",marginTop:"8px",marginBottom:"-36px",fontSize:"13px",color:"#93c5fd",fontWeight:"400"}}>
              👇 지금 얼마가 됐을지 아래에서 확인해보세요
            </div>
          </div>

          <div style={{marginBottom:"52px",paddingTop:"4px"}}>
            <div style={{height:"1px",background:T.border,marginBottom:"18px"}}/>
            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"600",letterSpacing:"-0.3px",transition:"all 0.2s"}}>
              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}
            </button>
            <div style={{marginTop:"20px"}}><CoupangBanner isDark={isDark} T={T}/></div>
          </div>

          {result&&(
            <div id="result-section" key={animKey} style={{marginBottom:"48px",animation:"slideUp 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
                <span style={snStyle}>04</span>
                <span style={{fontSize:"17px",fontWeight:"500",color:T.text,letterSpacing:"-0.3px"}}>결과</span>
                <div style={{flex:1,height:"1px",background:T.border}}/>
              </div>
              <div style={{position:"relative",background:T.bgResult,border:`1px solid ${result.isProfit?T.accentDim+"80":"#ef444460"}`,borderRadius:"20px",boxShadow:result.isProfit?`0 8px 40px ${T.accent}15`:"0 8px 40px rgba(239,68,68,0.12)"}}>

                {/* 상단: 종목명 + 기간 */}
                <div style={{padding:"22px 20px 0",borderBottom:`1px solid ${T.border}40`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
                    <div>
                      <div style={{fontSize:"20px",color:result.isProfit?T.accent:"#f87171",fontWeight:"700",letterSpacing:"-0.5px",lineHeight:1,marginBottom:"5px"}}>{selectedStock.name}</div>
                      <div style={{fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>{result.buyDateStr}<br/>→ 오늘 · {result.years}년 보유</div>
                    </div>
                    <div style={{fontSize:"28px"}}>{result.isProfit?(parseFloat(result.returnPct)>1000?"🦜🦜🦜":parseFloat(result.returnPct)>300?"🦜🦜":"🦜"):(parseFloat(result.returnPct)<-40?"😭":"😩")}</div>
                  </div>

                  {/* 핵심 수치 */}
                  <div style={{textAlign:"center",marginBottom:"20px"}}>
                    <div style={{fontSize:"40px",fontWeight:"700",color:result.isProfit?T.accent:"#f87171",letterSpacing:"-2px",lineHeight:1,marginBottom:"10px"}}>
                      {result.isProfit?"+":""}{result.returnPct}%
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginBottom:"10px"}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400",marginBottom:"2px"}}>투자 원금</div>
                        <div style={{fontSize:"14px",color:T.textSub,fontWeight:"700"}}>{formatKRW(parseInt(investAmount)*10000)}</div>
                      </div>
                      <div style={{fontSize:"18px",color:T.textMuted}}>→</div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400",marginBottom:"2px"}}>현재 가치</div>
                        <div style={{fontSize:"22px",fontWeight:"700",color:result.isProfit?T.accent:"#f87171",letterSpacing:"-0.5px"}}><CountUp key={animKey} target={result.currentValueKRW} duration={1500}/></div>
                        {isUSD&&<div style={{fontSize:"11px",color:T.textMuted,marginTop:"2px",fontWeight:"400"}}>{formatUSD(result.currentValueKRW/usdToKrw)}</div>}
                      </div>
                    </div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 16px",background:result.isProfit?`${T.accent}15`:"rgba(239,68,68,0.12)",borderRadius:"20px"}}>
                      <span style={{fontSize:"13px",color:result.isProfit?T.accent:"#f87171"}}>{result.isProfit?"▲":"▼"}</span>
                      <span style={{fontSize:"14px",fontWeight:"700",color:result.isProfit?T.accent:"#f87171"}}>{formatKRW(Math.abs(result.profitKRW))} {result.isProfit?"수익":"손실"}</span>
                    </div>
                  </div>

                  {/* 매수가/현재가/연평균 */}
                  <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
                    {[{label:"매수가",value:displayPrice(result.buyPrice)},{label:"현재가",value:displayPrice(result.currentPrice)},{label:"연평균",value:`${result.isProfit?"+":""}${result.cagr}%`,h:true}].map(item=>(
                      <div key={item.label} style={{flex:1,padding:"10px 8px",textAlign:"center",background:item.h?(result.isProfit?`${T.accent}15`:"rgba(239,68,68,0.1)"):isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.03)",borderRadius:"10px",border:`1px solid ${item.h?(result.isProfit?T.accent+"35":"#ef444435"):T.border}`}}>
                        <div style={{fontSize:"11px",color:T.textSub,marginBottom:"4px",fontWeight:"600"}}>{item.label}</div>
                        <div style={{fontSize:"13px",fontWeight:"700",color:item.h?(result.isProfit?T.accent:"#f87171"):T.text,wordBreak:"break-all"}}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* 주수 임팩트 */}
                  {result.sharesCount>0&&(
                    <div style={{marginBottom:"20px",padding:"12px 16px",background:isDark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)",borderRadius:"12px",textAlign:"center"}}>
                      <span style={{fontSize:"14px",color:T.textSub,fontWeight:"400"}}>
                        😱 <strong style={{color:result.isProfit?T.accent:"#f87171",fontWeight:"700",fontSize:"16px"}}>{result.sharesCount.toLocaleString()}주</strong>나 살 수 있었어요!
                      </span>
                    </div>
                  )}
                </div>

                {/* 하단 */}
                <div style={{padding:"16px 20px 22px"}}>
                  {/* 위트있는 멘트 */}
                  <div style={{fontSize:"14px",color:T.textMuted,textAlign:"center",lineHeight:"1.7",fontWeight:"400",marginBottom:"16px"}}>
                    "{witMsgs[animKey%witMsgs.length]}"
                  </div>

                  <button onClick={()=>setShowShareCard(true)} style={{width:"100%",padding:"14px",background:result.isProfit?`linear-gradient(135deg,${T.accentDim},#15803d)`:"linear-gradient(135deg,#dc2626,#b91c1c)",border:"none",borderRadius:"12px",cursor:"pointer",color:"#fff",fontSize:"15px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"20px"}}>
                    🦜 껄무새 자랑하기
                  </button>

                  {/* VS 배틀 비교 */}
                  <div style={{marginBottom:"14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                      <span style={{fontSize:"13px",color:T.text,fontWeight:"700"}}>⚔️ VS 배틀</span>
                      <div style={{flex:1,height:"1px",background:T.border}}/>
                      <span style={{fontSize:"11px",color:T.textMuted,fontWeight:"400"}}>같은 금액 투자했다면?</span>
                    </div>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
                      {[...US_PRESETS,...KR_PRESETS,...INDEX_PRESETS.slice(0,2),...COIN_PRESETS.slice(0,2)].filter(s=>s.ticker!==selectedStock.ticker).slice(0,12).map(s=>(
                        <button key={s.ticker} onClick={()=>setCompareStock(cs=>cs?.ticker===s.ticker?null:s)} style={{padding:"6px 12px",background:compareStock?.ticker===s.ticker?T.presetActive:T.presetInactive,border:`1px solid ${compareStock?.ticker===s.ticker?T.borderActive:T.border}`,borderRadius:"20px",cursor:"pointer",color:compareStock?.ticker===s.ticker?T.accent:T.presetInactiveText,fontSize:"12px",fontWeight:"400",transition:"all 0.15s"}}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                    {compareStock&&compareResult&&(()=>{
                      const myPct = parseFloat(result.returnPct);
                      const cpPct = parseFloat(compareResult.returnPct);
                      const iWin = myPct >= cpPct;
                      return(
                        <div style={{background:isDark?"rgba(0,0,0,0.2)":"rgba(0,0,0,0.03)",borderRadius:"16px",padding:"16px",border:`1px solid ${T.border}`}}>
                          <div style={{fontSize:"11px",color:T.textMuted,fontWeight:"400",marginBottom:"12px",textAlign:"center"}}>
                            {formatKRW(parseInt(investAmount)*10000)} · {result.years}년 투자 결과
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                            {/* 내 종목 */}
                            <div style={{flex:1,padding:"14px 10px",background:iWin?(result.isProfit?`${T.accent}15`:"rgba(239,68,68,0.1)"):"transparent",border:`2px solid ${iWin?(result.isProfit?T.accent:"#f87171"):T.border}`,borderRadius:"14px",textAlign:"center",transition:"all 0.3s"}}>
                              <div style={{fontSize:"14px",marginBottom:"4px",opacity:iWin?1:0}}>👑</div>
                              <div style={{fontSize:"12px",fontWeight:"600",color:T.text,marginBottom:"6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selectedStock.name}</div>
                              <div style={{fontSize:"20px",fontWeight:"800",color:myPct>=0?T.accent:"#f87171",letterSpacing:"-1px",lineHeight:1,marginBottom:"4px"}}>{myPct>=0?"+":""}{result.returnPct}%</div>
                              <div style={{fontSize:"12px",color:T.textSub,fontWeight:"500"}}>{formatKRW(Math.round(result.currentValueKRW))}</div>
                            </div>

                            {/* VS */}
                            <div style={{textAlign:"center",flexShrink:0}}>
                              <div style={{fontSize:"16px",fontWeight:"800",color:T.textMuted}}>VS</div>
                            </div>

                            {/* 비교 종목 */}
                            <div style={{flex:1,padding:"14px 10px",background:!iWin?(compareResult.isProfit?`${T.accent}15`:"rgba(239,68,68,0.1)"):"transparent",border:`2px solid ${!iWin?(compareResult.isProfit?T.accent:"#f87171"):T.border}`,borderRadius:"14px",textAlign:"center",transition:"all 0.3s"}}>
                              <div style={{fontSize:"14px",marginBottom:"4px",opacity:!iWin?1:0}}>👑</div>
                              <div style={{fontSize:"12px",fontWeight:"600",color:T.text,marginBottom:"6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{compareStock.name}</div>
                              <div style={{fontSize:"20px",fontWeight:"800",color:cpPct>=0?T.accent:"#f87171",letterSpacing:"-1px",lineHeight:1,marginBottom:"4px"}}>{cpPct>=0?"+":""}{compareResult.returnPct}%</div>
                              <div style={{fontSize:"12px",color:T.textSub,fontWeight:"500"}}>{formatKRW(Math.round(compareResult.currentValueKRW))}</div>
                            </div>
                          </div>
                          <div style={{marginTop:"10px",textAlign:"center",fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>
                            {iWin ? `🦜 ${selectedStock.name}이 ${formatKRW(Math.round(result.currentValueKRW - compareResult.currentValueKRW))} 더 벌었어요!` : `😭 ${compareStock.name}이 ${formatKRW(Math.round(compareResult.currentValueKRW - result.currentValueKRW))} 더 벌었어요...`}
                          </div>
                        </div>
                      );
                    })()}
                    {compareStock&&!compareResult&&(
                      <div style={{textAlign:"center",padding:"14px",color:T.textMuted,fontSize:"13px",fontWeight:"400"}}>⏳ 비교 계산 중…</div>
                    )}
                  </div>

                  <div style={{fontSize:"11px",color:T.textMuted,textAlign:"center",lineHeight:"1.7",fontWeight:"400",marginBottom:"12px"}}>⚠️ 과거 수익률은 미래를 보장하지 않습니다.</div>
                  <div style={{marginTop:"14px",borderRadius:"12px",overflow:"hidden",border:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",justifyContent:"center",background:T.bgCard,padding:"8px 0"}}>
                      <iframe src="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width=360&height=250&tsource=" width="360" height="250" frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"></iframe>
                    </div>
                    <div style={{padding:"5px 12px",fontSize:"10px",color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <footer style={{maxWidth:"600px",margin:"0 auto",padding:"28px 16px 48px",borderTop:`1px solid ${T.border}`,textAlign:"center"}}>
          <div style={{fontSize:"22px",marginBottom:"6px"}}>🦜</div>
          <div style={{fontSize:"15px",fontWeight:"300",color:T.accent,marginBottom:"2px"}}>껄무새 · stockparrot.kr</div>
          <div style={{fontSize:"12px",color:T.textSub,marginTop:"12px",lineHeight:"1.8",fontWeight:"400"}}>⚠️ 본 서비스는 참고용 엔터테인먼트 콘텐츠로, 투자 조언이 아닙니다.<br/>과거 수익률은 미래 성과를 보장하지 않습니다.</div>
          <div style={{marginTop:"16px",fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>© {CURRENT_YEAR} 껄무새 (stockparrot.kr). All rights reserved.</div>
          <div style={{fontSize:"11px",color:T.textFaint,marginTop:"4px",fontWeight:"400"}}>문의: <a href="mailto:to.choon@gmail.com" style={{color:T.accent,textDecoration:"none",fontWeight:"300"}}>to.choon@gmail.com</a></div>
        </footer>

      </div>

      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        button:active{transform:scale(0.97);}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#4ade80;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(74,222,128,0.4);}
        input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#4ade80;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(74,222,128,0.4);}
        @keyframes liveRing{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.8);opacity:0}}
        html, body {background: ${isDark ? '#06060f' : '#f2f7f3'} !important; margin:0; padding:0;}
      `}</style>
    </>
  );
}