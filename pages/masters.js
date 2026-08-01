import { useMemo, useState } from "react";
import Head from "next/head";

const MASTERS = [
  {
    id: "buffett",
    emoji: "🧓",
    name: "워런 버핏",
    label: "느리지만 무서운 장기 껄무새",
    source: "Berkshire Hathaway 13F 기반 과거 사례",
    color: "#4ade80",
    trades: [
      { symbol: "AAPL", name: "Apple", year: 2016, action: "2016 Q1 최초 편입", copy: "버핏이 애플을 처음 담았을 때 나도 샀다면?", note: "13F는 분기말 보유 공시라 정확한 매수일·단가는 알 수 없어요." },
      { symbol: "KO", name: "Coca-Cola", year: 1988, action: "장기 보유 대표 사례", copy: "배당왕을 그때 샀다면 어땠을까?", note: "현재 계산기는 일부 대표 종목만 지원해요. 미지원 종목은 순차 추가 예정입니다." },
      { symbol: "CVX", name: "Chevron", year: 2020, action: "에너지 비중 확대 사례", copy: "에너지 껄무새였을까?", note: "공시 기반 과거 사례이며 투자 권유가 아니에요." },
    ],
  },
  {
    id: "wood",
    emoji: "🚀",
    name: "캐시 우드",
    label: "미래를 너무 빨리 본 껄무새",
    source: "ARK 공개 자료 기반 과거 사례",
    color: "#60a5fa",
    trades: [
      { symbol: "TSLA", name: "Tesla", year: 2018, action: "대표 성장주 보유 사례", copy: "테슬라를 그때 같이 탔다면?", note: "ARK 사례는 공개 자료 기준으로 정리 예정입니다." },
      { symbol: "COIN", name: "Coinbase", year: 2021, action: "테마 성장주 사례", copy: "미래를 믿은 결과는 어땠을까?", note: "일부 종목은 데이터 연결 후 계산 지원 예정입니다." },
      { symbol: "ROKU", name: "Roku", year: 2019, action: "고변동 성장주 사례", copy: "고점과 저점을 버틸 수 있었을까?", note: "과거 성과는 미래 수익을 보장하지 않아요." },
    ],
  },
  {
    id: "pelosi",
    emoji: "👀",
    name: "낸시 펠로시",
    label: "이상하게 타이밍 좋은 껄무새",
    source: "미국 정치인 거래 공시 기반 과거 사례",
    color: "#f59e0b",
    trades: [
      { symbol: "NVDA", name: "NVIDIA", year: 2023, action: "반도체 테마 거래 사례", copy: "엔비디아를 그때 봤다면?", note: "정치인 거래 공시는 금액 구간·보고 지연이 있을 수 있어요." },
      { symbol: "AAPL", name: "Apple", year: 2020, action: "빅테크 거래 사례", copy: "빅테크 껄무새였을까?", note: "공시 기반 과거 사례이며 투자 권유가 아니에요." },
      { symbol: "MSFT", name: "Microsoft", year: 2021, action: "클라우드/AI 테마 사례", copy: "마이크로소프트를 그때 샀다면?", note: "정확한 거래 단가가 아닌 계산용 기준가로 시뮬레이션됩니다." },
    ],
  },
];

const SUPPORTED = new Set(["AAPL", "TSLA", "NVDA", "MSFT"]);

const theme = {
  bg: "#06130c",
  card: "#0d1f14",
  card2: "#10291a",
  text: "#f5f7f4",
  sub: "#a8b8ad",
  muted: "#708079",
  border: "rgba(255,255,255,0.1)",
  accent: "#4ade80",
};

