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
- Clinical Traceability implementata nel core e nella UI.
- Report copiabile esteso con activated rules, evidence chain, missing data e sources.
- UI/report/core user-facing copy tradotti in inglese.
- Test unit, build ed E2E passati.
- GitHub Pages deploy impostato.
- PDF locali esclusi da Git tramite `.gitignore`.

### Prossimi Passi Tesi

1. Clinical Traceability Layer

   Stato: implementato.

   Il modello deterministico spiega ogni decisione tramite nodi e archi di traceability.

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

   Stato: implementato.

   Il pannello `Clinical Traceability` e presente nella PWA.

   Domande da supportare:

   - Why this decision?
   - Which feature contributed?
   - Which score and cutoff were used?
   - Which rule fired?
   - Which paper supports this rule?
   - What data is missing?

3. Paper Citation Mapping

   Stato: implementazione base presente, documentazione formale ancora da completare.

   Mappare regole e score verso fonti cliniche:

   - Paolisso et al. 2022: Diagnostic Echocardiographic Mass (DEM) Score;
   - Paolisso et al. 2023: echocardiographic markers;
   - D'Angelo et al. 2020: cardiac CT and 18F-FDG PET/CT;
   - Paolisso et al. 2024: CMR Mass Score;
   - Angeli et al.: framing clinico e approccio multimodale.

4. Report Evoluto

   Stato: implementato nella versione base.

   Integrare nel report:

   - evidence chain;
   - activated rules;
   - missing data;
   - references sintetiche;
   - disclaimer clinico.

5. Synthetic / Golden Cases

   Stato: documentazione avviata in `docs/synthetic-cases.md`.

   Definire casi simulati riusabili per test e documentazione:

   - low suspicion;
   - echo positive only;
   - CMR positive;
   - echo-CMR discordance;
   - CT/PET high suspicion;
   - CT gray zone;
   - missing data / unavailable modality.

6. Roadmap Tesi Consolidata

   Stato: avviata in `docs/thesis-roadmap.md`.

   Obiettivo:

   - raccogliere cosa e gia fatto;
   - distinguere validazione funzionale da validazione clinica;
   - definire artefatti mancanti per la scrittura finale della tesi.

7. Backend Futuro

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

### Direzione Jason-First

Il progetto ISE dovrebbe essere Jason-first, non Prolog-first.

Motivo:

- Jason e piu coerente con agent-oriented design e BDI.
- Il dominio si presta bene a beliefs, goals, intentions e plans.
- La explainability puo essere modellata come memoria delle regole attivate.
- Il planning diagnostico puo essere espresso come scelta di piani in base a rischio, discordanza e dati mancanti.

Prolog resta utile come ispirazione sintattica per fatti e regole, ma l'artefatto principale dovrebbe essere Jason/AgentSpeak.

### Architettura MVP Jason

Baseline consigliata:

```text
cardiac_mass_agent.asl
```

Un solo agente e sufficiente per l'MVP. Deve ricevere un caso, mantenere beliefs cliniche, derivare rischio, produrre traceability e proporre next steps.

Possibile evoluzione multi-agent:

| Agente | Ruolo |
|---|---|
| `case_agent` | Carica casi e mantiene belief cliniche. |
| `reasoning_agent` | Deriva rischio, regole attivate, discordanza e missing data. |
| `planning_agent` | Produce next-step plan diagnostico. |
| `explanation_agent` | Risponde a query `why?`, `what is missing?`, `which source?`. |
| `interface_agent` | Opzionale, riceve richieste utente o output LLM-dispatcher. |

La versione multi-agent ha senso solo dopo una baseline monagente funzionante.

### Beliefs Jason

Esempio per un caso CMR-driven high suspicion:

```prolog
case(gc04).

available(gc04, cmr).
unavailable(gc04, echo).
unavailable(gc04, ct_pet).

observed(gc04, cmr, infiltration).
observed(gc04, cmr, first_pass_perfusion).
observed(gc04, cmr, heterogeneous_enhancement).

score(gc04, cmr_mass_score, 5).
cutoff(cmr_mass_score, 5).

source(cmr_mass_score, paolisso_2024_cmr_mass_score).
```

Nota:

- nel primo MVP gli score possono essere fatti in input, derivati dalla tesi/CDSS;
- non serve duplicare subito tutto il calcolo TypeScript dentro Jason;
- se richiesto dal corso, il calcolo score puo essere aggiunto dopo come estensione.

