import { AR_LABELS, CIWA_AR } from './ciwa-ar.js';
import { B_LABELS, CIWA_B } from './ciwa-b.js';
import { COWS_LABELS, COWS } from './cows.js';

// Hjelpefunksjoner
export  function labelFor(scheme, key, val){
    if(val===null) return '';
    const idx = Number(val);
    if(scheme==='ar'){ const arr = AR_LABELS[key]?.labels; return arr && arr[idx] ? arr[idx] : ''; }
    if(scheme==='b'){ const arr = B_LABELS[key]?.labels; return arr && arr[idx] ? arr[idx] : ''; }
    const opts = COWS_LABELS[key]?.options || [];
    const found = opts.find(o=>o.value===idx);
    return found? found.text : '';
}

export function buildPrintSheet(currentscheme){
    const isAr = currentscheme === 'ar';
    const isB = currentscheme === 'b';
    const isC = currentscheme === 'cows';
    const name = document.getElementById('navn').value || '–';
    const id = document.getElementById('fodt').value || '–';
    const dato = document.getElementById('dato').value || '–';
    const puls = document.getElementById('puls').value || '–';
    const bt   = document.getElementById('bt').value   || '–';
    const { values, unanswered } = getAnswers(currentscheme);
    const list = isAr ? CIWA_AR : isB ? CIWA_B : COWS;
    const sum = values.reduce((a,b)=> a + (b ?? 0), 0);
    const level = levelFor(sum, currentscheme).text;
    const answered = list.length - unanswered.length;
    document.getElementById('ps-title').textContent = isAr? 'CIWA-Ar' : isB? 'CIWA-B':'COWS';
    document.getElementById('ps-navn').textContent = name;
    document.getElementById('ps-fodt').textContent = id;
    document.getElementById('ps-dato').textContent = dato;
    document.getElementById('ps-puls').textContent = puls;
    document.getElementById('ps-bt').textContent   = bt;
    document.getElementById('ps-total').textContent = sum;
    document.getElementById('ps-level').textContent = `Alvorlighetsgrad: ${level}`;
    document.getElementById('ps-answered').textContent = answered;
    document.getElementById('ps-totalq').textContent = list.length;
    const ps = document.getElementById('ps-list'); ps.innerHTML = '';
    list.forEach((q, idx)=>{
    const val = values[idx];
    const item = document.createElement('div'); item.className = 'ps-item';
    const t = document.createElement('span'); t.className = 'ps-item-title'; t.textContent = `${idx+1}. ${q.title}`;
    const s = document.createElement('span'); s.className = 'ps-item-score'; s.textContent = (val===null? '?' : val) + `/${q.max ?? q.options[q.options.length-1].value}`;
    const lt = labelFor(currentscheme, q.key, val);
    const txt = document.createElement('span'); txt.className = 'ps-item-text'; txt.textContent = lt || '';
    item.appendChild(t); item.appendChild(s); if(lt){ item.appendChild(txt); }
    ps.appendChild(item);
    });
    const foot = document.getElementById('ps-foot');
    if(isAr){ foot.textContent = 'Norsk versjon: Oversatt av Jan Hammer, Trude Bjørnstad, Odd Skinnemoen, Vestre Viken<br>og Jan Tore Daltveit, Svein Skjøtskift, Thomas Mildestvedt, Haukeland Universitetssjukehus. Mai 2014.<br>Se originalskjema for full ordlyd.'; }
    else if(isB){ foot.textContent = 'Tilpasset fra Busto UE, Sykora K & Sellers EM (1989). Norsk oversettelse 20.12.2015 ved Anita Mlodozeniec & Øistein Kristensen.'; }
    else { foot.textContent = ''; }
    const psList = document.getElementById('ps-list'); psList.className = 'ps-columns ' + (isAr? 'ps-ar' : isB? 'ps-b' : 'ps-cows');
}

