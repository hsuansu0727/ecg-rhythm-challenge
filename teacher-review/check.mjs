import assert from 'node:assert/strict';
import fs from 'node:fs';
import {allowedRhythms} from '../data.mjs';
import {specimen,trace,svg,findings} from './waveforms.mjs';
const eq=(a,b)=>Math.abs(a-b)<1e-8;
const gaps=a=>a.slice(1).map((x,i)=>x.t-a[i].t);
const regular=a=>a.length<2||a.every(x=>eq(x,a[0]));
const all=[];
for(const {id} of allowedRhythms){let paths=[];for(let i=0;i<3;i++){
 const e=specimen(id,i),s=svg(e),points=trace(e);all.push({...e,points});paths.push(s);
 assert.equal((s.match(/data-waveform=/g)||[]).length,1);assert(!s.includes('<text'));assert.equal(findings(e).length,5);
 assert(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=1000&&y>0&&y<180));
 if(['NSR','SB','ST','AV1'].includes(id)){assert(regular(gaps(e.p)));assert(regular(gaps(e.q)));assert(e.pr.every(p=>eq(p,e.pr[0])));}
 if(id==='NSR')assert(e.rate>=60&&e.rate<=100);if(id==='SB')assert(e.rate<60);if(id==='ST'||id==='VT')assert(e.rate>100);
 if(id==='AF'){assert.equal(e.p.length,0);assert(!regular(gaps(e.q)));assert(new Set(gaps(e.q).map(x=>x.toFixed(2))).size>=5);assert(e.q.every(q=>q.width<.12));}
 if(id==='VF'){assert.equal(e.q.length,0);assert.equal(e.p.length,0);}
 if(id==='AV1')assert(e.pr.every(x=>x>.20));
 if(id==='AV2I'){assert(regular(gaps(e.p)));assert(e.drop.length>=2);let first=e.p.findIndex(p=>eq(p.t,e.drop[0]));const prs=e.p.slice(0,first).map(p=>e.q.find(q=>q.t>p.t&&q.t<p.t+.5).t-p.t);assert(prs.every((x,i)=>i===0||x>prs[i-1]));assert(eq(e.pr[first],e.pr[0]));}
 if(id==='AV2II'){assert(e.pr.every(x=>eq(x,e.pr[0])));assert(e.drop.length>=2);assert(regular(gaps(e.p)));}
 if(id==='AV3'){assert(regular(gaps(e.p)));assert(regular(gaps(e.q)));assert(e.atrialRate>e.rate);const phase=e.q.map(q=>q.t-e.p.filter(p=>p.t<q.t).at(-1).t);assert(new Set(phase.map(x=>x.toFixed(2))).size>=3);}
 if(id==='PVC'){const n=e.q.findIndex(q=>q.width>=.12);const rr=60/[66,75,84][i];assert(eq(e.q[n+1].t-e.q[n-1].t,2*rr));}
 }assert.equal(new Set(paths).size,3);}
for(const id of ['AF','AFL','AV3'])for(let i=0;i<3;i++){
 const f=findings(specimen(id,i));assert(f[0].includes('心房')&&f[0].includes('心室速率'));
 if(id==='AF')assert(f[1].includes('無明確 P')&&f[1].includes('無法判定'));
 if(id==='AFL')assert(f[1].includes(`${[2,3,4][i]} 個對一個 QRS`));
}
assert(findings(specimen('AV3',0))[0].includes('72 次／分'));
assert(findings(specimen('AV3',0))[0].includes('32 次／分'));
assert.throws(()=>specimen('SVT'));assert.throws(()=>specimen('AF',3));
fs.writeFileSync('/tmp/ecg-variants.json',JSON.stringify(all));console.log('PASS: 39 distinct single-trace specimens; interval, rate, whitelist, dropped-beat and AV-dissociation checks');
