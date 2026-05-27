# Architettura del Progetto — Cardiac Mass Decision Support System

## 1. Filosofia

Il progetto evolve da un singolo file HTML (POC funzionante) a un **monorepo TypeScript strutturato**, progettato per crescere senza generare debito tecnico. L'architettura segue quattro principi:

- **Test-Driven Development (TDD)**: prima si scrive il test che descrive il comportamento desiderato, poi si implementa la logica minima per superarlo, infine si refactoring. Ogni funzionalità nasce da un test che ne definisce i confini.
- **Separazione dei ruoli**: core (logica di dominio pura), frontend (UI/UX), backend (API/persistenza)
- **Tipi condivisi**: nessuna duplicazione tra client e server
- **Evolvibilità**: ogni componente può essere sostituito o esteso senza reimplementare tutto

## 2. Stack Tecnologico

| Livello | Tecnologia | Versione | Ruolo |
|---|---|---|---|
| **Package manager** | pnpm | 9+ | Workspace monorepo nativo |
| **Orchestrator** | Turborepo | 2+ | Build parallele, caching, pipeline |
| **Linguaggio** | TypeScript | 5.5+ | Strict mode, strictNullChecks |
| **Linter** | Biome | 1.9+ | Lint + format unificato (no ESLint + Prettier) |
| **Core (logica)** | TypeScript puro | — | Funzioni pure, zero dipendenze runtime |
| **Frontend** | React 19 + Vite 6 | latest | UI component-based |
| **PWA** | vite-plugin-pwa | — | Manifest, service worker, installabile |
| **Stile** | Tailwind CSS 4 | — | Utility-first, custom design system |
| **Stato client** | Zustand 5 | — | Store leggero, middleware persist |
| **Router** | TanStack Router | — | Type-safe routing, lazy loading |
| **Backend** | Hono 4 | — | API REST, validazione Zod, middleware |
| **ORM** | Drizzle ORM | — | Query type-safe, migrazioni automatiche |
| **DB** | SQLite / PostgreSQL | — | Dev SQLite, prod PostgreSQL |
| **Auth** | Lucia-auth v3 | — | Session-based, zero provider esterni |
| **Testing** | Vitest + Playwright | — | Unit test + E2E |
| **Deploy frontend** | GitHub Pages / Vercel | — | Static build |
| **Deploy backend** | Railway / Fly.io | — | Docker container |

## 3. Struttura Completa delle Directory

