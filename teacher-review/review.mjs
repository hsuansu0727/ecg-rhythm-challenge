import {allowedRhythms} from '../data.mjs?v=4';
import {specimen,svg,findings} from './waveforms.mjs?v=4';
const select=document.querySelector('#rhythm'),content=document.querySelector('#content');
let all=false,fit=false;
select.innerHTML=allowedRhythms.map(x=>`<option value="${x.id}">${x.name} · ${x.zh}</option>`).join('');select.value='AF';
export const observations=[
 ['① 心房快慢',['尚未判讀','慢（<60）','正常範圍（60–100）','快（>100）','紊亂，無法用 PP 計算','無法計算']],
 ['① 心室快慢',['尚未判讀','慢（<60）','正常範圍（60–100）','快（>100）','無法計算']],
 ['② PP 規則？',['尚未判讀','規則','不規則','鋸齒波規則','無明確 P，無法判定']],
 ['② RR 規則？',['尚未判讀','規則','不規則','完全不規則','無 QRS，無法判定']],
 ['③ P 看得見？',['尚未判讀','看得見','提早 P 形態不同','規則鋸齒波','無明確 P']],
 ['③ QRS < 3 小格？',['尚未判讀','是，窄','否，寬','無法辨識']],
 ['③ PR 如何？',['尚未判讀','正常且固定','延長且固定','越來越長','無固定值','無法量測']],
 ['④ 心房波與 QRS 關係',['尚未判讀','每個 P 都接 QRS','部分 P 沒接 QRS','規則鋸齒波，數個對一個 QRS','P、QRS 各走各的','無明確 P，無法判定關係']]
];
function render(){const chosen=all?allowedRhythms:allowedRhythms.filter(x=>x.id===select.value);
 content.innerHTML=chosen.map(r=>`<h2>${r.name} · ${r.zh}</h2>`+[0,1,2].map(i=>{const e=specimen(r.id,i);return `<article class="card"><b>版本 ${i+1}</b><div class="strip ${fit?'compact':''}">${svg(e)}</div><p class="muted">${fit?'整圖縮小比較；數格請切回原比例。':'可左右滑動；小格比例保持一致。'}</p><button data-play>平穩逐步顯示</button> <button data-full>完整靜止圖</button><details><summary>先試四步驟，再看解析</summary><p class="muted">先看快慢、規則性、波形，再看彼此關係。心房看 P／鋸齒波，心室看 QRS。速率單位：次／分；此欄暫不計分。</p><div class="steps">${observations.map(([title,choices])=>`<label>${title}<select>${choices.map(c=>`<option>${c}</option>`).join('')}</select></label>`).join('')}</div></details><details class="findings"><summary>教師查核：參數與四步驟解析</summary><p>${e.description}</p><ul>${findings(e).map(s=>`<li>${s}</li>`).join('')}</ul></details></article>`;}).join('')).join('');
 document.querySelectorAll('article').forEach(card=>{let animation;const strip=card.querySelector('svg');card.querySelector('[data-play]').onclick=()=>{animation?.cancel();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;animation=strip.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:10000,easing:'linear',fill:'forwards'});};card.querySelector('[data-full]').onclick=()=>animation?.cancel();});
}
select.onchange=()=>{all=false;render();};document.querySelector('#all').onclick=()=>{all=!all;document.querySelector('#all').classList.toggle('active',all);render();};document.querySelector('#fit').onclick=e=>{fit=!fit;e.target.textContent=fit?'原比例數格':'整圖比較';render();};render();
