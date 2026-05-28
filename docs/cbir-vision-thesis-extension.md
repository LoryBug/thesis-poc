# CBIR And Computer Vision Thesis Extension

Questo documento raccoglie una possibile evoluzione della tesi verso content-based image retrieval e computer vision su immagini di masse cardiache.

Va tenuto separato dal piano originale della tesi (`docs/thesis-roadmap.md`) e dal piano ISE (`docs/clinical-traceability-ise-plan.md`), per non confondere la baseline gia implementata con una possibile estensione piu ambiziosa.

## Idea Centrale

La direzione proposta e trasformare il prototipo attuale in un sistema piu completo che combina:

- clinical decision support deterministico;
- score clinici interpretabili;
- traceability delle regole;
- retrieval di immagini simili da casi storici;
- supporto al labelling clinico;
- eventuale estrazione automatica di label imaging, se il dataset lo permette.

Formula sintetica:

```text
Clinical input
+ structured imaging features
+ image-based similar case retrieval
-> deterministic scores
-> multimodality consensus
-> traceability
-> retrieved similar patients
-> clinician review
```

## Motivazione

Il cardiologo ha comunicato la disponibilita potenziale di un dataset utilizzabile liberamente, con aspetti privacy gia risolti.

Questo cambia il valore della tesi: il progetto non sarebbe piu solo un prototipo software basato su letteratura, ma potrebbe diventare uno strumento sperimentale su dati reali.

Inoltre, l'esperienza gia maturata su un sistema CBIR per retrieval di immagini architetturali rende naturale proporre una tesi al docente di visione artificiale.

## Titolo Possibile

Titoli candidati:

```text
Explainable Multimodal Decision Support and Image Retrieval for Cardiac Mass Evaluation
```

```text
Content-Based Image Retrieval for Explainable Cardiac Mass Decision Support
```

```text
An Explainable Clinical Decision Support System with Similar-Case Image Retrieval for Cardiac Masses
```

## Posizionamento Della Tesi

La tesi non dovrebbe partire promettendo una diagnosi automatica completa.

La proposta piu solida e:

> Costruire un sistema di supporto decisionale per masse cardiache che combina regole cliniche interpretabili e retrieval di immagini simili da casi storici anonimizzati, con l'obiettivo di supportare il medico nella valutazione, nel confronto con casi precedenti e nella futura annotazione strutturata delle feature.

Questa formulazione e forte perche:

- usa dati reali;
- valorizza la base CDSS gia implementata;
- introduce computer vision in modo realistico;
- evita claim clinici eccessivi;
- lascia spazio a classificazione o label prediction solo se i dati sono sufficienti.

## Relazione Con Il Prototipo Attuale

Il prototipo attuale resta la baseline clinica e software:

- DEM Score;
- CMR Mass Score;
- cardiac CT / 18F-FDG PET/CT pathway;
- consensus engine;
- clinical traceability;
- report copiabile;
- golden cases;
- source mapping;
- deploy PWA.

L'estensione CBIR aggiungerebbe un nuovo livello:

```text
Current CDSS
+ image embedding extraction
+ similar-case retrieval
+ retrieved-case explanation
+ dataset-backed validation
```

Il CDSS non deve dipendere obbligatoriamente dal modulo immagini. Deve continuare a funzionare anche senza dataset o senza retrieval.

## Obiettivo Minimo Realistico

Obiettivo minimo consigliato:

- dato un nuovo caso o una nuova immagine, recuperare i casi piu simili dal dataset;
- mostrare immagini/casi simili con diagnosi o label note;
- integrare il risultato del retrieval nella UI come evidenza contestuale;
- mantenere separata la decisione deterministica dagli output del retrieval;
- valutare il retrieval con metriche standard.

Questo e gia sufficiente per una tesi forte, se il dataset e reale e ben documentato.

## Obiettivo Ambizioso

Se numero di casi, qualita immagini e annotazioni sono sufficienti, si puo esplorare:

- classificazione benigno/maligno;
- predizione di selected imaging labels;
- weak labelling assistito da retrieval;
- clustering di fenotipi imaging;
- segmentazione/localizzazione della massa, solo se esistono annotazioni spaziali;
- retrieval multimodale combinando immagini, score e metadati clinici.

Questi obiettivi devono restare secondari finche non si conosce davvero il dataset.

## Cosa Non Promettere Subito

Da evitare nella proposta iniziale:

- diagnosi autonoma;
- accuratezza clinica generalizzabile;
- estrazione automatica affidabile di tutte le feature;
- classificazione robusta se il dataset e piccolo;
- segmentazione se non esistono maschere o bounding box;
- deep learning supervisionato complesso senza sapere numero e qualita dei dati.

Formula prudente:

> If dataset size and annotation quality are sufficient, the project will explore automatic prediction of selected imaging labels.

## Dataset Assessment

