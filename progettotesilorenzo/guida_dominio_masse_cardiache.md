# Masse cardiache: guida di dominio per progetto di tesi

Versione: 1.0

Obiettivo: dare a un ingegnere informatico la base clinica, metodologica e statistica per capire gli articoli forniti e parlare con cardiologi/radiologi in modo consapevole.

Fonti lette:

- `07 Angeli (620-630).pdf` - Angeli et al., 2022, classificazione, clinica e strategie diagnostiche delle masse cardiache.
- `21. DEM Score.pdf` - Paolisso et al., 2022, sviluppo e validazione del Diagnostic Echocardiographic Mass score.
- `1-s2.0-S0894731723000020-main.pdf` - Paolisso et al., 2023, marker ecocardiografici nella diagnosi delle masse cardiache.
- `1-s2.0-S1936878X20303314-main.pdf` - D'Angelo et al., 2020, accuratezza diagnostica di TC cardiaca e PET/TC con 18F-FDG.
- `paolisso-et-al-2024.pdf` - Paolisso et al., 2024, CMR Mass Score per predire malignita delle masse cardiache.

## 1. Messaggio principale

Il dominio degli articoli e la diagnosi non invasiva delle masse cardiache. Il problema clinico centrale e distinguere rapidamente una massa benigna da una maligna, per decidere terapia, urgenza, imaging successivo, biopsia, chirurgia o trattamento oncologico.

La biopsia o l'istologia restano il gold standard, ma nel cuore non sono sempre semplici o sicure. Per questo il percorso moderno usa imaging multimodale:

- Ecocardiografia: primo livello.
- Risonanza magnetica cardiaca, CMR/RM: riferimento non invasivo per caratterizzazione tissutale.
- TC cardiaca: utile per calcificazioni, grossi vasi, staging e quando la RM non e fattibile.
- PET/TC con 18F-FDG: valuta il metabolismo tumorale e aiuta soprattutto nei casi dubbi o oncologici.

Gli articoli non propongono una AI end-to-end su immagini grezze. Propongono score interpretabili basati su feature clinico-radiologiche, come infiltrazione, versamento pericardico, sede non sinistra, forma polilobata, aspetto sessile, enhancement e perfusione.

Questa e una base molto interessante per una tesi informatica, perche consente di lavorare su dati strutturati, decision support, modelli interpretabili, validazione, integrazione multimodale e potenzialmente NLP o computer vision.

## 2. Che cosa e una massa cardiaca

Con massa cardiaca si intende qualsiasi formazione solida o liquida osservata nelle strutture cardiache, nel pericardio o nei grossi vasi. Non tutte le masse sono tumori.

Classificazione pratica:

| Classe | Esempi | Significato clinico |
|---|---|---|
| Pseudotumori | Trombi, vegetazioni, cisti, calcificazioni, varianti anatomiche | Non sono neoplasie, ma possono simulare tumori |
| Tumori primitivi benigni | Mixoma, fibroelastoma papillare, lipoma, fibroma, paraganglioma | Nascono nel cuore e in genere hanno prognosi migliore |
| Tumori primitivi maligni | Sarcoma, angiosarcoma, linfoma cardiaco | Rari ma aggressivi |
| Tumori maligni secondari | Metastasi da polmone, melanoma, linfoma, rene, fegato, colon, tumori genito-urinari | Piu frequenti dei tumori primitivi maligni |

Concetto chiave: i tumori cardiaci primitivi sono rari, mentre metastasi e pseudotumori sono relativamente piu frequenti nella pratica clinica.

## 3. Epidemiologia essenziale

I tumori primitivi cardiaci sono rari. Tra questi, circa il 90% e benigno. Il mixoma e il tumore benigno piu comune nell'adulto.

Le metastasi cardiache sono molto piu frequenti dei tumori primitivi. Alcuni tumori hanno particolare tendenza a coinvolgere il cuore o il pericardio:

- Polmone.
- Mammella.
- Melanoma.
- Linfomi.
- Mesotelioma.
- Rene e tumori genito-urinari.
- Epatocarcinoma.

La prevalenza reale delle metastasi cardiache e probabilmente sottostimata, perche nei pazienti oncologici avanzati spesso non si eseguono accertamenti invasivi o complessi se non modificano la prognosi o la terapia.

## 4. Presentazione clinica

La clinica e spesso aspecifica. Una massa cardiaca puo essere scoperta per caso, oppure durante esami per dispnea, embolia, aritmie, sospetta endocardite, follow-up oncologico o screening di cardiotossicita.

I sintomi dipendono piu da sede, dimensione e rapporto con le strutture cardiache che dal nome istologico della massa.

Meccanismi principali:

- Ostruzione al flusso: sincope, dispnea, lipotimia, sintomi simili a stenosi valvolare.
- Embolizzazione sistemica: ictus, ischemia periferica, embolia coronarica.
- Embolizzazione polmonare: embolia polmonare o infarto polmonare.
- Infiltrazione miocardica: aritmie, scompenso, dolore toracico, alterazioni ECG.
- Interessamento pericardico: versamento pericardico, tamponamento, pericardite.
- Sintomi sistemici: febbre, astenia, infiammazione, dimagrimento, segni oncologici.

