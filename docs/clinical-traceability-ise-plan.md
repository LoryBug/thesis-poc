# Clinical Traceability and ISE Project Plan

Questo documento fissa la direzione discussa per mantenere separati, ma coerenti, il progetto di tesi e il progetto di Intelligent Systems Engineering (ISE).

## Visione

La tesi resta il progetto principale: una PWA/CDSS TypeScript per supporto decisionale non invasivo nella valutazione delle masse cardiache.

Il progetto ISE diventa un artefatto separato ma collegato: un agente simbolico/spiegabile che usa lo stesso dominio clinico per dimostrare reasoning, planning, traceability e, opzionalmente, verbalizzazione tramite LLM.

Principio guida:

```text
Clinical input
-> deterministic scoring
-> symbolic reasoning / traceability
-> explanation / planning
-> human review
```

Non vogliamo:

```text
Clinical input
-> LLM diagnosis
```

## Separazione Dei Progetti

### Tesi / CDSS

Repository: `thesis-poc`.

Scopo:

- costruire un prototipo clinico usabile;
- mantenere score e consensus deterministici;
- mostrare explainability e clinical traceability direttamente nella UI;
- restare deployabile, testato e coerente con i paper clinici.

Regola:

- la tesi deve funzionare anche se il progetto ISE non esiste.

### Progetto ISE

Repository consigliato separato: `ise-cardiac-traceability-agent`.

Scopo:

- reinterpretare lo stesso dominio come sistema intelligente agentivo;
- usare logic programming, BDI/reasoning agents, planning e explainability;
- dimostrare un agente che ragiona su casi clinici semplificati;
- produrre spiegazioni tracciabili e piani diagnostici motivati.

Regola:

- il progetto ISE puo riusare casi, regole e riferimenti della tesi, ma non deve complicare il codice principale della PWA.

## Linea A: Roadmap Tesi / CDSS

### Stato Attuale

- Monorepo TypeScript con `packages/core` e `packages/frontend`.
- Core scoring implementato:
  - DEM Score;
  - CMR Mass Score;
  - cardiac CT / 18F-FDG PET/CT;
  - consensus engine.
- Frontend React/PWA con cockpit clinico.
- Report copiabile.
- UI/report/core user-facing copy tradotti in inglese.
- Test unit, build ed E2E passati.
- GitHub Pages deploy impostato.
- PDF locali esclusi da Git tramite `.gitignore`.

### Prossimi Passi Tesi

1. Clinical Traceability Layer

   Aggiungere un modello deterministico per spiegare ogni decisione.

   Possibili tipi:

   ```ts
   interface TraceNode {
     id: string
     kind: 'feature' | 'score' | 'cutoff' | 'rule' | 'source' | 'recommendation' | 'missing-data'
     label: string
     detail?: string
   }

   interface TraceEdge {
     from: string
     to: string
     relation: 'supports' | 'triggers' | 'derived-from' | 'requires' | 'cites'
   }
   ```

2. Traceability UI

   Aggiungere un pannello `Clinical Traceability` nella PWA.

   Domande da supportare:

   - Why this decision?
   - Which feature contributed?
   - Which score and cutoff were used?
   - Which rule fired?
   - Which paper supports this rule?
   - What data is missing?

3. Paper Citation Mapping

   Mappare regole e score verso fonti cliniche:

   - Paolisso et al. 2022: Diagnostic Echocardiographic Mass (DEM) Score;
   - Paolisso et al. 2023: echocardiographic markers;
   - D'Angelo et al. 2020: cardiac CT and 18F-FDG PET/CT;
   - Paolisso et al. 2024: CMR Mass Score;
   - Angeli et al.: framing clinico e approccio multimodale.

4. Report Evoluto

   Integrare nel report:

   - evidence chain;
   - activated rules;
   - missing data;
   - references sintetiche;
   - disclaimer clinico.

5. Synthetic / Golden Cases

   Definire casi simulati riusabili per test e documentazione:

   - low suspicion;
   - echo positive only;
   - CMR positive;
   - echo-CMR discordance;
   - CT/PET high suspicion;
   - CT gray zone;
   - missing data / unavailable modality.

6. Backend Futuro

   Da valutare dopo traceability:

   - Hono API;
   - Drizzle schema;
   - persisted cases;
   - audit trail.

## Linea B: Progetto ISE Separato

Titolo possibile:

```text
An Explainable Agent-Based Traceability Engine for Cardiac Mass Decision Support
```

### Obiettivo

Costruire un agente intelligente che riceve un caso clinico semplificato e produce:

- classificazione simbolica;
- spiegazione tracciabile;
- next-step plan;
- risposte a query del tipo `why?`.

### Collegamento Con Il Corso ISE

Concetti coperti:

- agent-oriented design;
- reasoning agents;
- BDI / intentional stance;
- logic programming;
- STRIPS/planning;
- agent explainability;
- human-in-the-loop;
- eventualmente LLM agents with tools / structured outputs.

### Artefatti Previsti

