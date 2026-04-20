// pages/api/search.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST만 허용됩니다" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "query 파라미터가 필요합니다" });
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=ko-KR&region=KR&quotesCount=8&newsCount=0`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const data = await response.json();
    const quotes = data?.quotes || [];

    const results = quotes
      .filter((q) => q.symbol && q.shortname)
      .map((q) => ({
        ticker: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        nameKo: q.longname || q.shortname || q.symbol,
        exchange: q.exchange,
        ipoYear: null,
      }));

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: "검색 실패", message: err.message });
  }
}