Indizi clinici utili:

- Diagnosi incidentale e massa mobile in atrio sinistro: piu spesso benigna.
- Dispnea avanzata, versamento pericardico, cuore destro, pericardio o grossi vasi: piu sospetto per malignita.
- Massa in apice ventricolare acinetico dopo infarto: forte sospetto di trombo.
- Febbre, batteriemia, protesi valvolare o device: sospetto di vegetazione/endocardite.

## 5. Obiettivo diagnostico

La domanda clinica principale non e solo "che massa e?" ma soprattutto:

1. Esiste davvero una massa o e un artefatto/variante anatomica?
2. Dove si trova?
3. E intracavitaria, intramurale, pericardica o nei grossi vasi?
4. E mobile o fissa?
5. Ha base sessile o peduncolo?
6. Infiltra miocardio, pericardio o strutture vicine?
7. E vascolarizzata?
8. Capta contrasto?
9. Ha metabolismo aumentato alla PET?
10. Il comportamento e piu compatibile con benignita, malignita o trombo?

La diagnosi finale guida scelte molto diverse:

- Anticoagulazione se trombo.
- Antibiotici/chirurgia se vegetazione infettiva complicata.
- Chirurgia se mixoma o fibroelastoma a rischio embolico.
- Biopsia, chirurgia, chemioterapia, radioterapia o palliazione se malignita.
- Follow-up se lesione verosimilmente benigna e non complicata.

## 6. Imaging: cosa vede ogni metodica

### 6.1 Ecocardiografia

L'ecocardiografia transtoracica, TTE, e l'esame di primo livello. L'ecocardiografia transesofagea, TEE, puo essere usata quando serve maggiore dettaglio, soprattutto per valvole, atri e piccole masse.

Cosa valuta bene:

- Localizzazione.
- Dimensioni.
- Mobilita.
- Forma.
- Sito di impianto.
- Rapporto con valvole.
- Effetto emodinamico.
- Versamento pericardico.

Punti forti:

- Rapida.
- Economica.
- Disponibile.
- Non usa radiazioni.
- Ottima risoluzione temporale.
- Molto utile per vegetazioni e piccole masse mobili.

Limiti:

- Dipende dalla finestra acustica.
- Operatore-dipendente.
- Puo generare artefatti.
- Caratterizzazione tissutale limitata.
- Meno efficace per pericardio, arteria polmonare, grossi vasi e masse extracardiache/paracardiache.

### 6.2 Risonanza magnetica cardiaca, CMR/RM

La RM cardiaca e considerata il riferimento non invasivo per molte masse cardiache, perche combina anatomia, funzione e caratterizzazione tissutale.

Sequenze importanti:

- Cine SSFP: movimento, morfologia, rapporto con camere e valvole.
- T1 black blood: composizione tissutale di base.
- T2 black blood: edema, contenuto acquoso, infiammazione, necrosi.
- FAT-SAT: grasso, utile per lipoma/lipomatosi.
- First-pass perfusion: vascolarizzazione precoce dopo gadolinio.
- EGE, early gadolinium enhancement: enhancement precoce.
- LGE, late gadolinium enhancement: fibrosi, necrosi, flogosi, tessuto extracellulare espanso.

Cosa valuta bene:

- Localizzazione precisa.
- Infiltrazione.
- Rapporti con miocardio, pericardio e strutture extracardiache.
- Perfusione della massa.
- Enhancement omogeneo o eterogeneo.
- Differenza tra trombo avascolare e massa vascolarizzata.

Punti forti:

- Nessuna radiazione ionizzante.
- Ottima caratterizzazione tissutale.
- Immagini multiplanari.
- Molto utile per sospetto di malignita.

Limiti:

- Meno disponibile.
- Tempi lunghi.
- Difficile in pazienti instabili o claustrofobici.
- Problemi con alcuni device non compatibili.
- Non ideale per lesioni molto piccole o valvolari.

### 6.3 TC cardiaca

La TC cardiaca e utile come metodica complementare o alternativa alla RM.

Cosa valuta bene:

- Calcificazioni.
- Grossi vasi.
- Polmoni, mediastino, pleura.
- Margini della massa.
- Invasione di strutture vicine.
- Uptake di mezzo di contrasto iodato.
- Planning chirurgico.
- Staging oncologico.

Punti forti:

- Ampia disponibilita.
- Acquisizione rapida.
- Alta risoluzione spaziale.
- Molto utile se RM controindicata.

Limiti:

- Radiazioni ionizzanti.
- Mezzo di contrasto iodato.
- Peggiore risoluzione temporale rispetto a eco/RM.
- Meno efficace per piccole vegetazioni valvolari.

### 6.4 PET/TC con 18F-FDG