Prima di definire il piano tecnico serve una fotografia precisa del dataset.

Domande per il cardiologo:

- Quali modalita sono disponibili: echocardiography, CMR, CT, PET/CT?
- Le immagini sono DICOM originali, frame estratti, video, slice 2D, volumi 3D o immagini gia selezionate?
- Quanti pazienti/casi totali sono disponibili?
- Quanti casi benigni e quanti maligni?
- Quali diagnosi finali sono disponibili: istologia, follow-up, risoluzione dopo terapia, consenso clinico?
- Le label sono a livello paziente, esame, immagine, frame, slice o regione?
- Sono disponibili le feature DEM gia annotate?
- Sono disponibili le feature CMR Mass Score gia annotate?
- Sono disponibili i segni CT e i parametri PET SUVmax, MTV, TLG?
- Sono disponibili bounding box, maschere o punti indicativi della massa?
- Gli esami sono multimodali sullo stesso paziente o ogni paziente ha solo alcune modalita?
- Esistono key images/key frames gia scelti dal cardiologo o radiologo?
- Ci sono piu lettori/annotatori o una sola annotazione clinica?
- Esiste una misura di accordo inter-osservatore?
- I dati sono gia anonimizzati e organizzati per caso?
- Quali metadati clinici sono disponibili e utilizzabili?

Domande per il docente di visione artificiale:

- Quale livello di ambizione e realistico in base al numero di casi?
- Conviene partire da retrieval 2D su key images o da volumi/video?
- Quale backbone usare come baseline?
- Ha senso self-supervised learning se le label sono poche?
- Quali metriche di retrieval sono piu adatte al dataset?
- Come impostare una validazione corretta senza data leakage tra immagini dello stesso paziente?

## Possibile Architettura

Architettura modulare:

```text
Dataset
-> preprocessing / anonymized case indexing
-> image embedding extraction
-> vector index
-> similar-case retrieval
-> CDSS structured case
-> traceability + retrieved evidence
-> UI review
```

Componenti software:

- `packages/core`: resta responsabile di score, consensus e traceability deterministica.
- nuovo modulo offline `vision/` o repo separato per preprocessing, embeddings e indexing.
- nuovo formato JSON per casi reali anonimizzati.
- eventuale API locale/backend per interrogare l'indice vettoriale.
- frontend PWA esteso con pannello `Similar Cases`.

Il modulo immagini puo essere separato dal monorepo attuale se richiede Python, PyTorch o librerie medical imaging.

## CBIR Baseline

Baseline iniziale consigliata:

1. Selezione o estrazione di key images/key frames.
2. Preprocessing coerente per modalita.
3. Feature extraction con modello pretrained.
4. Creazione embedding per ogni immagine/caso.
5. Indicizzazione k-NN.
6. Retrieval top-k per nuova immagine/caso.
7. Valutazione rispetto a diagnosi, feature o classe clinica nota.

Possibili strategie di embedding:

- CNN pretrained come baseline semplice;
- modelli self-supervised tipo DINO/MAE se il dataset e prevalentemente immagine 2D;
- modelli medical imaging pretrained se compatibili con modalita e formato;
- embedding multimodale combinando immagine e feature strutturate.

La scelta dipende fortemente da formato e dimensione del dataset.

## Metriche Di Valutazione

Metriche retrieval:

- Precision@k;
- Recall@k;
- mean Average Precision;
- top-k accuracy rispetto a diagnosi o classe;
- clustering purity;
- nearest-neighbor consistency per feature imaging;
- valutazione qualitativa con cardiologo/radiologo.

Metriche classification, solo se si fa classificazione:

- AUC;
- sensitivity;
- specificity;
- F1-score;
- calibration;
- confidence intervals se il campione lo permette.

Attenzione:

- split a livello paziente, non a livello immagine;
- evitare leakage tra slice/frame dello stesso esame;
- separare training, validation e test se il dataset e abbastanza grande;
- se il dataset e piccolo, preferire cross-validation patient-level.

## Integrazione Con Traceability

L'estensione interessante e non usare il retrieval come scatola nera, ma come evidenza contestuale tracciata.

Esempio di output:

```text
The CDSS decision is CMR-driven high suspicion because CMR Mass Score = 5/8.
The image retrieval module found 5 similar historical cases.
Among them, 4 had malignant final diagnosis and 1 had benign final diagnosis.
Similarity was computed on CMR key-image embeddings.
Retrieved cases are contextual evidence only and do not override deterministic score rules.
```

Possibili nuovi nodi di traceability:

- `retrieval-query-image`;
- `retrieved-case`;
- `embedding-model`;
- `similarity-score`;
- `retrieved-case-label`;
- `retrieval-limitation`.

Possibili relazioni:

- `retrieves`;
- `similar-to`;
- `contextualizes`;
- `does-not-override`;
- `requires-review`.

Principio chiave:

```text
Scores and consensus make the deterministic recommendation.
Retrieval provides contextual similar-case evidence.
The clinician remains responsible for interpretation.
```

## UI Possibile

Nuovo pannello:

```text
Similar Cases
```

Contenuti:

- top-k casi simili;
- thumbnail o immagine chiave;
- modalita imaging;
- similarity score;
- diagnosi finale o classe nota;
- DEM/CMR/CT-PET summary se disponibile;
- link alla traceability del caso recuperato;
- warning su limiti e necessita di review clinica.

Funzioni utili:

- filtro per modalita;
- filtro per diagnosi finale;
- confronto affiancato nuovo caso vs caso recuperato;
- esportazione JSON del retrieval result;
- possibilita di usare il caso recuperato come supporto al labelling.

## Roadmap Proposta

### Fase 0: Hardening Del CDSS Attuale

- Completare golden cases automatici.
- Aggiungere export/import JSON dei casi.
- Eventuale sample case loader per demo.
- Stabilizzare traceability e report.

### Fase 1: Dataset Assessment

- Ricevere dataset sample.
- Documentare formato, modalita, numero casi, label e annotazioni.
- Definire il task primario con docente e cardiologo.

### Fase 2: CBIR Offline Baseline

- Preprocessing immagini.
- Embedding extraction.
- Vector index.
- Retrieval top-k.
- Valutazione quantitativa e qualitativa.

### Fase 3: Integrazione Nel Tool

- Collegare retrieval result al caso CDSS.
- Aggiungere pannello `Similar Cases`.
- Estendere traceability con retrieved evidence.
- Generare report con sezione retrieval.

### Fase 4: Label Prediction Esplorativa

- Solo se il dataset e sufficiente.
- Predire diagnosi o feature selezionate.
- Confrontare modello supervisionato vs retrieval baseline.
- Mantenere output come supporto, non diagnosi autonoma.

### Fase 5: Valutazione Finale

- Valutazione funzionale software.
- Valutazione retrieval.
- Analisi qualitativa con cardiologo.
- Discussione limiti, bias, data leakage e generalizzabilita.

## Deliverable Possibili

Deliverable minimi:

- CDSS/PWA attuale hardened.
- Dataset assessment report.
- CBIR pipeline offline.
- Similar-case retrieval evaluation.
- Integrazione UI con similar cases.
- Traceability estesa a retrieved evidence.
- Tesi con discussione clinica e tecnica.

Deliverable opzionali:

- classificatore benigno/maligno;
- predizione feature imaging;
- active learning per labelling;
- backend per storage casi e retrieval;
- demo deployabile con subset anonimizzato.

## Rischi Principali

Rischi tecnici:

- dataset troppo piccolo;
- immagini eterogenee per modalita/protocollo;
- label solo a livello paziente e non immagine;
- mancanza di key images;
- data leakage tra slice/frame dello stesso paziente;
- difficolta di usare DICOM/video/volumi nel tempo disponibile.

Rischi clinici:

- diagnosi finali non uniformemente confermate;
- class imbalance benigno/maligno;
- annotation bias;
- differenze tra centri, scanner e protocolli;
- rischio di sovrainterpretare retrieval come diagnosi.

Mitigazioni:

- partire da retrieval, non da diagnosi automatica;
- split patient-level;
- usare metriche retrieval e valutazione qualitativa;
- mantenere traceability e human-in-the-loop;
- dichiarare chiaramente limiti e natura sperimentale.

## Messaggio Da Portare Al Professore

Bozza sintetica:

```text
I recently built a content-based image retrieval system for architectural images, and I am currently developing a TypeScript/PWA clinical decision support prototype for cardiac mass evaluation based on deterministic scores, multimodality consensus and traceability.

A cardiologist has now indicated that an anonymized dataset of cardiac mass imaging cases may be available for thesis work. I would like to propose extending the current CDSS with a computer vision component focused first on similar-case image retrieval, rather than autonomous diagnosis.

The goal would be to retrieve historical cases with similar imaging appearance, show their known labels and clinical context, and integrate this as contextual evidence inside an explainable decision support workflow. If the dataset size and annotation quality are sufficient, a secondary exploratory objective could be automatic prediction of selected imaging labels or benign/malignant classification.

The project would combine clinical interpretability, image retrieval, dataset-backed evaluation and human-in-the-loop decision support.
```

## Decisione Consigliata

La direzione consigliata e proporre al professore una tesi centrata su:

```text
CBIR + explainable CDSS + traceability
```

Non su:

```text
fully automatic diagnosis from images
```

La diagnosi automatica puo restare un'estensione sperimentale, condizionata alla qualita e quantita del dataset.

Questa impostazione rende il progetto ambizioso ma difendibile: valorizza la base gia costruita, usa dati reali, introduce visione artificiale e mantiene un impianto clinicamente prudente.
