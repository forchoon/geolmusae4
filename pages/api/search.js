// pages/api/search.js
// Anthropic API 키를 서버에서만 사용 → 클라이언트에 노출 안 됨

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST만 허용됩니다" });
  }

  const { query, market } = req.body;

  if (!query) {
    return res.status(400).json({ error: "query 파라미터가 필요합니다" });
  }

  // API 키는 환경변수에서 읽음 (Vercel 대시보드에서 설정)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았습니다" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: market === "kr"
          ? `Korean stock lookup. Return ONLY valid JSON array. Format: [{"ticker":"005930.KS","name":"Samsung Electronics","nameKo":"삼성전자","market":"KR","ipoYear":2000}] Max 5 results. ticker must be Yahoo Finance format with .KS suffix. Return [] if nothing matches.`
          : `US stock lookup. Return ONLY valid JSON array. Format: [{"ticker":"AAPL","name":"Apple Inc.","nameKo":"애플","market":"US","ipoYear":1980}] Max 5 results. Return [] if nothing matches.`,
        messages: [{ role: "user", content: `Find stocks matching: "${query}"` }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map((b) => b.text || "").join("") || "[]";

    let results = [];
    try {
      results = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      results = [];
    }

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: "검색 실패", message: err.message });
  }
}
