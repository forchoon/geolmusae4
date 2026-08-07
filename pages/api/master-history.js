import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.SHEET_ID;
const TAB = 'master_history';
const ALLOWED = new Set(['buffett','ark','pelosi','parkYoungOk','kangBangCheon','leeChaeWon']);
const TRUSTED_SOURCE = /(?:sec\.gov|ark-funds\.com|disclosures-clerk\.house\.gov|reuters\.com)/i;

async function ensureTab(){
  const meta = await sheets.spreadsheets.get({ spreadsheetId:SHEET_ID, fields:'sheets.properties.title' });
  const exists=(meta.data.sheets||[]).some(s=>s.properties?.title===TAB);
  if(exists)return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId:SHEET_ID,
    requestBody:{requests:[{addSheet:{properties:{title:TAB}}}]}
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId:SHEET_ID,
    range:`${TAB}!A1:N1`,
    valueInputOption:'RAW',
    requestBody:{values:[['master','eventDate','ticker','badge','name','emoji','period','scale','summary','sourceLabel','sourceUrl','market','basis','archivedAt']]}
  });
}

function rowToItem(r){
  return {
    master:r[0]||'',eventDate:r[1]||'',ticker:r[2]||'',badge:r[3]||'',name:r[4]||'',emoji:r[5]||'',period:r[6]||'',scale:r[7]||'',summary:r[8]||'',sourceLabel:r[9]||'',sourceUrl:r[10]||'',market:r[11]||'',basis:r[12]||'',archivedAt:r[13]||''
  };
}

function key(master,item){return `${master}|${item.eventDate||''}|${item.ticker||''}|${item.badge||''}`;}

export default async function handler(req,res){
  try{
    if(!SHEET_ID||!process.env.GOOGLE_CREDENTIALS)return res.status(503).json({error:'history storage unavailable'});
    await ensureTab();

    if(req.method==='GET'){
      const master=String(req.query.master||'');
      if(!ALLOWED.has(master))return res.status(400).json({error:'invalid master'});
      const out=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID,range:`${TAB}!A2:N`});
      const items=(out.data.values||[]).map(rowToItem).filter(x=>x.master===master).sort((a,b)=>String(b.eventDate).localeCompare(String(a.eventDate)));
      res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=120');
      return res.status(200).json({items});
    }

    if(req.method==='POST'){
      const master=String(req.body?.master||'');
      const items=Array.isArray(req.body?.items)?req.body.items.slice(0,10):[];
      if(!ALLOWED.has(master))return res.status(400).json({error:'invalid master'});
      if(!items.length)return res.status(200).json({ok:true,added:0});

      const current=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID,range:`${TAB}!A2:N`});
      const seen=new Set((current.data.values||[]).map(rowToItem).map(x=>key(x.master,x)));
      const now=new Date().toISOString();
      const rows=[];
      for(const item of items){
        if(!item||!item.ticker||!item.eventDate)continue;
        if(item.sourceUrl&&!TRUSTED_SOURCE.test(String(item.sourceUrl)))continue;
        const k=key(master,item);
        if(seen.has(k))continue;
        seen.add(k);
        rows.push([master,item.eventDate||'',item.ticker||'',item.badge||'',item.name||'',item.emoji||'',item.period||'',item.scale||'',item.summary||'',item.sourceLabel||'',item.sourceUrl||'',item.market||'',item.basis||'',now]);
      }
      if(rows.length){
        await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:`${TAB}!A:N`,valueInputOption:'RAW',requestBody:{values:rows}});
      }
      return res.status(200).json({ok:true,added:rows.length});
    }

    return res.status(405).json({error:'method not allowed'});
  }catch(error){
    console.error('Master history API error:',error);
    return res.status(500).json({error:'history failed',details:error.message});
  }
}
