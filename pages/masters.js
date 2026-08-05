import Head from "next/head";

const theme = {
  bg: "#06060f",
  card: "#10131a",
  card2: "#151a22",
  text: "#f6f7f5",
  sub: "#a8b0aa",
  muted: "#747d76",
  border: "rgba(255,255,255,0.1)",
  accent: "#4ade80",
};

const nextItems = [
  { emoji: "🚀", title: "캐시 우드 · Tesla", desc: "성장주 발자취 준비 중" },
  { emoji: "👀", title: "낸시 펠로시 · NVIDIA", desc: "정치인 거래 공시 버전 준비 중" },
];

export default function Masters(){
  const calcHref = "/?masterTicker=AAPL&masterName=Apple&masterYear=2016&masterAmount=100&masterSource=buffett";

  return (
    <>
      <Head>
        <title>거장의 발자취 - 껄무새</title>
        <meta name="description" content="워런 버핏의 과거 공시 사례를 껄무새 계산기로 연결해보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <main style={{minHeight:"100vh",background:theme.bg,color:theme.text,fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif",padding:"18px 16px 42px"}}>
        <div style={{maxWidth:"600px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"14px"}}>
            <a href="/" style={{color:theme.sub,textDecoration:"none",fontSize:"13px",fontWeight:700}}>← 계산기로</a>
            <div style={{fontSize:"11px",color:theme.muted,fontWeight:700,border:`1px solid ${theme.border}`,borderRadius:"999px",padding:"6px 9px",background:"rgba(255,255,255,0.03)"}}>Lite</div>
          </div>

          <section style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:"22px",padding:"18px",boxShadow:"0 14px 44px rgba(0,0,0,0.22)",marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}}>
              <div style={{width:"46px",height:"46px",borderRadius:"15px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"25px",background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.28)"}}>👣</div>
              <div>
                <div style={{fontSize:"12px",color:theme.accent,fontWeight:900,letterSpacing:"0.4px",marginBottom:"3px"}}>거장의 발자취</div>
                <h1 style={{fontSize:"24px",lineHeight:1.18,letterSpacing:"-0.9px",margin:0,fontWeight:900}}>버핏이 애플을 공시에 올린 해,<br/>나도 샀다면?</h1>
              </div>
            </div>

            <div style={{background:theme.card2,border:`1px solid ${theme.border}`,borderRadius:"18px",padding:"15px",marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:"12px",alignItems:"flex-start",marginBottom:"10px"}}>
                <div>
                  <div style={{fontSize:"18px",fontWeight:900,letterSpacing:"-0.4px",marginBottom:"4px"}}>워런 버핏 · Apple</div>
                  <div style={{fontSize:"12px",color:theme.accent,fontWeight:800}}>2016 Q1 Berkshire Hathaway 13F 신규 편입</div>
                </div>
                <div style={{fontSize:"12px",color:theme.sub,fontWeight:900,whiteSpace:"nowrap"}}>2016</div>
              </div>
              <p style={{fontSize:"14px",lineHeight:1.65,color:theme.sub,margin:"0 0 12px"}}>
                13F 공시 기준으로 버크셔 해서웨이가 Apple 보유를 처음 드러낸 시점입니다. 껄무새는 이 사례를 기존 계산기로 연결해 “그때 나도 샀다면?”만 계산합니다.
              </p>
              <div style={{fontSize:"11px",lineHeight:1.55,color:theme.muted,background:"rgba(0,0,0,0.18)",border:`1px solid ${theme.border}`,borderRadius:"13px",padding:"10px 11px",marginBottom:"14px"}}>
                정확한 매수일·단가는 알 수 없어요. 공시 기반 과거 사례이며, 특정 종목 매수·매도 권유가 아닙니다.
              </div>
              <a href={calcHref} style={{display:"flex",alignItems:"center",justifyContent:"center",height:"48px",borderRadius:"14px",textDecoration:"none",background:"linear-gradient(135deg,#4ade80,#15803d)",color:"#031008",fontSize:"15px",fontWeight:900,letterSpacing:"-0.2px"}}>
                2016년 Apple 계산하기
              </a>
            </div>

            <div style={{fontSize:"11px",lineHeight:1.6,color:theme.muted,textAlign:"center"}}>
              전체 포트폴리오 분석이 아니라, 껄무새 계산기로 이어지는 대표 발자취 1개만 먼저 보여줍니다.
            </div>
          </section>

          <section style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${theme.border}`,borderRadius:"18px",padding:"14px",marginBottom:"14px"}}>
            <div style={{fontSize:"12px",color:theme.sub,fontWeight:800,marginBottom:"10px"}}>다음 발자취 준비 중</div>
            <div style={{display:"grid",gap:"8px"}}>
              {nextItems.map(item => (
                <div key={item.title} style={{display:"flex",alignItems:"center",gap:"10px",padding:"11px",borderRadius:"14px",background:"rgba(255,255,255,0.03)",border:`1px solid ${theme.border}`}}>
                  <div style={{fontSize:"20px",width:"30px",textAlign:"center"}}>{item.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"13px",fontWeight:800,color:theme.text,marginBottom:"2px"}}>{item.title}</div>
                    <div style={{fontSize:"11px",color:theme.muted}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={{fontSize:"11px",lineHeight:1.6,color:theme.muted,textAlign:"center",padding:"0 6px"}}>
            과거 수익률은 미래 성과를 보장하지 않습니다. 본 기능은 엔터테인먼트용 과거 데이터 탐색입니다.
          </div>
        </div>
      </main>
    </>
  );
}