La PET/TC misura il metabolismo glucidico. Le cellule tumorali maligne spesso consumano molto glucosio e captano piu 18F-FDG.

Parametri principali:

- SUVmax: massimo standardized uptake value.
- SUVmean: uptake medio.
- MTV: metabolic tumor volume, volume metabolicamente attivo.
- TLG: total lesion glycolysis, combina volume e intensita metabolica.

Cosa valuta bene:

- Attivita metabolica.
- Probabilita di malignita.
- Estensione sistemica di malattia.
- Sede migliore per eventuale biopsia.
- Risposta a terapia oncologica.

Punti forti:

- Molto utile in oncologia.
- Aiuta nei casi dubbi dopo TC/RM.
- Consente stadiazione total body.

Limiti:

- Radiazioni.
- Preparazione complessa per ridurre uptake fisiologico miocardico.
- Falsi positivi in infezione/infiammazione.
- Non distingue sempre tumore primitivo da metastasi.

## 7. Red flag di malignita

Le red flag sono caratteristiche che aumentano la probabilita che una massa sia maligna.

Red flag morfologiche comuni:

- Localizzazione non sinistra, quindi cuore destro, pericardio o grossi vasi.
- Aspetto sessile, cioe massa attaccata direttamente alla parete senza peduncolo.
- Forma polilobata, cioe con due o piu lobi.
- Disomogeneita del segnale o dell'ecogenicita.
- Infiltrazione del miocardio, pericardio o tessuti vicini.
- Versamento pericardico, soprattutto moderato/severo o clinicamente significativo.
- Margini irregolari.
- Dimensioni elevate, anche se la dimensione da sola non basta.

Red flag funzionali o tissutali:

- Perfusione al first-pass in RM.
- Enhancement eterogeneo in RM.
- Uptake di contrasto alla TC.
- Uptake metabolico elevato alla PET/TC.
- SUVmax elevato, MTV elevato, TLG elevato.

Nota importante: una massa grande non e necessariamente maligna. Per esempio un mixoma benigno puo diventare grande. Per questo gli score non si basano solo sulla dimensione.

## 8. Score diagnostici principali

### 8.1 DEM Score ecocardiografico pesato

Il DEM Score, Diagnostic Echocardiographic Mass Score, e stato sviluppato per stimare il rischio di malignita usando solo ecocardiografia.

| Feature ecocardiografica | Punti |
|---|---:|
| Infiltrazione | 2 |
| Massa polilobata | 2 |
| Versamento pericardico moderato/severo | 2 |
| Aspetto sessile | 1 |
| Disomogeneita | 1 |
| Localizzazione non sinistra | 1 |

Range: 0-9.

Interpretazione pratica: valori piu alti indicano maggiore probabilita di malignita. Un cutoff intorno a 3 separa bene benigno e maligno.

Performance riportata:

- AUC circa 0.965 nello studio di sviluppo/validazione.
- Sensibilita circa 85%.
- Specificita circa 96%.

### 8.2 Score ecocardiografico non pesato

Nel lavoro JASE 2023 gli stessi 6 marker vengono semplicemente contati. Se almeno 3 sono presenti, la massa e considerata ad alto rischio di malignita.

Vantaggio: semplicita clinica. Il medico non deve calcolare pesi, ma contare feature.

Performance:

- AUC >0.90.
- Accuratezza circa 90%.
- Risultati simili allo score pesato.

### 8.3 CMR Mass Score

Il CMR Mass Score usa RM cardiaca e aggiunge variabili di caratterizzazione tissutale.

| Feature CMR | Punti |
|---|---:|
| Infiltrazione | 2 |
| First-pass contrast perfusion | 2 |
| Versamento pericardico | 1 |
| Aspetto sessile | 1 |
| Forma polilobata | 1 |
| Enhancement eterogeneo | 1 |

Range: 0-8.

Cutoff: >=5.

Performance riportata:

- AUC 0.976.
- Sensibilita 92%.
- Specificita 96%.
- Accuratezza 94%.
- Valore prognostico: CMR Mass Score >=5 associato a maggiore mortalita globale.

### 8.4 Score/approccio TC e PET

Nel lavoro su TC/PET sono valutati 8 segni TC:

- Margini irregolari.
- Versamento pericardico.
- Invasione.
- Natura solida.
- Diametro >30 mm.
- Uptake di contrasto TC.
- Caratteristiche pre-contrasto.
- Calcificazioni.

Interpretazione:

- >=5 segni TC: predizione molto forte di malignita.
- <=2 segni TC: malignita molto improbabile.
- 3-4 segni TC: zona grigia.

Nella zona grigia, la PET/TC aiuta usando:

- SUVmax >=4.9.
- TLG >=29.
- MTV >=8.2.

Se almeno un parametro PET e patologico, la probabilita di malignita aumenta molto.

## 9. Articolo 1: Angeli et al. 2022, rassegna su classificazione e percorso diagnostico

Titolo: Classificazione, caratteristiche cliniche e strategie diagnostiche delle masse cardiache.

