export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Missing ticker' });

  try {
    const now = Math.floor(Date.now() / 1000);
    const fifteenYearsAgo = now - (15 * 365 * 24 * 60 * 60);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1wk&period1=${fifteenYearsAgo}&period2=${now}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) throw new Error('Yahoo Finance API failed');

    const data = await response.json();
    const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
    const timestamps = data?.chart?.result?.[0]?.timestamp || [];

    if (quotes.length === 0) throw new Error('No data');

    const currentMonth = new Date().getMonth();
    const yearMap = new Map();

    timestamps.forEach((ts, idx) => {
      const date = new Date(ts * 1000);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (month === currentMonth && quotes[idx]) {
        if (!yearMap.has(year)) {
          yearMap.set(year, parseFloat(quotes[idx].toFixed(2)));
        }
      }
    });

    const sortedData = Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, price]) => price);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.json({ data: sortedData, years: Array.from(yearMap.keys()).sort() });

  } catch (error) {
    console.error('Chart API error:', error);
    return res.status(500).json({ error: error.message });
  }
}