// Renders
export function makeScale(name, maxOrOptions, labels){
    const wrap = document.createElement('div'); wrap.className = 'scale';
    // To support sparse scoring (COWS), accept array of {value,text}
    if(Array.isArray(maxOrOptions)){
    maxOrOptions.forEach(opt=>{
        const id = `${name}_${opt.value}`;
        const lbl = document.createElement('label'); lbl.className='choice'; lbl.setAttribute('role','radio'); lbl.setAttribute('aria-checked','false'); lbl.htmlFor=id;
        const inp = document.createElement('input'); inp.type='radio'; inp.name=name; inp.value=opt.value; inp.id=id;
        const num = document.createElement('div'); num.className='num'; num.textContent = String(opt.value);
        const desc = document.createElement('div'); desc.className='desc'; desc.textContent = opt.text || '';
        lbl.title = opt.text || '';
        inp.addEventListener('change', ()=>{ wrap.querySelectorAll('.choice').forEach(c=>{ c.classList.remove('selected'); c.setAttribute('aria-checked','false'); }); lbl.classList.add('selected'); lbl.setAttribute('aria-checked','true'); computeTotals(); });
        lbl.appendChild(inp); lbl.appendChild(num); lbl.appendChild(desc); wrap.appendChild(lbl);
    });
    return wrap;
    }
    // default continuous 0..max
    const max = maxOrOptions;
    for(let i=0;i<=max;i++){
    const id = `${name}_${i}`;
    const lbl = document.createElement('label'); lbl.className = 'choice'; lbl.setAttribute('role','radio'); lbl.setAttribute('aria-checked','false'); lbl.htmlFor = id;
    const inp = document.createElement('input'); inp.type = 'radio'; inp.name = name; inp.value = i; inp.id = id;
    const num = document.createElement('div'); num.className = 'num'; num.textContent = i;
    const desc = document.createElement('div'); desc.className = 'desc'; desc.textContent = labels?.[i] || '';
    if(labels?.[i]) lbl.title = labels[i];
    inp.addEventListener('change', ()=>{ wrap.querySelectorAll('.choice').forEach(c=>{ c.classList.remove('selected'); c.setAttribute('aria-checked','false'); }); lbl.classList.add('selected'); lbl.setAttribute('aria-checked','true'); computeTotals(); });
    lbl.appendChild(inp); lbl.appendChild(num); lbl.appendChild(desc); wrap.appendChild(lbl);
    }
    return wrap;
}

export function renderQuestions(list, containerId){
    const ul = document.getElementById(containerId); ul.innerHTML = '';
    list.forEach((q, idx)=>{
    const li = document.createElement('li'); li.className = 'q-card';
    const h = document.createElement('div'); h.className='q-title'; h.textContent = `${idx+1}. ${q.title}`; li.appendChild(h);
    if(q.help){ const help = document.createElement('div'); help.className='q-help'; help.textContent = q.help; li.appendChild(help); }
    let sc;
    if(q.options){ sc = makeScale(q.key, q.options); }
    else {
        const labelSet = containerId==='ar-questions' ? AR_LABELS[q.key]?.labels : B_LABELS[q.key]?.labels;
        sc = makeScale(q.key, q.max, labelSet);
    }
    li.appendChild(sc); ul.appendChild(li);
    });
}

export function getAnswers(prefix){
    const arr = []; const unanswered = [];
    const list = prefix === 'ar' ? CIWA_AR : prefix==='b' ? CIWA_B : COWS;
    list.forEach((q, i)=>{ const sel = document.querySelector(`input[name="${q.key}"]:checked`); if(sel){ arr.push(parseInt(sel.value,10)); } else { arr.push(null); unanswered.push(i+1); } });
    return { values: arr, unanswered };
}

export function levelFor(score, scheme){
    if(scheme==='ar'){
    if(score>=20) return {lvl:'red', text:'Alvorlig abstinens'};
    if(score>=10) return {lvl:'yellow', text:'Moderat abstinens'};
    return {lvl:'green', text:'Mild/ingen abstinens'};
    } else if(scheme==='b'){
    if(score>=61) return {lvl:'red', text:'Meget alvorlig abstinens'};
    if(score>=41) return {lvl:'red', text:'Alvorlig abstinens'}; // rød
    if(score>=21) return {lvl:'yellow', text:'Moderat abstinens'};
    if(score>=1)  return {lvl:'green', text:'Mild abstinens'};
    return {lvl:'green', text:'Ingen abstinens'};
    } else { // COWS
    if(score>=37) return {lvl:'red', text:'Alvorlig abstinens'};
    if(score>=25) return {lvl:'yellow', text:'Moderat alvorlig abstinens'};
    if(score>=13) return {lvl:'yellow', text:'Moderat abstinens'};
    if(score>=5)  return {lvl:'green', text:'Mild abstinens'};
    return {lvl:'green', text:'Mild/ingen abstinens'};
    }
}

