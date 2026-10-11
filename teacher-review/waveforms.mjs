// Deterministic teaching simulations. Teacher review required before quiz use.
// Timeline: 10 s, 100 SVG units/s; one small square = .04 s / .1 mV.
import {allowedRhythms} from '../data.mjs';
const valid=new Set(allowedRhythms.map(x=>x.id));
export const duration=10, scale=100, gain=40;
const rates={NSR:[66,78,90],SB:[42,48,54],ST:[110,125,140],PAC:[72,80,88],PVC:[66,75,84],VT:[140,165,190]};
const seq=(start,period,end=10.5)=>{const a=[];for(let t=start;t<end;t+=period)a.push(t);return a;};
const round=x=>Math.round(x*1000)/1000;
export function specimen(id,index=0){
 if(!valid.has(id)||!Number.isInteger(index)||index<0||index>2)throw Error('Invalid approved rhythm/index');
 const e={id,index,p:[],q:[],pr:[],drop:[],baseline:'flat',description:'',atrialRate:null};
 const p=(t,amp=.17)=>e.p.push({t,width:.09,amp});
 const q=(t,width=.08,amp=1,polarity=1)=>e.q.push({t,width,amp,polarity});
 const conduct=(t,pr=.16,width=.08)=>{p(t);q(t+pr,width);e.pr.push(pr);};
 if(['NSR','SB','ST'].includes(id)){
  e.nominalRate=rates[id][index];const rr=60/e.nominalRate,pr=[.16,.18,.14][index];
  seq(.16,rr).forEach(t=>conduct(t,pr,[.08,.09,.07][index]));
  e.description=`心率 ${e.nominalRate} bpm；PR ${pr.toFixed(2)} 秒；QRS 寬度略有差異`;
 }else if(id==='PAC'||id==='PVC'){
  const rr=60/rates[id][index],pos=[3,5,7][index],coupling=rr*[.58,.62,.55][index];
  const base=seq(.16,rr),previous=base[pos-1],early=previous+coupling;
  for(let k=0;k<pos;k++)conduct(base[k]);
  if(id==='PAC'){
   p(early,[-.13,.25,.11][index]);q(early+[.14,.18,.15][index]);e.pr.push([.14,.18,.15][index]);
   seq(early+rr,rr).forEach(t=>conduct(t));
  }else{
   // Times of premature and adjacent QRS are expressed from preceding QRS onset.
   q(early+.16,[.16,.18,.20][index],1.25,index===1?-1:1);
   seq(previous+2*rr,rr).forEach(t=>conduct(t));
  }
  e.description=`基礎心率 ${rates[id][index]} bpm；早期搏動位於第 ${pos+1} 個搏動；${id==='PAC'?'提早 P 波形態改變，竇性週期重設':'寬 QRS，保留完全代償性停頓'}`;
 }else if(id==='AF'){
  const rrSets=[[.92,1.37,.79,1.12,1.58,.85,1.21,.96,1.43],[.62,.91,.48,.83,.71,1.05,.52,.77,.59,.96,.67,.88,.56],[.34,.58,.41,.72,.37,.49,.63,.32,.55,.44,.68,.39,.51,.35,.61,.46,.57,.33,.69,.42,.54]];
  let t=.25;q(t);for(const rr of rrSets[index]){t+=rr;if(t<10.1)q(t,[.08,.09,.07][index]);}
  e.baseline='fibrillation';e.fAmplitude=[.055,.10,.035][index];
  e.description=['較慢的心室反應，細小顫動波','中等心室率，較明顯顫動波','較快的心室反應，細小顫動波'][index]+'；RR 序列各不相同';
 }else if(id==='AFL'){
  e.baseline='flutter';e.atrialRate=[300,300,280][index];e.ratio=[2,3,4][index];
  seq(.28,60/e.atrialRate*e.ratio).forEach(t=>q(t));
  e.description=`心房率 ${e.atrialRate} bpm；固定 ${e.ratio}:1 傳導；鋸齒波持續存在`;
 }else if(id==='VT'){
  e.nominalRate=rates.VT[index];seq(.18,60/e.nominalRate).forEach(t=>q(t,[.16,.18,.20][index],1.1,index===1?-1:1));
  e.description=`${e.nominalRate} bpm；單形性寬 QRS ${[.16,.18,.20][index]} 秒；各版本形態不同`;
 }else if(id==='VF'){
  e.baseline='vf';e.fAmplitude=[.65,.30,.48][index];
  e.description=['粗大紊亂波形','較細小紊亂波形','振幅起伏的紊亂波形'][index]+'；無可辨識 P、QRS，不能以 QRS 計算心率';
 }else if(id==='AV1'){
  e.atrialRate=[66,72,78][index];const pr=[.28,.34,.40][index];seq(.16,60/e.atrialRate).forEach(t=>conduct(t,pr));
  e.description=`PR 固定 ${pr.toFixed(2)} 秒（${pr/.04} 小格）；每個 P 均傳導；心率 ${e.atrialRate} bpm`;
 }else if(id==='AV2I'){
  e.atrialRate=[72,78,84][index];const prs=[[.16,.24,.29],[.16,.24,.29,.33],[.16,.23]][index];
  seq(.16,60/e.atrialRate).forEach((t,k)=>{const n=k%(prs.length+1);if(n===prs.length){p(t);e.drop.push(t);}else conduct(t,prs[n]);});
  e.description=`${prs.map(v=>v.toFixed(2)).join(' → ')} 秒 → P 後 QRS 脫落 → PR 恢復最短，重複循環`;
 }else if(id==='AV2II'){
  e.atrialRate=[72,78,84][index];const pr=[.16,.18,.20][index],cycle=[4,5,4][index];
  seq(.16,60/e.atrialRate).forEach((t,k)=>{if(k%cycle===cycle-1){p(t);e.drop.push(t);}else conduct(t,pr,[.09,.14,.16][index]);});
  e.description=`已傳導的 PR 固定 ${pr.toFixed(2)} 秒；間歇一個 P 未接 QRS；不用單純 2:1 圖型區分 Type I / II`;
 }else if(id==='AV3'){
  e.atrialRate=[72,80,90][index];e.nominalRate=[32,38,42][index];
  seq(.16,60/e.atrialRate).forEach(t=>p(t));seq([.53,.75,.42][index],60/e.nominalRate).forEach(t=>q(t,[.16,.18,.08][index],1.15));
  e.description=`P ${e.atrialRate} bpm；QRS ${e.nominalRate} bpm；兩個獨立規則時鐘，PR 持續改變（部分 P 融入 QRS/T）`;
 }
 e.p.sort((a,b)=>a.t-b.t);e.q.sort((a,b)=>a.t-b.t);
 const visible=e.q.filter(q=>q.t>=0&&q.t+q.width<=duration);
 e.rate=visible.length>1?60*(visible.length-1)/(visible.at(-1).t-visible[0].t):null;
 return e;
}
function bump(t,start,width,amp){const u=(t-start)/width;return u>=0&&u<=1?amp*Math.sin(Math.PI*u)**2:0;}
function polygon(u,points){if(u<0||u>1)return 0;for(let k=1;k<points.length;k++)if(u<=points[k][0]){const a=points[k-1],b=points[k];return a[1]+(b[1]-a[1])*(u-a[0])/(b[0]-a[0]);}return 0;}
export function voltage(e,t){
 let v=0;
 if(e.baseline==='fibrillation')v=e.fAmplitude*(.6*Math.sin(2*Math.PI*(6.7*t+.04*t*t)+e.index)+.28*Math.sin(2*Math.PI*9.31*t+1.7)+.18*Math.sin(2*Math.PI*4.83*t+.3));
 if(e.baseline==='flutter'){const u=((t-.025)/(60/e.atrialRate)%1+1)%1;v=polygon(u,[[0,0],[.15,.04],[.78,-.24],[1,0]]);}
 if(e.baseline==='vf')v=e.fAmplitude*(.62*Math.sin(2*Math.PI*(3.8*t+.07*t*t)+e.index)+.35*Math.sin(2*Math.PI*5.73*t+1)+.22*Math.sin(2*Math.PI*7.91*t+.4))*(.75+.25*Math.sin(2*Math.PI*.37*t+e.index));
 for(const p of e.p)v+=bump(t,p.t,p.width,p.amp);
 for(const q of e.q){const wide=q.width>=.12;
  v+=q.amp*q.polarity*polygon((t-q.t)/q.width,wide?[[0,0],[.15,-.1],[.38,1],[.60,.65],[.84,-.55],[1,0]]:[[0,0],[.16,-.12],[.40,1],[.70,-.30],[1,0]]);
  const fast=e.id==='VT'||e.id==='ST'||(e.id==='AF'&&e.index===2);
  v+=bump(t,q.t+q.width+.05,fast?.13:.19,(wide?-.26:.28)*q.polarity);
 }
 return v;
}
export function trace(e){return Array.from({length:5001},(_,i)=>{const t=i*duration/5000;return [round(t*scale),round(100-voltage(e,t)*gain)];});}
export function svg(e){const d=trace(e).map(([x,y],i)=>`${i?'L':'M'}${x},${y}`).join(' ');return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 180" role="img" aria-label="待判讀心電圖"><defs><pattern id="small" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0H0V4" fill="none" stroke="#efcdd1" stroke-width=".35"/></pattern><pattern id="large" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="url(#small)"/><path d="M20 0H0V20" fill="none" stroke="#dc959e" stroke-width=".65"/></pattern></defs><rect width="1000" height="180" fill="#fff9fa"/><rect width="1000" height="180" fill="url(#large)"/><path data-waveform="true" d="${d}" fill="none" stroke="#172126" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"/></svg>`;}
export function findings(e){
 const speed=n=>n<60?'慢':n>100?'快':'正常範圍';
 const hr=e.rate?Math.round(e.rate):null;
 const ps=e.p.filter(p=>p.t>=0&&p.t+p.width<=duration);
 const ar=e.atrialRate??(ps.length>1?60*(ps.length-1)/(ps.at(-1).t-ps[0].t):null);
 let atrial=ar?`心房速率約 ${Math.round(ar)} 次／分（${speed(ar)}，由 P 或規則心房波估算）`:'本段心房活動無法辨識，不能計算心房速率';
 if(e.id==='AF')atrial='心房活動快速且紊亂；無固定 PP，不能由此圖計算單一規則心房速率';
 if(e.id==='PVC')atrial=`基礎竇性心房速率 ${rates.PVC[e.index]} 次／分；提早寬 QRS 附近不能用 QRS 代替 P 計數`;
 const ventricular=hr?`心室速率約 ${hr} 次／分（${speed(hr)}，由可見 QRS 間隔估算）`:'無可辨識 QRS，不能計算心室速率';
 const rate=`${atrial}；${ventricular}`;
 const map={NSR:['PP、RR 規則','P 可識別；QRS < 3 小格；PR 正常且固定','P–QRS 一對一'],SB:['PP、RR 規則','P 可識別；QRS < 3 小格；PR 正常且固定','P–QRS 一對一'],ST:['PP、RR 規則','P 可識別；QRS < 3 小格；PR 正常且固定','P–QRS 一對一'],PAC:['提早搏動打斷 PP、RR 規則性','提早 P 形態不同；QRS 窄；提早搏動 PR 可不同','提早 P 後接窄 QRS'],PVC:['提早搏動及停頓使 RR 不規則','寬 QRS ≥ 3 小格；其前無正常傳導 P；該搏動 PR 不適用','原竇性心搏之間插入一個提早寬 QRS'],AFL:['心房活動規則；此版本 RR 規則','鋸齒狀心房波；QRS 窄；不是正常 P，PR 不適用',`可辨識規則鋸齒狀 F 波；F:QRS = ${e.ratio}:1，可計數心房–心室傳導比例`],AF:['RR 完全不規則，無重複長短模式','無可識別正常 P；QRS 窄；PR 無法量測','無可辨識 P，也無規則可計數的鋸齒狀 F 波；QRS 可識別，但無法判定心房–心室傳導比例'],VT:['RR 規則','P 不易辨識；QRS ≥ 3 小格；PR 無法量測','連續寬 QRS；此段未畫可辨識 P，不以此斷言 AV 分離'],VF:['波形紊亂；無 PP／RR 可量測','P、QRS 無法辨識；PR 不適用','無組織化 P–QRS 關係'],AV1:['PP、RR 規則','P 可識別；QRS 窄；PR > 0.20 秒且固定','每一 P 後都有 QRS'],AV2I:['PP 規則；RR 分組而不規則','P 可識別；QRS 窄；PR 從左往右逐漸延長','PR 漸長後有 P 未接 QRS；下一週期 PR 變短'],AV2II:['PP 規則；QRS 脫落造成 RR 長間隔',`P 可識別；此版本 QRS ${e.index===0?'窄（<3 小格）':'寬（≥3 小格）'}；已傳導 PR 固定`,'突然一個 P 未接 QRS，沒有先逐漸延長 PR'],AV3:['PP、RR 各自規則，速率不同',`P 可識別（部分重疊）；此版本 QRS ${e.index===2?'窄（<3 小格）':'寬（≥3 小格）'}；PR 沒有固定值`,'P、QRS 獨立；沒有固定傳導關係']};
 const a=map[e.id];return [`① 心率快慢：${rate}`,`② 心律規則性：${a[0]}`,`③ P／QRS／PR：${a[1]}`,`④ 心房波–QRS 關係：${a[2]}`];
}
