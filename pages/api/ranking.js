import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.SHEET_ID;

export default async function handler(req, res) {
  const { method } = req;

  try {
    // POST: 사용자가 계산할 때 데이터 기록
    if (method === 'POST') {
      const { ticker, tabType } = req.body;

      if (!ticker || !tabType) {
        return res.status(400).json({ error: 'Missing ticker or tabType' });
      }

      const timestamp = new Date().toISOString();

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${tabType}!A:D`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[ticker, timestamp, tabType, 1]]
        }
      });

      return res.status(200).json({ ok: true });
    }

    // GET: 랭킹 조회
    if (method === 'GET') {
      const { tab } = req.query;

      if (!tab) {
        return res.status(400).json({ error: 'Missing tab parameter' });
      }

      // 전체 탭에서 최신 종목 가져오기
      if (tab === 'all') {
        const tabs = ['us', 'kr', 'coin', 'index'];
        let allRows = [];

        for (const t of tabs) {
          try {
            const r = await sheets.spreadsheets.values.get({
              spreadsheetId: SHEET_ID,
              range: `${t}!A:D`
            });
            const rows = (r.data.values || []).map(row => [...row, t]);
            allRows = allRows.concat(rows);
          } catch(e) {}
        }

        // 타임스탬프 기준 정렬해서 가장 최근 종목
        allRows.sort((a, b) => {
          const ta = a[1] || '';
          const tb = b[1] || '';
          return tb.localeCompare(ta);
        });

        const lastTicker = allRows.length > 0 ? allRows[0][0] : null;
        const lastTimestamp = allRows.length > 0 ? allRows[0][1] : null;

        // 최근 5개 고유 종목 추출
        const recentFeed = [];
        const seen = new Set();
        for (const row of allRows) {
          if (!row[0]) continue;
          if (!seen.has(row[0])) {
            seen.add(row[0]);
            recentFeed.push({ ticker: row[0], timestamp: row[1] });
          }
          if (recentFeed.length >= 5) break;
        }

        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
        return res.json({ lastTicker, lastTimestamp, recentFeed });
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${tab}!A:D`
      });

      const data = response.data.values || [];

      // 전체 누적 데이터
      const counts = {};
      data.forEach(row => {
        if (!row[0]) return;
        const ticker = row[0];
        counts[ticker] = (counts[ticker] || 0) + 1;
      });

      const ranking = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const lastTicker = data.length > 0
        ? data[data.length - 1][0]
        : null;

      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
      return res.json({
        ranking,
        lastTicker,
        total: Object.values(counts).reduce((a, b) => a + b, 0)
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Ranking API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}