export default function Masters(){
  const [activeId, setActiveId] = useState("buffett");
  const active = useMemo(()=>MASTERS.find(m=>m.id===activeId) || MASTERS[0], [activeId]);

  const startCalc = (trade) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("masterPrefill", JSON.stringify({
      source: "masters-lite",
      master: active.name,
      ticker: trade.symbol,
      yahooTicker: trade.symbol,
      name: trade.name,
      year: trade.year,
      amount: "100",
      market: "us",
    }));
    window.location.href = "/";
  };

  return (
    <>
      <Head>
        <title>거장의 발자취 - 껄무새</title>
        <meta name="description" content="버핏, 캐시 우드, 펠로시의 과거 공시 사례를 껄무새 계산기로 연결해보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <main style={{minHeight:"100vh",background:`radial-gradient(circle at top, rgba(74,222,128,0.16), transparent 34%), ${theme.bg}`,color:theme.text,fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif",padding:"22px 16px 42px"}}>
        <div style={{maxWidth:"620px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"22px"}}>
            <a href="/" style={{color:theme.sub,textDecoration:"none",fontSize:"13px",fontWeight:700}}>← 계산기로</a>
            <div style={{fontSize:"12px",color:theme.muted,fontWeight:700,border:`1px solid ${theme.border}`,borderRadius:"999px",padding:"7px 10px",background:"rgba(0,0,0,0.18)"}}>Lite Beta</div>
          </div>

          <section style={{background:"linear-gradient(135deg, rgba(74,222,128,0.18), rgba(255,255,255,0.04))",border:`1px solid ${theme.border}`,borderRadius:"24px",padding:"22px 18px",boxShadow:"0 18px 50px rgba(0,0,0,0.24)",marginBottom:"16px"}}>
            <div style={{fontSize:"40px",marginBottom:"10px"}}>👣</div>
            <h1 style={{fontSize:"30px",lineHeight:1.12,letterSpacing:"-1.3px",margin:"0 0 10px",fontWeight:900}}>거장의 발자취</h1>
            <p style={{fontSize:"14px",lineHeight:1.65,color:theme.sub,margin:"0 0 16px"}}>
              버핏도, 캐시 우드도, 펠로시도 결국 지나고 보면 껄무새입니다. 과거 공시 사례를 보고 “그때 나도 샀다면?”을 바로 계산해보세요.
            </p>
            <div style={{fontSize:"11px",lineHeight:1.55,color:theme.muted,background:"rgba(0,0,0,0.2)",border:`1px solid ${theme.border}`,borderRadius:"14px",padding:"11px 12px"}}>
              과거 공시와 대표 사례를 기반으로 한 탐색 기능입니다. 특정 종목 매수·매도 권유가 아니며, 13F/PTR 등 공시는 보고 지연과 가격 추정 오차가 있을 수 있어요.
            </div>
          </section>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"8px",marginBottom:"14px"}}>
            {MASTERS.map(master => {
              const activeMaster = master.id === activeId;
              return (
                <button key={master.id} onClick={()=>setActiveId(master.id)} style={{border:`1px solid ${activeMaster ? master.color : theme.border}`,background:activeMaster ? `${master.color}1f` : theme.card,borderRadius:"16px",padding:"12px 8px",color:theme.text,cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:"24px",marginBottom:"6px"}}>{master.emoji}</div>
                  <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"-0.2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{master.name}</div>
                </button>
              );
            })}
          </div>

          <section style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:"22px",padding:"16px",marginBottom:"14px"}}>
            <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"14px"}}>
              <div style={{width:"48px",height:"48px",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",background:`${active.color}20`,border:`1px solid ${active.color}66`}}>{active.emoji}</div>
              <div style={{minWidth:0}}>
                <h2 style={{fontSize:"20px",lineHeight:1.2,margin:"0 0 4px",letterSpacing:"-0.6px"}}>{active.name}</h2>
                <div style={{fontSize:"13px",color:active.color,fontWeight:800}}>{active.label}</div>
                <div style={{fontSize:"11px",color:theme.muted,marginTop:"4px"}}>{active.source}</div>
              </div>
            </div>

            <div style={{display:"grid",gap:"10px"}}>
              {active.trades.map((trade, idx) => {
                const supported = SUPPORTED.has(trade.symbol);
                return (
                  <div key={`${active.id}-${trade.symbol}-${idx}`} style={{border:`1px solid ${theme.border}`,background:theme.card2,borderRadius:"18px",padding:"14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"flex-start",marginBottom:"8px"}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"5px"}}>
                          <span style={{fontSize:"18px",fontWeight:900,letterSpacing:"-0.3px"}}>{trade.name}</span>
                          <span style={{fontSize:"11px",color:theme.muted,border:`1px solid ${theme.border}`,borderRadius:"999px",padding:"3px 7px"}}>{trade.symbol}</span>
                        </div>
                        <div style={{fontSize:"12px",color:active.color,fontWeight:800}}>{trade.action}</div>
                      </div>
                      <div style={{fontSize:"12px",color:theme.sub,fontWeight:800,whiteSpace:"nowrap"}}>{trade.year}</div>
                    </div>
                    <div style={{fontSize:"14px",lineHeight:1.5,color:theme.text,marginBottom:"8px",fontWeight:700}}>{trade.copy}</div>
                    <div style={{fontSize:"11px",lineHeight:1.5,color:theme.muted,marginBottom:"12px"}}>{trade.note}</div>
                    <button disabled={!supported} onClick={()=>startCalc(trade)} style={{width:"100%",height:"44px",borderRadius:"13px",border:supported?"none":`1px solid ${theme.border}`,background:supported?`linear-gradient(135deg, ${active.color}, #15803d)`:"rgba(255,255,255,0.04)",color:supported?"#031008":theme.muted,fontSize:"14px",fontWeight:900,cursor:supported?"pointer":"not-allowed"}}>
                      {supported ? "그때 나도 샀다면?" : "계산 지원 준비 중"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <div style={{fontSize:"11px",lineHeight:1.6,color:theme.muted,textAlign:"center",padding:"0 6px"}}>
            본 화면은 라이트 베타입니다. 전체 포트폴리오가 아닌 대표 사례만 보여주며, 향후 공시 출처·분기 밴드·당신 vs 거장 비교를 순차 추가할 예정입니다.
          </div>
        </div>
      </main>
    </>
  );
}