Tipo di articolo: review narrativa.

Domanda dell'articolo: come classificare le masse cardiache e come impostare un percorso diagnostico pratico usando le metodiche disponibili.

Messaggi principali:

- Le masse cardiache sono eterogenee: pseudotumori, tumori benigni, tumori maligni primitivi, metastasi.
- La clinica raramente e sufficiente per definire la natura della massa.
- L'ecocardiogramma e il primo esame per tutti i pazienti.
- La RM cardiaca e il gold standard non invasivo quando serve caratterizzazione tissutale.
- TC e PET/TC sono complementari, soprattutto se RM non disponibile o se serve stadiazione.
- La decisione finale dovrebbe essere discussa in Heart Team.

Concetti clinici importanti:

- Tumori primitivi benigni: soprattutto mixoma nell'adulto.
- Tumori primitivi maligni: soprattutto sarcomi e linfomi.
- Metastasi: piu frequenti dei primitivi maligni.
- Pseudotumori: trombi, vegetazioni, cisti, calcificazioni e varianti anatomiche.

Percorso proposto:

1. Sospetto o riscontro di massa.
2. Ecocardiogramma TTE/TEE.
3. Se eco conclusiva, si procede con terapia mirata.
4. Se eco inconclusiva, RM o TC.
5. Se ancora dubbio o contesto oncologico, PET/TC.
6. Se imaging non dirimente, considerare biopsia o terapia ex adiuvantibus, ad esempio anticoagulazione se sospetto trombo.
7. Discussione collegiale in Heart Team.

Punto forte dell'articolo: fornisce il vocabolario e il workflow clinico generale.

Limite: non e uno studio quantitativo originale, quindi non valida direttamente un modello.

## 10. Articolo 2: Paolisso et al. 2022, sviluppo del DEM Score

Titolo: Development and Validation of a Diagnostic Echocardiographic Mass Score in the Approach to Cardiac Masses.

Tipo di articolo: studio osservazionale con sviluppo e validazione interna di score.

Domanda: e possibile usare feature ecocardiografiche semplici per predire la malignita di una massa cardiaca?

Dataset:

- 249 pazienti.
- 181 masse benigne.
- 68 masse maligne.
- Derivation cohort: 178 pazienti.
- Validation cohort: 71 pazienti.
- Diagnosi definitiva con istologia o risoluzione radiologica per trombi.

Feature inizialmente associate a malignita:

- Localizzazione non sinistra.
- Diametro >30 mm.
- Disomogeneita.
- Margini irregolari.
- Immobilita.
- Aspetto sessile.
- Forma polilobata.
- Infiltrazione.
- Versamento pericardico.

Feature indipendenti finali:

- Infiltrazione.
- Versamento pericardico moderato/severo.
- Forma polilobata.
- Aspetto sessile.
- Disomogeneita.
- Localizzazione non sinistra.

Score finale:

- Infiltrazione: 2.
- Polilobata: 2.
- Versamento pericardico moderato/severo: 2.
- Disomogeneita: 1.
- Sessile: 1.
- Localizzazione non sinistra: 1.

Risultati:

- AUC 0.965.
- Sensibilita 85% circa.
- Specificita 96% circa.
- Accuratezza 89.4%.
- Buona riproducibilita anche con cardiologo in training.

Implicazione clinica: l'ecocardiogramma, pur essendo semplice e disponibile, puo guidare in modo razionale l'accesso a esami di secondo livello.

Lettura informatica: e un caso classico di clinical decision rule interpretabile. Le variabili sono binarie, il target e binario, il modello di origine e regressione logistica.

## 11. Articolo 3: Paolisso et al. 2023, marker ecocardiografici e score non pesato

Titolo: Echocardiographic Markers in the Diagnosis of Cardiac Masses.

Tipo di articolo: studio osservazionale su coorte piu ampia, con regressione logistica e classification tree analysis.

Domanda: le 6 feature ecocardiografiche del DEM Score predicono malignita anche se semplicemente contate senza pesi?

Dataset:

- 286 pazienti inclusi.
- 212 masse benigne.
- 74 masse maligne.
- Esclusi casi senza istologia, masse extracardiache, cattiva finestra acustica, masse non visualizzate all'eco.
- Follow-up mediano 22 mesi.

Osservazioni cliniche:

- Le masse benigne erano piu spesso peduncolate, mobili e aderenti al setto interatriale.
- Le masse maligne erano piu spesso grandi, sessili, polilobate, disomogenee, infiltranti e associate a versamento pericardico.
- Le masse maligne si associavano piu spesso a dispnea e embolia polmonare.
- Le masse benigne si associavano piu spesso a diagnosi incidentale ed embolia periferica.

Feature indipendenti confermate:

- Infiltrazione.
- Versamento pericardico moderato/severo.
- Localizzazione non sinistra.
- Aspetto sessile.
- Forma polilobata.
- Disomogeneita.

Score non pesato:

- Si contano le 6 feature.
- Cutoff >=3.

Risultati:

