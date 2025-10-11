// ========================================
// MAIN.JS - Hovedfil for skåringsverktøy
// Håndterer initialisering, fane-navigasjon og globale funksjoner
// ========================================

// Import av skjemadata
import { AR_LABELS, CIWA_AR } from './ciwa-ar.js';
import { B_LABELS, CIWA_B } from './ciwa-b.js';
import { COWS_LABELS, COWS } from './cows.js';

// Import av hjelpefunksjoner
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
  copySum,
  fallbackCopy,
  renderAll
} from './utils.js';

// ========================================
// INITIALISERING
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // SETT DAGENS DATO
  // ========================================
  
  /**
   * Sett dagens dato i datofelt automatisk
   */
  function setTodaysDate() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const today = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
    
    const datoField = document.getElementById('dato');
    if (datoField) {
      datoField.value = today;
    }
  }
  
  setTodaysDate();

  // ========================================
  // DOM-ELEMENTER OG VARIABLER
  // ========================================
  
  // Fane-elementer
  const tabAr = document.getElementById('tab-ar');
  const tabB = document.getElementById('tab-b');
  const tabCOWS = document.getElementById('tab-cows');
  
  // Panel-elementer
  const panelAr = document.getElementById('panel-ar');
  const panelB = document.getElementById('panel-b');
  const panelC = document.getElementById('panel-cows');
  
  // Footer-elementer
  const footerAr = document.getElementById('footer-ar');
  const footerB = document.getElementById('footer-b');
  const footerC = document.getElementById('footer-cows');
  
  // Modal-elementer
  const modal = document.getElementById('email-modal');
  const modalSchemeLabel = document.getElementById('modal-scheme-label');
  
  // Gjeldende skjema
  let currentScheme = 'ar';

  // ========================================
  // FANE-NAVIGASJON
  // ========================================
  
  /**
   * Aktiver en spesifikk fane og skjul andre
   * @param {string} which - Skjematype ('ar', 'b', 'cows')
   */
  function activateTab(which) {
    currentScheme = which;
    
    // Bestem hvilken fane som er aktiv
    const isAr = which === 'ar';
    const isB = which === 'b';
    const isC = which === 'cows';
    
    // Oppdater fane-tilstand
    updateTabStates(isAr, isB, isC);
    
    // Vis/skjul paneler
    togglePanelVisibility(isAr, isB, isC);
    
    // Vis/skjul footers
    toggleFooterVisibility(isAr, isB, isC);
    
    // Kontroller synlighet av skjema-spesifikke seksjoner
    updateBodyClasses(which);
    
    // Oppdater utskriftselementer
    updatePrintElements(isAr, isB, isC);
    
    // Oppdater modal
    updateModalLabel(isAr, isB, isC);
    
    // Scroll til topp og oppdater beregninger
    window.scrollTo({ top: 0, behavior: 'smooth' });
    computeTotals();
  }
  
  /**
   * Oppdater tilstand for faner (active/inactive)
   */
  function updateTabStates(isAr, isB, isC) {
    tabAr.classList.toggle('active', isAr);
    tabAr.setAttribute('aria-selected', isAr);
    
    tabB.classList.toggle('active', isB);
    tabB.setAttribute('aria-selected', isB);
    
    tabCOWS.classList.toggle('active', isC);
    tabCOWS.setAttribute('aria-selected', isC);
  }
  
  /**
   * Vis/skjul paneler basert på aktiv fane
   */
  function togglePanelVisibility(isAr, isB, isC) {
    panelAr.hidden = !isAr;
    panelB.hidden = !isB;
    panelC.hidden = !isC;
  }
  
  /**
   * Vis/skjul footers basert på aktiv fane
   */
  function toggleFooterVisibility(isAr, isB, isC) {
    footerAr.hidden = !isAr;
    footerB.hidden = !isB;
    footerC.hidden = !isC;
  }
  
  /**
   * Oppdater body-klasser for skjema-spesifikke stiler
   */
  function updateBodyClasses(scheme) {
    // Fjern eksisterende klasser
    document.body.className = document.body.className.replace(/active-(ar|b|cows)/g, '');
    
    // Legg til ny klasse
    document.body.classList.add(`active-${scheme}`);
  }
  
  /**
   * Oppdater elementer for utskrift
   */
  function updatePrintElements(isAr, isB, isC) {
    const psList = document.getElementById('ps-list');
    const psTitle = document.getElementById('ps-title');
    
    if (psTitle) {
      psTitle.textContent = isAr ? 'CIWA-Ar' : isB ? 'CIWA-B' : 'COWS';
    }
    
    if (psList) {
      psList.classList.toggle('ps-ar', isAr);
      psList.classList.toggle('ps-b', isB);
      psList.classList.toggle('ps-cows', isC);
    }
  }
  
  /**
   * Oppdater modal-label
   */
  function updateModalLabel(isAr, isB, isC) {
    if (modalSchemeLabel) {
      modalSchemeLabel.textContent = isAr ? 'CIWA-Ar' : isB ? 'CIWA-B' : 'COWS';
    }
  }
  
  // Event listeners for faner
  if (tabAr) tabAr.addEventListener('click', () => activateTab('ar'));
  if (tabB) tabB.addEventListener('click', () => activateTab('b'));
  if (tabCOWS) tabCOWS.addEventListener('click', () => activateTab('cows'));

  // ========================================
  // E-POST MODAL
  // ========================================
  
  /**
   * Åpne e-post modal
   * @param {string} scheme - Skjematype
   */
  function openEmailModal(scheme) {
    currentScheme = scheme;
    
    if (modalSchemeLabel) {
      modalSchemeLabel.textContent = scheme === 'ar' ? 'CIWA-Ar' : 
                                   scheme === 'b' ? 'CIWA-B' : 'COWS';
    }
    
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
  }
  
  /**
   * Lukk e-post modal
   */
  function closeEmailModal() {
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  }
  
  // Event listeners for modal
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEmailModal();
    });
  }
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEmailModal();
  });

  // ========================================
  // UTSKRIFT
  // ========================================
  
  // Bygg utskriftsark før utskrift
  window.addEventListener('beforeprint', () => {
    buildPrintSheet(currentScheme);
  });

  // ========================================
  // GLOBALE FUNKSJONER
  // ========================================
  
  // Gjør funksjoner tilgjengelig for HTML onclick-attributter
  window.scrollToFirstUnanswered = scrollToFirstUnanswered;
  window.resetForm = resetForm;
  window.copySum = copySum;
  window.openEmailModal = openEmailModal;
  window.closeEmailModal = closeEmailModal;
  window.sendEmail = sendEmail;

  // ========================================
  // RESPONSIV FUNKSJONALITET
  // ========================================
  
  /**
   * Sett åpen/lukket tilstand for meta-details basert på skjermstørrelse
   */
  function setMetaOpenState() {
    const details = document.getElementById('meta-details');
    if (!details) return;
    
    // Åpne automatisk på større skjermer
    if (window.innerWidth > 700) {
      details.open = true;
    } else {
      details.open = false;
    }
  }
  
  // Event listeners for responsiv funksjonalitet
  window.addEventListener('resize', setMetaOpenState);
  setMetaOpenState(); // Kjør ved lasting

  // ========================================
  // INITIAL RENDERING
  // ========================================
  
  // Render alle skjemaer
  renderAll();
  
  // Sett initial tilstand (CIWA-Ar aktiv)
  document.body.classList.add('active-ar');
  
  // Sett initial meta-tilstand
  setMetaOpenState();
});