export function computeTotals(){
    // AR
    const ar = getAnswers('ar'); const arSum = ar.values.reduce((a,b)=> a + (b ?? 0), 0); const arAnswered = CIWA_AR.length - ar.unanswered.length; const arLevel = levelFor(arSum,'ar');
    document.getElementById('ar-total-num').textContent = `Total: ${arSum}`;
    const arBadge = document.getElementById('ar-badge'); arBadge.dataset.level = arLevel.lvl; arBadge.textContent = `Alvorlighetsgrad: ${arLevel.text}`;
    document.getElementById('ar-warn').hidden = ar.unanswered.length===0;
    document.getElementById('ar-counts').textContent = `${arAnswered}/${CIWA_AR.length} besvart. Mangler: ${ar.unanswered.length ? ar.unanswered.join(', ') : '–'}`;

    // B
    const b = getAnswers('b'); const bSum = b.values.reduce((a,b)=> a + (b ?? 0), 0); const bAnswered = CIWA_B.length - b.unanswered.length; const bLevel = levelFor(bSum,'b');
    document.getElementById('b-total-num').textContent = `Total: ${bSum}`;
    const bBadge = document.getElementById('b-badge'); bBadge.dataset.level = bLevel.lvl; bBadge.textContent = `Alvorlighetsgrad: ${bLevel.text}`;
    document.getElementById('b-warn').hidden = b.unanswered.length===0;
    document.getElementById('b-counts').textContent = `${bAnswered}/${CIWA_B.length} besvart. Mangler: ${b.unanswered.length ? b.unanswered.join(', ') : '–'}`;

    // COWS
    const c = getAnswers('cows'); const cSum = c.values.reduce((a,b)=> a + (b ?? 0), 0); const cAnswered = COWS.length - c.unanswered.length; const cLevel = levelFor(cSum,'cows');
    document.getElementById('cows-total-num').textContent = `Total: ${cSum}`;
    const cBadge = document.getElementById('cows-badge'); cBadge.dataset.level = cLevel.lvl; cBadge.textContent = `Alvorlighetsgrad: ${cLevel.text}`;
    document.getElementById('cows-warn').hidden = c.unanswered.length===0;
    document.getElementById('cows-counts').textContent = `${cAnswered}/${COWS.length} besvart. Mangler: ${c.unanswered.length ? c.unanswered.join(', ') : '–'}`;
}

export function scrollToFirstUnanswered(scheme){
    const list = scheme==='ar'? CIWA_AR : scheme==='b'? CIWA_B : COWS;
    for(let i=0;i<list.length;i++){
    if(!document.querySelector(`input[name="${list[i].key}"]:checked`)){
        const el = document.querySelector(`input[name="${list[i].key}"]`);
        if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}); el.closest('.q-card').animate([
        { boxShadow:'0 0 0px 0px rgba(75,116,255,0)'}, { boxShadow:'0 0 0px 6px rgba(75,116,255,0.28)'}
        ],{duration:450, easing:'ease-out'}); }
        return;
    }
    }
}

export function resetForm(scheme){
    const list = scheme==='ar'? CIWA_AR : scheme==='b'? CIWA_B : COWS;
    list.forEach(q=>{ document.querySelectorAll(`input[name="${q.key}"]`).forEach(inp=>{ inp.checked = false; inp.parentElement.classList.remove('selected'); inp.parentElement.setAttribute('aria-checked','false'); }); });
    computeTotals(); window.scrollTo({top:0, behavior:'smooth'});
}

