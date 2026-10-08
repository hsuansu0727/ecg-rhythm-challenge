const allowedRhythms=[
 {id:'NSR',name:'NSR',full:'Normal Sinus Rhythm',zh:'正常竇性心律',find:['HR：60–100 bpm','PP / RR interval：regular','P wave：每個 QRS 前都有正常 P wave','PR interval：固定且正常']},
 {id:'SB',name:'Sinus Bradycardia',full:'Sinus Bradycardia',zh:'竇性心搏過緩',find:['HR：< 60 bpm','PP / RR interval：regular','P wave：每個 QRS 前都有正常 P wave','PR interval：固定']},
 {id:'ST',name:'Sinus Tachycardia',full:'Sinus Tachycardia',zh:'竇性心搏過速',find:['HR：> 100 bpm','RR interval：regular','P wave：每個 QRS 前都有正常 P wave','QRS：通常狹窄']},
 {id:'PAC',name:'PAC',full:'Premature Atrial Contraction',zh:'心房早期收縮',find:['Beat appears prematurely','提前出現的 P wave 形態不同','QRS：通常狹窄','之後可見非完全代償性停頓']},
 {id:'AFL',name:'Atrial Flutter',full:'Atrial Flutter',zh:'心房撲動',find:['P wave：典型 saw-tooth flutter waves','Atrial activity：regular','AV conduction 可呈固定比例','Ventricular rhythm：常為規則']},
 {id:'AF',name:'AF',full:'Atrial Fibrillation',zh:'心房顫動',find:['P wave：無可辨識的正常 P wave','RR interval：irregular','Ventricular rhythm：irregularly irregular','Baseline：細小 fibrillatory activity']},
 {id:'PVC',name:'PVC / VPC',full:'Premature Ventricular Contraction',zh:'心室早期收縮',find:['Beat appears prematurely','Wide and bizarre QRS','前方通常沒有正常 P wave','之後常見完全代償性停頓']},
 {id:'VT',name:'VT',full:'Ventricular Tachycardia',zh:'心室心搏過速',find:['HR：快速，常 > 100 bpm','Rhythm：regular 或近乎規則','QRS：wide and bizarre','多個連續 ventricular beats']},
 {id:'VF',name:'VF',full:'Ventricular Fibrillation',zh:'心室顫動',find:['無可辨識的 P-QRS-T complex','Baseline：chaotic, irregular waveform','無組織化的 ventricular activity']},
 {id:'AV1',name:'1° AV Block',full:'First-degree AV Block',zh:'第一度房室傳導阻滯',find:['每一個 P wave 後都有 QRS','PR interval：延長','PR interval：固定','RR interval：通常規則']},
 {id:'AV2I',name:'2° AV Block Type I',full:'Mobitz I / Wenckebach',zh:'第二度房室傳導阻滯第一型',find:['PR interval progressively lengthens','接著出現 dropped QRS','之後循環重新開始']},
 {id:'AV2II',name:'2° AV Block Type II',full:'Mobitz II',zh:'第二度房室傳導阻滯第二型',find:['Conducted beats 的 PR interval 固定','突然有 P wave 沒有接 QRS','dropped QRS']},
 {id:'AV3',name:'3° AV Block',full:'Third-degree AV Block',zh:'第三度／完全性房室傳導阻滯',find:['P wave 與 QRS 各自規律','P wave 與 QRS 沒有固定關係','AV dissociation']}
];
const groups={NSR:['SB','ST','AV1'],SB:['NSR','ST','AV1'],ST:['AFL','NSR','AF'],PAC:['PVC','NSR','AF'],AFL:['AF','ST','PAC'],AF:['AFL','PAC','ST'],PVC:['PAC','VT','NSR'],VT:['PVC','VF','AF'],VF:['VT','AF','PVC'],AV1:['AV2I','AV2II','AV3'],AV2I:['AV1','AV2II','AV3'],AV2II:['AV1','AV2I','AV3'],AV3:['AV1','AV2I','AV2II']};
function getFindings(id){
 const m={NSR:['正常（60–100 bpm）','PP、RR 規則','P wave 可識別；QRS 窄（< 0.12 sec；< 3 小格）；PR 正常','每個 P wave 後都有一個 QRS'],SB:['慢（< 60 bpm）','PP、RR 規則','P wave 可識別；QRS 窄；PR 正常','每個 P wave 後都有一個 QRS'],ST:['快（> 100 bpm）','PP、RR 規則','P wave 可識別；QRS 窄；PR 正常','每個 P wave 後都有一個 QRS'],PAC:['基礎心率通常正常','因提前心房搏動而不規則','提前 P wave 形態不同；QRS 窄；PR 可改變','提前 P wave 後通常仍接一個 QRS'],AFL:['心室率依 AV 傳導比例而定','心房活動規則；RR 常規則','可見鋸齒狀 flutter waves；QRS 窄；PR 不適用','多個 flutter waves 對應一個 QRS，可呈固定比例'],AF:['心室率可快、慢或正常','RR 不規則且不規則（irregularly irregular）','無可識別正常 P wave；QRS 通常窄；PR 無法量測','P wave 與 QRS 無固定關係'],PVC:['基礎心率依原始節律而定','因 PVC 提前出現而不規則','PVC 前通常無正常 P wave；QRS 寬且怪異；PR 不適用','提前出現一個寬 QRS，之後常有代償性停頓'],VT:['快，通常 > 100 bpm','通常規則或接近規則','P wave 多不易識別／可見 AV dissociation；QRS 寬；PR 不適用','連續出現 ≥3 個寬 QRS 的心室搏動'],VF:['無有效可判讀心率','完全不規則','無可識別 P wave、QRS 或 PR interval','無組織化 P–QRS 關係'],AV1:['通常正常或依基礎竇性心律而定','PP、RR 通常規則','P wave 可識別；QRS 通常窄；PR 延長且固定','每個 P wave 後都有 QRS'],AV2I:['通常正常或稍慢','PP 規則；RR 因 dropped QRS 而不規則','P wave 可識別；QRS 通常窄；PR 逐漸延長','PR 漸長後出現 P wave 未接 QRS，循環重複'],AV2II:['通常正常或稍慢','PP 規則；RR 因 dropped QRS 而不規則','P wave 可識別；QRS 通常窄；已傳導搏動的 PR 固定','突然有 P wave 未接 QRS'],AV3:['通常慢（逃脫心律）','PP 規則；RR 規則，但兩者彼此獨立','P wave 可識別；QRS 可寬或窄；PR 不固定','P wave 與 QRS 沒有固定關係（AV dissociation）']};const a=m[id];return [`① 快慢：${a[0]}`,`② PP / RR 規則性：${a[1]}`,`③ P、QRS、PR：${a[2]}`,`④ P–QRS 關係：${a[3]}`];
}

allowedRhythms.find(r=>r.id==='PAC').name='APC / PAC';
const imageMap={NSR:'nsr',SB:'sb',ST:'st',PAC:'pac',AFL:'afl',AF:'af',PVC:'pvc',VT:'vt',VF:'vf',AV1:'av1',AV2I:'av2i',AV2II:'av2ii',AV3:'av3'};
export {allowedRhythms,groups,getFindings,imageMap};
