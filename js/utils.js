// ========================================
// UTILS.JS - Hjelpefunksjoner for skåringsverktøy
// ========================================

// Import av skjemadata - LEGG TIL MADRS HER
import { AR_LABELS, CIWA_AR } from './ciwa-ar.js';
import { B_LABELS, CIWA_B } from './ciwa-b.js';
import { COWS_LABELS, COWS } from './cows.js';
import { MADRS_LABELS, MADRS } from './madrs.js'; // <-- LEGG TIL DENNE LINJEN

// ========================================
// NAVIGASJON OG SCROLL-FUNKSJONER
// ========================================

/**
 * Scroll automatisk til neste spørsmål etter svar
 * @param {HTMLElement} currentQuestionElement - Gjeldende spørsmålselement
 */
export function scrollToNextQuestion(currentQuestionElement) {
  const nextQuestion = currentQuestionElement.nextElementSibling;
  
  if (nextQuestion && nextQuestion.tagName === 'LI') {
    nextQuestion.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

/**
 * Scroll til første ubesvarte spørsmål og marker det
 * @param {string} scheme - Skjematype ('ar', 'b', 'cows', 'madrs')
 */
export function scrollToFirstUnanswered(scheme) {
  const list = scheme === 'ar' ? CIWA_AR : 
               scheme === 'b' ? CIWA_B : 
               scheme === 'cows' ? COWS : 
               scheme === 'madrs' ? MADRS : CIWA_AR; // <-- LEGG TIL MADRS
  
  for (let i = 0; i < list.length; i++) {
    if (!document.querySelector(`input[name="${list[i].key}"]:checked`)) {
      const el = document.querySelector(`input[name="${list[i].key}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.closest('.q-card').animate([
          { boxShadow: '0 0 0px 0px rgba(75,116,255,0)' },
          { boxShadow: '0 0 0px 6px rgba(75,116,255,0.28)' }
        ], { duration: 450, easing: 'ease-out' });
      }
      return;
    }
  }
}

/**
 * Hent label-tekst for en gitt verdi i et skjema
 * @param {string} scheme - Skjematype ('ar', 'b', 'cows', 'madrs')
 * @param {string} key - Spørsmålsnøkkel
 * @param {number|null} val - Verdi
 * @returns {string} Label-tekst
 */
export function labelFor(scheme, key, val) {
  if (val === null) return '';
  const idx = Number(val);
  
  if (scheme === 'ar') {
    const arr = AR_LABELS[key]?.labels;
    return arr && arr[idx] ? arr[idx] : '';
  }
  if (scheme === 'b') {
    const arr = B_LABELS[key]?.labels;
    return arr && arr[idx] ? arr[idx] : '';
  }
  if (scheme === 'madrs') {
    const arr = MADRS_LABELS[key]?.labels;
    return arr && arr[idx] ? arr[idx] : '';
  }
  
  // COWS har annen struktur
  const opts = COWS_LABELS[key]?.options || [];
  const found = opts.find(o => o.value === idx);
  return found ? found.text : '';
}

/**
 * Hent alle svar for et skjema
 * @param {string} prefix - Skjematype ('ar', 'b', 'cows', 'madrs')
 * @returns {Object} - { values: Array, unanswered: Array }
 */
export function getAnswers(prefix) {
  const arr = [];
  const unanswered = [];
  const list = prefix === 'ar' ? CIWA_AR : 
               prefix === 'b' ? CIWA_B : 
               prefix === 'cows' ? COWS : 
               prefix === 'madrs' ? MADRS : CIWA_AR; // <-- LEGG TIL MADRS
  
  list.forEach((q, i) => {
    const sel = document.querySelector(`input[name="${q.key}"]:checked`);
    if (sel) {
      arr.push(parseInt(sel.value, 10));
    } else {
      arr.push(null);
      unanswered.push(i + 1);
    }
  });
  
  return { values: arr, unanswered };
}

/**
 * Bestem alvorlighetsgrad basert på totalskåre
 * @param {number} score - Totalskåre
 * @param {string} scheme - Skjematype
 * @returns {Object} - { lvl: string, text: string }
 */
export function levelFor(score, scheme) {
  if (scheme === 'ar') {
    if (score >= 20) return { lvl: 'red', text: 'Alvorlig abstinens' };
    if (score >= 10) return { lvl: 'yellow', text: 'Moderat abstinens' };
    return { lvl: 'green', text: 'Mild/ingen abstinens' };
  } 
  else if (scheme === 'b') {
    if (score >= 61) return { lvl: 'red', text: 'Meget alvorlig abstinens' };
    if (score >= 41) return { lvl: 'red', text: 'Alvorlig abstinens' };
    if (score >= 21) return { lvl: 'yellow', text: 'Moderat abstinens' };
    if (score >= 1) return { lvl: 'green', text: 'Mild abstinens' };
    return { lvl: 'green', text: 'Ingen abstinens' };
  } 
  else if (scheme === 'cows') {
    if (score >= 37) return { lvl: 'red', text: 'Alvorlig abstinens' };
    if (score >= 25) return { lvl: 'yellow', text: 'Moderat alvorlig abstinens' };
    if (score >= 13) return { lvl: 'yellow', text: 'Moderat abstinens' };
    if (score >= 5) return { lvl: 'green', text: 'Mild abstinens' };
    return { lvl: 'green', text: 'Mild/ingen abstinens' };
  }
  else if (scheme === 'madrs') {
    if (score >= 35) return { lvl: 'red', text: 'Alvorlig depresjon' };
    if (score >= 20) return { lvl: 'yellow', text: 'Moderat depresjon' };
    if (score >= 7) return { lvl: 'green', text: 'Lett depresjon' };
    return { lvl: 'green', text: 'Ingen/lett depresjon' };
  }
  
  return { lvl: 'green', text: 'Ukjent' };
}

// ========================================
// RENDERING AV SKJEMAELEMENTER
// ========================================

/**
 * Lag svaralternativer (radio buttons) for et spørsmål
 * @param {string} name - Input name
 * @param {number|Array} maxOrOptions - Maksverdi eller array med options
 * @param {Array} labels - Label-array
 * @returns {HTMLElement} Container med svaralternativer
 */
export function makeScale(name, maxOrOptions, labels) {
  const wrap = document.createElement('div');
  wrap.className = 'scale';
  
  // Støtte for sparse scoring (COWS) - array av {value, text}
  if (Array.isArray(maxOrOptions)) {
    maxOrOptions.forEach(opt => {
      const { input, label } = createRadioChoice(name, opt.value, opt.text || '');
      
      input.addEventListener('change', () => {
        handleChoiceChange(wrap, label, input);
      });
      
      wrap.appendChild(label);
    });
    return wrap;
  }
  
  // Standard kontinuerlig skala 0..max
  const max = maxOrOptions;
  for (let i = 0; i <= max; i++) {
    const { input, label } = createRadioChoice(name, i, labels?.[i] || '');
    
    if (labels?.[i]) label.title = labels[i];
    
    input.addEventListener('change', () => {
      handleChoiceChange(wrap, label, input);
    });
    
    wrap.appendChild(label);
  }
  
  return wrap;
}

/**
 * Opprett et radio button valg
 * @param {string} name - Input name
 * @param {number} value - Verdi
 * @param {string} description - Beskrivelse
 * @returns {Object} - { input: HTMLInput, label: HTMLLabel }
 */
function createRadioChoice(name, value, description) {
  const id = `${name}_${value}`;
  const lbl = document.createElement('label');
  lbl.className = 'choice';
  lbl.setAttribute('role', 'radio');
  lbl.setAttribute('aria-checked', 'false');
  lbl.htmlFor = id;
  lbl.title = description;
  
  const inp = document.createElement('input');
  inp.type = 'radio';
  inp.name = name;
  inp.value = value;
  inp.id = id;
  
  const num = document.createElement('div');
  num.className = 'num';
  num.textContent = String(value);
  
  const desc = document.createElement('div');
  desc.className = 'desc';
  desc.textContent = description;
  
  lbl.appendChild(inp);
  lbl.appendChild(num);
  lbl.appendChild(desc);
  
  return { input: inp, label: lbl };
}

/**
 * Håndter endring av valg (radio button)
 * @param {HTMLElement} wrap - Container
 * @param {HTMLElement} selectedLabel - Valgt label
 * @param {HTMLElement} input - Input element
 */
function handleChoiceChange(wrap, selectedLabel, input) {
  // Fjern selected fra alle valg
  wrap.querySelectorAll('.choice').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  
  // Marker valgt alternativ
  selectedLabel.classList.add('selected');
  selectedLabel.setAttribute('aria-checked', 'true');
  
  // Oppdater totaler
  computeTotals();
  
  // Scroll til neste spørsmål
  const questionElement = input.closest('li');
  setTimeout(() => {
    scrollToNextQuestion(questionElement);
  }, 200);
}

/**
 * Render alle spørsmål for et skjema
 * @param {Array} list - Spørsmålsliste
 * @param {string} containerId - Container ID
 */
export function renderQuestions(list, containerId) {
  const ul = document.getElementById(containerId);
  if (!ul) return;
  
  ul.innerHTML = '';
  
  list.forEach((q, idx) => {
    const li = document.createElement('li');
    li.className = 'q-card';
    
    // Spørsmålstittel
    const title = document.createElement('div');
    title.className = 'q-title';
    title.textContent = `${idx + 1}. ${q.title}`;
    li.appendChild(title);
    
    // Hjelpetekst (hvis tilgjengelig)
    if (q.help) {
      const help = document.createElement('div');
      help.className = 'q-help';
      help.textContent = q.help;
      li.appendChild(help);
    }
    
    // Svaralternativer
    let scale;
    if (q.options) {
      // COWS-stil med options
      scale = makeScale(q.key, q.options);
    } else {
      // Standard skala med labels
      const labelSet = containerId === 'ar-questions' ? AR_LABELS[q.key]?.labels : 
                      containerId === 'b-questions' ? B_LABELS[q.key]?.labels :
                      containerId === 'madrs-questions' ? MADRS_LABELS[q.key]?.labels : null; // <-- LEGG TIL MADRS
      scale = makeScale(q.key, q.max, labelSet);
    }
    
    li.appendChild(scale);
    ul.appendChild(li);
  });
}

// ========================================
// BEREGNINGER OG OPPDATERINGER
// ========================================

/**
 * Beregn og oppdater totaler for alle skjemaer
 */
export function computeTotals() {
  updateSchemeTotal('ar', CIWA_AR);
  updateSchemeTotal('b', CIWA_B);
  updateSchemeTotal('cows', COWS);
  updateSchemeTotal('madrs', MADRS);
}

/**
 * Oppdater total for et spesifikt skjema
 * @param {string} scheme - Skjematype
 * @param {Array} questionList - Spørsmålsliste
 */
function updateSchemeTotal(scheme, questionList) {
  const answers = getAnswers(scheme);
  const sum = answers.values.reduce((a, b) => a + (b ?? 0), 0);
  const answered = questionList.length - answers.unanswered.length;
  const level = levelFor(sum, scheme);
  
  // Oppdater DOM-elementer
  document.getElementById(`${scheme}-total-num`).textContent = `Total: ${sum}`;
  
  const badge = document.getElementById(`${scheme}-badge`);
  badge.dataset.level = level.lvl;
  badge.textContent = `Alvorlighetsgrad: ${level.text}`;
  
  document.getElementById(`${scheme}-warn`).hidden = answers.unanswered.length === 0;
  document.getElementById(`${scheme}-counts`).textContent = 
    `${answered}/${questionList.length} besvart${answers.unanswered.length ? '. Mangler spørsmål: ' + answers.unanswered.join(', ') : ''}`;
  
  // Skjul "Gå til første ubesvarte"-knappen hvis alt er besvart
  const button = document.getElementById(`btn_${scheme}_ubesvart`);
  if (button) {
    button.style.display = answers.unanswered.length === 0 ? 'none' : '';
  }
}

// ========================================
// SKJEMAHANDLINGER
// ========================================

/**
 * Nullstill et skjema
 * @param {string} scheme - Skjematype
 */
export function resetForm(scheme) {
  const list = scheme === 'ar' ? CIWA_AR : 
               scheme === 'b' ? CIWA_B : 
               scheme === 'cows' ? COWS : 
               scheme === 'madrs' ? MADRS : CIWA_AR; // <-- LEGG TIL MADRS
  
  list.forEach(q => {
    document.querySelectorAll(`input[name="${q.key}"]`).forEach(inp => {
      inp.checked = false;
      inp.parentElement.classList.remove('selected');
      inp.parentElement.setAttribute('aria-checked', 'false');
    });
  });
  
  computeTotals();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// UTSKRIFT OG EXPORT
// ========================================

/**
 * Bygg utskriftsark
 * @param {string} currentscheme - Gjeldende skjema
 */
export function buildPrintSheet(currentscheme) {
  const isAr = currentscheme === 'ar';
  const isB = currentscheme === 'b';
  const isC = currentscheme === 'cows';
  const isM = currentscheme === 'madrs';
  
  // Hent pasientdata
  const name = document.getElementById('navn').value || '–';
  const id = document.getElementById('fodt').value || '–';
  const dato = document.getElementById('dato').value || '–';
  const puls = document.getElementById('puls').value || '–';
  const bt = document.getElementById('bt').value || '–';
  const resp = document.getElementById('resp').value || '–';
  const spo2 = document.getElementById('spo2').value || '–';
  
  const { values, unanswered } = getAnswers(currentscheme);
  const list = isAr ? CIWA_AR : isB ? CIWA_B : isC ? COWS : MADRS;
  const sum = values.reduce((a, b) => a + (b ?? 0), 0);
  const level = levelFor(sum, currentscheme).text;
  const answered = list.length - unanswered.length;
  
  // Oppdater print-elementer
  document.getElementById('ps-title').textContent = isAr ? 'CIWA-Ar' : isB ? 'CIWA-B' : isC ? 'COWS' : 'MADRS';
  document.getElementById('ps-navn').textContent = name;
  document.getElementById('ps-fodt').textContent = id;
  document.getElementById('ps-dato').textContent = dato;
  document.getElementById('ps-puls').textContent = puls;
  document.getElementById('ps-bt').textContent = bt;
  document.getElementById('ps-resp').textContent = resp;
  document.getElementById('ps-spo2').textContent = spo2;
  document.getElementById('ps-total').textContent = sum;
  document.getElementById('ps-level').textContent = `Alvorlighetsgrad: ${level}`;
  document.getElementById('ps-answered').textContent = answered;
  document.getElementById('ps-totalq').textContent = list.length;
  
  // Bygg spørsmålsliste for print
  const ps = document.getElementById('ps-list');
  ps.innerHTML = '';
  
  list.forEach((q, idx) => {
    const val = values[idx];
    const item = document.createElement('div');
    item.className = 'ps-item';
    
    const title = document.createElement('span');
    title.className = 'ps-item-title';
    title.textContent = `${idx + 1}. ${q.title}`;
    
    const score = document.createElement('span');
    score.className = 'ps-item-score';
    score.textContent = (val === null ? '?' : val) + `/${q.max ?? q.options[q.options.length - 1].value}`;
    
    const labelText = labelFor(currentscheme, q.key, val);
    
    item.appendChild(title);
    item.appendChild(score);
    
    if (labelText) {
      const txt = document.createElement('span');
      txt.className = 'ps-item-text';
      txt.textContent = labelText;
      item.appendChild(txt);
    }
    
    ps.appendChild(item);
  });
  
  // Sett footer
  const foot = document.getElementById('ps-foot');
  if (isAr) {
    foot.textContent = 'Norsk versjon: Oversatt av Jan Hammer, Trude Bjørnstad, Odd Skinnemoen, Vestre Viken og Jan Tore Daltveit, Svein Skjøtskift, Thomas Mildestvedt, Haukeland Universitetssjukehus. Mai 2014.';
  } else if (isB) {
    foot.textContent = 'Tilpasset fra Busto UE, Sykora K & Sellers EM (1989). Norsk oversettelse 20.12.2015 ved Anita Mlodozeniec & Øistein Kristensen.';
  } else if (isM) {
    foot.textContent = 'MADRS – Montgomery–Åsberg Depression Rating Scale. Utviklet av Montgomery & Åsberg (1979).';
  } else {
    foot.textContent = '';
  }
  
  // Sett CSS-klasser for kolonner
  const psList = document.getElementById('ps-list');
  psList.className = 'ps-columns ' + (isAr ? 'ps-ar' : isB ? 'ps-b' : isC ? 'ps-cows' : 'ps-madrs');
}

/**
 * Bygg full oppsummering
 * @param {string} scheme - Skjematype
 * @returns {Object} Oppsummering med tekst og metadata
 */
export function buildSummary(scheme) {
  const isAr = scheme === 'ar';
  const isB = scheme === 'b';
  const isC = scheme === 'cows';
  const isM = scheme === 'madrs';
  const { values, unanswered } = getAnswers(scheme);
  const items = isAr ? CIWA_AR : isB ? CIWA_B : isC ? COWS : MADRS;
  const sum = values.reduce((a, b) => a + (b ?? 0), 0);
  const level = levelFor(sum, scheme);
  
  // Hent pasientdata
  const name = document.getElementById('navn').value || '';
  const id = document.getElementById('fodt').value || '';
  const dato = document.getElementById('dato').value || '';
  const puls = document.getElementById('puls').value || '';
  const bt = document.getElementById('bt').value || '';
  const resp = document.getElementById('resp').value || '';
  const spo2 = document.getElementById('spo2').value || '';
  
  // Bygg tekst
  let text = `${isAr ? 'CIWA-Ar' : isB ? 'CIWA-B' : isC ? 'COWS' : 'MADRS'} skåring\n`;
  text += `Dato: ${dato}\n`;
  text += `Pasient: ${name}\n`;
  text += `Fødselsdato: ${id}\n`;
  text += `Puls: ${puls}\n`;
  text += `Blodtrykk: ${bt}\n`;
  text += `Respirasjonsfrekvens: ${resp}\n`;
  text += `SpO2: ${spo2}\n\n`;
  text += `Total: ${sum} • Alvorlighetsgrad: ${level.text}\n`;
  
  if (unanswered.length) {
    text += `Mangler svar på: ${unanswered.join(', ')}\n`;
  }
  
  text += `\n`;
  
  items.forEach((q, idx) => {
    const val = values[idx];
    const maxVal = q.max ?? q.options[q.options.length - 1].value;
    text += `${idx + 1}. ${q.title}: ${val === null ? '-' : val}/${maxVal}\n`;
  });
  
  return { text, total: sum, level: level.text, unanswered };
}

/**
 * Bygg kort oppsummering
 * @param {string} scheme - Skjematype
 * @returns {Object} Kort oppsummering
 */
export function buildLite(scheme) {
  const { values } = getAnswers(scheme);
  const sum = values.reduce((a, b) => a + (b ?? 0), 0);
  const level = levelFor(sum, scheme);
  
  const name = document.getElementById('navn').value || '';
  const id = document.getElementById('fodt').value || '';
  const dato = document.getElementById('dato').value || '';
  const schemeName = scheme === 'ar' ? 'CIWA-Ar' : 
                    scheme === 'b' ? 'CIWA-B' : 
                    scheme === 'cows' ? 'COWS' : 'MADRS';
  
  return {
    subject: `${schemeName} – ${name || 'Pasient'} – total ${sum}`,
    body: `Dato: ${dato}\nPasient: ${name}\nFødselsdato: ${id}\nTotal: ${sum} • Alvorlighetsgrad: ${level.text}`
  };
}

/**
 * Kopier kort oppsummering til utklippstavle
 * @param {string} scheme - Skjematype
 * @param {HTMLElement} btn - Knapp-element for feedback
 */
export function copySum(scheme, btn) {
  const { values } = getAnswers(scheme);
  const parts = values.map(v => (v === null ? '?' : String(v)));
  const sum = values.reduce((a, b) => a + (b ?? 0), 0);
  const level = levelFor(sum, scheme).text;
  const schemeName = scheme === 'ar' ? 'CIWA-Ar' : 
                    scheme === 'b' ? 'CIWA-B' : 
                    scheme === 'cows' ? 'COWS' : 'MADRS';
  const text = `${schemeName}=${sum} (${parts.join('+')}) • ${level}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(btn);
    }).catch(() => {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
}

/**
 * Fallback kopiering for eldre nettlesere
 * @param {string} text - Tekst å kopiere
 * @param {HTMLElement} btn - Knapp for feedback
 */
export function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback(btn);
  } finally {
    document.body.removeChild(ta);
  }
}

/**
 * Vis feedback når kopiering er vellykket
 * @param {HTMLElement} btn - Knapp-element
 */
function showCopyFeedback(btn) {
  if (btn) {
    const old = btn.textContent;
    btn.textContent = 'Kopiert!';
    setTimeout(() => btn.textContent = old, 1600);
  }
}

// ========================================
// E-POST FUNKSJONALITET
// ========================================

/**
 * Send e-post med skjema-oppsummering
 * @param {string} scheme - Skjematype
 * @param {string} type - 'full' eller 'lite'
 */
export function sendEmail(scheme, type) {
  let subject, body;
  
  if (type === 'lite') {
    const lite = buildLite(scheme);
    subject = lite.subject;
    body = lite.body;
  } else {
    const summary = buildSummary(scheme);
    const schemeName = scheme === 'ar' ? 'CIWA-Ar' : 
                      scheme === 'b' ? 'CIWA-B' : 
                      scheme === 'cows' ? 'COWS' : 'MADRS';
    subject = `${schemeName} skåring`;
    body = summary.text;
  }
  
  // Opprett mailto-link
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const mailtoLink = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  
  // Åpne e-post-klient
  window.location.href = mailtoLink;
}

// ========================================
// HOVEDRENDER-FUNKSJON
// ========================================

/**
 * Render alle skjemaer og initialiser
 */
export function renderAll() {
  renderQuestions(CIWA_AR, 'ar-questions');
  renderQuestions(CIWA_B, 'b-questions');
  renderQuestions(COWS, 'cows-questions');
  renderQuestions(MADRS, 'madrs-questions');
  computeTotals();
}