export function buildSummary(scheme){
    const isAr = scheme==='ar'; const isB = scheme==='b';
    const { values, unanswered } = getAnswers(scheme); const items = isAr? CIWA_AR : isB? CIWA_B : COWS;
    const sum = values.reduce((a,b)=> a+(b??0),0); const level = levelFor(sum, scheme);
    const name = document.getElementById('navn').value || ''; const id = document.getElementById('fodt').value || ''; const dato = document.getElementById('dato').value || ''; const puls = document.getElementById('puls').value || ''; const bt = document.getElementById('bt').value || '';
    let text = `${isAr?'CIWA-Ar': isB?'CIWA-B':'COWS'} skåring\nDato: ${dato}\nPasient: ${name}\nFødselsdato: ${id}\nPuls: ${puls}\nBlodtrykk: ${bt}\n\n`;
    text += `Total: ${sum} • Alvorlighetsgrad: ${level.text}\n`; if(unanswered.length){ text += `Mangler svar på: ${unanswered.join(', ')}\n`; } text += `\n`;
    items.forEach((q, idx)=>{ const val = values[idx]; const maxVal = q.max ?? q.options[q.options.length-1].value; text += `${idx+1}. ${q.title}: ${val===null?'-':val}/${maxVal}\n`; });
    return { text, total: sum, level: level.text, unanswered };
}

export function buildLite(scheme){
    const { values } = getAnswers(scheme); const sum = values.reduce((a,b)=> a+(b??0),0); const level = levelFor(sum, scheme);
    const name = document.getElementById('navn').value || ''; const id = document.getElementById('fodt').value || ''; const dato = document.getElementById('dato').value || '';
    const schemeName = scheme==='ar'?'CIWA-Ar': scheme==='b'?'CIWA-B':'COWS';
    return { subject: `${schemeName} – ${name||'Pasient'} – total ${sum}`, body: `Dato: ${dato}\nPasient: ${name}\nFødselsdato: ${id}\nTotal: ${sum} • Alvorlighetsgrad: ${level.text}` };
}

export function sendEmail(scheme, type){
    if(type==='full'){ const s = buildSummary(scheme); const subj = encodeURIComponent(`${scheme==='ar'?'CIWA-Ar': scheme==='b'?'CIWA-B':'COWS'} – Full oppsummering`); const body = encodeURIComponent(s.text); window.location.href = `mailto:?subject=${subj}&body=${body}`; }
    else { const s = buildLite(scheme); const subj = encodeURIComponent(s.subject); const body = encodeURIComponent(s.body); window.location.href = `mailto:?subject=${subj}&body=${body}`; }
}

export function downloadSummary(scheme){
    const s = buildSummary(scheme); const blob = new Blob([s.text], {type:'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a');
    const name = (document.getElementById('navn').value||'Pasient').replace(/\s+/g,'_'); a.href = url; a.download = `${scheme==='ar'?'CIWA-Ar': scheme==='b'?'CIWA-B':'COWS'}_${name}_${new Date().toISOString().slice(0,10)}.txt`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

export function copySum(scheme, btn){
    const { values } = getAnswers(scheme);
    const parts = values.map(v => (v===null ? '?' : String(v)));
    const sum = values.reduce((a,b)=> a + (b ?? 0), 0);
    const level = levelFor(sum, scheme).text;
    const schemeName = scheme==='ar'?'CIWA-Ar': scheme==='b'?'CIWA-B':'COWS';
    const text = `${schemeName}=${sum} (${parts.join('+')}) • ${level}`;
    if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>{
        if(btn){ const old = btn.textContent; btn.textContent = 'Kopiert!'; setTimeout(()=> btn.textContent = old, 1600); }
    }).catch(()=>{ fallbackCopy(text, btn); });
    } else { fallbackCopy(text, btn); }
}

export function fallbackCopy(text, btn){
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); if(btn){ const old = btn.textContent; btn.textContent = 'Kopiert!'; setTimeout(()=> btn.textContent = old, 1600); } }
    finally { document.body.removeChild(ta); }  
}

export function renderAll(){
    renderQuestions(CIWA_AR, 'ar-questions');
    renderQuestions(CIWA_B,  'b-questions');
    renderQuestions(COWS,    'cows-questions');
    computeTotals();
}
