# Audit Tecnico — Cardiac Mass DSS

> Documento generato automaticamente il 2026-06-14. Copre tre aree di analisi: funzionalità, sicurezza/performance, UX/UI/accessibilità. I fix già applicati sono marcati esplicitamente.

---

## 1. Funzionalità

Questa sezione cataloga lo stato funzionale dell'applicazione Cardiac Mass DSS sulla base dell'analisi statica del codice sorgente. Le valutazioni si riferiscono alla versione corrente del repository.

---

### 1.1 Cosa funziona

**Navigazione**

La navigazione inter-pagina è gestita tramite stato Zustand senza alcuna libreria di routing dedicata. Il tasto Back di Android è ora operativo grazie a un workaround basato su `history.pushState` introdotto nell'ultimo ciclo di fix.

**Acquisizione dati (NewCase)**

Il form di inserimento (`packages/frontend/src/pages/NewCase.tsx`) espone tre moduli indipendenti per le modalità diagnostiche Echo, CMR e CT-PET. Ciascun modulo può essere attivato o disattivato tramite toggle di disponibilità, consentendo sessioni parziali quando una modalità non è stata eseguita. I metadati del caso (nome, data, note) sono editabili.

**Score engine**

I quattro moduli di scoring presenti in `packages/core/src/scores/` sono tutti implementati e restituiscono risultati numerici e categorici:

| Modulo | File | Output |
|---|---|---|
| DEM Score | `dem.ts` | Score numerico + livello di rischio |
| CMR Mass Score | `cmr.ts` | Score numerico + categoria |
| CT Signs | `ct.ts` | Punteggio segni tomografici |
| PET Evaluation | `pet.ts` | Valutazione metabolica categorica |

**Decision engine (consensus)**

Il modulo `packages/core/src/consensus/engine.ts` (righe 92–166) implementa 11 percorsi decisionali in sequenza `if-else` che producono una raccomandazione clinica con relativa motivazione testuale. Per ciascun path viene generato un insieme di evidence strings che accompagnano la raccomandazione.

**Traceability engine**