- AUC >0.90.
- Accuratezza circa 90%.
- Prestazione simile allo score pesato.
- Presenza di >=3 feature associata a mortalita piu alta.

Classification tree analysis:

- Primo discriminante: infiltrazione.
- Se non c'e infiltrazione, si guarda localizzazione non sinistra.
- Se non c'e localizzazione non sinistra, si guarda aspetto sessile.
- Accuratezza nella classificazione delle malignita: 87.5%.

Implicazione clinica: un medico puo usare una check-list di 6 elementi durante l'eco. Se almeno 3 sono presenti, bisogna sospettare malignita e accelerare imaging avanzato.

Lettura informatica: questo lavoro e molto vicino a un decision tree clinico. Interessante confrontare score lineare, albero decisionale e modelli ML interpretabili.

## 12. Articolo 4: D'Angelo et al. 2020, TC cardiaca e PET/TC con 18F-FDG

Titolo: Diagnostic Accuracy of Cardiac Computed Tomography and 18-F Fluorodeoxyglucose Positron Emission Tomography in Cardiac Masses.

Tipo di articolo: studio su accuratezza diagnostica di TC e PET/TC.

Domanda: TC cardiaca e PET/TC possono distinguere masse benigne e maligne? E come si integrano?

Dataset:

- 60 pazienti finali.
- 20 masse benigne.
- 40 masse maligne.
- Masse confermate istologicamente, tranne alcuni trombi confermati da risoluzione dopo anticoagulante.

Segni TC valutati:

- Margini irregolari.
- Versamento pericardico.
- Calcificazioni.
- Invasione.
- Natura solida.
- Diametro >30 mm.
- Caratteristiche pre-contrasto.
- Uptake di contrasto.

Risultati TC:

- Margini irregolari e invasione avevano PPV 100% nel campione.
- >=5 segni TC identificavano malignita.
- <=2 segni TC escludevano malignita.
- 3-4 segni TC rappresentavano una zona grigia.

Parametri PET/TC:

- SUVmax.
- SUVmean.
- MTV.
- TLG.

Cutoff rilevanti:

- SUVmax >=4.9.
- TLG >=29.
- MTV >=8.2.

Risultati PET/TC:

- SUV, MTV e TLG erano significativamente piu alti nelle masse maligne.
- Nella zona grigia TC, almeno un parametro PET alterato aumentava fortemente la capacita di identificare malignita.

Valore prognostico:

- Il numero di segni TC prediceva mortalita.
- SUVmax prediceva mortalita nel modello Cox.

Implicazione clinica: TC e PET/TC non sostituiscono sempre la RM, ma sono fondamentali in contesti specifici: RM non fattibile, sospetto coinvolgimento grossi vasi, staging oncologico, dubbio residuo dopo imaging anatomico.

Lettura informatica: e un problema di fusione tra feature morfologiche TC e feature metaboliche PET. La logica e sequenziale: TC prima, PET nei casi intermedi.

## 13. Articolo 5: Paolisso et al. 2024, CMR Mass Score

Titolo: Cardiac Magnetic Resonance to Predict Cardiac Mass Malignancy: The CMR Mass Score.

Tipo di articolo: studio osservazionale su RM cardiaca, confronto con ecocardiografia e analisi prognostica.

Domanda: si puo costruire uno score RM che migliori la predizione di malignita rispetto allo score ecocardiografico?

Dataset:

- 167 pazienti consecutivi.
- Tutti con ecocardiogramma e CMR entro 1 mese.
- 94 masse benigne.
- 73 masse maligne.
- Diagnosi definitiva con istologia o risoluzione del trombo.
- Follow-up completo, mediana 14 mesi.

Protocollo CMR:

- Cine SSFP.
- T1 e T2 black blood.
- FAT-SAT se necessario.
- First-pass perfusion.
- EGE.
- LGE.

Feature CMR analizzate:

- Localizzazione.
- Dimensione.
- Forma: regolare, irregolare, sessile, peduncolata, polilobata.
- Margini.
- Mobilita.
- Disomogeneita.
- Infiltrazione.
- Intensita T1/T2.
- FAT-SAT.
- First-pass perfusion.
- EGE/LGE.
- Enhancement omogeneo/eterogeneo.
- Versamento pericardico.

Risultati morfologici:

- Le masse benigne erano piu spesso nelle camere sinistre.
- Le masse maligne erano piu spesso nel cuore destro, pericardio o grossi vasi.
- Le masse maligne erano piu grandi, infiltranti, disomogenee, sessili, polilobate e associate a versamento pericardico.

Risultati tissutali:

- T1 e FAT-SAT non distinguevano bene benigno/maligno.
- T2 iperintenso era piu comune nelle malignita ma non indipendente nel modello finale.
- First-pass perfusion e enhancement eterogeneo erano predittori indipendenti.

Modello 1:

- Usa le feature morfologiche del DEM Score applicate alla CMR.
- AUC 0.950.
- Accuratezza elevata, ma non massima.