1. Knowledge Base

   Esempio Prolog:

   ```prolog
   observed(case1, cmr, infiltration).
   observed(case1, cmr, first_pass_contrast_perfusion).
   score(case1, cmr_mass_score, 5).
   cutoff(cmr_mass_score, 5).
   source(cmr_mass_score, paolisso_2024).
   ```

2. Reasoning Rules

   ```prolog
   high_suspicion(Case) :-
       score(Case, cmr_mass_score, Score),
       cutoff(cmr_mass_score, Cutoff),
       Score >= Cutoff.

   needs_second_level_imaging(Case) :-
       score(Case, dem_score, Score),
       cutoff(dem_score, Cutoff),
       Score >= Cutoff,
       unavailable(Case, cmr).
   ```

3. Planning Component

   Azioni diagnostiche possibili:

   - `perform_cmr`;
   - `perform_pet_ct`;
   - `review_images`;
   - `heart_team_discussion`;
   - `consider_histology`;
   - `follow_up`.

   Goal possibili:

   - `resolve_discordance`;
   - `increase_diagnostic_confidence`;
   - `complete_staging`;
   - `obtain_tissue_diagnosis_if_needed`.

4. Explanation Component

   Query utili:

   ```prolog
   why_high_suspicion(Case, Explanation).
   why_next_step(Case, Step, Explanation).
   missing_evidence(Case, Missing).
   source_for_rule(Rule, Source).
   ```

5. Demo

   Possibili forme:

   - CLI Prolog;
   - mini servizio separato;
   - notebook/script Python;
   - Jason/AgentSpeak demo;
   - output JSON leggibile eventualmente dalla PWA in futuro.

## Ruolo Possibile Dell'LLM Nel Progetto ISE

L'LLM e interessante, ma deve essere un componente di verbalizzazione/interfaccia, non il motore diagnostico.

### Uso Corretto

L'LLM puo:

- trasformare trace strutturati in spiegazioni naturali;
- rispondere a domande `why?` usando solo fatti e trace forniti;
- adattare il livello di dettaglio della spiegazione;
- generare bozze di report leggibili;
- evidenziare dati mancanti gia identificati dal rule engine;
- agire come conversational layer sopra regole Prolog/Jason.

Esempio:

```text
Reasoning engine:
high_suspicion(case_01)
because cmr_mass_score = 5/8 and cutoff >= 5.

LLM verbalizer:
High suspicion is assigned because the CMR Mass Score reached the validated cutoff. The contributing features were infiltration, first-pass contrast perfusion, and heterogeneous enhancement. This rule is derived from Paolisso et al. 2024.
```

### Uso Da Evitare

L'LLM non deve:

- calcolare score;
- inventare cutoff;
- produrre diagnosi autonoma;
- citare paper non presenti nel trace;
- sostituire il rule engine;
- generare raccomandazioni cliniche fuori dalle regole.

### Architettura LLM Sicura

```text
Case facts
-> deterministic scoring / symbolic reasoning
-> trace graph
-> LLM verbalization constrained by trace
-> human review
```

L'LLM puo essere una estensione opzionale. La baseline ISE deve restare valida anche senza LLM.

## Struttura Repository Consigliata

### Repo Tesi Attuale

```text
thesis-poc/
  packages/core/
    scores/
    consensus/
    traceability/        future
  packages/frontend/
    src/components/
    src/pages/
  docs/
    clinical-traceability-ise-plan.md
    synthetic-cases.md   future
```

### Repo ISE Futuro

```text
ise-cardiac-traceability-agent/
  kb/
    clinical_rules.pl
    sources.pl
  cases/
    case_01.pl
    case_02.pl
  agents/
    reasoning_agent.asl  optional Jason
    explanation_agent.asl optional Jason
  planning/
    domain.pl
    planner.pl
  llm/
    verbalizer.py        optional
    prompts/
  report/
    report.md
```

## Ordine Operativo Consigliato

1. Scrivere proposta breve per i docenti ISE.
2. Implementare `Clinical Traceability` nella tesi.
3. Definire golden cases condivisi.
4. Creare repository ISE separato.
5. Tradurre golden cases in fatti Prolog/Jason.
6. Implementare reasoning e explanation deterministici.
7. Aggiungere planning diagnostico.
8. Aggiungere LLM verbalizer solo se il baseline agentivo e gia funzionante.

## Messaggio Da Usare Con I Docenti ISE

Bozza sintetica:

```text
I would like to propose an ISE project connected to my thesis domain, but implemented as a separate artifact. The thesis is a TypeScript/PWA clinical decision support prototype for cardiac mass evaluation. The ISE project would model the same domain as an explainable agent-based traceability engine, using symbolic rules for reasoning over observed imaging features, diagnostic scores and literature-derived cutoffs. The agent would produce traceable explanations and diagnostic next-step plans, with an optional LLM component used only to verbalize structured traces, not to make clinical decisions.
```

## Decisione Attuale

Scelta consigliata:

- tesi: TypeScript CDSS + deterministic clinical traceability;
- ISE: progetto separato Prolog/Jason su reasoning, planning ed explainability;
- LLM: opzionale, solo come verbalizer vincolato dal trace.