```
tesi-masse-cardiache/
├── package.json                    # Workspace root (pnpm)
├── pnpm-workspace.yaml             # Workspace config
├── turbo.json                      # Turborepo pipeline
├── biome.json                      # Lint + format config
├── tsconfig.base.json              # Base TS config (extends)
├── .gitignore
├── .env.example
├── README.md
│
├── packages/
│   ├── core/                       # ★ Logica di dominio pura
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts            # Public API barrel
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── masses.ts       # Massa cardiaca, tumore, pseudotumore
│   │   │   │   ├── imaging.ts      # Esami, feature, score
│   │   │   │   └── patient.ts      # Caso clinico, contesto
│   │   │   ├── scores/
│   │   │   │   ├── dem-score.ts    # DEM Score (algoritmo, cutoff, probabilità)
│   │   │   │   ├── cmr-score.ts    # CMR Mass Score
│   │   │   │   ├── ct-pet.ts       # TC/PET signs + soglie
│   │   │   │   └── index.ts
│   │   │   ├── consensus/
│   │   │   │   ├── engine.ts       # Motore del consenso multimodale
│   │   │   │   ├── rules.ts        # Regole di concordanza/discordanza
│   │   │   │   └── index.ts
│   │   │   ├── prognosis/
│   │   │   │   ├── probability.ts  # Mappe probabilità DEM
│   │   │   │   └── risk.ts         # Stratificazione rischio
│   │   │   ├── evidence/
│   │   │   │   ├── builder.ts      # Generazione evidenze testuali
│   │   │   │   └── format.ts       # Formattazione report
│   │   │   └── utils/
│   │   │       ├── validation.ts   # Zod schemas
│   │   │       └── constants.ts    # Cutoff, soglie, etichette
│   │   └── tests/
│   │       ├── scores/
│   │       │   ├── dem-score.test.ts
│   │       │   ├── cmr-score.test.ts
│   │       │   └── ct-pet.test.ts
│   │       └── consensus/
│   │           └── engine.test.ts
│   │
│   ├── frontend/                   # ★ React App + PWA
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   └── icons/             # Icone PWA (192x192, 512x512)
│   │   ├── src/
│   │   │   ├── main.tsx           # Entry point
│   │   │   ├── App.tsx            # Root con router
│   │   │   ├── routes.ts          # Definizione rotte (TanStack Router)
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── NewCase.tsx
│   │   │   │   ├── CaseDetail.tsx
│   │   │   │   ├── Report.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── PageShell.tsx
│   │   │   │   ├── exam-card/
│   │   │   │   │   ├── EchoCard.tsx
│   │   │   │   │   ├── CmrCard.tsx
│   │   │   │   │   ├── CtPetCard.tsx
│   │   │   │   │   └── CardShell.tsx
│   │   │   │   ├── score/
│   │   │   │   │   ├── ScoreBar.tsx
│   │   │   │   │   ├── FeatureCheckbox.tsx
│   │   │   │   │   └── Badge.tsx
│   │   │   │   ├── consensus/
│   │   │   │   │   ├── ConsensusPanel.tsx
│   │   │   │   │   └── ConsensusRow.tsx
│   │   │   │   ├── decision/
│   │   │   │   │   ├── DecisionCard.tsx
│   │   │   │   │   ├── NextStep.tsx
│   │   │   │   │   └── EvidenceList.tsx
│   │   │   │   ├── report/
│   │   │   │   │   ├── ReportViewer.tsx
│   │   │   │   │   └── CopyButton.tsx
│   │   │   │   └── shared/
│   │   │   │       ├── Select.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       └── Toggle.tsx
│   │   │   ├── stores/
│   │   │   │   ├── case.store.ts   # Zustand store per caso corrente
│   │   │   │   ├── history.store.ts # Cronologia casi salvati
│   │   │   │   └── ui.store.ts     # Preferenze UI
│   │   │   ├── hooks/
│   │   │   │   ├── useScores.ts
│   │   │   │   ├── useConsensus.ts
│   │   │   │   └── useLocalStorage.ts
│   │   │   └── lib/
│   │   │       ├── persist.ts       # Salvataggio/recupero localStorage
│   │   │       └── export.ts        # Export PDF/report
│   │   └── tests/
│   │       ├── components/
│   │       └── pages/
│   │
│   ├── backend/                    # ★ API REST (opzionale, fase 2)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts            # Server entry
│   │   │   ├── app.ts              # Hono app setup
│   │   │   ├── routes/
│   │   │   │   ├── cases.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── search.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   └── error.ts
│   │   │   ├── db/
│   │   │   │   ├── schema.ts       # Drizzle schema
│   │   │   │   ├── migrations/
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── case.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   └── models/
│   │   │       └── index.ts
│   │   ├── tests/
│   │   └── Dockerfile
│   │
│   └── ml-inference/               # ★ ML/NLP (opzionale, fase 3)
│       ├── package.json
│       ├── src/
│       │   ├── feature-extraction/
│       │   │   ├── report-nlp.ts   # Estrazione feature da referti
│       │   │   └── transforms.ts
│       │   ├── classification/
│       │   │   ├── model-loader.ts # ONNX runtime
│       │   │   └── predict.ts
│       │   └── index.ts
│       └── models/
│           └── .gitkeep            # Modelli ONNX
│
├── docs/                           # Documentazione di progetto
│   ├── architecture.md
│   ├── scores.md
│   ├── decision-logic.md
│   └── domain-guide.md
│
└── scripts/
    ├── seed.ts                     # Dati di esempio
    └── migrate.ts                  # Migrazioni DB
```

## 4. Pacchetto `core` — Il Cuore Del Progetto

### 4.1 Filosofia

`core` contiene **solo logica di dominio pura**: zero dipendenze, zero side effect, zero import da React/backend. È un pacchetto TypeScript che esporta funzioni, tipi e costanti.

Può essere importato da frontend e backend mantenendo un'unica fonte di verità.

### 4.2 Convenzioni TDD per i Test

Ogni file in `packages/core/src/` ha un corrispondente file di test in `packages/core/tests/` con la stessa struttura di directory.

Regole di scrittura:

- **Struttura `describe` / `it`** annidata per raggruppare casi logici
- **Nomi dei test in Italiano** descrittivi del comportamento clinico atteso
- **Arrange-Act-Assert** esplicito con commenti di sezione
- **Dati di test factory** importati da `tests/fixtures/` (non hard-coded nel test)
- **Test isolati**: ogni test è indipendente (niente stato condiviso tra test)
- **Edge case espliciti**: valori limite, undefined, null, array vuoti, oggetti parziali

Esempio:

```typescript
// tests/scores/dem-score.test.ts
import { describe, it, expect } from 'vitest'
import { calculateDemScore } from '../../src/scores/dem-score'
import { echoAllPresent, echoAllAbsent, echoPartial } from '../fixtures/echo-features'

describe('DEM Score', () => {
  describe('calculateDemScore', () => {
    it('restituisce 0 quando nessuna feature e presente', () => {
      // Arrange
      const features = echoAllAbsent()
      // Act
      const result = calculateDemScore(features)
      // Assert
      expect(result).toBe(0)
    })

    it('restituisce 9 quando tutte le 6 feature sono presenti', () => {
      const features = echoAllPresent()
      expect(calculateDemScore(features)).toBe(9)
    })

    it('restituisce il peso corretto per feature parziali', () => {
      const features = echoPartial(['infiltration', 'sessile', 'nonLeftLocation'])
      expect(calculateDemScore(features)).toBe(4) // 2 + 1 + 1
    })

    it('non modifica le feature in input (purezza funzione)', () => {
      const features = echoAllPresent()
      const original = { ...features }
      calculateDemScore(features)
      expect(features).toEqual(original)
    })
  })

  describe('demProbability', () => {
    it('restituisce 0% per score 0', () => {
      expect(demProbability(0)).toBe(0)
    })
    it('restituisce 100% per score 9', () => {
      expect(demProbability(9)).toBe(100)
    })
    it('restringe score negativi a 0', () => {
      expect(demProbability(-5)).toBe(0)
    })
  })
})
```

### 4.2 Tipi Principali

```typescript
// packages/core/src/types/imaging.ts

export interface EchoFeatures {
  infiltration: boolean;        // DEM: 2 punti
  polylobated: boolean;         // DEM: 2 punti
  pericardialEffusion: boolean; // DEM: 2 punti
  sessile: boolean;             // DEM: 1 punto
  inhomogeneity: boolean;       // DEM: 1 punto
  nonLeftLocation: boolean;     // DEM: 1 punto
}

export interface CmrFeatures {
  infiltration: boolean;        // CMR: 2 punti
  firstPassPerfusion: boolean;  // CMR: 2 punti
  pericardialEffusion: boolean; // CMR: 1 punto
  sessile: boolean;             // CMR: 1 punto
  polylobated: boolean;         // CMR: 1 punto
  heterogeneousEnhancement: boolean; // CMR: 1 punto
}

export interface CtFeatures {
  irregularMargins: boolean;
  pericardialEffusion: boolean;
  invasion: boolean;
  solidNature: boolean;
  diameterOver30mm: boolean;
  contrastUptake: boolean;
  preContrastSuspicious: boolean;
  calcifications: boolean;
}

export interface PetParameters {
  suvMax: number | null;
  mtv: number | null;
  tlg: number | null;
}

export interface ImagingData {
  echoAvailable: boolean;
  echo: EchoFeatures | null;
  cmrAvailable: boolean;
  cmr: CmrFeatures | null;
  ctpetAvailable: boolean;
  ct: CtFeatures | null;
  pet: PetParameters | null;
}
```

### 4.3 Calcolo Score — Esempio DEM

```typescript
// packages/core/src/scores/dem-score.ts

const DEM_WEIGHTS: Record<keyof EchoFeatures, number> = {
  infiltration: 2,
  polylobated: 2,
  pericardialEffusion: 2,
  sessile: 1,
  inhomogeneity: 1,
  nonLeftLocation: 1,
};

export const DEM_MAX = 9;
export const DEM_CUTOFF = 3;

export function calculateDemScore(features: EchoFeatures): number {
  return Object.entries(features).reduce(
    (sum, [key, value]) => sum + (value ? DEM_WEIGHTS[key as keyof EchoFeatures] : 0),
    0,
  );
}

export function demProbability(score: number): number {
  // Mappa derivata dal paper Paolisso 2022 (curva ROC)
  const map: Record<number, number> = {
    0: 0, 1: 2, 2: 8, 3: 29, 4: 65,
    5: 89, 6: 97, 7: 99, 8: 100, 9: 100,
  };
  return map[Math.min(Math.max(score, 0), DEM_MAX)] ?? 0;
}
```

