const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

if (source.includes('COUPANG_NATIVE_320_V3')) {
  console.log('Native Coupang banner already applied.');
  process.exit(0);
}

const pattern = /function CoupangBanner\(\{isDark,T\}\)\{[\s\S]*?\n\}\n\nfunction CountUp/;
if (!pattern.test(source)) {
  console.warn('CoupangBanner target not found. Skipping.');
  process.exit(0);
}

const replacement = `function CoupangBanner({isDark,T}){
  // COUPANG_NATIVE_320_V3: keep Coupang widget at its native dimensions.
  // Stretching the iframe with CSS can desync the widget's internal layout from
  // the width/height query parameters and cause clipping or distortion.
  const coupangSrc="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width=320&height=100&tsource=stockparrot.kr";

  return(
    <div style={{marginBottom:"20px",borderRadius:"14px",overflow:"hidden",border:"1px solid "+T.border,background:T.bgCard}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",padding:"7px 10px",background:T.bgDeep,borderBottom:"1px solid "+T.border}}>
        <span style={{fontSize:"10px",color:T.textMuted,fontWeight:"500"}}>광고 · 쿠팡파트너스</span>
        <span style={{fontSize:"10px",color:T.textMuted,fontWeight:"400"}}>추천 상품</span>
      </div>
      <div style={{width:"100%",minHeight:"100px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:T.bgCard,padding:"0"}}>
        <iframe
          title="쿠팡 파트너스 추천 상품"
          src={coupangSrc}
          width="320"
          height="100"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{display:"block",width:"320px",maxWidth:"320px",height:"100px",border:0,margin:0,padding:0,flex:"0 0 320px",background:T.bgCard}}
        />
      </div>
      <div style={{padding:"6px 12px",background:T.bgDeep,fontSize:"10px",lineHeight:1.5,color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
    </div>
  );
}

function CountUp`;

source = source.replace(pattern, replacement);
fs.writeFileSync(indexPath, source);
console.log('Native Coupang banner applied.');
