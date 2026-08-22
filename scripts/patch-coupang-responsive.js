const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

if (source.includes('COUPANG_MEASURED_V2')) {
  console.log('Measured Coupang banner already applied.');
  process.exit(0);
}

const pattern = /function CoupangBanner\(\{isDark,T\}\)\{[\s\S]*?\n\}\n\nfunction CountUp/;
if (!pattern.test(source)) {
  console.warn('CoupangBanner target not found. Skipping.');
  process.exit(0);
}

const replacement = `function CoupangBanner({isDark,T}){
  // COUPANG_MEASURED_V2: Coupang carousel expects a numeric pixel width.
  const bannerRef=useRef(null);
  const [bannerWidth,setBannerWidth]=useState(320);

  useEffect(()=>{
    const el=bannerRef.current;
    if(!el) return;
    const updateWidth=()=>{
      const measured=Math.floor(el.clientWidth||el.getBoundingClientRect().width||320);
      if(measured>0) setBannerWidth(Math.max(280,Math.min(568,measured)));
    };
    updateWidth();
    let observer=null;
    if(typeof ResizeObserver!=="undefined"){
      observer=new ResizeObserver(updateWidth);
      observer.observe(el);
    }
    window.addEventListener("resize",updateWidth);
    return()=>{
      if(observer) observer.disconnect();
      window.removeEventListener("resize",updateWidth);
    };
  },[]);

  const coupangSrc="https://ads-partners.coupang.com/widgets.html?id=982204&template=carousel&trackingCode=AF6806576&subId=&width="+bannerWidth+"&height=140&tsource=stockparrot.kr";

  return(
    <div style={{marginBottom:"20px",borderRadius:"14px",overflow:"hidden",border:"1px solid "+T.border,background:T.bgCard}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",padding:"7px 10px",background:T.bgDeep,borderBottom:"1px solid "+T.border}}>
        <span style={{fontSize:"10px",color:T.textMuted,fontWeight:"500"}}>광고 · 쿠팡파트너스</span>
        <span style={{fontSize:"10px",color:T.textMuted,fontWeight:"400"}}>추천 상품</span>
      </div>
      <div ref={bannerRef} style={{width:"100%",minHeight:"140px",overflow:"hidden",background:T.bgCard}}>
        <iframe
          key={bannerWidth}
          title="쿠팡 파트너스 추천 상품"
          src={coupangSrc}
          width={bannerWidth}
          height="140"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{display:"block",width:"100%",height:"140px",border:0,margin:0,padding:0,background:T.bgCard}}
        />
      </div>
      <div style={{padding:"6px 12px",background:T.bgDeep,fontSize:"10px",lineHeight:1.5,color:T.textMuted,textAlign:"center",fontWeight:"400"}}>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
    </div>
  );
}

function CountUp`;

source = source.replace(pattern, replacement);
fs.writeFileSync(indexPath, source);
console.log('Measured Coupang banner applied.');
