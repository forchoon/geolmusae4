export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'Missing ticker' });

  try {
    const now = Math.floor(Date.now() / 1000);
    const historyStart = Math.floor(new Date('1980-01-01T00:00:00Z').getTime() / 1000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1wk&period1=${historyStart}&period2=${now}`;

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

    const today = new Date();
    const targetMonth = today.getUTCMonth();
    const targetDay = today.getUTCDate();
    const yearMap = new Map();

    timestamps.forEach((ts, idx) => {
      const price = quotes[idx];
      if (!price) return;

      const date = new Date(ts * 1000);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const distance = Math.abs(Date.UTC(2000, month, day) - Date.UTC(2000, targetMonth, targetDay));
      const previous = yearMap.get(year);

      if (!previous || distance < previous.distance) {
        yearMap.set(year, {
          price: parseFloat(price.toFixed(2)),
          distance,
        });
      }
    });

    const sortedEntries = Array.from(yearMap.entries()).sort((a, b) => a[0] - b[0]);
    const years = sortedEntries.map(([year]) => year);
    const chartData = sortedEntries.map(([, item]) => item.price);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.json({ data: chartData, years });

  } catch (error) {
    console.error('Chart API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