### 4.4 Motore del Consenso

```typescript
// packages/core/src/consensus/engine.ts

export type RiskLevel = 'low' | 'mid' | 'high' | 'not';

export interface ConsensusResult {
  risk: RiskLevel;
  title: string;
  subtitle: string;
  explanation: string;
  nextStep: string;
  evidence: string[];
  modalities: {
    echo: { status: string; note: string };
    cmr: { status: string; note: string };
    ctPet: { status: string; note: string };
  };
  integrated: { status: string; note: string };
}

export function evaluateConsensus(data: ImagingData): ConsensusResult {
  // Logica completa: eco come triage, CMR come esame dominante,
  // TC/PET come percorso alternativo, gestione concordanze/discordanze
  // ... (derivata dal POC esistente, resa pura e testabile)
}
```

## 5. Pacchetto `frontend` — L'App Installabile

### 5.1 Routing

| Route | Pagina | Descrizione |
|---|---|---|
| `/` | `Dashboard.tsx` | Riepilogo casi recenti, statistiche |
| `/new` | `NewCase.tsx` | Inserimento nuovo caso con scoring completo |
| `/case/:id` | `CaseDetail.tsx` | Dettaglio caso salvato |
| `/case/:id/report` | `Report.tsx` | Report copiabile / stampabile |
| `/settings` | `Settings.tsx` | Preferenze app, reset dati |

### 5.2 Store Zustand

```typescript
// packages/frontend/src/stores/case.store.ts

interface CaseState {
  // Dati correnti del caso
  patientId: string;
  clinicalContext: ClinicalContext;
  location: string;
  freeNote: string;
  imaging: ImagingData;

  // Risultati derivati (calcolati, non memorizzati separatamente)
  // Si ricalcolano on-the-fly con memoizzazione

  // Actions
  setPatientId: (id: string) => void;
  setClinicalContext: (ctx: ClinicalContext) => void;
  setEchoFeature: (key: keyof EchoFeatures, value: boolean) => void;
  setCmrFeature: (key: keyof CmrFeatures, value: boolean) => void;
  setCtFeature: (key: keyof CtFeatures, value: boolean) => void;
  setPetParameter: (key: 'suvMax' | 'mtv' | 'tlg', value: number | null) => void;
  toggleExam: (exam: 'echo' | 'cmr' | 'ctpet', available: boolean) => void;
  reset: () => void;
}
```

### 5.3 Persistenza (senza backend)

`history.store.ts` salva i casi in `localStorage` con struttura:

```typescript
interface SavedCase {
  id: string;           // UUID generato
  createdAt: string;    // ISO date
  patientId: string;
  imaging: ImagingData;
  consensus: ConsensusResult; // Cached al momento del salvataggio
  note: string;
}
```

### 5.4 PWA

`vite-plugin-pwa` genera automaticamente:
- `manifest.json` con nome, icone, tema
- Service worker per caching strategico
- Prompt di installazione su iOS/Android/Desktop

Config:

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Cardiac Mass DSS',
    short_name: 'CM-DSS',
    display: 'standalone',
    theme_color: '#173b68',
    icons: [
      { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
})
```

## 6. Pacchetto `backend` — API REST (Fase 2)

Quando serve persistenza centralizzata, autenticazione, condivisione tra cardiologi:

### 6.1 Hono App Setup

```typescript
// packages/backend/src/app.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { caseRoutes } from './routes/cases'
import { authRoutes } from './routes/auth'

const app = new Hono()

app.use('/api/*', cors())
app.route('/api/auth', authRoutes)
app.route('/api/cases', caseRoutes)

