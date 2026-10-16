import './style.css';
import { LEGAL } from './legal.js';

const initialPath = location.pathname;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ───────── Daten ───────── */
const SERVICES = [
  {
    id: 'buchhaltung', path: '/buchhaltung', label: 'Buchhaltung', icon: 'i-book',
    title: 'Buchhaltung',
    intro: 'Eine zuverlässige Buchhaltung bildet die Grundlage für fundierte unternehmerische Entscheidungen.',
    items: [
      ['Finanzbuchhaltung', 'Laufende Buchhaltung nach gesetzlichen Vorgaben, Verbuchung aller Geschäftsfälle und Anlagenbuchhaltung.'],
      ['Debitoren', 'Kundenrechnungen, Zahlungseingänge und Mahnwesen.'],
      ['Kreditoren', 'Prüfung und Erfassung der Lieferantenrechnungen, fristgerechte Zahlungsvorbereitung, Pflege der Lieferantenstammdaten.'],
      ['Monats-, Quartals- und Jahresabschlüsse', 'Erstellung nach gesetzlichen Vorschriften mit Bilanz, Erfolgsrechnung, Revisionsunterlagen und Analyse der Ergebnisse.']
    ]
  },
  {
    id: 'personalwesen', path: '/personalwesen', label: 'Personal', icon: 'i-people',
    title: 'Personalwesen',
    intro: 'Individuelle Unterstützung im Personalwesen – genau in dem Umfang, den Ihr Unternehmen braucht.',
    items: [
      ['Lohnbuchhaltung', 'Monatliche Lohnverarbeitung, Lohnabrechnungen und Lohnausweise sowie Abstimmung mit der Finanzbuchhaltung.'],
      ['Sozialversicherungen', 'An- und Abmeldungen, Lohnmeldungen, Quellensteuerabrechnungen, Jahresendabrechnungen (AHV, UVG, BVG) und Korrespondenz.'],
      ['Personaladministration', 'Arbeitsverträge, Ein- und Austritte, Absenzmanagement, Arbeitszeugnisse, Personalstammdaten und Personaldossiers.']
    ]
  },
  {
    id: 'steuern', path: '/steuern', label: 'Steuern', icon: 'i-doc',
    title: 'Steuern',
    intro: 'Fristgerecht, korrekt und abgestimmt auf Ihre private oder unternehmerische Situation.',
    items: [
      ['Steuererklärung', 'Erstellung und Einreichung sowie Kontakt mit den Steuerbehörden.'],
      ['Mehrwertsteuerabrechnung', 'Erstellung und Einreichung sowie Ermittlung von Vorsteuer und Umsatzsteuer.']
    ]
  }
];

const SCOPES = [
  ['Einzelne Aufgaben', 'Sie geben gezielt ab, was Sie am meisten Zeit kostet – etwa die Lohnabrechnung oder die MWST-Abrechnung.'],
  ['Teilbereiche', 'Ganze Bereiche wie Kreditoren, Debitoren oder das Personalwesen liegen bei mir. Den Rest führen Sie selbst.'],
  ['Gesamte Buchhaltung', 'Ich führe Ihre Buchhaltung vollständig – vom Beleg bis zum Jahresabschluss. Sie behalten den Überblick.']
];

const LEDGER = [
  ['Kundenrechnung 2026-114', 'Debitoren', 12480],
  ['Lieferant Büromaterial', 'Kreditoren', 1860.5],
  ['Lohnabrechnung Oktober', 'Personalaufwand', 18240],
  ['Zahlungseingang Kunde', 'Bank', 9200],
  ['MWST-Abgrenzung Q3', 'Mehrwertsteuer', 3118.4]
];

