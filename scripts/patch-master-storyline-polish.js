const fs=require('fs');
const path=require('path');
const p=path.join(process.cwd(),'pages','index.js');
let s=fs.readFileSync(p,'utf8');

const fixes=[
  [
    'minWidth:`${Math.max(100,selectedMaster.cases.length*92)}%`',
    'minWidth:`${Math.max(520,selectedMaster.cases.length*92+16)}px`',
    'Legend timeline width'
  ],
  [
    '{g.text}',
    '{g.desc||g.text||""}',
    'Legend glossary description'
  ],
  [
    '>🇺🇸 해외</button>',
    '>🇺🇸 미국주식</button>',
    'Master US market tab label'
  ],
  [
    '>🇰🇷 국내</button>',
    '>🇰🇷 국내주식</button>',
    'Master KR market tab label'
  ]
];

for(const [from,to,label] of fixes){
  if(s.includes(to)){console.log(`${label} already applied.`);continue;}
  if(!s.includes(from)){console.warn(`${label} target not found.`);continue;}
  s=s.replace(from,to);
  console.log(`${label} applied.`);
}

fs.writeFileSync(p,s);
console.log('Master storyline polish applied.');
