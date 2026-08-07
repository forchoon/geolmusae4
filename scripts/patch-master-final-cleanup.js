const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

// All master legacy cases are already rendered. Remove the old show-all button and its empty wrapper.
const buttonPatterns=[
  /<div[^>]*>\s*<button[^>]*onClick=\{\(\)=>setShowAllMasterCases\(!showAllMasterCases\)\}[^>]*>[\s\S]*?<\/button>\s*<\/div>/g,
  /<button[^>]*onClick=\{\(\)=>setShowAllMasterCases\(!showAllMasterCases\)\}[^>]*>[\s\S]*?<\/button>/g,
  /<button[^>]*>[\s\S]*?전체 사례 보기 \+4[\s\S]*?<\/button>/g
];
for(const re of buttonPatterns)s=s.replace(re,'');

// Avoid leaving any obsolete disclosure labels behind.
s=s.split('전체 사례 보기 +4').join('');
s=s.split('대표 사례 접기').join('');
s=s.split('펼쳐보기 +').join('');

// Beginner-friendly amount copy. Primary UI uses KRW; no K/M/B shorthand.
const swaps=[
  ['합계 $8M+ 매수 공개','약 110억 4,000만원 이상 매수 공개'],
  ['약 $1.39M 매수 공개','약 19억 1,800만원 매수 공개'],
  ['105,108주 · 약 $12.2M','105,108주 · 약 168억 3,600만원'],
  ['$8M+','약 110억 4,000만원 이상'],
  ['$1.39M','약 19억 1,800만원'],
  ['$12.2M','약 168억 3,600만원'],
  ['$1M~$5M','약 13억 8,000만원~69억원'],
  ['$500K~$1M','약 6억 9,000만원~13억 8,000만원'],
  ['$250K~$500K','약 3억 4,500만원~6억 9,000만원'],
  ['$100K~$250K','약 1억 3,800만원~3억 4,500만원'],
  ['$50K~$100K','약 6,900만원~1억 3,800만원'],
  ['$15K~$50K','약 2,070만원~6,900만원'],
  ['SEC 13F · Reuters','SEC 분기 보유신고 · Reuters'],
  ['SEC 13F','SEC 분기 보유신고']
];
for(const [a,b] of swaps)s=s.split(a).join(b);

fs.writeFileSync(p,s);
console.log('Master final cleanup applied.');