/* ───────── Farbwelt-Schalter ───────── */
const themeBtn = $('#themeBtn');
const metaTheme = $('meta[name="theme-color"]');
function applyTheme(t) {
  const classic = t === 'classic';
  document.documentElement.dataset.theme = classic ? 'classic' : 'forest';
  themeBtn.setAttribute('aria-pressed', String(classic));
  themeBtn.setAttribute('aria-label', classic ? 'Zurück zur neuen Farbwelt' : 'Originalfarben der bisherigen Website verwenden');
  $('.theme-label').textContent = classic ? 'Neue Farben' : 'Originalfarben';
  metaTheme.content = classic ? '#6b5440' : '#0b2a21';
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('mf-theme'); } catch {}
applyTheme(savedTheme === 'classic' ? 'classic' : 'forest');
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'classic' ? 'forest' : 'classic';
  const r = themeBtn.getBoundingClientRect();
  document.documentElement.style.setProperty('--tx', `${r.left + r.width / 2}px`);
  document.documentElement.style.setProperty('--ty', `${r.top + r.height / 2}px`);
  const swap = () => applyTheme(next);
  if (document.startViewTransition && !reduced) document.startViewTransition(swap); else swap();
  try { localStorage.setItem('mf-theme', next); } catch {}
});

/* ───────── Reveal / Intro ───────── */
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('ready')));
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el) => io.observe(el));
$('#year').textContent = new Date().getFullYear();

