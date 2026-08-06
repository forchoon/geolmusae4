const fs = require('fs');
const path = require('path');

const indexPath = path.join(process.cwd(), 'pages', 'index.js');
let source = fs.readFileSync(indexPath, 'utf8');

const markerData = String.raw`const DIRECT_MASTER_MARKERS = {
  AAPL:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2016,dateLabel:"2016 Q1",label:"보유 최초 공개",kind:"period"}],
  KO:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:1988,dateLabel:"1988~1994",label:"매입 기간",kind:"period"}],
  AXP:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:1991,dateLabel:"1991~1995",label:"매입 기간",kind:"period"}],
  BAC:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2011,dateLabel:"2011-08-25",label:"계약 발표",kind:"date"}],
  CVX:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2020,dateLabel:"2020 Q4",label:"보유 신규 공개",kind:"period"}],
  OXY:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2022,dateLabel:"2022-08-04",label:"의결권 20% 돌파",kind:"date"}],
  AMZN:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2019,dateLabel:"2019 Q1",label:"보유 최초 공개",kind:"period"}],
  MCO:[{master:"워런 버핏",shortName:"버핏",emoji:"🧓",year:2000,dateLabel:"2000",label:"분할 상장으로 보유",kind:"period"}],
  TSLA:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2014,dateLabel:"2014 이후",label:"ETF 초기 편입",kind:"period"}],
  COIN:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2021,dateLabel:"2021 상장 이후",label:"ETF 편입",kind:"period"}],
  ROKU:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2019,dateLabel:"2019 대표 기준",label:"대표 보유 사례",kind:"period"}],
  ZM:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2020,dateLabel:"2020 대표 기준",label:"대표 보유 사례",kind:"period"}],
  HOOD:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2021,dateLabel:"2021 상장 이후",label:"ETF 편입",kind:"period"}],
  CRSP:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2017,dateLabel:"2017 대표 기준",label:"유전자 편집 테마",kind:"period"}],
  SHOP:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2022,dateLabel:"2022 대표 기준",label:"혁신 포트폴리오",kind:"period"}],
  PATH:[{master:"캐시 우드·ARK",shortName:"ARK",emoji:"🚀",year:2021,dateLabel:"2021 상장 이후",label:"자동화 테마 편입",kind:"period"}],
  PANW:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2024,dateLabel:"2024-02-12·21",label:"배우자 콜옵션 매수",kind:"date"}],
  AVGO:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2024,dateLabel:"2024-06-24",label:"배우자 콜옵션 매수",kind:"date"}],
  NVDA:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2024,dateLabel:"2024-06-26",label:"배우자 보통주 매수",kind:"date"}],
  MSFT:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2021,dateLabel:"2021-03-19",label:"배우자 콜옵션 행사",kind:"date"}],
  GOOGL:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2021,dateLabel:"2021-12-17",label:"배우자 콜옵션 매수",kind:"date"}],
  TEM:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2025,dateLabel:"2025-01-14",label:"배우자 콜옵션 매수",kind:"date"}],
  VST:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2025,dateLabel:"2025-01-14",label:"배우자 콜옵션 매수",kind:"date"}],
  CRM:[{master:"펠로시 일가",shortName:"펠로시",emoji:"👀",year:2021,dateLabel:"2021-12-20",label:"배우자 콜옵션 매수",kind:"date"}]
};`;

if (!source.includes('const DIRECT_MASTER_MARKERS = {')) {
  const anchor = 'const THEMES = {';
  if (!source.includes(anchor)) throw new Error('Theme anchor not found');
  source = source.replace(anchor, markerData + '\n\n' + anchor);
  console.log('Direct calculator master marker data injected.');
} else {
  console.log('Direct calculator master marker data already injected.');
}

const chartFetchStart = source.indexOf('async function fetchChartDataAPI(yahooTicker) {');
const chartFetchEnd = source.indexOf('\n\nasync function fetchYahooPrice', chartFetchStart);
if (chartFetchStart === -1 || chartFetchEnd === -1) throw new Error('fetchChartDataAPI target not found');
const chartFetchReplacement = String.raw`async function fetchChartDataAPI(yahooTicker) {
  try {
    const res = await fetch('/api/chart?ticker=' + encodeURIComponent(yahooTicker));
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return {data:json.data,years:Array.isArray(json.years)?json.years:null};
    }
    return null;
  } catch (error) {
    console.error('Chart fetch error:', error);
    return null;
  }
}`;
source = source.slice(0, chartFetchStart) + chartFetchReplacement + source.slice(chartFetchEnd);
console.log('Chart API payload now keeps year labels.');

