import { AR_LABELS, CIWA_AR } from './ciwa-ar.js';
import { B_LABELS, CIWA_B } from './ciwa-b.js';
import { COWS_LABELS, COWS } from './cows.js';
import {
  labelFor,
  buildPrintSheet,
  makeScale,
  renderQuestions,
  getAnswers,
  levelFor,
  computeTotals,
  scrollToFirstUnanswered,
  resetForm,
  buildSummary,
  buildLite,
  sendEmail,
  downloadSummary,
  copySum,
  fallbackCopy,
  renderAll
} from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
//Setter dagens dato i feltet
  (function(){
    const d = new Date(); const pad = (n) => String(n).padStart(2, '0');
    const today = `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
    const dato = document.getElementById('dato'); if(dato) dato.value = today;
  })();

  //Hent DOM-elementer
  const tabAr   = document.getElementById('tab-ar');
  const tabB    = document.getElementById('tab-b');
  const tabCOWS = document.getElementById('tab-cows');
  const panelAr = document.getElementById('panel-ar');
  const panelB  = document.getElementById('panel-b');
  const panelC  = document.getElementById('panel-cows');
  const footerAr = document.getElementById('footer-ar');
  const footerB  = document.getElementById('footer-b');
  const footerC  = document.getElementById('footer-cows');
  const modal = document.getElementById('email-modal');
  const modalSchemeLabel = document.getElementById('modal-scheme-label');
  let currentScheme = 'ar';

  //Bytt tab/fane
  function activateTab(which){
    currentScheme = which;
    const isAr = which==='ar';
    const isB  = which==='b';
    const isC  = which==='cows';
    tabAr.classList.toggle('active', isAr); tabAr.setAttribute('aria-selected', isAr);
    tabB.classList.toggle('active', isB);  tabB.setAttribute('aria-selected', isB);
    tabCOWS.classList.toggle('active', isC); tabCOWS.setAttribute('aria-selected', isC);
    panelAr.hidden = !isAr; panelB.hidden = !isB; panelC.hidden = !isC;
    footerAr.hidden = !isAr; footerB.hidden = !isB; footerC.hidden = !isC;
    const psList = document.getElementById('ps-list');
    document.getElementById('ps-title').textContent = isAr? 'CIWA-Ar' : isB? 'CIWA-B' : 'COWS';
    psList.classList.toggle('ps-ar', isAr); psList.classList.toggle('ps-b', isB); psList.classList.toggle('ps-cows', isC);
    modalSchemeLabel.textContent = isAr? 'CIWA-Ar' : isB? 'CIWA-B' : 'COWS';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    computeTotals();
  }
  tabAr.addEventListener('click', ()=>activateTab('ar'));
  tabB.addEventListener('click',  ()=>activateTab('b'));
  tabCOWS.addEventListener('click',  ()=>activateTab('cows'));

  //Modul for e-post
  window.addEventListener('beforeprint', () => buildPrintSheet(currentScheme));
  function openEmailModal(scheme){ currentScheme = scheme; modalSchemeLabel.textContent = scheme==='ar'?'CIWA-Ar': scheme==='b'?'CIWA-B':'COWS'; modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); }
  function closeEmailModal(){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); }
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeEmailModal(); });
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeEmailModal(); });

// Gjør hjelpefunksjoner tilgjengelig for HTML-knapper
window.scrollToFirstUnanswered = scrollToFirstUnanswered;
window.resetForm = resetForm;
window.downloadSummary = downloadSummary;
window.copySum = copySum;
window.openEmailModal = openEmailModal;
window.sendEmail = sendEmail;

// Render alt når DOM er klar
renderAll();
});