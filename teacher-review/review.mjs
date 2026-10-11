import {allowedRhythms} from '../data.mjs?v=6';
import {specimen,svg,findings} from './waveforms.mjs?v=6';
const select=document.querySelector('#rhythm'),content=document.querySelector('#content');
let all=false,fit=false;
select.innerHTML=allowedRhythms.map(x=>`<option value="${x.id}">${x.name} · ${x.zh}</option>`).join('');select.value='AF';
export const observations=[
 ['① 心房速率',['尚未判讀','慢（<60）','正常範圍（60–100）','快（>100）','無法計算']],
 ['① 心室速率',['尚未判讀','慢（<60）','正常範圍（60–100）','快（>100）','無法計算']],
 ['② P 看得見？',['尚未判讀','有','沒有','看不清']],
 ['② P 形狀一致？',['尚未判讀','一致','不一致','無法判定']],
 ['② 心房波與 QRS 有傳導關係？',['尚未判讀','有','各自獨立','無法判定']],
 ['② 有 P 後未接 QRS？',['尚未判讀','有','沒有','無法判定']],
 ['③ QRS 寬窄',['尚未判讀','窄（<3 小格）','寬（≥3 小格）','寬窄都有','無法辨識']],
 ['④ PR 長度',['尚未判讀','短（<0.12 秒）','正常（0.12–0.20 秒）','長（>0.20 秒）','無法量測']],
 ['④ PR 變化',['尚未判讀','固定','越來越長','不固定','無法量測']],
 ['⑤ 心房波規則？（P／鋸齒波）',['尚未判讀','規則','不規則','無法判定']],
 ['⑤ RR 規則？',['尚未判讀','規則','不規則','無法判定']]
];
function render(){const chosen=all?allowedRhythms:allowedRhythms.filter(x=>x.id===select.value);
 content.innerHTML=chosen.map(r=>`<h2>${r.name} · ${r.zh}</h2>`+[0,1,2].map(i=>{const e=specimen(r.id,i);return `<article class="card"><b>版本 ${i+1}</b><div class="strip ${fit?'compact':''}">${svg(e)}</div><p class="muted">${fit?'整圖縮小比較；數格請切回原比例。':'可左右滑動；小格比例保持一致。'}</p><button data-play>平穩逐步顯示</button> <button data-full>完整靜止圖</button><details><summary>先試五步驟，再看解析</summary><p class="muted">速率 → P 波與關係 → QRS → PR → 規則性。看不清就選「無法判定」；心房看 P／規則心房波，心室看 QRS。沒有明確 P 時，PR 可選「無法量測」。此欄暫不計分。</p><details><summary>速率怎麼算？</summary><p class="muted">25 mm/s 格線：規則心室率 = 300 ÷ RR 大格數，或 1500 ÷ RR 小格數；規則心房率用 PP／規則心房波間距。若不規則，完整 10 秒內的 QRS 數 × 6 可估計平均心室率。無可辨識波形就不計算。</p></details><div class="steps">${observations.map(([title,choices])=>`<label>${title}<select>${choices.map(c=>`<option>${c}</option>`).join('')}</select></label>`).join('')}</div></details><details class="findings"><summary>教師查核：參數與五步驟解析</summary><p>${e.description}</p><ul>${findings(e).map(s=>`<li>${s}</li>`).join('')}</ul></details></article>`;}).join('')).join('');
 document.querySelectorAll('article').forEach(card=>{let animation;const strip=card.querySelector('svg');card.querySelector('[data-play]').onclick=()=>{animation?.cancel();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;animation=strip.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:10000,easing:'linear',fill:'forwards'});};card.querySelector('[data-full]').onclick=()=>animation?.cancel();});
}
select.onchange=()=>{all=false;render();};document.querySelector('#all').onclick=()=>{all=!all;document.querySelector('#all').classList.toggle('active',all);render();};document.querySelector('#fit').onclick=e=>{fit=!fit;e.target.textContent=fit?'原比例數格':'整圖比較';render();};render();
