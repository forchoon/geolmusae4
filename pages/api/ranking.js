import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.SHEET_ID;
const RECENT_DAYS = 7;

export default async function handler(req, res) {
  const { method } = req;

  try {
    // POST: 사용자가 계산한 종목·연도 조합 기록
    if (method === 'POST') {
      const { ticker, name, year, tabType } = req.body;

      if (!ticker || !tabType) {
        return res.status(400).json({ error: 'Missing ticker or tabType' });
      }

      const timestamp = new Date().toISOString();

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${tabType}!A:F`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[ticker, timestamp, tabType, 1, year || '', name || ticker]]
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
              range: `${t}!A:F`
            });
            const rows = (r.data.values || []).map(row => [...row, t]);
            allRows = allRows.concat(rows);
          } catch(e) {}
        }

        allRows.sort((a, b) => {
          const ta = a[1] || '';
          const tb = b[1] || '';
          return tb.localeCompare(ta);
        });

        const lastTicker = allRows.length > 0 ? allRows[0][5] || allRows[0][0] : null;
        const lastTimestamp = allRows.length > 0 ? allRows[0][1] : null;

        const recentFeed = [];
        const seen = new Set();
        for (const row of allRows) {
          if (!row[0]) continue;
          const label = row[5] || row[0];
          if (!seen.has(label)) {
            seen.add(label);
            recentFeed.push({ ticker: label, timestamp: row[1] });
          }
          if (recentFeed.length >= 5) break;
        }

        res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
        return res.json({ lastTicker, lastTimestamp, recentFeed });
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${tab}!A:F`
      });

      const data = response.data.values || [];
      const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
      const counts = new Map();

      data.forEach(row => {
        const ticker = row[0];
        const timestamp = row[1];
        const year = Number(row[4]);
        const name = row[5] || ticker;
        const time = Date.parse(timestamp || '');

        if (!ticker || !year || !Number.isFinite(time) || time < cutoff) return;

        const key = `${ticker}::${year}`;
        const prev = counts.get(key) || { ticker, name, year, count: 0 };
        prev.count += 1;
        counts.set(key, prev);
      });

      const ranking = Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const recentRows = data
        .filter(row => Number.isFinite(Date.parse(row[1] || '')) && Date.parse(row[1]) >= cutoff)
        .sort((a, b) => (b[1] || '').localeCompare(a[1] || ''));

      const lastTicker = recentRows.length > 0 ? recentRows[0][5] || recentRows[0][0] : null;

      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
      return res.json({
        ranking,
        lastTicker,
        total: ranking.reduce((sum, item) => sum + item.count, 0),
        periodDays: RECENT_DAYS
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Ranking API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
