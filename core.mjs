import {allowedRhythms,groups} from './data.mjs';
export const ids=allowedRhythms.map(r=>r.id);
export const missions=[
 {id:'sinus',title:'01 竇性心律',desc:'比較正常、過慢與過快',ids:['NSR','SB','ST']},
 {id:'early',title:'02 提早出現的心搏',desc:'辨認 APC 與 VPC',ids:['PAC','PVC']},
 {id:'atrial',title:'03 心房節律',desc:'比較心房撲動與顫動',ids:['AFL','AF']},
 {id:'ventricular',title:'04 心室節律',desc:'比較 VT 與 VF',ids:['VT','VF']},
 {id:'block',title:'05 房室傳導',desc:'看 PR 變化與 P–QRS 關係',ids:['AV1','AV2I','AV2II','AV3']}
];
export function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function question(id,level='intermediate'){
 if(!ids.includes(id))throw new Error('Rhythm outside allowedRhythms');
 const similar=groups[id].filter(x=>ids.includes(x)&&x!==id);
 let distractors;if(level==='beginner')distractors=shuffle(ids.filter(x=>x!==id)).slice(0,3);else if(level==='intermediate'){const two=shuffle(similar).slice(0,2);distractors=[...two,shuffle(ids.filter(x=>x!==id&&!two.includes(x)))[0]];}else distractors=similar.slice(0,3);
 return {id,options:shuffle([id,...distractors])};
}
export function deck(pool,n,level){
 pool=[...new Set(pool)].filter(id=>ids.includes(id));if(!pool.length)throw new Error('Empty rhythm pool');
 let order=[];while(order.length<n)order.push(...shuffle(pool));return order.slice(0,n).map(id=>question(id,level));
}
export function fresh(){return {version:1,xp:0,bestStreak:0,stats:{},best:{},wrongs:[]};}
export function normalize(raw){
 const out=fresh();const integer=n=>Number.isSafeInteger(n)&&n>=0?n:0;
 if(!raw||typeof raw!=='object')return out;out.xp=integer(raw.xp);out.bestStreak=integer(raw.bestStreak);
 for(const id of ids){const s=raw.stats?.[id];if(s)out.stats[id]={seen:integer(s.seen),right:Math.min(integer(s.right),integer(s.seen)),miss:integer(s.miss)};}
 for(const m of missions)out.best[m.id]=Math.min(100,integer(raw.best?.[m.id]));
 out.wrongs=[...new Set((Array.isArray(raw.wrongs)?raw.wrongs:[]).filter(x=>ids.includes(x)))];return out;
}
export function record(save,id,correct,streak){if(!ids.includes(id))throw new Error('Invalid rhythm');const s=save.stats[id]??={seen:0,right:0,miss:0};s.seen++;correct?s.right++:s.miss++;save.xp+=correct?10:2;save.bestStreak=Math.max(save.bestStreak,streak);if(!correct&&!save.wrongs.includes(id))save.wrongs.push(id);}
