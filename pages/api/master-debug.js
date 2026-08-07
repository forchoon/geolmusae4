const XLSX=require('xlsx');
const pdfParse=require('pdf-parse');
const AdmZip=require('adm-zip');
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/139 Safari/537.36';
async function buf(url){const r=await fetch(url,{headers:{'User-Agent':UA,'Referer':'https://www.ark-funds.com/ark-trade-notifications'}});if(!r.ok)throw new Error(String(r.status));return Buffer.from(await r.arrayBuffer());}
export default async function handler(req,res){
  try{
    const b=await buf('https://etfs.ark-funds.com/hubfs/idt/trades/ARK_Trades.xls');
    const wb=XLSX.read(b,{type:'buffer',cellDates:true});
    const ark={};for(const n of wb.SheetNames)ark[n]=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,defval:'',raw:true}).slice(0,10);
    const year=new Date().getUTCFullYear();const z=new AdmZip(await buf(`https://disclosures-clerk.house.gov/public_disc/financial-pdfs/${year}FD.ZIP`));const t=z.getEntries().find(e=>/\.txt$/i.test(e.entryName));const lines=t.getData().toString('utf8').split(/\r?\n/).filter(x=>/pelosi/i.test(x)&&/\tP\t/.test(x)).slice(-5);
    const docs=lines.map(line=>{const c=line.split('\t');return c.find(v=>/^2\d{7}$/.test(v.trim()))?.trim();}).filter(Boolean).reverse();
    const house=[];for(const d of docs.slice(0,3)){try{const p=await buf(`https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/${year}/${d}.pdf`);const text=(await pdfParse(p)).text;house.push({doc:d,text:text.slice(0,5000)});}catch(e){house.push({doc:d,error:String(e.message||e)});}}
    res.status(200).json({ark,house});
  }catch(e){res.status(500).json({error:String(e.stack||e)});}
}