### Regole Derivate

Esempio di regole simboliche Jason:

```prolog
cmr_positive(Case) :-
    score(Case, cmr_mass_score, Score) &
    cutoff(cmr_mass_score, Cutoff) &
    Score >= Cutoff.

high_suspicion(Case) :-
    cmr_positive(Case).

needs_second_level_imaging(Case) :-
    score(Case, dem_score, Score) &
    cutoff(dem_score, Cutoff) &
    Score >= Cutoff &
    unavailable(Case, cmr).

missing_modality(Case, Modality) :-
    unavailable(Case, Modality).
```

### Goals E Piani Jason

Goal principali:

```prolog
!evaluate(gc04).
!plan_next_steps(gc04).
!explain(gc04).
```

Esempio di piani:

```prolog
+!evaluate(Case)
  : high_suspicion(Case)
  <- +risk(Case, high);
     +activated_rule(Case, cmr_mass_score_above_cutoff);
     +trace(Case, rule, cmr_mass_score_above_cutoff);
     !plan_next_steps(Case).

+!plan_next_steps(Case)
  : risk(Case, high)
  <- +next_step(Case, heart_team_discussion);
     +next_step(Case, staging_or_histological_assessment).

+!plan_next_steps(Case)
  : needs_second_level_imaging(Case)
  <- +next_step(Case, perform_cmr);
     +planning_goal(Case, increase_diagnostic_confidence).

+!explain(Case)
  : activated_rule(Case, cmr_mass_score_above_cutoff)
  <- .print("High suspicion because CMR Mass Score reached cutoff.");
     .print("Source: Paolisso et al. 2024.").
```

### Planning Component

Azioni diagnostiche possibili:

- `perform_cmr`;
- `perform_pet_ct`;
- `review_images`;
- `heart_team_discussion`;
- `consider_histology`;
- `follow_up`;
- `complete_staging`.

Goal possibili:

- `resolve_discordance`;
- `increase_diagnostic_confidence`;
- `complete_staging`;
- `obtain_tissue_diagnosis_if_needed`;
- `make_missing_data_explicit`.

Esempi di mapping:

| Stato derivato | Goal agentivo | Piano suggerito |
|---|---|---|
| DEM positivo e CMR mancante | `increase_diagnostic_confidence` | `perform_cmr` |
| CT gray zone senza PET | `increase_diagnostic_confidence` | `perform_pet_ct` o `perform_cmr` |
| Echo-CMR discordance | `resolve_discordance` | `review_images`, poi `perform_pet_ct` se necessario |
| CMR positivo | `complete_staging` | `heart_team_discussion`, `complete_staging` |
| Nessun esame disponibile | `make_missing_data_explicit` | richiedere input clinico/imaging |

### Explanation Component

Query utili:

```prolog
!explain(Case).
!why_decision(Case).
!why_next_step(Case).
!missing_data(Case).
!source_for_rule(Case, Rule).
!summarize_trace(Case).
```

Output atteso:

```text
Case: gc04
Risk: high
Activated rule: cmr_mass_score_above_cutoff
Reason: CMR Mass Score = 5 and cutoff >= 5
Observed evidence: infiltration, first-pass perfusion, heterogeneous enhancement
Source: Paolisso et al. 2024 CMR Mass Score
Next step: Heart Team discussion and staging/histological assessment
```

### Demo

Possibili forme:

- Jason CLI con casi `GC-00`...`GC-09` caricabili;
- output `.print` leggibile per demo live;
- output JSON/text generato da piani Jason;
- eventuale mini wrapper Python/Node solo per orchestrare input/output;
- opzionale LLM verbalizer sopra output strutturato.

## Ruolo Possibile Dell'LLM Nel Progetto ISE

L'LLM ha senso, ma come layer opzionale di interfaccia. Non deve essere il motore diagnostico e non deve sostituire l'agente Jason.

Architettura consigliata:

```text
User question
-> LLM dispatcher / interface
-> allowed structured intent
-> Jason agent reasoning
-> structured trace / plan
-> LLM verbalizer
-> human-readable answer
```

Il progetto deve funzionare anche senza LLM tramite CLI Jason o query/piani predefiniti.

### LLM Come Dispatcher Vincolato

L'LLM puo trasformare una domanda naturale in uno degli intenti consentiti:

```json
{
  "intent": "WHY_DECISION",
  "caseId": "gc04"
}
```

Intenti ammessi:

| Intent | Significato | Query/goal Jason equivalente |
|---|---|---|
| `WHY_DECISION` | Perche il caso ha quel rischio? | `!why_decision(Case)` |
| `WHY_RULE` | Perche una regola e stata attivata? | `!source_for_rule(Case, Rule)` |
| `MISSING_DATA` | Quali dati mancano? | `!missing_data(Case)` |
| `NEXT_STEP_PLAN` | Quale piano diagnostico e proposto? | `!plan_next_steps(Case)` |
| `SOURCE_FOR_RULE` | Quale fonte supporta la regola? | `!source_for_rule(Case, Rule)` |
| `SUMMARIZE_TRACE` | Riassumi trace e reasoning. | `!summarize_trace(Case)` |

Se la domanda non rientra in questi intenti, il dispatcher deve rifiutare o chiedere chiarimento.

### Uso Corretto

L'LLM puo:

- trasformare trace strutturati in spiegazioni naturali;
- rispondere a domande `why?` usando solo fatti e trace forniti;
- adattare il livello di dettaglio della spiegazione;
- generare bozze di report leggibili;
- evidenziare dati mancanti gia identificati dal rule engine;
- agire come conversational layer sopra Jason;
- classificare una domanda utente in intenti ammessi e controllati.

Esempio:

```text
Jason agent:
risk(gc04, high)
activated_rule(gc04, cmr_mass_score_above_cutoff)
source(cmr_mass_score_above_cutoff, paolisso_2024_cmr_mass_score)

LLM verbalizer:
High suspicion is assigned because the CMR Mass Score reached the cutoff. The contributing features were infiltration, first-pass contrast perfusion, and heterogeneous enhancement. This rule is derived from Paolisso et al. 2024.
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
-> Jason BDI reasoning / planning
-> trace graph
-> optional LLM dispatcher/verbalizer constrained by trace
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
    traceability/
  packages/frontend/
    src/components/
    src/pages/
  docs/
    clinical-traceability-ise-plan.md
    thesis-roadmap.md
    synthetic-cases.md
```

### Repo ISE Futuro

```text
ise-cardiac-traceability-agent/
  agents/
    cardiac_mass_agent.asl
    case_agent.asl              optional later split
    reasoning_agent.asl         optional later split
    planning_agent.asl          optional later split
    explanation_agent.asl       optional later split
    interface_agent.asl         optional LLM bridge
  cases/
    gc00.asl
    gc01.asl
    gc04.asl
  beliefs/
    sources.asl
    cutoffs.asl
    clinical_actions.asl
  docs/
    README.md
  output/
    traces/
    plans/
  llm/
    dispatcher.py        optional
    verbalizer.py        optional
    prompts/
  report/
    report.md
```

## Ordine Operativo Consigliato

1. Scrivere proposta breve per i docenti ISE.
2. Creare repository ISE separato.
3. Tradurre `GC-00`...`GC-09` in beliefs Jason.
4. Implementare baseline monagente `cardiac_mass_agent.asl`.
5. Implementare goals `!evaluate`, `!plan_next_steps`, `!explain`.
6. Aggiungere planning diagnostico per high suspicion, discordance, gray zone e missing data.
7. Aggiungere output trace/plan leggibile.
8. Valutare split multi-agent solo se utile per il corso.
9. Aggiungere LLM dispatcher/verbalizer solo se il baseline agentivo e gia funzionante.

## Messaggio Da Usare Con I Docenti ISE

Bozza sintetica:

```text
I would like to propose an ISE project connected to my thesis domain, but implemented as a separate artifact. The thesis is a TypeScript/PWA clinical decision support prototype for cardiac mass evaluation. The ISE project would model the same domain as a Jason/AgentSpeak BDI agent that reasons over observed imaging features, diagnostic scores, literature-derived cutoffs and missing data. The agent would produce symbolic risk assessment, traceable explanations and diagnostic next-step plans. An optional LLM component could be added only as a constrained dispatcher/verbalizer over Jason-generated traces, not as a clinical decision maker.
```

## Decisione Attuale

Scelta consigliata:

- tesi: TypeScript CDSS + deterministic clinical traceability;
- ISE: progetto separato Jason/AgentSpeak su BDI reasoning, planning ed explainability;
- baseline: monagente Jason prima di eventuale multi-agent;
- LLM: opzionale, solo come dispatcher/verbalizer vincolato da intenti e trace Jason.
