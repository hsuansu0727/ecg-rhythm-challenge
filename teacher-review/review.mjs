import {allowedRhythms} from '../data.mjs';
import {specimen,svg,findings} from './waveforms.mjs?v=3';
const select=document.querySelector('#rhythm'),content=document.querySelector('#content');
let all=false,fit=false;
select.innerHTML=allowedRhythms.map(x=>`<option value="${x.id}">${x.name} · ${x.zh}</option>`).join('');select.value='AF';
export const observations=[
 ['① 心房速率（看 P／規則心房波）',['尚未判讀','慢（<60 次／分）','正常範圍（60–100 次／分）','快（>100 次／分）','心房活動紊亂，無固定 PP 可計算','無法從本段辨識心房速率']],
 ['① 心室速率（看 QRS／RR）',['尚未判讀','慢（<60 次／分）','正常範圍（60–100 次／分）','快（>100 次／分）','無可識別 QRS，無法計算']],
 ['② 心房規則性（PP／心房波）',['尚未判讀','P–P 規則','P–P 因提早搏動而不規則','鋸齒狀心房波規則','無可辨識 P；心房活動紊亂','本段無法判定']],
 ['② 心室規則性（RR）',['尚未判讀','RR 規則','RR 因提早搏動或 QRS 脫落而不規則','RR 完全不規則，無重複模式','無可識別 QRS，無法判定']],
 ['③ P／心房波',['尚未判讀','可辨識 P 波','提早 P 形態不同','可辨識規則鋸齒狀 F 波','無可辨識 P，無規則鋸齒狀 F 波','本段心房活動無法判定']],
 ['③ QRS 寬度',['尚未判讀','窄（<3 小格）','寬（≥3 小格）','無法辨識']],
 ['③ PR interval',['尚未判讀','正常且固定','延長且固定','逐漸延長','已傳導搏動 PR 固定，另有 QRS 脫落','P、QRS 各自規則，PR 無固定值','無法量測／不適用']],
 ['④ 心房波–QRS 關係',['尚未判讀','可辨識 P；每個 P 後接一個 QRS','可辨識 P；部分 P 後沒有 QRS','可辨識規則鋸齒狀 F 波；可數出 F:QRS 傳導比例','可辨識 P、QRS；各自規則且彼此獨立','竇性搏動一對一；提早寬 QRS 前無傳導 P','無可辨識 P／規則 F 波；QRS 可識別，無法判定心房–心室傳導比例','P、QRS 均無法辨識，無法評估關係']]
];
function render(){const chosen=all?allowedRhythms:allowedRhythms.filter(x=>x.id===select.value);
 content.innerHTML=chosen.map(r=>`<h2>${r.name} · ${r.zh}</h2>`+[0,1,2].map(i=>{const e=specimen(r.id,i);return `<article class="card"><b>版本 ${i+1}</b><div class="strip ${fit?'compact':''}">${svg(e)}</div><p class="muted">${fit?'整圖縮小比較；數格請切回原比例。':'可左右滑動；小格比例保持一致。'}</p><button data-play>平穩逐步顯示</button> <button data-full>完整靜止圖</button><details><summary>先試四步驟，再看解析</summary><p class="muted">此欄供練習觀察，暫不計分。心房率看 P 或規則心房波，心室率看 QRS；兩者分開判讀。先確認心房波可否辨識，再判讀傳導比例。AF 的紊亂顫動波，不等於 AFL 可規則計數的鋸齒狀 F 波。</p><div class="steps">${observations.map(([title,choices])=>`<label>${title}<select>${choices.map(c=>`<option>${c}</option>`).join('')}</select></label>`).join('')}</div></details><details class="findings"><summary>教師查核：參數與四步驟解析</summary><p>${e.description}</p><ul>${findings(e).map(s=>`<li>${s}</li>`).join('')}</ul></details></article>`;}).join('')).join('');
 document.querySelectorAll('article').forEach(card=>{let animation;const strip=card.querySelector('svg');card.querySelector('[data-play]').onclick=()=>{animation?.cancel();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;animation=strip.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:10000,easing:'linear',fill:'forwards'});};card.querySelector('[data-full]').onclick=()=>animation?.cancel();});
}
select.onchange=()=>{all=false;render();};document.querySelector('#all').onclick=()=>{all=!all;document.querySelector('#all').classList.toggle('active',all);render();};document.querySelector('#fit').onclick=e=>{fit=!fit;e.target.textContent=fit?'原比例數格':'整圖比較';render();};render();
