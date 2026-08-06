const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

function replaceOnce(from, to, label) {
  if (source.includes(to)) {
    console.log(`${label} already applied.`);
    return;
  }
  if (!source.includes(from)) {
    console.warn(`${label} target not found. Skipping.`);
    return;
  }
  source = source.replace(from, to);
  console.log(`${label} applied.`);
}

replaceOnce(
  '<div style={{maxWidth:"600px",margin:"0 auto",padding:"22px 20px 10px",textAlign:"left",position:"relative"}}>',
  '<div style={{maxWidth:"600px",margin:"0 auto",padding:"22px 20px 10px",textAlign:"center",position:"relative"}}>',
  'Center header container'
);

replaceOnce(
  '<img src="/stockparrot-logo.png" alt="껄무새" style={{width:"120px",maxWidth:"55%",height:"auto",display:"block",margin:"0"}}/>',
  '<img src="/stockparrot-logo.png" alt="껄무새" style={{width:"120px",maxWidth:"55%",height:"auto",display:"block",margin:"0 auto"}}/>',
  'Center header logo'
);

replaceOnce(
  '  const sec={marginBottom:"52px",paddingTop:"16px"};',
  '  const sec={marginBottom:"36px",paddingTop:"16px"};',
  'Tighten direct calculator step spacing'
);

const masterStart = source.indexOf('        <div style={{display:homeMode==="master"?"block":"none",maxWidth:"600px",margin:"0 auto 18px",padding:"0 16px"}}>');
const calculatorStart = source.indexOf('        <div id="calculator-start"', masterStart);
const masterButtonNeedle = '            <button type="button" disabled={masterResultLoading||!investAmount||Number(investAmount)<=0}';

if (source.includes('{/* master coupang ad */}')) {
  console.log('Master Coupang ad already applied.');
} else if (masterStart === -1 || calculatorStart === -1) {
  console.warn('Master tab block not found. Skipping master Coupang ad.');
} else {
  const masterBlock = source.slice(masterStart, calculatorStart);
  const localButtonIndex = masterBlock.indexOf(masterButtonNeedle);
  if (localButtonIndex === -1) {
    console.warn('Master calculate button not found. Skipping master Coupang ad.');
  } else {
    const absoluteButtonIndex = masterStart + localButtonIndex;
    const adBlock = [
      '            {/* master coupang ad */}',
      '            <div style={{marginBottom:"16px"}}><CoupangBanner isDark={isDark} T={T}/></div>',
      ''
    ].join('\n');
    source = source.slice(0, absoluteButtonIndex) + adBlock + source.slice(absoluteButtonIndex);
    console.log('Master Coupang ad applied.');
  }
}

fs.writeFileSync(indexPath, source);