Modello 2, CMR Mass Score:

- Infiltrazione: 2.
- First-pass contrast perfusion: 2.
- Versamento pericardico: 1.
- Sessile: 1.
- Polilobata: 1.
- Enhancement eterogeneo: 1.

Risultati CMR Mass Score:

- Range 0-8.
- Cutoff >=5.
- AUC 0.976.
- Sensibilita 92%.
- Specificita 96%.
- PPV 94%.
- NPV 94%.
- Accuratezza 94%.
- Superiore al DEM Score ecocardiografico.

Confronto eco vs CMR:

- L'ecocardiografia ha mancato 16 masse poi viste alla CMR.
- La concordanza tra DEM Score e CMR Mass Score era buona, Cohen kappa 0.66.
- CMR rilevava meglio infiltrazione e alcune localizzazioni difficili.
- Eco e CMR insieme identificavano correttamente 70/73 masse maligne, cioe circa 96%.

Prognosi:

- CMR Mass Score >=5 prediceva mortalita globale piu alta.
- Hazard ratio circa 5.70.
- Anche lo score continuo era prognostico.

Implicazione clinica: il CMR Mass Score e lo strumento piu potente tra quelli letti, perche integra morfologia e informazione tissutale.

Lettura informatica: il CMR Mass Score e un modello interpretabile multimodale limitato alla RM. E una base ideale per validazione esterna, calibrazione, confronto con ML e integrazione con referti.

## 14. Confronto sintetico degli score

| Strumento | Modalita | Feature principali | Cutoff | AUC circa | Ruolo |
|---|---|---|---:|---:|---|
| DEM Score pesato | Eco | 6 feature morfologiche | >=3 circa | 0.965 | Primo triage |
| Score eco non pesato | Eco | Conta delle stesse 6 feature | >=3/6 | >0.90 | Check-list pratica |
| CMR Mass Score | RM | Morfologia + perfusione/enhancement | >=5/8 | 0.976 | Migliore predizione non invasiva |
| Segni TC | TC | 8 segni morfologici/contrastografici | >=5 | 0.988 nel campione | Utile se RM non fattibile o staging |
| PET/TC | PET | SUVmax, MTV, TLG | SUVmax >=4.9 | 0.948 SUV | Utile in zona grigia e oncologia |

Attenzione: AUC molto alte non significano automaticamente che il modello sia gia generalizzabile ovunque. Molti dati sono single-center, con campioni selezionati e prevalenze non realistiche rispetto alla popolazione generale.

## 15. Metodologia statistica ricorrente

Gli articoli seguono una pipeline metodologica abbastanza standard.

### 15.1 Disegno dello studio

La maggior parte sono studi osservazionali su coorti di pazienti consecutivi. Il centro principale e il Bologna Cardiac Masses Registry.

Punti metodologici:

- Pazienti con sospetta massa cardiaca.
- Imaging analizzato da esperti.
- Lettori spesso blinded rispetto a istologia e dati clinici.
- Target finale: benigno vs maligno.
- Gold standard: istologia, chirurgia, biopsia, autopsia o risoluzione di trombo dopo anticoagulante.

### 15.2 Analisi delle feature

Prima si confrontano feature tra gruppi benigni e maligni:

- Test t o Mann-Whitney per variabili continue.
- Chi-quadrato o Fisher per categoriche.
- Tabelle descrittive.

Poi si cercano predittori:

- Regressione logistica univariata.
- Regressione logistica multivariata.
- Controllo della collinearita, ad esempio VIF.

### 15.3 Costruzione dello score

Le variabili indipendenti entrano nello score. I pesi derivano spesso dai coefficienti beta della regressione logistica.

Logica:

- Coefficiente piu grande = predittore piu forte.
- Si normalizzano i coefficienti rispetto al piu piccolo.
- Si assegnano punti interi.
- Lo score totale e la somma dei punti.

### 15.4 Scelta del cutoff

Il cutoff viene scelto con Youden index:

`Youden = sensibilita + specificita - 1`

Il cutoff migliore e quello che bilancia meglio sensibilita e specificita.

### 15.5 Metriche diagnostiche

Metriche usate:

- AUC: capacita discriminativa globale.
- Sensibilita: quota di maligni identificati come maligni.
- Specificita: quota di benigni identificati come benigni.
- PPV: probabilita che un caso positivo sia davvero maligno.
- NPV: probabilita che un caso negativo sia davvero benigno.
- Accuracy: quota totale di classificazioni corrette.
- Cohen kappa: accordo tra lettori o metodiche oltre il caso.

Nota per l'ingegnere: PPV e NPV dipendono dalla prevalenza della malattia nel dataset. Se il dataset e arricchito di casi maligni, PPV/NPV possono non trasferirsi direttamente alla pratica reale.

### 15.6 Analisi prognostica

Alcuni articoli valutano se lo score predice mortalita.

Metodi:

- Kaplan-Meier per curve di sopravvivenza.
- Log-rank test per confrontare gruppi.
- Cox regression per hazard ratio.

