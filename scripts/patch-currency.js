const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
const source = fs.readFileSync(indexPath, 'utf8');

const oldCode = 'function getCurrency(yt){return CURRENCY_MAP[yt]||"USD";}';
const newCode = 'function getCurrency(yt){if(!yt)return "USD";if(yt==="^KS11"||yt.endsWith(".KS")||yt.endsWith(".KQ"))return "KRW";return CURRENCY_MAP[yt]||"USD";}';

if (source.includes(newCode)) {
  console.log('Currency patch already applied.');
  process.exit(0);
}

if (!source.includes(oldCode)) {
  console.warn('Currency patch target not found. Skipping.');
  process.exit(0);
}

fs.writeFileSync(indexPath, source.replace(oldCode, newCode));
console.log('Currency patch applied: .KS/.KQ tickers now use KRW.');
