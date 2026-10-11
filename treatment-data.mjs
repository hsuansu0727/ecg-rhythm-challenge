import {allowedRhythms} from './data.mjs?v=12';
import {shuffle} from './core.mjs?v=12';
export const sources={
教材:{title:'教師提供：心律不整治療方式統整（藥物表／治療方式表）',url:null},
快:{title:'AHA 2025：成人有脈搏心搏過速',url:'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf'},
慢:{title:'AHA 2025：成人有脈搏心搏過緩',url:'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf'},
急救:{title:'AHA 2025：成人心跳停止',url:'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf'}
};
// Fixed, teacher-reviewable questions. No AI generation or automatic expansion.
const q=(id,rhythm,topic,scenario,prompt,answer,distractors,explain,refs=['教材'])=>({id,rhythm,topic,scenario,prompt,answer,distractors,explain,refs});
export const treatmentQuestions=[
q('psvt-drug','PSVT','處置','成人 PSVT，RR 規則、QRS 窄，有脈搏，血壓穩定。已由醫療團隊進行迷走神經刺激仍未終止，確認無相關禁忌。','下列哪項藥物最符合此情境？','Adenosine',['Atropine','Digoxin','Lidocaine'],['先確認有脈搏且狀況穩定。','Adenosine 可用於規則窄 QRS 的 PSVT。','仍須監測心律與血壓，依醫囑給藥。'],['教材','快']),
q('psvt-node','PSVT','藥物機轉','醫師對適合的 PSVT 病人選用 Adenosine。','其主要作用位置與效果為何？','短暫阻斷 AV node 傳導',['抗膽鹼，增加心率','阻斷心室 Na⁺ 通道','阻斷 K⁺ 通道，延長再極化'],['Adenosine 作用時間很短。','暫時抑制 AV node 傳導，可中斷依賴 AV node 的折返迴路。','不代表所有快速心律都適用。']),
q('sb-drug','SB','處置','成人 SB，心室率 38 次／分，有脈搏；持續低血壓與頭暈。已開始監測及初步支持處置。','下列哪項是此症狀性心搏過緩流程中的初始藥物？','Atropine',['Adenosine','Diltiazem','Digoxin'],['心率慢且已有灌流不足表現。','Atropine 用於適當的症狀性心搏過緩。','持續評估反應，不能只看心率數字。'],['教材','慢']),
q('sb-atropine','SB','藥物機轉','SB 病人依醫囑使用 Atropine。','何種機轉可使心率上升？','抗膽鹼作用，減少迷走神經影響',['增加副交感作用','阻斷 AV node 傳導','抑制 Ca²⁺ 通道使心率下降'],['Atropine 為抗膽鹼藥。','減少迷走神經對心臟的抑制，使心率上升。','AV block 各型反應不同，不可一概套用。']),
q('sb-tcp','SB','節律器','成人 SB 有脈搏，低血壓持續；Atropine 無效。醫療團隊準備可立即使用的暫時性節律器。','下列哪項符合此情境？','體外經皮節律器（TCP）',['直接手術植入永久節律器（PPM）','同步電擊','去顫術'],['TCP 可用於緊急、暫時性的節律支持。','本題限定選擇節律器；其他藥物支持仍由團隊評估。','永久節律器需後續評估，不能取代當下急救準備。'],['教材','慢']),
q('sb-pain','SB','節律器','SB 病人清醒且正在接受 TCP。','依教材，下列哪項舒適照護需要特別注意？','評估疼痛，依醫囑給予適當鎮痛／鎮靜',['TCP 完全無痛，不需評估','先關閉節律器，等病人睡著','以同步電擊取代 TCP'],['TCP 可能造成明顯疼痛。','清醒病人須評估疼痛與耐受性。','藥物需依血壓及病況評估，不應因此延誤必要處置。']),
q('af-shock','AF','電擊','成人 A-fib 快速心室反應，有脈搏；心搏過速造成血壓 72/40 mmHg、意識改變，已判定不穩定。','下列哪項電擊方式最符合此情境？','同步電擊（cardioversion）',['非同步去顫術','TCP','直接植入 PPM'],['本題有脈搏，但血流動力不穩定。','準備同步電擊，並持續支持與監測。','可行時給予鎮靜。'],['教材','快']),
q('af-sync','AF','電擊','團隊準備對不穩定且有脈搏的 A-fib 病人進行同步電擊。','Sync 模式的主要目的為何？','讓放電與 QRS 的 R 波同步',['在 T 波高峰放電','讓病人心率固定 60 次／分','使放電與 P 波同步'],['同步電擊需確認設備辨識 QRS。','與 R 波同步，避免落在心室易受刺激的時期。','同步電擊與非同步去顫是不同方式。']),
q('af-sedate','AF','電擊','A-fib 病人仍有脈搏且清醒，須接受同步電擊；目前有條件安全給予鎮靜。','依教材與處置流程，應注意哪項準備？','可行時依醫囑鎮靜，持續監測',['必須完全停止心電監測','因有脈搏，禁止同步電擊','先等待植入永久節律器'],['同步電擊可能造成疼痛。','可行時給予鎮靜，並準備必要的呼吸循環支持。','緊急處置不應因等待鎮靜而不必要地延誤。'],['教材','快']),
q('vt-nopulse','VT','電擊','成人監視器顯示 VT，無反應、無正常呼吸且確認無脈搏；除顫器已備妥。','應走哪個處置方向？','高品質 CPR，儘速非同步去顫',['等待 Sync 標記後同步電擊','先給 Atropine，暫不 CPR','先植入 PPM'],['無脈搏 VT 屬可電擊心律。','CPR 與及時去顫是關鍵。','不能把有脈搏的同步電擊流程套用於此情境。'],['教材','急救']),
q('vf-shock','VF','電擊','成人無反應、無正常呼吸且無脈搏，監視器確認 VF。','下列哪項處置最適當？','高品質 CPR，儘速非同步去顫',['同步電擊，等待辨識 R 波','先以 TCP 導出規則 QRS','只給 Adenosine 後觀察'],['VF 無可辨識的組織化 QRS。','採非同步去顫，並配合 CPR。','不用等待 R 波同步。'],['教材','急救']),
q('vf-drugdelay','VF','處置','成人 VF 無脈搏，CPR 已開始，除顫器已備妥。有人提議先等抗心律不整藥送到。','下列哪項觀念正確？','不要因等藥延誤去顫與 CPR',['Amiodarone 可完全取代去顫','先給 Atropine 才能去顫','VF 必須先做同步電擊'],['去顫與 CPR 是早期重點。','抗心律不整藥可在急救流程適當時機使用。','藥物不能取代必要的電擊。'],['教材','急救']),
q('vt-amio','VT','藥物機轉','教材將 Amiodarone 列於第三類抗心律不整藥；醫師評估 VT 病人後選用此藥。','依教材，其分類機轉與心電圖影響為何？','阻斷 K⁺ 通道，延長再極化／QT',['抗膽鹼，使心率上升','增加副交感，使 AV 傳導下降','僅阻斷 Ca²⁺ 通道'],['教材以第三類、K⁺ 通道阻斷作用整理。','可延長再極化及 QT。','本題考分類，不表示所有 VT 都只需給藥。']),
q('vt-stable','VT','處置','成人單形性 VT，有脈搏且血壓穩定；醫師已確認診斷，評估後選擇以抗心律不整藥輸注處理。','下列哪項是教材列出、且此流程可考慮的藥物？','Amiodarone',['Atropine','Digoxin','Verapamil'],['本題明確限定有脈搏、穩定、單形性 VT。','Amiodarone 是可考慮的抗心律不整藥之一。','若變成不穩定或無脈搏，處置流程會改變。'],['教材','快']),
q('af-beta','AF','藥物機轉','教材中的 Propranolol 屬 β-blocker；醫師已評估病人適合使用。','教材如何描述其對心率及 AV node 的主要影響？','心率下降，AV node 傳導減慢',['心率上升，AV node 傳導加快','只改變 QRS，完全不影響心率','與非同步去顫的作用相同'],['Propranolol 為 β 阻斷劑。','可使心率及 AV node 傳導下降。','本題考機轉，不表示每位 A-fib 病人都適合此藥。']),
q('af-calcium','AF','藥物機轉','教材列出 Verapamil 與 Diltiazem；醫師已評估病人適合使用。','這兩種藥物的教材分類為何？','Ca²⁺ 通道阻斷劑',['Na⁺ 通道阻斷劑','抗膽鹼藥','K⁺ 通道阻斷劑'],['屬教材第四類抗心律不整藥。','可減慢 AV node 傳導。','適應症與禁忌仍須依病人狀況評估。']),
q('af-digoxin','AF','藥物機轉','依教材整理 Digoxin 的作用。','哪項敘述符合教材？','增加副交感影響，減慢 AV node 傳導',['抗膽鹼作用使心率上升','可取代 VF 的去顫術','與 TCP 同樣由皮膚傳送節律刺激'],['教材以增加副交感作用整理。','可使 AV node 傳導減慢。','本題不將其設定為所有 A-fib 的急救首選。']),
q('vt-lido','VT','藥物機轉','教材將 Lidocaine 列在第一類抗心律不整藥中。','其分類機轉為何？','阻斷 Na⁺ 通道',['阻斷 β 受體','抗膽鹼作用','增加副交感作用'],['Lidocaine 屬第一類中的 IB 類藥。','分類機轉是 Na⁺ 通道阻斷。','同屬第一類的藥物，適應症與心電圖效應不完全相同。'])
];
const valid=new Set(allowedRhythms.map(r=>r.id));
export const activeQuestions=treatmentQuestions.filter(q=>valid.has(q.rhythm));
export function treatmentDeck(pool,n){pool=pool.filter(q=>activeQuestions.some(a=>a.id===q.id));if(!pool.length)throw Error('Empty treatment pool');let a=[];while(a.length<n)a.push(...shuffle(pool));return a.slice(0,n).map(q=>({...q,options:shuffle([q.answer,...q.distractors])}));}
export const pendingItems=[
 ['ST','頸動脈竇按摩與 ST 的對應需修正；暫不據此出題。'],
 ['APC／VPC','第一類藥物不可整類套用相同適應症；先保留藥物分類題。'],
 ['Atrial Flutter','教材 AF 與 A-fib 的命名需釐清，避免把 AF 當成兩種心律。'],
 ['各型 AV block','Atropine 的反應與阻滯位置／類型有關，需分型及補充情境。'],
 ['電擊能量與 ICD／PPM','能量需考慮設備與情境；植入式裝置適應症需補充。'],
 ['AT','不在目前 allowedRhythms，未加入題庫。']
];