Messaggio: gli score non servono solo a dire benigno/maligno, ma anche a stratificare rischio.

## 16. Traduzione in problema informatico

### 16.1 Target principale

Classificazione binaria:

- Input: feature cliniche e di imaging.
- Output: benigno vs maligno.

Target secondari:

- Probabilita di malignita.
- Necessita di imaging di secondo livello.
- Tipo di massa: pseudotumore, benigno primitivo, maligno primitivo, metastasi.
- Sopravvivenza o rischio di morte.
- Decisione: follow-up, RM, TC, PET, biopsia, Heart Team.

### 16.2 Tipi di dati possibili

Dati strutturati:

- Eta, sesso, sintomi, storia oncologica.
- Localizzazione.
- Feature eco/RM/TC/PET codificate come 0/1.
- Score DEM, CMR, TC, PET.
- Istologia finale.
- Follow-up e outcome.

Dati non strutturati:

- Referti ecocardiografici.
- Referti RM/TC/PET.
- Note cliniche.

Dati immagine:

- Immagini DICOM eco.
- Cine RM.
- Sequenze T1/T2/LGE.
- TC contrastografica.
- PET/TC.

### 16.3 Problemi informatici realistici

Possibili direzioni:

- Validazione esterna degli score esistenti su una nuova coorte.
- Calibrazione della probabilita di malignita, non solo classificazione.
- Confronto tra regressione logistica, random forest, gradient boosting, explainable boosting machines e score clinici.
- Modello multimodale che combina feature eco, CMR, TC e PET quando disponibili.
- Modello sequenziale che decide quale esame fare dopo, minimizzando costi e ritardi.
- NLP su referti per estrarre automaticamente feature come infiltrazione, sessile, polilobata, versamento, enhancement.
- Dashboard clinica per calcolare score e suggerire next step.
- Analisi di missing data, perche non tutti i pazienti hanno tutte le metodiche.
- Studio di explainability per rendere il modello accettabile ai cardiologi.
- Survival prediction usando Cox, random survival forest o DeepSurv su feature clinico-imaging.

### 16.4 Perche non partire subito da deep learning su immagini

Il deep learning su immagini grezze e affascinante ma difficile in questo dominio.

Problemi:

- Dataset piccoli.
- Masse rare.
- Imaging multimodale e non omogeneo.
- Annotazioni costose.
- Necessita di DICOM puliti e label affidabili.
- Rischio di overfitting.
- Difficile spiegabilita clinica.

Approccio piu pragmatico per una tesi:

1. Partire da feature strutturate e score interpretabili.
2. Validare e migliorare gli score.
3. Eventualmente aggiungere NLP su referti.
4. Solo dopo valutare computer vision su sotto-task specifici.

## 17. Criticita e bias da ricordare

Punti deboli comuni degli studi:

- Single-center.
- Campioni piccoli, soprattutto per TC/PET.
- Prevalenza di malignita spesso alta perche i pazienti sono selezionati.
- Evoluzione tecnologica nel tempo: gli studi coprono molti anni, ma scanner e protocolli cambiano.
- Alcune masse maligne avanzate non vengono confermate istologicamente perche non si procede a indagini invasive.
- Possibile verification bias: entrano nello studio soprattutto i pazienti che arrivano a diagnosi definitiva.
- Mancanza di validazione esterna multicentrica robusta.
- Lettura esperta: non e detto che la stessa performance valga in centri meno specializzati.
- Missing data: non tutti i pazienti hanno eco, CMR, TC e PET.

Questi limiti non indeboliscono l'interesse del dominio. Anzi, aprono spazio a una tesi metodologicamente utile.

## 18. Cosa chiedere ai cardiologi prima di definire la tesi

Domande sui dati:

- Quanti pazienti avete disponibili?
- Sono casi consecutivi o selezionati?
- Qual e il periodo temporale?
- Quanti hanno istologia?
- Quanti trombi sono confermati da risoluzione dopo anticoagulante?
- Quanti hanno eco, CMR, TC, PET?
- I dati sono gia strutturati o solo in referti testuali?
- Sono disponibili immagini DICOM?
- Sono disponibili outcome di follow-up?

Domande sulle feature:

- Le 6 feature DEM sono gia annotate?
- Le 6 feature CMR Mass Score sono gia annotate?
- Per TC/PET sono disponibili SUVmax, MTV, TLG?
- Le feature sono state annotate da un solo medico o da piu lettori?
- Esiste una misura di accordo inter-osservatore?

Domande cliniche:

- Quale decisione reale volete supportare?
- Distinguere benigno/maligno?
- Decidere se fare CMR?
- Decidere se fare PET?
- Ridurre tempi diagnostici?
- Prioritizzare pazienti urgenti?
- Supportare Heart Team?

Domande di implementazione:

- Il risultato deve essere un modello, una dashboard, uno score calculator, uno studio retrospettivo o un prototipo integrabile?
- Serve una validazione prospettica?
- Esistono vincoli privacy/GDPR?
- I dati sono esportabili in forma anonimizzata?

