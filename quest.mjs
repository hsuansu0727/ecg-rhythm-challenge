import {missions} from './core.mjs?v=17';
export const starsFor=score=>score>=100?3:score>=80?2:score>0?1:0;
export const totalStars=best=>missions.reduce((sum,m)=>sum+starsFor(best?.[m.id]||0),0);
export const unlocked=(best,index)=>index===0||(best?.[missions[index-1].id]||0)>=80;
export function nextMission(best){return missions.find((m,i)=>unlocked(best,i)&&(best?.[m.id]||0)<100)||missions[0];}
export function finishMission(best,id,accuracy){
 if(!missions.some(m=>m.id===id))throw new Error('Unknown mission');
 const previous=best[id]||0;best[id]=Math.max(previous,accuracy);
 return {stars:starsFor(accuracy),bestStars:starsFor(best[id]),bonus:previous<80&&accuracy>=80?50:0,improved:best[id]>previous};
}
export function mapHTML(best,prefix){const current=nextMission(best);return `<div class="quest-map" aria-label="四站闖關地圖">${missions.map((m,i)=>{const open=unlocked(best,i),score=best?.[m.id]||0,stars=starsFor(score);return `<article class="quest-node ${open?'':'locked'} ${current.id===m.id?'current':''} ${score>=80?'passed':''}"><div class="quest-marker" aria-hidden="true">${score>=80?'✓':open?i+1:'◇'}</div><div class="quest-content"><div class="quest-kicker">STATION ${String(i+1).padStart(2,'0')} ${score>=80?'· 已通關':open?'· 可挑戰':'· 待解鎖'}</div><h3>${m.title.slice(3)}</h3><p>${m.desc}</p><div class="quest-stars" aria-label="${stars} 顆星，滿分 3 顆">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}<small>${score?'最佳 '+score+'%':'每關 5 題'}</small></div></div><button class="${open?'primary':''}" data-${prefix}="${m.id}">${open?score>=80?'提升星等':'開始挑戰':'查看關卡'}</button></article>`;}).join('')}</div>`;}
export function xpHTML(xp){const level=Math.floor(xp/200)+1,remaining=200-xp%200;return `<div class="quest-xp"><div class="row"><b>Lv. ${level} · 心律探索者</b><span>${xp} XP</span></div><div class="progress"><span style="width:${xp%200/2}%"></span></div><small>再 ${remaining} XP 升級 · 答對 +10／完成作答 +2／每關首次通關 +50</small></div>`;}
export function lockedHTML(m){return `<section class="card quest-preview"><span class="pill">下一站預覽</span><h1>${m.title.slice(3)}</h1><p>${m.desc}</p><p>前一站取得至少 4 / 5 題（80%），即可解鎖本關。</p><p class="muted">想先練這一類？自由練習與測驗不受關卡解鎖限制。</p><button id="mapBack" class="primary full">回到闖關地圖</button></section>`;}
