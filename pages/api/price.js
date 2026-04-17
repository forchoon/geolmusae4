// pages/api/price.js
// Yahoo Finance 주가 조회 프록시
// 브라우저에서 직접 Yahoo에 요청하면 CORS 오류 → 서버가 대신 요청

export default async function handler(req, res) {
  const { ticker, period1, period2, range } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "ticker 파라미터가 필요합니다" });
  }

  try {
    let url;
    if (period1 && period2) {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&period1=${period1}&period2=${period2}`;
    } else {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=${range || "5d"}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Yahoo Finance 조회 실패" });
    }

    const data = await response.json();

    // 캐시 설정 (1분)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "서버 오류", message: err.message });
  }
}