Il modulo `packages/core/src/traceability/builder.ts` costruisce un grafo orientato che collega feature di input → score → cutoff → regola attivata → raccomandazione finale. Il grafo è esposto nella UI tramite `TraceabilityPanel`. Quattro riferimenti bibliografici sono linkati staticamente come fonti (Paolisso 2022, D'Angelo 2020, Paolisso 2024, Angeli 2022).

**Storage locale**

`packages/frontend/src/lib/storage.ts` implementa la persistenza tramite `localStorage` con schema versionato (v1). La lettura, la scrittura e l'eliminazione dei casi sono operative.

**Report generation**

`packages/frontend/src/lib/report.ts` e `packages/frontend/src/components/ReportCard.tsx` producono un report plain-text strutturato in sezioni (dati paziente, score per modalità, raccomandazione, evidence, riferimenti bibliografici). L'esportazione in PDF avviene tramite `window.print()` del browser, funzionante sia su web che su WebView Capacitor.

**Import/Export JSON**

`packages/frontend/src/components/EvaluationToolsCard.tsx` e `packages/frontend/src/lib/case-json.ts` implementano l'export del caso corrente in JSON e il re-import con ricalcolo degli score tramite type guard di validazione.

**Golden cases per demo**

`packages/frontend/src/lib/synthetic-cases.ts` contiene 10 casi sintetici (GC-00 → GC-09) che coprono scenari diagnostici rappresentativi e vengono usati come base per demo e regressione manuale.

**Test unitari e di componente**

Sono presenti test per: `storage`, `case-json`, `synthetic-cases`, e per i componenti `ConsensusPanel`, `CtPetCard`, `EchoCard`, `EvaluationToolsCard`, `TraceabilityPanel`, `Header`. Gli store Zustand (`case.store`, `history.store`, `ui.store`) hanno copertura dedicata.

---

### 1.2 Gap per la demo (priorità alta)

I seguenti gap compromettono la credibilità della demo o la sicurezza di un uso clinico anche esplorativo.

**G-01 — Header POC hardcoded nel report**

`packages/frontend/src/lib/report.ts` emette la stringa `"CARDIAC MASS DECISION SUPPORT - POC"` come intestazione. In una demo il documento deve essere neutralizzato o rinominato con un titolo istituzionale. Nessun campo è parametrizzabile.

**G-02 — Nessun audit trail delle regole attivate**

`packages/core/src/consensus/engine.ts` esegue i 11 path in cascata `if-else` senza registrare quale condizione ha fatto scattare la raccomandazione. In assenza di log strutturato, un clinico non può verificare a posteriori il percorso decisionale.

**G-03 — Import JSON non salva automaticamente**

Il flusso di import in `packages/frontend/src/lib/case-json.ts` ricalcola correttamente gli score ma non persiste il caso nel `localStorage`. L'utente può perdere il caso se naviga via prima del salvataggio esplicito.

**G-04 — Validazione clinica assente sui parametri PET**

`packages/frontend/src/pages/NewCase.tsx` accetta qualsiasi valore `>= 0` per i parametri PET senza range clinici validati (es. SUVmax fuori range fisiologico). Un input errato produce uno score apparentemente valido senza warning.

**G-05 — Nessun E2E test**

Playwright è configurato nel progetto ma non esiste alcun test scritto. Per una demo su dispositivo mobile (Capacitor) l'assenza di smoke test automatici rende impossibile garantire che i flussi principali non siano rotti dopo una modifica.

**G-06 — Nessuna cifratura dei dati locali**

I dati clinici (anche fittizi in demo) sono scritti in chiaro nel `localStorage`. Su Android, il WebView storage è accessibile con privilegi di root.

---

### 1.3 Backlog (post-MVP)

**Navigazione e routing**
- Introdurre URL-based routing (es. React Router) per consentire deep linking e supporto nativo al tasto Back senza workaround `history.pushState`.
- Aggiungere lazy loading delle pagine e un error boundary globale.

**Score e decision engine**
- Parametrizzare le soglie dello score engine tramite file di configurazione.
- Introdurre output probabilistico / confidence interval.
- Sostituire la mappa hardcoded `demProbability()` con una funzione interpolabile.
- Sostituire la cascata `if-else` in `engine.ts` (righe 92–166) con un rule engine formale.
- Implementare conflict detection e weighted scoring tra modalità.

**Traceability**
- Collegare i 4 riferimenti bibliografici a URI permanenti (DOI).
- Implementare prioritizzazione esplicita tra regole attivate.

**Storage e conformità**
- Migrare verso IndexedDB cifrato o backend per superare il limite di 5–10 MB di `localStorage`.
- Implementare migration path per versioni dello schema superiori alla v1.
- Aggiungere audit log conforme GDPR per le operazioni di eliminazione dati.

**Report e interoperabilità**
- Aggiungere export FHIR R4 / HL7 CDA.
- Introdurre un template system per il report (intestazione, logo, firma medico).

**Import/Export**
- Aggiungere checksum SHA-256 ai file JSON esportati.
- Implementare CSV export e batch import da ZIP.

**Test e qualità**
- Scrivere test E2E Playwright per i flussi principali.
- Integrare `axe-core` per test di accessibilità automatica.
- Aggiungere visual regression test.

---

### Tabella riepilogativa

| Area | Stato | Priorità |
|---|---|---|
| Navigazione / Routing | Funzionante con workaround; no URL routing | Media |
| Form NewCase | Funzionante; no validazione clinica range PET | Alta |
| Score engine | Funzionante; threshold hardcoded, no CI | Media |
| Decision engine (consensus) | Funzionante; no rule engine, no audit trail regole | Alta |
| Traceability engine | Funzionante; no conflict detection, no DOI link | Media |
| Storage / persistenza | Funzionante; no cifratura, no GDPR, no migration | Alta |
| Report generation | Funzionante; header POC hardcoded, no FHIR | Alta |
| Golden cases (demo) | Funzionante; no assertion su output atteso | Bassa |
| Import / Export JSON | Funzionante; no autosave post-import, no checksum | Alta |
| Test coverage | Unitari/componenti presenti; no E2E, no a11y | Alta |

---

## 2. Sicurezza e Performance

---

### 2.1 Fix applicati in questo sprint

#### [SEC-01] XSS in `printReport` — `caseId` non escapato ✅

- **File:** `packages/frontend/src/lib/report.ts` riga 9
- **Problema:** `caseId` interpolato direttamente nel tag `<title>` senza escaping. Payload come `</title><script>alert('xss')</script>` era eseguibile nella popup di stampa.
- **Fix:** funzione `esc()` applicata a `caseId` oltre che al body del report.

#### [PERF-01] `minifyEnabled false` in build di release Android ✅

- **File:** `packages/frontend/android/app/build.gradle` riga 21
- **Problema:** build di release non minificava il bytecode nativo → APK 3–5x più grande.
- **Fix:** `minifyEnabled true`.

#### [PERF-02] Calcoli pesanti senza `useMemo` in `NewCase` ✅

- **File:** `packages/frontend/src/pages/NewCase.tsx` righe 33–43
- **Problema:** `evaluateConsensus`, `buildTraceability`, `buildClinicalReport` ricalcolati ad ogni render.
- **Fix:** selettori granulari Zustand + `useMemo` con dipendenze specifiche.

#### [A11Y-01] `DisclaimerModal` senza Escape key né focus ✅

- **File:** `packages/frontend/src/components/DisclaimerModal.tsx`
- **Fix:** listener `keydown` per `Escape` + focus via `ref` al primo elemento interattivo.

#### [PERF-03] Array JSX PET ricreato ad ogni render ✅

- **File:** `packages/frontend/src/components/CtPetCard.tsx` righe 41–45
- **Fix:** array `petFields` spostato fuori dal componente a livello di modulo.

---

### 2.2 Issue ancora aperte

#### [SEC-02] Nessun Content Security Policy

- **File:** `packages/frontend/index.html`
- **Problema:** nessun meta tag CSP. Superficie di attacco limitata (app Capacitor offline-only), ma assente.
- **Impatto:** Basso nell'architettura attuale. Alto se aggiunto un backend o distribuita come PWA.
- **Soluzione:** `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">` in `index.html` + header in `vite.config.ts` per dev.

#### [SEC-03] Dati clinici in `localStorage` non cifrati

- **File:** `packages/frontend/src/lib/storage.ts`
- **Problema:** i dati clinici sono serializzati in JSON e scritti in chiaro. Su Android, accessibili con root via `adb shell`.
- **Impatto:** Alto in contesto medicale. Dati sanitari rientrano in GDPR art. 9.
- **Soluzione:** cifratura con Web Crypto API (AES-256-GCM), chiave derivata da PIN utente via PBKDF2.

#### [SEC-04] Nessun Android Network Security Config

- **File:** `packages/frontend/android/app/src/main/AndroidManifest.xml`
- **Problema:** manca `android:networkSecurityConfig`; cleartext HTTP non esplicitamente disabilitato.
- **Impatto:** Basso (app offline-only). Richiesto dalle linee guida Play Store per app mediche.
- **Soluzione:** creare `res/xml/network_security_config.xml` con `cleartextTrafficPermitted="false"`.

#### [DATA-01] Nessuna migration per lo schema `localStorage`

- **File:** `packages/frontend/src/lib/storage.ts` riga 19 — `const STORAGE_VERSION = 1`
- **Problema:** nessuna funzione di migrazione. Con una versione futura dello schema, i dati v1 vengono scartati silenziosamente al boot.
- **Soluzione:** catena di migration functions eseguita al boot prima di qualsiasi accesso allo store.

#### [DATA-02] Silent failure su `localStorage` overflow

- **File:** `packages/frontend/src/lib/storage.ts` righe 84–90
- **Problema:** il `catch` in `saveCases()` logga solo in `console.error`. Se il limite ~5–10 MB viene raggiunto, il salvataggio fallisce silenziosamente.
- **Soluzione:** intercettare `QuotaExceededError` e mostrare una notifica persistente.

#### [PERF-04] Instabilità reference nei selettori Zustand

- **File:** `packages/frontend/src/stores/history.store.ts`
- **Problema:** `saveCases()` ricrea reference all'array `cases` ad ogni chiamata; componenti che selezionano `(s) => s.cases` vengono re-renderizzati inutilmente.
- **Soluzione:** `useShallow` di Zustand o `immer` per immutabilità strutturale.

#### [PERF-05] Nessun debounce su input numerici PET

- **File:** `packages/frontend/src/components/CtPetCard.tsx` righe 96–100
- **Problema:** ogni keystroke su SUVmax/MTV/TLG invalida la memoization di `evaluateConsensus`. Digitare `4.9` produce 3 ricalcoli.
- **Soluzione:** debounce 150 ms sull'`onChange` degli input numerici.

---

### 2.3 Priorità

| Issue | Stato | Severità | Effort stimato |
|---|---|---|---|
| [SEC-01] XSS in `printReport` | ✅ Fixato | Critica | — |
| [SEC-03] Dati `localStorage` non cifrati | Aperto | Alta | 3–5 gg |
| [DATA-02] Silent failure su overflow | Aperto | Alta | 0.5 gg |
| [DATA-01] Nessuna migration schema | Aperto | Media | 1–2 gg |
| [SEC-02] Nessun Content Security Policy | Aperto | Media | 0.5 gg |
| [SEC-04] Nessun Android Network Security Config | Aperto | Media | 0.5 gg |
| [PERF-01] `minifyEnabled false` in release | ✅ Fixato | Media | — |
| [PERF-02] Calcoli pesanti senza `useMemo` | ✅ Fixato | Bassa | — |
| [PERF-03] Array JSX PET ricreato a ogni render | ✅ Fixato | Bassa | — |
| [PERF-04] Instabilità reference selettori Zustand | Aperto | Bassa | 0.5 gg |
| [PERF-05] Nessun debounce su input numerici PET | Aperto | Bassa | 0.5 gg |
| [A11Y-01] `DisclaimerModal` senza Escape e focus | ✅ Fixato | Bassa | — |

> **[SEC-03]** e **[DATA-02]** devono essere affrontati prima di qualsiasi distribuzione in ambiente clinico reale. [SEC-03] ha implicazioni di conformità GDPR dirette su dati sanitari.

---

## 3. UX, UI e Accessibilità

---

### 3.1 Miglioramenti applicati in questo sprint

| # | Intervento | Dettaglio |
|---|---|---|
| F1 | **Back button Android** | `history.pushState` + listener `popstate`; il tasto hardware Back ora funziona. |
| F2 | **DisclaimerModal al primo avvio** | Flag in `localStorage`; il modal si mostra una sola volta. |
| F3 | **Tooltip `<Abbr>` per sigle mediche** | DEM, SUVmax, MTV, TLG espongono tooltip, chiudibili con `Escape`. |
| F4 | **Bottone Print/PDF in ReportCard** | Export direttamente dall'interfaccia. |
| F5 | **Header mobile — touch target e layout** | Classi CSS riviste; touch target su viewport standard (> 480 px) conformi. |
| F6 | **Escape key su DisclaimerModal** | `Escape` chiude il modal; coerente con le convenzioni di accessibilità. |

---

### 3.2 Accessibilità — issue aperte (con ref WCAG)

#### A1 — H1 cliccabile invece di `<button>`

- **File:** `packages/frontend/src/components/layout/Header.tsx` righe 17–22
- **Problema:** `<h1 onClick={() => navigate('home')}>` — heading non raggiungibile via `Tab` né attivabile via `Enter`/`Space`.
- **Fix:** wrappare il contenuto in un `<button>` all'interno dell'`<h1>`.
- **WCAG:** 1.3.1 Info and Relationships (livello A)

#### A2 — `aria-current="page"` mancante sul nav attivo

- **File:** `packages/frontend/src/components/layout/Header.tsx` riga 34
- **Problema:** bottone di navigazione attivo distinto solo visivamente; nessun `aria-current`.
- **Fix:** `aria-current={page === item.page ? 'page' : undefined}` su ogni bottone nav.
- **WCAG:** 1.3.1 Info and Relationships (livello A)

#### A3 — Focus outline quasi invisibile

- **File:** `packages/frontend/src/index.css` riga 67
- **Problema:** `outline: 3px solid rgba(36, 91, 148, 0.22)` — alpha 0.22 su sfondo bianco, contrasto < 3:1.
- **Fix:** portare alpha a `0.75` o usare colore solido `#245b94`.
- **WCAG:** 2.4.7 Focus Visible (livello AA)

#### A4 — Bottoni header mobile sotto 44 px

- **File:** `packages/frontend/src/index.css` riga 1032
- **Problema:** `padding: 8px 9px` → altezza ~26 px su `< 480px`.
- **Fix:** aggiungere `min-height: 44px; min-width: 44px` al breakpoint mobile.
- **WCAG:** 2.5.5 Target Size (livello AA)

#### A5 — Nessuna region `aria-live` per "Copied ✓"

- **File:** `packages/frontend/src/components/ReportCard.tsx` riga 33
- **Problema:** cambio testo del bottone non annunciato da screen reader.
- **Fix:** `<span role="status" aria-live="polite" className="sr-only">{copied ? 'Report copied' : ''}</span>`
- **WCAG:** 4.1.3 Status Messages (livello AA)

#### A6 — `role="table"` su `<div>` senza semantica ARIA completa

- **File:** `packages/frontend/src/pages/ExplainabilityGuide.tsx` riga 113
- **Problema:** usa `role="table"` + `role="row"` ma omette `role="columnheader"` e `role="cell"`.
- **Fix:** convertire in HTML semantico nativo (`<table>`, `<thead>`, `<th scope="col">`, `<td>`).
- **WCAG:** 1.3.1 Info and Relationships (livello A)

#### A7 — `aria-describedby` mancante su input con placeholder

- **File:** `packages/frontend/src/components/CaseMetadataCard.tsx` righe 35–41
- **Problema:** placeholder scompare durante typing; hint non disponibile a screen reader dopo focus.
- **Fix:** `<span id="case-id-hint" className="sr-only">Formato: CM-001</span>` + `aria-describedby="case-id-hint"`.
- **WCAG:** 1.3.1 Info and Relationships (livello A)

#### A8 — Contrasto colori borderline o non conforme

- **File:** `packages/frontend/src/index.css` righe 26–27

| Elemento | Contrasto stimato | Esito AA |
|---|---|---|
| `--cm-muted: #607089` su `#ffffff` | 5.5:1 | Borderline (passa senza margine) |
| `.cm-pill.low` — testo `#16784c` su pill rgba blended | < 4.5:1 | **Non conforme** |
| `.cm-feature-card::before` border `#bac7d8` su `#ffffff` | ~2:1 | Decorativo |

- **Fix:** aumentare saturazione/scurezza di `--cm-low` nella variante pill; per `--cm-muted` considerare `#4e5e74` (6.5:1).
- **WCAG:** 1.4.3 Contrast Minimum (livello AA)

---

### 3.3 UI/Design system — issue aperte

#### U1 — Background gradient duplicato

- **File:** `packages/frontend/src/App.tsx` riga 24 e `packages/frontend/src/index.css` righe 44–46
- **Problema:** stesso gradient in due punti. Qualsiasi modifica richiede aggiornamenti doppi.
- **Fix:** rimuovere lo stile inline da `App.tsx`; la regola `body` in `index.css` è sufficiente.

#### U2 — Scale CSS non coerenti (design token mancanti)

| Proprietà | Valori trovati | Atteso |
|---|---|---|
| `border-radius` | 12 / 14 / 16 / 18 px | 3 valori: sm / md / lg |
| `gap` nelle griglie | 10 / 18 / 22 px | scala uniforme |
| `padding` card | 18 / 22 / 24 / 32 px | 3–4 step definiti |
| `font-size` label | 12 / 13 px | 1 valore per categoria |

- **Fix:** definire variabili CSS nell'`:root` (`--space-sm/md/lg/xl`, `--radius-sm/md/lg`) e sostituire tutti i valori hardcoded.

#### U3 — Colori hardcoded inline

| File | Riga | Valore |
|---|---|---|
| `packages/frontend/src/components/layout/Header.tsx` | 10–14 | gradient + box-shadow inline |
| `packages/frontend/src/App.tsx` | 24 | gradient inline (vedi U1) |
| `packages/frontend/src/pages/CaseDetail.tsx` | 91 | `#fbfdff` hardcoded |
| `packages/frontend/src/pages/Home.tsx` | 42 | padding inline su card |

- **Fix:** spostare tutto in classi CSS o variabili CSS.

#### U4 — Footer tecnico non rilevante per i medici

- **File:** `packages/frontend/src/pages/NewCase.tsx` riga 129
- **Problema:** `"React/TypeScript prototype - cardiac masses, diagnostic scores, and decision support."` è informazione implementativa che distrae in contesto clinico.
- **Fix:** rimuovere o sostituire con versione app (es. `"Cardiac Mass DSS v1.0 — Solo uso clinico-sperimentale"`).

#### U5 — DisclaimerModal senza transizione d'entrata

- **File:** `packages/frontend/src/index.css` (keyframe assente)
- **Problema:** modal appare bruscamente senza animazione.
- **Fix:**
  ```css
  @keyframes cmFadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  .cm-modal-overlay { animation: cmFadeIn 200ms ease; }
  ```

#### U6 — Feedback "Copied ✓" solo testuale

- **File:** `packages/frontend/src/components/ReportCard.tsx`
- **Problema:** bottone cambia testo ma non colore; feedback visivo debole.
- **Fix:** aggiungere classe `.cm-btn--success` (verde) quando `copied === true`. Collegato ad A5 per la controparte screen reader.

#### U7 — Pattern "empty state" duplicato

| File | Riga |
|---|---|
| `packages/frontend/src/pages/Home.tsx` | 41 |
| `packages/frontend/src/pages/CaseDetail.tsx` | 24 |

- **Fix:** estrarre `<EmptyState message="..." action={...} />` come componente riusabile.

#### U8 — Transizioni CSS non standardizzate

| Elemento | Durata attuale |
|---|---|
| Feature card (hover) | 140 ms ease |
| Score bar (width) | 180 ms ease |
| Button (hover) | 140 ms ease |
| Modal overlay | nessuna (vedi U5) |

- **Fix:** definire `--transition-micro: 140ms ease` e `--transition-enter: 200ms ease`; sostituire tutti i valori hardcoded.

---

### 3.4 Priorità di intervento

| ID | Problema | File | WCAG / Impatto | Effort |
|---|---|---|---|---|
| **A3** | Focus outline quasi invisibile | `index.css:67` | WCAG 2.4.7 AA | XS |
| **A2** | `aria-current` mancante su nav | `Header.tsx:34` | WCAG 1.3.1 A | XS |
| **A5** | Nessun `aria-live` per "Copied ✓" | `ReportCard.tsx:33` | WCAG 4.1.3 AA | XS |
| **A1** | `<h1>` cliccabile invece di `<button>` | `Header.tsx:17-22` | WCAG 1.3.1 A | S |
| **A7** | `aria-describedby` mancante su input | `CaseMetadataCard.tsx:35-41` | WCAG 1.3.1 A | S |
| **A4** | Touch target < 44 px su `< 480px` | `index.css:1032` | WCAG 2.5.5 AA | S |
| **A8** | Contrasto `.cm-pill.low` non conforme | `index.css:26-27` | WCAG 1.4.3 AA | S |
| **U4** | Footer tecnico visibile ai medici | `NewCase.tsx:129` | Credibilità clinica | XS |
| **U6** | Feedback "Copied" solo testuale | `ReportCard.tsx` | Usabilità | XS |
| **U5** | Modal senza transizione d'entrata | `index.css` | Usabilità | XS |
| **A6** | `role="table"` senza semantica ARIA completa | `ExplainabilityGuide.tsx:113` | WCAG 1.3.1 A | M |
| **U1** | Gradient background duplicato | `App.tsx:24` | Manutenibilità | XS |
| **U3** | Colori hardcoded inline | Vari file | Manutenibilità | S |
| **U8** | Transizioni CSS non standardizzate | `index.css` | Coerenza UI | S |
| **U7** | Empty state pattern duplicato | `Home.tsx:41`, `CaseDetail.tsx:24` | Manutenibilità | S |
| **U2** | Scale CSS non coerenti (token mancanti) | `index.css` | Design system | M |

> **Leggenda effort:** XS = < 30 min / S = 30–120 min / M = mezza giornata