export default app
```

### 6.2 Drizzle ORM Schema

```typescript
// packages/backend/src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const cases = sqliteTable('cases', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  clinicalContext: text('clinical_context'),
  location: text('location'),
  note: text('note'),
  echoFeatures: text('echo_features', { mode: 'json' }),
  cmrFeatures: text('cmr_features', { mode: 'json' }),
  ctFeatures: text('ct_features', { mode: 'json' }),
  petParameters: text('pet_parameters', { mode: 'json' }),
  consensus: text('consensus', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
```

### 6.3 Endpoints

| Metodo | Path | Descrizione |
|---|---|---|
| `POST` | `/api/cases` | Crea nuovo caso |
| `GET` | `/api/cases` | Lista casi (paginata, filtrabile) |
| `GET` | `/api/cases/:id` | Dettaglio caso |
| `PUT` | `/api/cases/:id` | Aggiorna caso |
| `DELETE` | `/api/cases/:id` | Elimina caso |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Sessione corrente |

## 7. ML/NLP — Roadmap TypeScript-Nativa

### 7.1 Estrazione Feature da Referti (Fase 3)

Usando **Transformers.js** per inference lato browser:

```typescript
// packages/ml-inference/src/feature-extraction/report-nlp.ts
import { pipeline } from '@xenova/transformers'

// Carica modello BERT piccolo per NER/classificazione
const extractor = await pipeline(
  'token-classification',
  'Xenova/bert-base-ner-conll2003'
)

// Oppure: modello specializzato per linguaggio clinico
const classifier = await pipeline(
  'text-classification',
  'medicalai/bert-cardiac-mass-features'
)

export async function extractFeatures(reportText: string): Promise<Partial<EchoFeatures>> {
  // Estrai: infiltrazione, versamento, sessile, ecc.
  // Ritorna feature binarie con confidence score
}
```

### 7.2 Classificazione con ONNX (Fase 4)

Se si addestra un modello (XGBoost, Random Forest, PyTorch) in Python:

```bash
# Esporta in ONNX
python -m skl2onnx \
  --input model.pkl \
  --output model.onnx \
  --opset 17
```

Poi lo carichi in Node.js:

```typescript
import ort from 'onnxruntime-node'

const session = await ort.InferenceSession.create('./models/model.onnx')
const result = await session.run({
  input: new ort.Tensor('float32', featuresArray, [1, nFeatures]),
})
```

## 8. Workflow di Sviluppo

### TDD — Ciclo di sviluppo obbligatorio

Ogni modifica al codice segue il ciclo **Red-Green-Refactor**:

```
┌────────────────────────────────────────────┐
│  1. RED   Scrivi un test che fallisce       │
│            (definisce il comportamento      │
│             atteso prima di scrivere codice)│
├────────────────────────────────────────────┤
│  2. GREEN Scrivi il codice minimo           │
│            necessario per far passare       │
│            il test                          │
├────────────────────────────────────────────┤
│  3. REFACTOR Pulisci il codice,             │
│             rimuovi duplicazioni,           │
│             migliora leggibilità,           │
│             i test devono rimanere verdi    │
└────────────────────────────────────────────┘
```

Regole del progetto:

- **Nessuna implementazione senza un test che la richieda**. Non si scrive una funzione, un componente o un endpoint API senza prima avere un test che ne specifichi il comportamento.
- **I test sono la sorgente della verità**. Se un comportamento non è descritto da un test, non esiste.
- **Commit solo con test verdi**. Il branch `main` deve sempre avere tutti i test passanti.
- **Copertura minima**: ogni file in `packages/core/src/` deve avere un corrispondente test in `packages/core/tests/` con coverage delle linee logiche > 90%.
- **I test si scrivono in Italiano nei nomi dei test case** per leggibilità clinica (es. `calcolaDemScore con tutte le feature restituisce 9`).

### Setup iniziale

```bash
git clone <repo>
cd tesi-masse-cardiache
pnpm install
pnpm build:core
pnpm dev:frontend
```

### Comandi

| Script | Descrizione |
|---|---|
| `pnpm dev` | Avvia frontend + backend in dev mode |
| `pnpm build` | Build di tutti i pacchetti |
| `pnpm lint` | Biome lint su tutto |
| `pnpm format` | Biome format su tutto |
| `pnpm test` | Vitest su tutti i pacchetti |
| `pnpm test:coverage` | Test con coverage report |
| `pnpm changeset` | Versioning semantico (per pubblicazione) |

### Pipeline CI (GitHub Actions)

Il workflow esegue i test su ogni push e PR. Se i test falliscono, la build si blocca.

```yaml
# .github/workflows/ci.yml
- run: pnpm install
- run: pnpm lint
- run: pnpm test -- --coverage
- run: pnpm build
- run: pnpm deploy:frontend  # Solo se test e build passano
```

Regola: **nessun deploy se anche un solo test fallisce**. Il badge `test passing` nel README.md si aggiorna automaticamente.

## 9. Migrazione dal POC Attuale

### Step 1 — Core (primo sprint)
1. Creare il monorepo con `pnpm init`, `pnpm-workspace.yaml`, `turbo.json`
2. Installare dipendenze base (TypeScript, Biome, Vitest)
3. Configurare Vitest in `packages/core` con coverage e modalità watch
4. **Scrivere i test prima di ogni implementazione**:
   - Test per i tipi e le interfacce (verifica compilazione)
   - Test per `calculateDemScore`: caso vuoto (0), tutte le feature (9), feature parziali, cutoff
   - Test per `demProbability`: mappa completa, valori fuori range
   - Test per `calculateCmrScore`: stesso pattern
   - Test per `calculateCtSigns`: conteggio 0-8
   - Test per `ctPetLevel`: basso, zona grigia, alto, discordanza
   - Test per il motore del consenso: concordanza eco-CMR, discordanza, solo eco, solo TC/PET
5. Implementare la logica finché tutti i test sono verdi
6. Refactoring: estrarre costanti, pesi, messaggi in file separati
7. Verificare coverage (> 90% su file logici)

### Step 2 — Frontend Base
1. Inizializzare `packages/frontend` con Vite + React + Tailwind
2. **Test-first per componenti**:
   - Test di rendering per EchoCard, CmrCard, CtPetCard (verifica presenza elementi UI)
   - Test di interazione: check di una feature aggiorna lo score
   - Test per il report: verifica contenuto generato da dati noti
   - Test per il consenso: verifica UI reagisce a change di stato
3. Ricostruire UI con componenti (esame, score, decisione, report)
4. Collegare store Zustand ai componenti
5. Aggiungere PWA
6. Aggiungere persistenza localStorage
7. Deploy su GitHub Pages

### Step 3 — Backend
1. Solo quando serve condivisione o autenticazione
2. **Test-first per API**:
   - Test per ogni endpoint: POST cases, GET cases, GET /cases/:id, PUT, DELETE
   - Test per autenticazione: login valido, login non valido, sessione scaduta
   - Test per validazione input: campi mancanti, tipi errati, payload malformati
   - Test per Drizzle schema: insert e select su db SQLite in-memory
3. Hono + Drizzle + SQLite
4. API CRUD per casi
5. Auth con Lucia

### Step 4 — ML/NLP
1. Solo quando ci sono referti testuali da processare
2. **Test-first per inferenza**:
   - Test per `extractFeatures`: referto con feature note, estrazione corretta
   - Test per confidence score: soglia minima accettabile
   - Test per ONNX model loader: modello valido, modello assente, versione errata
   - Test di integrazione: pipe estrazione → classificazione → score
3. Transformers.js per estrazione feature
4. ONNX Runtime per modelli predittivi

## 10. Perché TypeScript Batte Python per ML Qui

| Aspetto | Python | TypeScript |
|---|---|---|
| **Inferenza browser** | No (serve API) | Sì (Transformers.js, TensorFlow.js) |
| **Full-stack types** | Due linguaggi | Condivisi |
| **Deploy** | Server Python | Statico + Node.js |
| **PWA** | Irrilevante | Nativo |
| **Modelli custom** | Addestramento facile | ONNX runtime |
| **NLP su referti** | Flask + spaCy | Transformers.js + browser |
| **Performance app** | Backend-only | Client-side possibile |

La regola pratica: **addestri in Python, inferisci in TypeScript**. I modelli ONNX girano dovunque.

## 11. Decisioni Future da Prendere

Quando riprendiamo, decidiamo:

1. **Nome del progetto**: `cardiac-mass-dss`? `cm-decision-support`?
2. **Preferenza Hono vs Fastify**: Hono è più moderno, Fastify ha più ecosistema
3. **Database in produzione**: PostgreSQL su Railway? SQLite su dispositivo?
4. **Desktop app**: Electron/Tauri in futuro o PWA basta?
5. **Mobile**: PWA basta o serve React Native?

---

Questo e il blueprint completo. Partiremo dallo **Step 1 (Core)** nella prossima sessione.
