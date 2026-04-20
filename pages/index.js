import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const TABS = [
  { id: "us", label: "🇺🇸 미국주식" },
  { id: "kr", label: "🇰🇷 국내주식" },
  { id: "index", label: "📊 대표지수" },
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
  {ticker:"BTC",name:"비트코인",emoji:"₿"},{ticker:"KOSPI",name:"코스피",emoji:"🇰🇷"},
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
  BTC:[0.08,3,13,732,318,430,952,13800,3700,7200,28990,46200,16600,42500,93500,95000],
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
  SPY:1993,QQQ:1999,DIA:1998,IWM:2000,VTI:2001,GLD:2004,BTC:2010,
  "삼성전자":2000,"SK하이닉스":2001,"카카오":2017,"NAVER":2009,
  "현대차":2000,"LG화학":2001,"삼성SDI":2001,"삼성바이오":2016,"KOSPI":2000,
};
const CURRENT_YEAR = new Date().getFullYear();

function getYahooTicker(t){return TICKER_MAP[t]||t;}
function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}
function getIpoYear(yt){return IPO_YEAR[yt]||2000;}
function getChartData(t){return CHART_DATA[t]||CHART_DATA["SPY"];}
function getTodayMMDD(){const n=new Date();return `${String(n.getMonth()+1).padStart(2,"0")}/${String(n.getDate()).padStart(2,"0")}`;}
function getSameDayOfYear(yr){const n=new Date();return `${yr}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;}
function formatKRW(v){const a=Math.abs(v),s=v<0?"-":"";if(a>=1e8)return`${s}${(a/1e8).toFixed(1)}억원`;if(a>=1e4)return`${s}${Math.round(a/1e4)}만원`;return`${s}${Math.round(a).toLocaleString()}원`;}
function formatUSD(v){return`$${v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;}

// ── API 프록시 ───────────────────────────────────────────────
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

// ── 테마 ─────────────────────────────────────────────────────
const THEMES = {
  dark:{bg:"#06060f",bgCard:"#0f0f1e",bgDeep:"#0a0a16",bgResult:"linear-gradient(145deg,#0c1c10,#08100a)",border:"#2a2a40",borderActive:"#4ade80",text:"#eeeef8",textSub:"#b0b0c8",textMuted:"#7878a0",textFaint:"#4a4a6a",accent:"#4ade80",accentDim:"#22c55e",tabBg:"#0f0f1e",tabActive:"linear-gradient(135deg,#1a2e1f,#0f1f13)",tabInactive:"#8080a8",presetActive:"#1a2e1f",presetInactive:"#1e1e30",presetInactiveText:"#a0a0c0",inputBg:"#0f0f1e",dropdownBg:"#0f0f1e",isDark:true},
  light:{bg:"#f2f7f3",bgCard:"#ffffff",bgDeep:"#eaf3ec",bgResult:"linear-gradient(145deg,#edfaef,#f0faf2)",border:"#d8eadb",borderActive:"#16a34a",text:"#141f16",textSub:"#3d5c42",textMuted:"#5a7a5e",textFaint:"#a0c0a4",accent:"#16a34a",accentDim:"#22c55e",tabBg:"#e4eee5",tabActive:"linear-gradient(135deg,#d0ead5,#bfe0c8)",tabInactive:"#5a7a5e",presetActive:"#d0ead5",presetInactive:"#f0f7f1",presetInactiveText:"#4a6a4e",inputBg:"#ffffff",dropdownBg:"#ffffff",isDark:false},
};

// ── StockChart ───────────────────────────────────────────────
function StockChart({ticker,investYear,T,displayPrice,onDragYear}){
  const [hoverIdx,setHoverIdx]=useState(null);
  const [dragIdx,setDragIdx]=useState(null); // 드래그로 매수마커 이동
  const data=getChartData(ticker);
  const W=480,H=130,P=10;
  const mn=Math.min(...data),mx=Math.max(...data);
  const mi=data.indexOf(mn),xi=data.indexOf(mx);
  const up=data[data.length-1]>=data[0],lc=up?"#4ade80":"#f87171";
  const xs=(W-P*2)/Math.max(data.length-1,1),yr=mx-mn||1;
  const tx=i=>P+i*xs,ty=v=>H-P-((v-mn)/yr)*(H-P*2-18);
  const cur=data[data.length-1],ret=(((cur/data[0])-1)*100).toFixed(1);
  const lp=data.map((v,i)=>`${i===0?"M":"L"}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(" ");
  const fp=`${lp} L${tx(data.length-1).toFixed(1)},${H-P} L${tx(0).toFixed(1)},${H-P} Z`;
  const ipoYr=getIpoYear(getYahooTicker(ticker));

  // 드래그 중이면 dragIdx 사용, 아니면 investYear 기반 계산
  const bi = dragIdx !== null ? dragIdx : Math.max(0,Math.min(data.length-1,Math.round((investYear-ipoYr)/Math.max(CURRENT_YEAR-ipoYr,1)*(data.length-1))));
  const bx=tx(bi),by=ty(data[bi]);
  const hv=hoverIdx!==null?data[hoverIdx]:null,hx=hoverIdx!==null?tx(hoverIdx):null,hy=hoverIdx!==null?ty(hv):null;

  // 인덱스 → 연도 변환
  const idxToYear = idx => Math.round(ipoYr + (idx/(data.length-1))*(CURRENT_YEAR-ipoYr));

  // SVG 좌표 → 데이터 인덱스 변환
  const getIdxFromEvent = (clientX, svgEl) => {
    const r = svgEl.getBoundingClientRect();
    const x = (clientX - r.left) / r.width * W;
    return Math.max(0, Math.min(data.length-1, Math.round((x-P)/xs)));
  };

  return(
    <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"16px",padding:"16px 14px",overflow:"hidden",marginBottom:"16px"}}>
     
        <div style={{fontSize:"13px",color:lc,fontWeight:"400",marginTop:"2px"}}>
          상장 이후 {parseFloat(ret)>=0?"+":""}{ret}%
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible",cursor:"crosshair"}}
        onMouseMove={e=>{
          const idx=getIdxFromEvent(e.clientX,e.currentTarget);
          setHoverIdx(idx);
          if(e.buttons===1&&dragIdx!==null){ // 마우스 드래그 중
            setDragIdx(idx);
            onDragYear&&onDragYear(idxToYear(idx));
          }
        }}
        onMouseLeave={()=>{setHoverIdx(null);}}
        onMouseDown={e=>{
          const idx=getIdxFromEvent(e.clientX,e.currentTarget);
          // 파란 마커 근처 클릭 시 드래그 시작
          if(Math.abs(idx-bi)<=2){setDragIdx(bi);}
        }}
        onMouseUp={()=>setDragIdx(null)}
        onTouchMove={e=>{
          const idx=getIdxFromEvent(e.touches[0].clientX,e.currentTarget);
          setHoverIdx(idx);
          setDragIdx(idx);
          onDragYear&&onDragYear(idxToYear(idx));
        }}
        onTouchEnd={()=>{setHoverIdx(null);setDragIdx(null);}}
      >
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lc} stopOpacity="0.18"/><stop offset="100%" stopColor={lc} stopOpacity="0"/></linearGradient></defs>
        <path d={fp} fill="url(#cg)"/>
        <path d={lp} fill="none" stroke={lc} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={tx(mi).toFixed(1)} cy={ty(mn).toFixed(1)} r="3.5" fill={T.bg} stroke="#f87171" strokeWidth="2"/>
        <text x={Math.min(Math.max(tx(mi),44),W-44)} y={(ty(mn)+15).toFixed(1)} textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="700">최저 {displayPrice(mn)}</text>
        <circle cx={tx(xi).toFixed(1)} cy={ty(mx).toFixed(1)} r="3.5" fill={T.bg} stroke="#fbbf24" strokeWidth="2"/>
        <text x={Math.min(Math.max(tx(xi),44),W-44)} y={(ty(mx)-6).toFixed(1)} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">최고 {displayPrice(mx)}</text>
        {/* 매수 마커 — 드래그 가능 */}
        <line x1={bx.toFixed(1)} y1={P} x2={bx.toFixed(1)} y2={H-P} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
        <circle cx={bx.toFixed(1)} cy={by.toFixed(1)} r={dragIdx!==null?7:5} fill="#60a5fa" stroke={T.bg} strokeWidth="2" style={{cursor:"grab"}}/>
        <text x={Math.min(Math.max(bx,50),W-50)} y={(by-10).toFixed(1)} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700">
          {idxToYear(bi)}년 {displayPrice(data[bi])}
        </text>
        {hoverIdx!==null&&<><line x1={hx.toFixed(1)} y1={P} x2={hx.toFixed(1)} y2={H-P} stroke={lc} strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/><circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="4" fill={lc} stroke={T.bg} strokeWidth="2"/></>}
      </svg>
      {dragIdx!==null&&(
        <div style={{marginTop:"8px",padding:"6px 12px",background:"#60a5fa20",border:"1px solid #60a5fa40",borderRadius:"8px",fontSize:"12px",color:"#60a5fa",fontWeight:"400",textAlign:"center"}}>
          📌 {idxToYear(dragIdx)}년으로 매수 시점 설정 중… 손을 떼면 적용돼요
        </div>
      )}
    </div>
  );
}

// ── 쿠팡 파트너스 배너 ───────────────────────────────────────
function CoupangBanner({isDark,T}){
 return(
    <div style={{marginBottom:"20px",borderRadius:"14px",overflow:"hidden",border:`1px solid ${T.border}`,position:"relative"}}>
      <div style={{position:"absolute",top:"9px",right:"10px",zIndex:2,fontSize:"10px",color:T.textMuted,background:T.bgCard,padding:"2px 7px",borderRadius:"4px",border:`1px solid ${T.border}`,fontWeight:"400"}}>광고 · 쿠팡파트너스</div>
      <div style={{display:"flex",justifyContent:"center",padding:"8px 0",background:T.bgCard}}>
        <iframe src="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width=320&height=100&tsource=" width="360" height="250" frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"></iframe>
      </div>
      <div style={{padding:"5px 12px",background:T.bgDeep,fontSize:"10px",color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
    </div>
  );
}



// ── CountUp ──────────────────────────────────────────────────
function CountUp({target,duration=1400}){
  const [d,setD]=useState(0);const st=useRef(null);const raf=useRef(null);
  useEffect(()=>{st.current=null;if(raf.current)cancelAnimationFrame(raf.current);const a=ts=>{if(!st.current)st.current=ts;const p=Math.min((ts-st.current)/duration,1);setD(target*(1-Math.pow(1-p,4)));if(p<1)raf.current=requestAnimationFrame(a);};raf.current=requestAnimationFrame(a);return()=>cancelAnimationFrame(raf.current);},[target]);
  return<span>{formatKRW(d)}</span>;
}

// ── 공유 카드 ────────────────────────────────────────────────
function ShareCard({result,stockName,investYear,investAmount,onClose,isDark}){
  const {isProfit,returnPct,currentValueKRW,cagr}=result;
  const mc=isProfit?"#4ade80":"#f87171";
  const msgs=isProfit?["그때 살 껄 그랬어요 🤦","살 껄~ 살 껄~ 🦜","버핏도 안 샀는데 나도 안 샀지"]:["팔 껄, 팔아야 했는데 😭","손절이 답이었습니다","그냥 예금 넣을 껄"];
  const msg=msgs[Math.floor(Math.random()*msgs.length)];
  const char=isProfit?(parseFloat(returnPct)>1000?"🦜🦜🦜":parseFloat(returnPct)>300?"🦜🦜":"🦜"):(parseFloat(returnPct)<-40?"😭":"😩");
  const [saving,setSaving]=useState(false);

  const handleSaveImage=async()=>{
    setSaving(true);
    try{
      // html2canvas CDN 동적 로드
      if(!window.html2canvas){
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload=res;s.onerror=rej;
          document.head.appendChild(s);
        });
      }
      const el=document.getElementById("share-card-inner");
      const canvas=await window.html2canvas(el,{backgroundColor:null,scale:2,useCORS:true,logging:false});
      const link=document.createElement("a");
      link.download=`껄무새_${stockName}_${investYear}.png`;
      link.href=canvas.toDataURL("image/png");
      link.click();
    }catch(e){
      alert("이미지 저장에 실패했어요. 텍스트 복사를 이용해주세요 🦜");
    }
    setSaving(false);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(16px)",overflowY:"auto"}}>
      <div id="share-card-inner" style={{width:"320px",background:isProfit?"linear-gradient(145deg,#071a0a,#0d2e12)":"linear-gradient(145deg,#1a0505,#2d0808)",borderRadius:"24px",border:`1px solid ${mc}30`,boxShadow:`0 0 60px ${mc}25`,padding:"32px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",background:`radial-gradient(circle,${mc}15 0%,transparent 65%)`,pointerEvents:"none"}}/>
        <div style={{fontSize:"9px",letterSpacing:"3px",marginBottom:"14px",color:mc,opacity:0.5}}>🦜 STOCKPARROT.KR</div>
        <div style={{fontSize:"40px",marginBottom:"8px"}}>{char}</div>
        <div style={{fontSize:"12px",color:mc,opacity:0.7,marginBottom:"3px",fontWeight:"400"}}>{stockName}</div>
        <div style={{fontSize:"11px",color:mc,opacity:0.5,marginBottom:"14px",fontWeight:"400"}}>{investYear}년에 {isProfit?"샀더라면":"팔았더라면"}…</div>
        <div style={{fontSize:"36px",fontWeight:"300",color:mc,letterSpacing:"-2px",lineHeight:1,marginBottom:"6px"}}>{isProfit?"+":""}{returnPct}%</div>
        <div style={{fontSize:"18px",color:"#e8f0ea",fontWeight:"400",marginBottom:"4px"}}>{formatKRW(Math.round(currentValueKRW))}</div>
        <div style={{fontSize:"10px",color:mc,opacity:0.5,marginBottom:"16px",fontWeight:"400"}}>{formatKRW(parseInt(investAmount)*10000)} 투자 → {CURRENT_YEAR}년</div>
        <div style={{fontSize:"11px",color:mc,opacity:0.7,lineHeight:"1.6",fontStyle:"normal",fontWeight:"400"}}>"{msg}"</div>
        <div style={{marginTop:"14px",fontSize:"9px",color:mc,opacity:0.3}}>연평균 수익률 {isProfit?"+":""}{cagr}% · stockparrot.kr</div>
      </div>
      <div style={{display:"flex",gap:"10px",marginTop:"14px",width:"320px"}}>
        <button onClick={()=>{const txt=isProfit?`${stockName} ${investYear}년에 샀더라면 +${returnPct}%! ${char} "${msg}" | stockparrot.kr`:`${stockName} ${investYear}년에 팔았더라면 ${returnPct}%... ${char} "${msg}" | stockparrot.kr`;navigator.clipboard?.writeText(txt).then(()=>alert("클립보드에 복사됐어요! 인스타에 붙여넣기 하세요 🦜"));}} style={{flex:1,padding:"13px",background:"linear-gradient(135deg,#22c55e,#16a34a)",border:"none",borderRadius:"12px",cursor:"pointer",color:"#fff",fontSize:"14px",fontWeight:"300"}}>🔗 텍스트 복사</button>
        <button onClick={handleSaveImage} disabled={saving} style={{flex:1,padding:"13px",background:saving?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:"12px",cursor:saving?"not-allowed":"pointer",color:"#ccc",fontSize:"14px",fontWeight:"300"}}>
          {saving?"⏳ 저장 중…":"📥 이미지 저장"}
        </button>
      </div>
      <button onClick={onClose} style={{marginTop:"10px",background:"none",border:"none",color:"#666",fontSize:"13px",cursor:"pointer",padding:"6px",fontWeight:"400"}}>닫기</button>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
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
  const searchTimeout=useRef(null);
  const priceTimeout=useRef(null);

  const T=isDark?THEMES.dark:THEMES.light;
  const isUSD=currency==="USD";
  const firstYear=getIpoYear(selectedStock.yahooTicker);
  const lastYear=CURRENT_YEAR;
  const sliderPct=Math.max(0,Math.min(100,((investYear-firstYear)/Math.max(lastYear-firstYear,1))*100));
  const liveReturnPct=buyPrice&&currentPrice?((currentPrice/buyPrice-1)*100).toFixed(1):null;
  const displayPrice=val=>{if(!val&&val!==0)return"-";if(!isUSD)return formatKRW(val);if(showKRW)return`${formatKRW(Math.round(val*usdToKrw))} (${formatUSD(val)})`;return formatUSD(val);};

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
        const fb=getChartData(selectedStock.ticker);
        const ipoYr=getIpoYear(selectedStock.yahooTicker);
        const idx=Math.round((investYear-ipoYr)/Math.max(CURRENT_YEAR-ipoYr,1)*(fb.length-1));
        setBuyPrice(fb[Math.max(0,Math.min(fb.length-1,idx))]);setCurrentPrice(fb[fb.length-1]);
        setCurrency(getCurrency(selectedStock.yahooTicker));setPriceError("📦 샘플 데이터 사용 중");
      }
      setPriceLoading(false);setRateLoading(false);
    },600);
  },[selectedStock.yahooTicker,investYear]);

  useEffect(()=>{
    setResult(null);setSearchQuery("");
    const map={us:US_PRESETS[0],kr:KR_PRESETS[0],index:INDEX_PRESETS[0]};
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

  // 비교 종목 선택 시 자동 계산
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
        // 샘플 데이터 폴백
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
    const exactYears=(new Date()-new Date(getSameDayOfYear(investYear)))/(1000*60*60*24*365.25);
    const cagr=((Math.pow(pr,1/Math.max(exactYears,0.1))-1)*100).toFixed(1);
    setResult({buyPrice,currentPrice,investKRW,currentValueKRW:curVal,profitKRW,returnPct,cagr,years:Math.floor(exactYears),isProfit:profitKRW>=0,buyDateStr:getSameDayOfYear(investYear)});
    setCompareStock(null);setCompareResult(null);
    setAnimKey(k=>k+1);setLoading(false);
    // 결과로 부드럽게 스크롤
    setTimeout(()=>{
      document.getElementById("result-section")?.scrollIntoView({behavior:"smooth",block:"start"});
    },100);
  };

  const amountOptions=["100","500","1000","3000","5000","10000"];
  const parrotMsg=result?parseFloat(result.returnPct)>1000?"🦜🦜🦜 껄무새껄무새껄무새!!":parseFloat(result.returnPct)>300?"🦜🦜 껄무새껄무새~":parseFloat(result.returnPct)>0?"🦜 껄무새~":"😭 팔걸…":null;
  const currentPresets=activeTab==="us"?US_PRESETS:activeTab==="kr"?KR_PRESETS:INDEX_PRESETS;
  const sec={marginBottom:"52px",paddingTop:"16px"};
  const snStyle={width:"28px",height:"28px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"300",color:"#fff",flexShrink:0,lineHeight:"1",padding:"0",minWidth:"28px",minHeight:"28px"};
  const witMsgs=result?result.isProfit?["그때 살 걸 그랬어요 🤦","살 걸~ 살 걸~ 🦜","버핏도 안 샀는데 나도 안 샀지"]:["팔 걸, 팔아야 했는데 😭","손절이 답이었습니다","그냥 예금 넣을 걸"]:[];

  return(
    <>
      <Head>
        <title>껄무새 - 그때 살걸! 그때 팔걸!</title>
        <meta name="description" content="그때 그 주식을 샀더라면 지금 얼마일까? 주식 수익률 시뮬레이터"/>
        <meta property="og:title" content="껄무새 - 그때 살걸! 그때 팔걸!"/>
        <meta property="og:description" content="그때 그 주식을 샀더라면 지금 얼마일까?"/>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦜</text></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600&display=swap" rel="stylesheet"/>
      </Head>
      <div style={{minHeight:"100vh",background:T.bg,color:T.text,overflowX:"hidden",transition:"background 0.3s,color 0.3s",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>

        {showShareCard&&result&&<ShareCard result={result} stockName={selectedStock.name} investYear={investYear} investAmount={investAmount} onClose={()=>setShowShareCard(false)} isDark={isDark}/>}

        {/* 헤더 */}
        <div style={{padding:"36px 20px 16px",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setIsDark(d=>!d)} style={{position:"absolute",top:"18px",right:"18px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"20px",padding:"7px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",color:T.textSub,fontSize:"13px",fontWeight:"400",zIndex:10}}>
            <span>{isDark?"☀️":"🌙"}</span><span>{isDark?"라이트":"다크"}</span>
          </button>
          <div style={{fontSize:"36px",marginBottom:"4px"}}>🦜</div>
          <h1 style={{fontSize:"32px",fontWeight:"600",margin:0,letterSpacing:"-1px",background:isDark?"linear-gradient(135deg,#ffffff 0%,#86efac 60%,#4ade80 100%)":"linear-gradient(135deg,#0d1a10 0%,#16a34a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>껄무새</h1>
          <p style={{fontSize:"13px",color:T.accent,margin:"6px 0 2px",fontWeight:"400"}}>그때 살걸!!! 그때 팔걸!!! 껄껄껄 🦜</p>
        </div>

        {/* 환율 */}
        <div style={{maxWidth:"600px",margin:"0 auto 8px",padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",padding:"10px 18px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px"}}>
            <span style={{fontSize:"15px"}}>💱</span>
            <span style={{fontSize:"13px",color:T.textSub,fontWeight:"400"}}>USD / KRW</span>
            <div style={{width:"1px",height:"14px",background:T.border}}/>
            {rateLoading?<span style={{fontSize:"13px",color:T.textMuted,fontWeight:"400"}}>조회 중…</span>:<>
              <span style={{fontSize:"17px",fontWeight:"300",color:T.text}}>{usdToKrw.toLocaleString()}<span style={{fontSize:"13px",color:T.textSub,marginLeft:"2px",fontWeight:"400"}}>원</span></span>
              <span style={{fontSize:"11px",fontWeight:"300",padding:"3px 9px",background:`${T.accent}25`,color:T.accent,borderRadius:"6px"}}>실시간</span>
            </>}
          </div>
        </div>

        <div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}>

          {/* STEP 1 */}
          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <div style={{...snStyle,background:"linear-gradient(135deg,#22c55e,#15803d)"}}>1</div>
              <span style={{fontSize:"17px",fontWeight:"300",color:T.text,letterSpacing:"-0.3px"}}>종목 선택</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",gap:"4px",marginBottom:"16px",background:T.tabBg,borderRadius:"14px",padding:"4px"}}>
              {TABS.map(tab=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,padding:"11px 4px",background:activeTab===tab.id?T.tabActive:"transparent",border:`1px solid ${activeTab===tab.id?T.borderActive+"60":"transparent"}`,borderRadius:"10px",cursor:"pointer",color:activeTab===tab.id?T.accent:T.tabInactive,fontSize:"13px",fontWeight:"400",transition:"all 0.2s"}}>{tab.label}</button>)}
            </div>
            {/* 검색 */}
            <div style={{marginBottom:"14px",position:"relative"}}>
              <div style={{position:"relative"}}>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={activeTab==="kr"?"영문으로 검색하세요! (예: samsung)":activeTab==="index"?"SPY, QQQ…":"영문 또는 티커로 검색하세요!…"} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"12px 46px 12px 16px",color:T.text,fontSize:"16px",fontWeight:"400",outline:"none"}}/>
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
            <div style={{fontSize:"11px",color:T.accent,letterSpacing:"2px",marginBottom:"10px",fontWeight:"400"}}>{activeTab==="index"?"대표 지수 · ETF":"인기 종목"}</div>
            <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"16px"}}>
              {currentPresets.map(s=><button key={s.ticker} onClick={()=>handleSelectPreset(s)} style={{padding:"8px 13px",background:selectedStock.ticker===s.ticker?T.presetActive:T.presetInactive,border:`1px solid ${selectedStock.ticker===s.ticker?T.borderActive:T.border}`,borderRadius:"8px",cursor:"pointer",color:selectedStock.ticker===s.ticker?T.accent:T.presetInactiveText,fontSize:"13px",fontWeight:"400",transition:"all 0.15s"}}>{s.emoji?`${s.emoji} `:""}{s.name}</button>)}
            </div>
            <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"14px",marginBottom:"16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{background:T.presetActive,borderRadius:"8px",padding:"8px 11px",flexShrink:0}}><div style={{color:T.accent,fontWeight:"300",fontSize:"11px"}}>{isUSD?"USD":"KRW"}</div></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:T.text,fontWeight:"300",fontSize:"15px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selectedStock.name}</div>
                  <div style={{color:T.textSub,fontSize:"13px",marginTop:"2px",fontWeight:"600"}}>{firstYear}년 상장 · 현재 {priceLoading?"조회 중…":currentPrice?displayPrice(currentPrice):"-"}</div>
                </div>
                {liveReturnPct&&<span style={{color:parseFloat(liveReturnPct)>=0?T.accent:"#f87171",fontSize:"15px",fontWeight:"300",flexShrink:0}}>{parseFloat(liveReturnPct)>=0?"+":""}{liveReturnPct}%</span>}
              </div>
              {isUSD&&<div style={{marginTop:"10px",paddingTop:"10px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{fontSize:"12px",color:T.textSub,marginRight:"2px",fontWeight:"400"}}>표시 통화</span>
                {[{val:false,label:"$ 달러 (USD)"},{val:true,label:"₩ 원화 (KRW)"}].map(opt=><button key={String(opt.val)} onClick={()=>setShowKRW(opt.val)} style={{padding:"5px 12px",background:showKRW===opt.val?T.presetActive:"transparent",border:`1px solid ${showKRW===opt.val?T.borderActive:T.border}`,borderRadius:"20px",cursor:"pointer",color:showKRW===opt.val?T.accent:T.textMuted,fontSize:"12px",fontWeight:"400"}}>{opt.label}</button>)}
              </div>}
            </div>
     
          </div>

          {/* STEP 2 — 매수 시점 선택 (차트 바로 아래) */}
          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <div style={{...snStyle,background:"linear-gradient(135deg,#22c55e,#15803d)"}}>2</div>
              <span style={{fontSize:"17px",fontWeight:"300",color:T.text,letterSpacing:"-0.3px"}}>매수 시점 선택</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"14px"}}>
              <div>
                <span style={{fontSize:"32px",fontWeight:"300",color:T.text,letterSpacing:"-1px"}}>{investYear}년</span>
                <span style={{fontSize:"14px",color:T.accent,fontWeight:"400",marginLeft:"8px"}}>오늘({getTodayMMDD()})</span>
                {buyPrice&&!priceLoading&&<span style={{fontSize:"14px",color:T.textSub,fontWeight:"400",marginLeft:"6px"}}>{displayPrice(buyPrice)}</span>}
                <span style={{fontSize:"13px",color:T.textSub,marginLeft:"4px",fontWeight:"400"}}>매수</span>
              </div>
              <div style={{textAlign:"right"}}>
                {priceLoading&&<div style={{fontSize:"13px",color:T.accent,fontWeight:"400"}}>🦜 조회 중…</div>}
                {priceError&&!priceLoading&&<div style={{fontSize:"12px",color:"#f87171",fontWeight:"400"}}>{priceError}</div>}
                {liveReturnPct&&!priceLoading&&<div style={{fontSize:"15px",fontWeight:"300",color:parseFloat(liveReturnPct)>=0?T.accent:"#f87171"}}>{parseFloat(liveReturnPct)>=0?"+":""}{liveReturnPct}%</div>}
              </div>
            </div>
    <div style={{fontSize:"12px",color:T.textMuted,textAlign:"center",marginBottom:"8px",fontWeight:"400"}}>👆 차트를 좌우로 드래그해서 매수 시점을 선택하세요</div>
<StockChart ticker={selectedStock.ticker} investYear={investYear} T={T} displayPrice={displayPrice} onDragYear={yr=>{setInvestYear(yr);setResult(null);}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"10px"}}>
              <span style={{fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>{firstYear}년</span>
              <span style={{fontSize:"12px",color:T.textMuted,fontWeight:"400"}}>{Math.round((firstYear+lastYear)/2)}년</span>
              <span style={{fontSize:"12px",color:T.accent,fontWeight:"300"}}>오늘</span>

            </div>
          </div>

          {/* STEP 3 — 투자 금액 설정 */}
          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <div style={{...snStyle,background:"linear-gradient(135deg,#22c55e,#15803d)"}}>3</div>
              <span style={{fontSize:"17px",fontWeight:"300",color:T.text,letterSpacing:"-0.3px"}}>투자 금액 설정</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"12px"}}>
              {amountOptions.map(a=><button key={a} onClick={()=>setInvestAmount(a)} style={{padding:"8px 12px",background:investAmount===a?T.presetActive:T.presetInactive,border:`1px solid ${investAmount===a?T.borderActive:T.border}`,borderRadius:"8px",cursor:"pointer",color:investAmount===a?T.accent:T.presetInactiveText,fontSize:"13px",fontWeight:"400",transition:"all 0.15s"}}>{parseInt(a)>=10000?`${parseInt(a)/10000}억원`:parseInt(a)>=1000?`${parseInt(a)/1000}천만원`:parseInt(a)>=100?`${parseInt(a)}만원`:`${parseInt(a)*10}만원`}</button>)}
            </div>
            <div style={{position:"relative"}}>
              <input type="number" value={investAmount} onChange={e=>setInvestAmount(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"13px 60px 13px 16px",color:T.text,fontSize:"16px",fontWeight:"400",outline:"none"}} placeholder="직접 입력"/>
              <span style={{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)",color:T.textSub,fontSize:"13px",fontWeight:"400"}}>만원</span>
            </div>
          </div>

          {/* STEP 4 */}
          <div style={sec}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
              <div style={{...snStyle,background:"linear-gradient(135deg,#22c55e,#15803d)"}}>4</div>
              <span style={{fontSize:"17px",fontWeight:"300",color:T.text,letterSpacing:"-0.3px"}}>수익률 계산</span>
              <div style={{flex:1,height:"1px",background:T.border}}/>
            </div>
            <button onClick={handleCalculate} disabled={loading||priceLoading||!buyPrice} style={{width:"100%",padding:"18px",background:(loading||priceLoading||!buyPrice)?T.presetActive:`linear-gradient(135deg,${T.accentDim},#15803d)`,border:"none",borderRadius:"14px",cursor:(loading||priceLoading||!buyPrice)?"not-allowed":"pointer",color:"#fff",fontSize:"17px",fontWeight:"300",letterSpacing:"-0.3px",transition:"all 0.2s"}}>
              {loading?"🦜 껄무새 계산 중…":priceLoading?"📡 시세 조회 중…":!buyPrice?"연도를 선택해주세요":"📈 수익률 계산하기"}
            </button> 
          <div style={{marginTop:"20px"}}><CoupangBanner isDark={isDark} T={T}/></div>
          </div>

          {/* 결과 */}
          {result&&(
            <div id="result-section" key={animKey} style={{marginBottom:"48px",animation:"slideUp 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
                <div style={{...snStyle,background:"linear-gradient(135deg,#f59e0b,#d97706)",fontSize:"16px"}}>🦜</div>
                <span style={{fontSize:"17px",fontWeight:"300",color:T.text,letterSpacing:"-0.3px"}}>결과</span>
                <div style={{flex:1,height:"1px",background:T.border}}/>
              </div>
              <div style={{background:T.bgResult,border:`1px solid ${result.isProfit?T.accentDim+"80":"#ef444460"}`,borderRadius:"20px",overflow:"hidden",boxShadow:result.isProfit?`0 8px 40px ${T.accent}15`:"0 8px 40px rgba(239,68,68,0.12)"}}>
                <div style={{height:"3px",background:result.isProfit?`linear-gradient(90deg,${T.accentDim},${T.accent})`:"linear-gradient(90deg,#ef4444,#f87171)"}}/>
                <div style={{padding:"22px 20px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
                    <div>
                      <div style={{fontSize:"15px",color:T.text,fontWeight:"300"}}>{selectedStock.name}</div>
                      <div style={{fontSize:"13px",color:T.textSub,marginTop:"3px",fontWeight:"400"}}>{result.buyDateStr} <br/> → 오늘 · {result.years}년 보유</div>
                    </div>
                    <div style={{background:result.isProfit?`${T.accent}20`:"rgba(239,68,68,0.15)",border:`1px solid ${result.isProfit?T.accent+"50":"#ef444450"}`,borderRadius:"12px",padding:"10px 16px",textAlign:"center"}}>
                      <div style={{fontSize:"20px",fontWeight:"300",color:result.isProfit?T.accent:"#f87171",lineHeight:1}}>{result.isProfit?"+":""}{result.returnPct}%</div>
                      <div style={{fontSize:"11px",color:T.textSub,marginTop:"3px",fontWeight:"400"}}>연평균 수익률 {result.isProfit?"+":""}{result.cagr}%</div>
                    </div>
                  </div>
                  <div style={{background:isDark?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.04)",borderRadius:"14px",padding:"22px 16px 18px",marginBottom:"16px",textAlign:"center",border:`1px solid ${result.isProfit?T.accent+"20":"#ef444425"}`}}>
                    <div style={{fontSize:"40px",marginBottom:"10px"}}>{result.isProfit?(parseFloat(result.returnPct)>1000?"🦜🦜🦜":parseFloat(result.returnPct)>300?"🦜🦜":"🦜"):(parseFloat(result.returnPct)<-40?"😭":"😩")}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px",marginBottom:"16px"}}>
                      <div style={{textAlign:"center"}}><div style={{fontSize:"12px",color:T.textSub,marginBottom:"4px",fontWeight:"400"}}>투자 원금</div><div style={{fontSize:"15px",color:T.textSub,fontWeight:"300"}}>{formatKRW(parseInt(investAmount)*10000)}</div></div>
                      <div style={{fontSize:"20px",color:T.textMuted}}>→</div>
                      <div style={{textAlign:"center"}}><div style={{fontSize:"12px",color:T.textSub,marginBottom:"4px",fontWeight:"400"}}>현재 가치</div><div style={{fontSize:"28px",fontWeight:"500",color:result.isProfit?T.accent:"#f87171",letterSpacing:"-0.5px"}}><CountUp key={animKey} target={result.currentValueKRW} duration={1500}/></div>{isUSD&&<div style={{fontSize:"12px",color:T.textMuted,marginTop:"3px",fontWeight:"400"}}>{formatUSD(result.currentValueKRW/usdToKrw)}</div>}</div>
                    </div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 18px",background:result.isProfit?`${T.accent}15`:"rgba(239,68,68,0.12)",borderRadius:"20px",border:`1px solid ${result.isProfit?T.accent+"35":"#ef444435"}`}}>
                      <span style={{fontSize:"16px",color:result.isProfit?T.accent:"#f87171"}}>{result.isProfit?"▲":"▼"}</span>
                      <span style={{fontSize:"15px",fontWeight:"300",color:result.isProfit?T.accent:"#f87171"}}>{formatKRW(Math.abs(result.profitKRW))} {result.isProfit?"수익":"손실"}</span>
                    </div>
                  
                  </div>
                  <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
                    {[{label:"매수가",value:displayPrice(result.buyPrice)},{label:"현재가",value:displayPrice(result.currentPrice)},{label:"연평균 수익률",value:`${result.isProfit?"+":""}${result.cagr}%`,h:true}].map(item=>(
                      <div key={item.label} style={{flex:1,padding:"12px 8px",textAlign:"center",background:item.h?(result.isProfit?`${T.accent}15`:"rgba(239,68,68,0.1)"):isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.03)",borderRadius:"10px",border:`1px solid ${item.h?(result.isProfit?T.accent+"35":"#ef444435"):T.border}`}}>
                        <div style={{fontSize:"11px",color:T.textSub,marginBottom:"5px",fontWeight:"400"}}>{item.label}</div>
                        <div style={{fontSize:"13px",fontWeight:"300",color:item.h?(result.isProfit?T.accent:"#f87171"):T.text,wordBreak:"break-all"}}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:"0 20px 22px"}}>
                  <div style={{padding:"16px",background:result.isProfit?`${T.accent}10`:"rgba(239,68,68,0.08)",border:`1px solid ${result.isProfit?T.accent+"25":"#ef444425"}`,borderRadius:"12px",textAlign:"center",marginBottom:"14px"}}>
                    <div style={{fontSize:"14px",color:result.isProfit?T.accent:"#f87171",fontStyle:"normal",lineHeight:"1.7",fontWeight:"400"}}>"{witMsgs[animKey%3]}"</div>
                  </div>

                  {/* 📥 이미지로 저장하기 */}
                  <button onClick={()=>setShowShareCard(true)} style={{width:"100%",padding:"14px",background:result.isProfit?`linear-gradient(135deg,${T.accentDim},#15803d)`:"linear-gradient(135deg,#dc2626,#b91c1c)",border:"none",borderRadius:"12px",cursor:"pointer",color:"#fff",fontSize:"15px",fontWeight:"300",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"16px"}}>
                    📥 이미지로 저장하기
                  </button>

                  {/* 🔀 다른 종목과 비교 — 칩 바로 노출 */}
                  <div style={{marginBottom:"14px"}}>
                    <div style={{fontSize:"13px",color:T.textMuted,fontWeight:"400",marginBottom:"10px",textAlign:"center"}}>다른 종목과 비교해볼까요?</div>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center",marginBottom:"12px"}}>
                      {[...US_PRESETS,...KR_PRESETS,...INDEX_PRESETS.slice(0,2)].filter(s=>s.ticker!==selectedStock.ticker).slice(0,12).map(s=>(
                        <button key={s.ticker} onClick={()=>setCompareStock(cs=>cs?.ticker===s.ticker?null:s)} style={{padding:"7px 13px",background:compareStock?.ticker===s.ticker?T.presetActive:T.presetInactive,border:`1px solid ${compareStock?.ticker===s.ticker?T.borderActive:T.border}`,borderRadius:"20px",cursor:"pointer",color:compareStock?.ticker===s.ticker?T.accent:T.presetInactiveText,fontSize:"13px",fontWeight:"400",transition:"all 0.15s"}}>
                          {s.name}
                        </button>
                      ))}
                    </div>

                    {/* 비교 결과 */}
                    {compareStock&&compareResult&&(
                      <div style={{background:isDark?"rgba(0,0,0,0.2)":"rgba(0,0,0,0.03)",borderRadius:"14px",padding:"16px",border:`1px solid ${T.border}`}}>
                        <div style={{fontSize:"12px",color:T.textMuted,fontWeight:"400",marginBottom:"12px",textAlign:"center"}}>같은 기간 · 같은 금액 {formatKRW(parseInt(investAmount)*10000)}</div>
                        <div style={{display:"flex",gap:"10px"}}>
                          {[{name:selectedStock.name,r:result},{name:compareStock.name,r:compareResult}].map((item,i)=>{
                            const better=parseFloat(item.r.returnPct)>=parseFloat(i===0?compareResult.returnPct:result.returnPct);
                            return(
                              <div key={i} style={{flex:1,padding:"16px 12px",background:better?(result.isProfit?`${T.accent}12`:"rgba(239,68,68,0.08)"):"transparent",border:`2px solid ${better?(result.isProfit?T.accent+"60":"#ef444460"):T.border}`,borderRadius:"14px",textAlign:"center",transition:"all 0.3s"}}>
                                <div style={{fontSize:"12px",color:better?(result.isProfit?T.accent:"#f87171"):T.textMuted,fontWeight:"300",marginBottom:"6px"}}>{better?"👑 승자":"😢 패자"}</div>
                                <div style={{fontSize:"13px",fontWeight:"300",color:T.text,marginBottom:"8px"}}>{item.name}</div>
                                <div style={{fontSize:"22px",fontWeight:"300",color:parseFloat(item.r.returnPct)>=0?T.accent:"#f87171",letterSpacing:"-1px",lineHeight:1,marginBottom:"6px", wordBreake:"break-all"}}>{parseFloat(item.r.returnPct)>=0?"+":""}{item.r.returnPct}%</div>
                                <div style={{fontSize:"13px",color:T.textSub,fontWeight:"400"}}>{formatKRW(Math.round(item.r.currentValueKRW))}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {compareStock&&!compareResult&&(
                      <div style={{textAlign:"center",padding:"14px",color:T.textMuted,fontSize:"13px",fontWeight:"400"}}>⏳ 비교 계산 중…</div>
                    )}
                  </div>

                  <div style={{fontSize:"12px",color:T.textSub,textAlign:"center",lineHeight:"1.7",fontWeight:"400",marginBottom:"12px"}}>⚠️ 과거 수익률은 미래를 보장하지 않습니다.</div>
                      <div style={{marginTop:"14px",borderRadius:"12px",overflow:"hidden",border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"center",background:T.bgCard,padding:"8px 0"}}><iframe src="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width=360&height=250&tsource=" width="360" height="250" frameBorder="0" scrolling="no" referrerPolicy="unsafe-url"></iframe></div><div style={{padding:"5px 12px",fontSize:"10px",color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div></div>

                
                </div>
              </div>
            </div>
          )}
          {/* 쿠팡 배너 — 맨 아래 */}


        </div>

        {/* 푸터 */}
        <footer style={{maxWidth:"600px",margin:"0 auto",padding:"28px 16px 48px",borderTop:`1px solid ${T.border}`,textAlign:"center"}}>
          <div style={{fontSize:"22px",marginBottom:"6px"}}>🦜</div>
          <div style={{fontSize:"15px",fontWeight:"300",background:isDark?"linear-gradient(135deg,#fff,#86efac)":"linear-gradient(135deg,#0d1a10,#16a34a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"2px"}}>껄무새 · stockparrot.kr</div>
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
      `}</style>
    </>
  );
}