## 19. Possibili tesi concrete

### Tesi A: validazione e calibrazione degli score esistenti

Obiettivo: validare DEM Score e CMR Mass Score su una coorte indipendente.

Output:

- AUC, sensibilita, specificita, PPV, NPV.
- Curve di calibrazione.
- Decision curve analysis.
- Confronto tra score e modelli ML interpretabili.

Pro: molto clinica, solida, realistica.

Contro: richiede dataset ben strutturato.

### Tesi B: modello multimodale interpretabile

Obiettivo: combinare feature eco, CMR, TC e PET in un unico modello che gestisce dati mancanti.

Output:

- Modello predittivo benigno/maligno.
- Explainability per feature importance.
- Pipeline con missing data.
- Confronto con score singoli.

Pro: forte componente informatica.

Contro: richiede molti dati e gestione attenta del bias.

### Tesi C: NLP per estrazione automatica da referti

Obiettivo: estrarre automaticamente dai referti le feature degli score.

Output:

- Dataset annotato di referti.
- Modello o regole NLP per feature extraction.
- Valutazione precision, recall, F1.
- Calcolo automatico DEM/CMR score.

Pro: molto adatta a informatica, utile clinicamente, non richiede immagini DICOM.

Contro: serve accesso ai referti e annotazione manuale iniziale.

### Tesi D: sistema decisionale sequenziale per imaging

Obiettivo: suggerire l'esame successivo piu appropriato in base a dati disponibili.

Esempio:

- Eco basso rischio: follow-up o gestione diretta.
- Eco alto rischio: CMR urgente.
- CMR non fattibile: TC.
- TC zona grigia: PET/TC.

Output:

- Algoritmo decisionale.
- Simulazione su dati retrospettivi.
- Misura di accuratezza, costi, tempi e numero di esami evitati.

Pro: tesi molto utile per workflow clinico.

Contro: serve definire bene costi, disponibilita e decisioni cliniche.

### Tesi E: prognosi e sopravvivenza

Obiettivo: predire mortalita o outcome clinici usando score e feature imaging.

Output:

- Kaplan-Meier.
- Cox regression.
- Random survival forest.
- Stratificazione del rischio.

Pro: aggiunge dimensione prognostica.

Contro: serve follow-up affidabile.

## 20. Glossario minimo

| Termine | Significato |
|---|---|
| AUC | Area under the ROC curve, misura la capacita discriminativa |
| CMR/RM cardiaca | Risonanza magnetica cardiaca |
| CCT/TC cardiaca | Tomografia computerizzata cardiaca |
| DEM Score | Diagnostic Echocardiographic Mass Score |
| EGE | Early gadolinium enhancement, enhancement precoce in RM |
| LGE | Late gadolinium enhancement, enhancement tardivo in RM |
| First-pass perfusion | Valutazione della perfusione al primo passaggio del contrasto |
| Enhancement | Aumento di segnale dopo contrasto |
| Sessile | Massa attaccata alla parete con base larga, senza peduncolo |
| Peduncolata | Massa attaccata tramite un peduncolo |
| Polilobata | Massa con due o piu lobi |
| Infiltrazione | Crescita dentro miocardio/pericardio/tessuti vicini |
| Versamento pericardico | Liquido nello spazio pericardico |
| SUVmax | Massimo uptake standardizzato alla PET |
| MTV | Volume tumorale metabolicamente attivo |
| TLG | Total lesion glycolysis, combina volume e uptake |
| PPV | Positive predictive value |
| NPV | Negative predictive value |
| Youden index | Sensibilita + specificita - 1 |
| Cox regression | Modello per analisi di sopravvivenza |
| Kaplan-Meier | Curva di sopravvivenza nel tempo |
| Cohen kappa | Misura di accordo tra valutatori/metodiche |

## 21. Riassunto finale

Il dominio delle masse cardiache e un problema clinico raro ma complesso, dove la decisione rapida e corretta cambia molto il percorso del paziente. Gli articoli mostrano che poche feature di imaging, se scelte bene, predicono la malignita con accuratezza elevata.

La sequenza concettuale e:

1. L'ecocardiogramma identifica e caratterizza inizialmente la massa.
2. Le feature DEM aiutano a stimare il sospetto di malignita.
3. La CMR aggiunge caratterizzazione tissutale e migliora l'accuratezza.
4. TC e PET/TC sono utili se la RM non basta, non e fattibile o serve staging.
5. Gli score hanno anche valore prognostico.
6. Il campo e maturo per una tesi informatica su validazione, interpretabilita, integrazione multimodale, NLP o supporto decisionale.

La direzione piu solida per una prima tesi e probabilmente partire dai dati strutturati e dagli score esistenti, evitando inizialmente una AI su immagini grezze. Una tesi molto credibile potrebbe validare e migliorare DEM Score e CMR Mass Score, oppure costruire un sistema che estrae automaticamente feature dai referti e calcola il rischio di malignita.
