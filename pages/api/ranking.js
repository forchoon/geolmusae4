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