/* ───────── Header, Progress, Spy ───────── */
const header = $('.site-header');
const progress = $('#progress');
const onScroll = () => {
  const y = scrollY;
  header.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = $('#menuBtn');
const nav = $('#nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

const spyTargets = ['start', 'dienstleistungen', 'ueber-mich', 'kontakt'];
let currentSection = 'start';
let spyReady = false;
setTimeout(() => (spyReady = true), 1800);
const spy = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    currentSection = e.target.id;
    $$('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.spy === currentSection));
    if (!legalOpen && !(initialPath !== '/' && !spyReady)) history.replaceState(null, '', sectionPath(currentSection));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
spyTargets.forEach((id) => spy.observe(document.getElementById(id)));

/* ───────── Hero: Spotlight, Tilt ───────── */
const hero = $('.hero');
const ledger = $('#ledger');
if (canHover && !reduced) {
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
    hero.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  ledger.addEventListener('pointermove', (e) => {
    const r = ledger.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ledger.style.setProperty('--ry', `${(px - 0.5) * 9}deg`);
    ledger.style.setProperty('--rx', `${(0.5 - py) * 9}deg`);
    ledger.style.setProperty('--sx', `${px * 100}%`);
    ledger.style.setProperty('--sy', `${py * 100}%`);
  });
  ledger.addEventListener('pointerleave', () => { ledger.style.setProperty('--rx', '0deg'); ledger.style.setProperty('--ry', '0deg'); });
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.28}px`;
    });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });
}

/* ───────── Ledger-Animation ───────── */
const rowsEl = $('#ledgerRows');
const totSoll = $('#totSoll'), totHaben = $('#totHaben');
const barSoll = $('#barSoll'), barHaben = $('#barHaben');
const stamp = $('#stamp');
const sum = LEDGER.reduce((a, r) => a + r[2], 0);
let ledgerRun = 0;

function tween(el, from, to, ms) {
  return new Promise((res) => {
    if (reduced) { el.textContent = fmt.format(to); return res(); }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(from + (to - from) * eased);
      p < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
}

async function runLedger() {
  const id = ++ledgerRun;
  rowsEl.innerHTML = '';
  stamp.classList.remove('show');
  [barSoll, barHaben].forEach((b) => (b.style.transform = 'scaleX(0)'));
  totSoll.textContent = totHaben.textContent = fmt.format(0);
  let acc = 0;
  for (const [text, account, amount] of LEDGER) {
    if (id !== ledgerRun) return;
    const li = document.createElement('li');
    li.innerHTML = `<span>${text}<span class="acc">${account}</span></span><span class="amt">${fmt.format(amount)}</span>`;
    rowsEl.append(li);
    await sleep(40);
    li.classList.add('in');
    const from = acc;
    acc += amount;
    const ratio = Math.min(1, acc / sum);
    barSoll.style.transform = barHaben.style.transform = `scaleX(${ratio})`;
    tween(totSoll, from, acc, 600);
    await tween(totHaben, from, acc, 600);
    setTimeout(() => li.classList.add('settled'), 900);
    await sleep(reduced ? 0 : 280);
  }
  if (id !== ledgerRun) return;
  await sleep(250);
  stamp.classList.add('show');
}
let ledgerStarted = false;
const ledgerObs = new IntersectionObserver((es) => {
  if (es[0].isIntersecting && !ledgerStarted) { ledgerStarted = true; setTimeout(runLedger, reduced ? 0 : 900); }
}, { threshold: 0.3 });
ledgerObs.observe(ledger);
$('#ledgerReplay').addEventListener('click', runLedger);

/* ───────── Leistungen: Tabs + Auswahl ───────── */
const tabsEl = $('#tabs');
const panelsEl = $('#panels');
const selected = new Map(); // key -> {group, name}
let activeTab = 0;

const ind = document.createElement('span');
ind.className = 'indicator';
ind.setAttribute('aria-hidden', 'true');
tabsEl.append(ind);

SERVICES.forEach((s, i) => {
  const tab = document.createElement('button');
  tab.className = 'tab';
  tab.type = 'button';
  tab.role = 'tab';
  tab.id = `tab-${s.id}`;
  tab.setAttribute('aria-controls', `panel-${s.id}`);
  tab.innerHTML = `<svg class="ic" aria-hidden="true"><use href="#${s.icon}"/></svg>${s.label}`;
  tab.addEventListener('click', () => selectTab(i, true));
  tab.addEventListener('keydown', (e) => {
    const n = SERVICES.length;
    const map = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    if (e.key in map) { e.preventDefault(); selectTab(map[e.key], true); $$('.tab')[map[e.key]].focus(); }
  });
  tabsEl.append(tab);

  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.id = `panel-${s.id}`;
  panel.role = 'tabpanel';
  panel.setAttribute('aria-labelledby', tab.id);
  panel.innerHTML = `
    <div class="panel-intro">
      <div class="panel-icon"><svg class="ic" aria-hidden="true"><use href="#${s.icon}"/></svg></div>
      <h3>${s.title}</h3>
      <p>${s.intro}</p>
    </div>
    <ul class="items">${s.items.map(([name, desc], k) => `
      <li class="item" data-key="${s.id}-${k}">
        <div><h4>${name}</h4><p>${desc}</p></div>
        <button class="toggle" type="button" aria-pressed="false" aria-label="${name} zur Anfrage hinzufügen" data-group="${s.title}" data-name="${name}">
          <svg class="ic ic-plus" aria-hidden="true"><use href="#i-plus"/></svg><svg class="ic ic-ok" aria-hidden="true"><use href="#i-check"/></svg>
        </button>
      </li>`).join('')}
    </ul>`;
  panelsEl.append(panel);
});

function moveIndicator() {
  const t = $$('.tab')[activeTab];
  ind.style.width = `${t.offsetWidth}px`;
  ind.style.transform = `translateX(${t.offsetLeft}px)`;
  tabsEl.scrollTo({ left: t.offsetLeft - (tabsEl.clientWidth - t.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
}
function selectTab(i, push) {
  activeTab = i;
  $$('.tab').forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  $$('.panel').forEach((p, k) => p.classList.toggle('active', k === i));
  moveIndicator();
  if (push && currentSection === 'dienstleistungen') history.replaceState(null, '', SERVICES[i].path);
}
addEventListener('resize', moveIndicator);
document.fonts?.ready.then(moveIndicator);

panelsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle');
  if (!btn) return;
  const li = btn.closest('.item');
  const on = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', String(on));
  li.classList.toggle('on', on);
  if (on) selected.set(li.dataset.key, { group: btn.dataset.group, name: btn.dataset.name });
  else selected.delete(li.dataset.key);
  renderSelection(true);
});

const pill = $('#pill'), pillCount = $('#pillCount'), pillText = $('#pillText');
const chosen = $('#chosen'), chosenList = $('#chosenList'), chosenScope = $('#chosenScope');
const scope = $('#scope');

function renderSelection(bump) {
  const n = selected.size;
  pill.hidden = n === 0 || contactVisible;
  pillCount.textContent = n;
  pillText.textContent = n === 1 ? 'Thema gewählt' : 'Themen gewählt';
  if (bump) { pillCount.classList.remove('bump'); void pillCount.offsetWidth; pillCount.classList.add('bump'); }
  chosen.hidden = n === 0 && Number(scope.value) === 0 && !scopeTouched;
  chosenList.innerHTML = '';
  selected.forEach((v, key) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" data-key="${key}" aria-label="${v.name} entfernen">${v.name}<svg class="ic" aria-hidden="true"><use href="#i-close"/></svg></button>`;
    chosenList.append(li);
  });
  chosenScope.textContent = scopeTouched ? `Gewünschter Umfang: ${SCOPES[scope.value][0]}` : '';
}
chosenList.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const li = panelsEl.querySelector(`[data-key="${b.dataset.key}"]`);
  li?.querySelector('.toggle').click();
});
pill.addEventListener('click', () => go('/kontakt'));

