export default function Privacy() {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "'Apple SD Gothic Neo', sans-serif",
      color: "#333",
      lineHeight: "1.8"
    }}>
      <h1 style={{fontSize: "24px", fontWeight: "700", marginBottom: "8px"}}>개인정보처리방침</h1>
      <p style={{fontSize: "13px", color: "#888", marginBottom: "32px"}}>최종 수정일: 2026년 4월 27일</p>

      <p>껄무새(stockparrot.kr, 이하 "서비스")는 사용자의 개인정보를 중요하게 생각하며, 다음과 같은 방침을 따릅니다.</p>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>1. 수집하는 정보</h2>
      <p>본 서비스는 사용자의 개인정보를 수집하지 않습니다. 다만, 서비스 이용 통계를 위해 다음 정보를 익명으로 수집할 수 있습니다:</p>
      <ul style={{paddingLeft: "20px"}}>
        <li>검색한 종목명 (익명)</li>
        <li>계산 횟수 (익명)</li>
      </ul>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>2. 정보의 이용</h2>
      <p>수집된 익명 데이터는 다음 목적으로만 사용됩니다:</p>
      <ul style={{paddingLeft: "20px"}}>
        <li>실시간 인기 종목 랭킹 표시</li>
        <li>서비스 품질 개선</li>
      </ul>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>3. 제3자 제공</h2>
      <p>수집된 정보는 제3자에게 제공되지 않습니다.</p>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>4. 외부 서비스</h2>
      <p>본 서비스는 다음 외부 서비스를 활용합니다:</p>
      <ul style={{paddingLeft: "20px"}}>
        <li>Yahoo Finance API (주가 데이터 조회)</li>
        <li>Google Sheets API (랭킹 데이터 저장)</li>
        <li>쿠팡 파트너스 (광고)</li>
      </ul>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>5. 투자 관련 고지</h2>
      <p>본 서비스는 참고용 엔터테인먼트 콘텐츠로, 투자 조언이 아닙니다. 과거 수익률은 미래 성과를 보장하지 않습니다.</p>

      <h2 style={{fontSize: "18px", fontWeight: "600", marginTop: "32px", marginBottom: "12px"}}>6. 문의</h2>
      <p>개인정보 관련 문의사항은 아래로 연락주세요:</p>
      <p>이메일: <a href="mailto:to.choon@gmail.com" style={{color: "#4ade80"}}>to.choon@gmail.com</a></p>

      <p style={{marginTop: "48px", fontSize: "12px", color: "#aaa"}}>© 2026 껄무새 (stockparrot.kr)</p>
    </div>
  );
}