if (!source.includes('const [chartYears,setChartYears]=useState(null);')) {
  const stateAnchor = '  const [chartData,setChartData]=useState(null);';
  if (!source.includes(stateAnchor)) throw new Error('chartData state anchor not found');
  source = source.replace(stateAnchor, stateAnchor + '\n  const [chartYears,setChartYears]=useState(null);');
  console.log('Chart year state injected.');
}

const effectStart = source.indexOf('  // 차트 데이터 로딩\n  useEffect(() => {');
const effectEnd = source.indexOf('\n\n  useEffect(()=>{\n    if(!selectedStock.yahooTicker)return;', effectStart);
if (effectStart === -1 || effectEnd === -1) throw new Error('Chart loading effect target not found');
const effectReplacement = String.raw`  // 차트 데이터 로딩
  useEffect(() => {
    if (!selectedStock.yahooTicker) return;
    const loadChartData = async () => {
      setChartLoading(true);
      const payload = await fetchChartDataAPI(selectedStock.yahooTicker);
      if (payload && payload.data && payload.data.length > 0) {
        setChartData(payload.data);
        setChartYears(payload.years);
      } else {
        const fallback = getChartData(selectedStock.ticker);
        setChartData(fallback);
        setChartYears(null);
      }
      setChartLoading(false);
    };
    loadChartData();
  }, [selectedStock.yahooTicker, selectedStock.ticker]);`;
source = source.slice(0, effectStart) + effectReplacement + source.slice(effectEnd);
console.log('Chart loading effect now stores year labels.');

if (!source.includes('                    chartYears={chartYears}')) {
  const propAnchor = '                    chartData={chartData}\n                    buyPrice={buyPrice}';
  if (!source.includes(propAnchor)) throw new Error('StockChart prop anchor not found');
  source = source.replace(propAnchor, '                    chartData={chartData}\n                    chartYears={chartYears}\n                    buyPrice={buyPrice}');
  console.log('StockChart year labels prop applied.');
}