let contactVisible = false;
new IntersectionObserver((es) => { contactVisible = es[0].isIntersecting; renderSelection(false); }, { threshold: 0.2 }).observe($('#kontakt'));

/* ───────── Umfang ───────── */
let scopeTouched = false;
function renderScope() {
  const v = Number(scope.value);
  scope.style.setProperty('--p', `${v * 50}%`);
  const t = $('#scopeTitle'), x = $('#scopeText');
  t.textContent = SCOPES[v][0];
  x.textContent = SCOPES[v][1];
  [t, x].forEach((el) => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
}
scope.addEventListener('input', () => { scopeTouched = true; renderScope(); renderSelection(false); });
renderScope();

/* ───────── Formular ───────── */
const form = $('#form');
const rules = {
  vorname: (v) => (v.trim() ? '' : 'Bitte geben Sie Ihren Vornamen an.'),
  name: (v) => (v.trim() ? '' : 'Bitte geben Sie Ihren Namen an.'),
  email: (v) => (!v.trim() ? 'Bitte geben Sie Ihre E-Mail-Adresse an.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Diese E-Mail-Adresse sieht nicht vollständig aus (z. B. name@firma.ch).'),
  msg: (v) => (v.trim().length >= 5 ? '' : 'Schreiben Sie mir kurz, worum es geht.')
};
function validate(id) {
  const input = $('#' + id);
  const msg = rules[id](input.value);
  const field = input.closest('.field');
  const err = $('#e-' + id);
  field.classList.toggle('invalid', !!msg);
  field.classList.toggle('valid', !msg && id !== 'msg');
  input.setAttribute('aria-invalid', String(!!msg));
  if (msg) input.setAttribute('aria-describedby', 'e-' + id); else input.removeAttribute('aria-describedby');
  err.hidden = !msg;
  err.textContent = msg;
  return !msg;
}
Object.keys(rules).forEach((id) => {
  const input = $('#' + id);
  input.addEventListener('blur', () => { if (input.value || input.closest('.field').classList.contains('invalid')) validate(id); });
  input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) validate(id); });
});