const componentStart = source.indexOf('function StockChart(');
const componentEnd = source.indexOf('\n\nfunction CoupangBanner', componentStart);
if (componentStart === -1 || componentEnd === -1) throw new Error('StockChart component target not found');
const componentReplacement = String.raw`function StockChart({ticker,investYear,T,displayPrice,currentPrice,chartData,chartYears,buyPrice}){
  const [hoverIdx,setHoverIdx]=useState(null);
  const [showMasterMarks,setShowMasterMarks]=useState(true);
  const [selectedMarker,setSelectedMarker]=useState(null);
  const data=(chartData&&chartData.length>0)?chartData:getChartData(ticker);
  const yahooTicker=getYahooTicker(ticker)==='GOOG'?'GOOGL':getYahooTicker(ticker);
  const markerDefs=DIRECT_MASTER_MARKERS[yahooTicker]||[];
  const evidence=typeof MASTER_EVIDENCE!=='undefined'?MASTER_EVIDENCE[yahooTicker]:null;

  useEffect(()=>{
    setSelectedMarker(null);
    setShowMasterMarks(true);
  },[yahooTicker]);

  if(!data||data.length===0){
    return(
      <div style={{background:T.bgCard,border:'1px solid '+T.border,borderRadius:'16px',padding:'40px 20px',textAlign:'center'}}>
        <div style={{fontSize:'13px',color:T.textMuted}}>차트 데이터를 불러오는 중...</div>
      </div>
    );
  }

  const W=480,H=160,P=12;
  const ipoYr=getIpoYear(yahooTicker);
  const years=(chartYears&&chartYears.length===data.length)
    ?chartYears.map(Number)
    :data.map((_,i)=>Math.round(ipoYr+(CURRENT_YEAR-ipoYr)*(i/Math.max(data.length-1,1))));
  const mn=Math.min(...data),mx=Math.max(...data);
  const mi=data.indexOf(mn),xi=data.indexOf(mx);
  const up=data[data.length-1]>=data[0],lc=up?'#4ade80':'#f87171';
  const xs=(W-P*2)/Math.max(data.length-1,1),yr=mx-mn||1;
  const tx=i=>P+i*xs;
  const ty=v=>H-P-((v-mn)/yr)*(H-P*2-24);
  const lp=data.map((v,i)=>(i===0?'M':'L')+tx(i).toFixed(1)+','+ty(v).toFixed(1)).join(' ');
  const fp=lp+' L'+tx(data.length-1).toFixed(1)+','+(H-P)+' L'+tx(0).toFixed(1)+','+(H-P)+' Z';
  const nearestIndex=year=>{
    let best=0,dist=Infinity;
    years.forEach((y,i)=>{const d=Math.abs(y-year);if(d<dist){dist=d;best=i;}});
    return best;
  };
  const bi=nearestIndex(investYear);
  const bx=tx(bi),by=ty(data[bi]);
  const hv=hoverIdx!==null?data[hoverIdx]:null,hx=hoverIdx!==null?tx(hoverIdx):null,hy=hoverIdx!==null?ty(hv):null;
  const labelW=70;
  const mnLbX=Math.min(Math.max(tx(mi),labelW/2),W-labelW/2);
  const mxLbX=Math.min(Math.max(tx(xi),labelW/2),W-labelW/2);
  const mnBelow=ty(mn)<H-30;
  const mnLbY=mnBelow?ty(mn)+22:ty(mn)-8;
  const mxLbY=ty(mx)-14;
  const markerLabelX=bx>W-60?Math.max(bx-20,50):Math.min(Math.max(bx,50),W-50);
  const visibleMarkers=markerDefs.filter(item=>item.year>=years[0]&&item.year<=years[years.length-1]);

  return(
    <div style={{padding:'4px 0 0',marginBottom:'4px'}}>
      {markerDefs.length>0&&(
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',margin:'0 2px 10px',padding:'9px 10px',background:T.bgDeep,border:'1px solid '+T.border,borderRadius:'10px'}}>
          <button type="button" onClick={()=>{setShowMasterMarks(true);setSelectedMarker(markerDefs[0]);}} style={{minWidth:0,display:'flex',alignItems:'center',gap:'7px',padding:0,border:'none',background:'transparent',cursor:'pointer',textAlign:'left'}}>
            <span style={{fontSize:'16px'}}>{markerDefs[0].emoji}</span>
            <span style={{minWidth:0}}>
              <span style={{display:'block',fontSize:'11px',fontWeight:'700',color:T.text}}>거장 발자취 · {markerDefs[0].shortName}</span>
              <span style={{display:'block',fontSize:'10px',color:T.textMuted,marginTop:'2px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{markerDefs[0].dateLabel} · {markerDefs[0].label}</span>
            </span>
          </button>
          <button type="button" onClick={()=>{setShowMasterMarks(v=>!v);setSelectedMarker(null);}} style={{flexShrink:0,padding:'6px 9px',border:'1px solid '+(showMasterMarks?T.borderActive:T.border),borderRadius:'999px',background:showMasterMarks?T.presetActive:'transparent',color:showMasterMarks?T.accent:T.textMuted,fontSize:'10px',fontWeight:'700',cursor:'pointer'}}>{showMasterMarks?'표시 중':'숨김'}</button>
        </div>
      )}
      <svg width="100%" viewBox={'0 0 '+W+' '+H} style={{display:'block',overflow:'visible'}}
        onMouseMove={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          const x=(e.clientX-r.left)/r.width*W;
          const idx=Math.max(0,Math.min(data.length-1,Math.round((x-P)/xs)));
          setHoverIdx(idx);
        }}
        onMouseLeave={()=>setHoverIdx(null)}
      >
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lc} stopOpacity="0.18"/><stop offset="100%" stopColor={lc} stopOpacity="0"/></linearGradient></defs>
        <path d={fp} fill="url(#cg)"/>
        <path d={lp} fill="none" stroke={lc} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={tx(mi).toFixed(1)} cy={ty(mn).toFixed(1)} r="4" fill={T.bg} stroke="#f87171" strokeWidth="2"/>
        <rect x={(mnLbX-34).toFixed(1)} y={(mnLbY-13).toFixed(1)} width="68" height="16" rx="4" fill="#f8717122"/>
        <text x={mnLbX.toFixed(1)} y={mnLbY.toFixed(1)} textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="700">최저 {displayPrice(mn)}</text>
        <circle cx={tx(xi).toFixed(1)} cy={ty(mx).toFixed(1)} r="4" fill={T.bg} stroke="#fbbf24" strokeWidth="2"/>
        <rect x={(mxLbX-34).toFixed(1)} y={(mxLbY-13).toFixed(1)} width="68" height="16" rx="4" fill="#fbbf2422"/>
        <text x={mxLbX.toFixed(1)} y={mxLbY.toFixed(1)} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="700">최고 {displayPrice(mx)}</text>
        {showMasterMarks&&visibleMarkers.map((item,idx)=>{
          const itemIndex=nearestIndex(item.year);
          const itemX=tx(itemIndex);
          const itemY=ty(data[itemIndex]);
          const active=selectedMarker&&selectedMarker.master===item.master&&selectedMarker.dateLabel===item.dateLabel;
          return <g key={item.master+'-'+item.dateLabel} onClick={e=>{e.stopPropagation();setSelectedMarker(active?null:item);}} style={{cursor:'pointer'}}>
            {item.kind==='period'&&<rect x={(itemX-6).toFixed(1)} y="7" width="12" height={(H-20).toFixed(1)} rx="6" fill="#a78bfa18"/>}
            <line x1={itemX.toFixed(1)} y1="8" x2={itemX.toFixed(1)} y2={(H-P).toFixed(1)} stroke="#a78bfa" strokeWidth={active?'2':'1.4'} strokeDasharray={item.kind==='period'?'4 4':'0'} opacity={active?'1':'0.78'}/>
            <circle cx={itemX.toFixed(1)} cy={itemY.toFixed(1)} r={active?'7':'5.5'} fill="#a78bfa" stroke={T.bg} strokeWidth="2"/>
            <text x={itemX.toFixed(1)} y={(Math.max(itemY-10,15)).toFixed(1)} textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="800">{item.emoji} {item.shortName}</text>
          </g>;
        })}
        <circle cx={bx.toFixed(1)} cy={by.toFixed(1)} r="5" fill="#60a5fa" stroke={T.bg} strokeWidth="2"/>
        <text x={markerLabelX} y={(by-10).toFixed(1)} textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="700">{investYear}년 오늘 {buyPrice?displayPrice(buyPrice):displayPrice(data[bi])}</text>
        {hoverIdx!==null&&<circle cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="4" fill={lc} stroke={T.bg} strokeWidth="2"/>}
      </svg>
      {showMasterMarks&&markerDefs.length>0&&visibleMarkers.length===0&&(
        <div style={{margin:'5px 2px 0',fontSize:'10px',lineHeight:1.5,color:T.textMuted}}>현재 차트 범위 밖의 과거 발자취예요.</div>
      )}
      {selectedMarker&&(
        <div style={{margin:'8px 2px 2px',padding:'12px',background:T.bgDeep,border:'1px solid #a78bfa66',borderRadius:'12px',animation:'slideUp .25s ease-out'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'10px'}}>
            <div style={{minWidth:0}}>
              <div style={{fontSize:'13px',fontWeight:'800',color:T.text}}>{selectedMarker.emoji} {selectedMarker.master}</div>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#c4b5fd',marginTop:'4px'}}>{selectedMarker.dateLabel} · {selectedMarker.label}</div>
            </div>
            <span style={{flexShrink:0,fontSize:'9px',fontWeight:'800',color:selectedMarker.kind==='date'?'#93c5fd':'#c4b5fd',border:'1px solid '+(selectedMarker.kind==='date'?'#60a5fa66':'#a78bfa66'),padding:'4px 6px',borderRadius:'999px'}}>{selectedMarker.kind==='date'?'거래일 공개':'공시·대표 구간'}</span>
          </div>
          {evidence&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'6px',marginTop:'10px'}}>
              <div style={{padding:'8px 9px',background:T.bgCard,borderRadius:'8px'}}><div style={{fontSize:'9px',color:T.textMuted}}>공개 규모</div><div style={{fontSize:'10px',fontWeight:'700',lineHeight:1.45,color:T.textSub,marginTop:'3px'}}>{evidence.scale}</div></div>
              <div style={{padding:'8px 9px',background:T.bgCard,borderRadius:'8px'}}><div style={{fontSize:'9px',color:T.textMuted}}>자료 기준</div><div style={{fontSize:'10px',fontWeight:'700',lineHeight:1.45,color:T.textSub,marginTop:'3px'}}>{evidence.sourceLabel}</div></div>
            </div>
          )}
          <div style={{fontSize:'10px',lineHeight:1.55,color:T.textMuted,marginTop:'9px'}}>{selectedMarker.kind==='date'?'공개된 거래일 위치에 표시했어요.':'정확한 체결일이 공개되지 않아 공시 기준 연도 또는 대표 구간으로 표시했어요.'}</div>
          {evidence&&evidence.sourceUrl&&<a href={evidence.sourceUrl} target="_blank" rel="noreferrer" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'9px',paddingTop:'8px',borderTop:'1px solid '+T.border,color:'#c4b5fd',fontSize:'10px',fontWeight:'800',textDecoration:'none'}}><span>공개자료 근거</span><span>원문 보기 ↗</span></a>}
        </div>
      )}
    </div>
  );
}`;
source = source.slice(0, componentStart) + componentReplacement + source.slice(componentEnd);
console.log('Direct calculator chart master markers applied.');

fs.writeFileSync(indexPath, source);