let mailText = '';
function buildMail() {
  const d = Object.fromEntries(new FormData(form));
  const topics = [...selected.values()].map((v) => `• ${v.group}: ${v.name}`).join('\n');
  mailText = [
    'Guten Tag Frau Müller', '',
    d.msg.trim(), '',
    topics ? `Themen, die mich interessieren:\n${topics}\n` : '',
    scopeTouched ? `Gewünschter Umfang: ${SCOPES[scope.value][0]}\n` : '',
    'Freundliche Grüsse',
    `${d.vorname.trim()} ${d.name.trim()}`,
    d.email.trim()
  ].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n');
  const subj = `Anfrage Erstgespräch – ${d.vorname.trim()} ${d.name.trim()}`;
  return `mailto:mueller@mueller-finance.ch?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(mailText)}`;
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bad = Object.keys(rules).filter((id) => !validate(id));
  if (bad.length) { $('#' + bad[0]).focus(); return; }
  const btn = $('#submit');
  btn.setAttribute('aria-busy', 'true');
  const href = buildMail();
  await sleep(350);
  location.href = href;
  btn.removeAttribute('aria-busy');
  const s = $('#success');
  s.hidden = false;
  s.focus();
});
$('#copyMsg').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(mailText); toast('Text kopiert – jetzt in Ihre E-Mail einfügen.'); }
  catch { toast('Kopieren nicht möglich. Schreiben Sie direkt an mueller@mueller-finance.ch'); }
});
$('#vcard').addEventListener('click', () => {
  const v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Müller;Dominique;;;', 'FN:Dominique Müller', 'ORG:Müller Finance', 'TITLE:Fachfrau im Finanz- und Rechnungswesen mit eidg. Fachausweis', 'TEL;TYPE=WORK,VOICE:+41775125109', 'EMAIL;TYPE=WORK:mueller@mueller-finance.ch', 'ADR;TYPE=WORK:;;;Klingnau;;5313;Schweiz', 'URL:https://www.mueller-finance.ch', 'END:VCARD'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
  a.download = 'Mueller-Finance.vcf';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => (t.hidden = true), 4000);
}

/* ───────── Router (SPA, Original-URLs bleiben gültig) ───────── */
const legal = $('#legal');
let legalOpen = false;
const SECTION_PATH = { start: '/', dienstleistungen: null, 'ueber-mich': '/ueber-mich', kontakt: '/kontakt' };
function sectionPath(id) { return id === 'dienstleistungen' ? SERVICES[activeTab].path : SECTION_PATH[id] ?? '/'; }

function openLegal(key) {
  const d = LEGAL[key];
  $('#legalTitle').textContent = d.title;
  $('#legalBody').innerHTML = d.html + '<p class="stand">Stand: Oktober 2026</p>';
  $('#legalBody').scrollTop = 0;
  if (!legal.open) legal.showModal();
  legalOpen = true;
}
legal.addEventListener('close', () => { legalOpen = false; history.replaceState(null, '', sectionPath(currentSection)); lastFocus?.focus?.(); });
$('#legalClose').addEventListener('click', () => legal.close());
legal.addEventListener('click', (e) => { if (e.target === legal) legal.close(); });

let lastFocus = null;
function route(path, { scroll = true } = {}) {
  const p = path.toLowerCase().replace(/\/+$/, '') || '/';
  const smooth = reduced ? 'auto' : 'smooth';
  if (p === '/impressum') return openLegal('impressum');
  if (p === '/datenschutz') return openLegal('datenschutz');
  if (p === '/agb' || p === '/datenschutz-kopie') return openLegal('agb');
  if (legal.open) legal.close();
  const svc = SERVICES.findIndex((s) => s.path === p);
  let target = null;
  if (svc >= 0) { selectTab(svc, false); target = 'dienstleistungen'; }
  else if (p === '/ueber-mich') target = 'ueber-mich';
  else if (p === '/kontakt') target = 'kontakt';
  else target = 'start';
  if (scroll) {
    const el = document.getElementById(target);
    if (target === 'start') scrollTo({ top: 0, behavior: smooth });
    else el.scrollIntoView({ behavior: smooth, block: 'start' });
  }
}
function go(path) {
  lastFocus = document.activeElement;
  setMenu(false);
  if (!/impressum|datenschutz|agb/i.test(path)) history.pushState(null, '', path);
  else history.replaceState(null, '', path);
  route(path);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-route]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault();
  go(a.getAttribute('href'));
});
addEventListener('popstate', () => route(location.pathname));

selectTab(0, false);
if (initialPath !== '/') setTimeout(() => route(initialPath), 120);
