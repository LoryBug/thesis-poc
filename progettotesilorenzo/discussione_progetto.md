# Discussione del Progetto di Tesi

## 1. Inquadramento del Problema

Il progetto nasce dalla collaborazione tra ingegneria informatica e cardiologia per affrontare un problema clinico rilevante: la diagnosi non invasiva delle masse cardiache e la distinzione tra forme benigne e maligne. Come evidenziato nella guida di dominio (`guida_dominio_masse_cardiache.md`), le masse cardiache rappresentano una sfida diagnostica per la loro rarità, la variabilità clinica e la necessità di un tempestivo inquadramento per guidare decisioni terapeutiche criticali (chirurgia, biopsia, terapia oncologica, anticoagulazione).

L'obiettivo iniziale proposto dai collaboratori clinici era realizzare una semplice web app per il calcolo degli score diagnostici esistenti (DEM Score, CMR Mass Score, approccio TC/PET). Sebbene utile come punto di ingresso, tale approccio rischiava di ridursi a un esercizio di implementazione piuttosto che a un contributo originale di ricerca. La tesi ha quindi puntato a superare questo limite, sviluppando un prototipo che non solo implementa gli score, ma li interpreta alla luce della logica clinica sottostante agli studi di riferimento.

## 2. Metodologia Seguita

L'approccio seguito è stato strutturato in due fasi principali:

### Fase 1: Comprensione del Dominio
- Lettura critica e sintesi dei cinque articoli forniti dal gruppo clinico.
- Estrazione della teoria minima necessaria: classificazione delle masse cardiache, epidemiologia, presentazione clinica, ruolo delle diverse metodiche di imaging (ecocardiografia, CMR, TC, PET/TC).
- Identificazione degli score diagnostici validati negli studi: DEM Score ecocardiografico, CMR Mass Score, e l'approccio sequenziale TC → PET/TC.
- Analisi della metodologia statistica utilizzata negli studi originali (disegno osservazionale, regressione logistica per costruzione degli score, scelta del cutoff con indice di Youden, valutazione con AUC, sensibilità, specificità, PPV, NPV).
- Creazione di un glossario minimo dei termini clinico-tecnici essenziali per la comunicazione interdisciplinare.

### Fase 2: Sviluppo del Proof of Concept (POC)
- Progettazione di un prototipo web-based che va oltre il semplice calcolo di punteggi.
- Implementazione di una logica decisionale che rispetta il workflow clinico suggerito dagli studi:
  1. Ecocardiografia come primo livello di triage (DEM Score).
  2. CMR come esame dominante per caratterizzazione tissutale quando disponibile.
  3. TC e PET/TC come percorso alternativo o complementare, particolarmente utile nella zona grigia TC (3-4 segni) o per staging oncologico.
- Introduzione di una sezione esplicita di "Consenso Multimodale" che valuta concordanza e discordanza tra le diverse metodiche, anziché sommare meccanicamente gli score.
- Sviluppo di un report automatico copiabile che sintetizza input clinico, score calcolati, interpretazione basata sul consenso, evidenze a supporto e next step suggerito.
- Implementazione in HTML/CSS/vanilla JavaScript per garantire portabilità, facilità di utilizzo e zero dipendenze.
- Validazione della sintassi JavaScript e testing manuale di vari scenari clinici rappresentativi.

## 3. Risultati Ottenuti

### 3.1 Guida di Dominio
La sintesi dei cinque articoli in `guida_dominio_masse_cardiache.md` fornisce una base strutturata per:
- Comprendere il contesto clinico delle masse cardiache.
- Conoscere le caratteristiche chiave di benignità vs malignità secondo l'imaging.
- Capire come sono stati sviluppati e validati gli score diagnostici.
- Orientarsi nella metodologia statistica degli studi osservazionali.
- Tradurre il dominio in problemi informatici validi (validazione degli score, NLP su referti, sistemi decisionali, modelli interpretabili).

### 3.2 Proof of Concept
Il POC realizzato in `poc_masse_cardiache.html` dimostra:
- **Correttezza tecnica**: il calcolo di DEM Score, CMR Mass Score e il conteggio dei segni TC aderiscono precisamente alle definizioni dei paper.
- **Fedeltà clinica**: la logica decisionale rispetta il workflow suggerito dagli studi, evitando semplificazioni fuorvianti (es. trattare qualsiasi PET positiva come alto sospetto indipendentemente dal conteggio TC).
- **Interpretabilità**: il POC non è una "scatola nera"; espone chiaramente quali feature contribuiscono alla decisione e come queste si integrano nel consenso multimodale.
- **Utilità pratica**: la generazione automatica di un report copiabile facilita l'uso in contesti clinici reali (riunioni di Heart Team, referti, discussioni interdisciplinari).
- **Accessibilità**: essere un file HTML singolo permette di eseguirlo su qualsiasi dispositivo senza installazione, configurazione o connessione a server.

## 4. Contributi e Originalità

Il lavoro realizza diversi livelli di contribuito:

### Contributo Clinico-Informatico
- Fornisce ai cardiologi uno strumento di supporto decisionale che non si limita a restituire un numero, ma spiega *perché* si arriva a una determinata conclusione, rispettando la gerarchia di evidenza degli studi.
- Evidenzia esplicitamente le situazioni di concordanza e discordanza tra metodiche, stimolando una riflessione critica piuttosto che un'accecata affidamento a un punteggio sintetico.
- Il report sintetico può servire come traccia per la documentazione clinica o come base per discussioni in equipe multidisciplinari.

### Contributo Metodologico
- Dimostra come partire da una letteratura clinica specifica per costruire un prototipo informatico che ne sia fedele estensione, piuttosto che semplice applicazione.
- Mostra l'importanza di comprendere la logica sottostante agli score (quando vengono usati, in quale sequenza, quali sono i loro limiti) prima di tentarne l'automazione o l'integrazione.
- Offre un modello di come un informatico possa collaborare efficacemente con medici specialisti partendo da una solida comprensione del dominio.

### Contributo Tecnico
- Il POC, sebbene semplice, è completo, funzionante e immediatamente utilizzabile.
- La struttura modulare del JavaScript facilita estensioni future (aggiunta di nuovi esami, integrazione con modelli di machine learning, collegamento a basi di dati reali).
- L'approccio "zero dependencies" lo rende ideale per contesti clinici dove l'installazione di software può essere difficoltosa.

## 5. Limiti

Nonostante i risultati raggiunti, il progetto presenta alcuni limiti intrinseci alla sua natura di proof of concept:

### Limiti di Ampiezza
- Il POC è destinato a dimostrare un concetto, non a sostituire sistemi di supporto decisionale clinico certificati.
- Non include validazione su dati reali di pazienti (il che sarebbe necessario per una pubblicazione o un impiego clinico reale).
- Non gestisce casi di dati mancanti in modo sofisticato (semplicemente disabilita le sezioni non disponibili).

### Limiti di Profondità
- Non implementa tecniche di machine learning avanzate per la predizione della malignità.
- Non include componenti di elaborazione del linguaggio naturale (NLP) per l'estrazione automatica di feature dai referti clinici.
- Non si collega a sistemi di archiviazione e comunicazione di immagini mediche (PACS) o a cartelle cliniche elettroniche (EHR).

### Limiti di Generalizzabilità
- Le soglie e la logica sono derivate dagli studi forniti, che possono avere limiti di generalizzabilità (studi single-center, popolazioni selezionate).
- L'applicabilità a diversi contesti clinici (es. setting di emergenza vs follow-up programmato) va valutata caso per caso.

## 6. Prospettive Future

Il lavoro pone le basi per diversi sviluppi significativi, che potrebbero costituire il prosieguo naturale della tesi o progetti successivi:

### 6.1 Validazione Retrospettiva su Dati Reali
Se fossero disponibili dati clinici strutturati (es. da un registro locale di masse cardiache), si potrebbe:
- Calcolare DEM Score e CMR Mass Score su una coorte di pazienti.
- Confrontare le previsioni degli score con la diagnosi finale (istologia o risoluzione del trombo).
- Valutare metriche di performance (AUC, sensibilità, specificità) in una popolazione reale.
- Eseguire analisi di calibrazione per verificare se le probabilità stimate dagli score corrispondano alle frequenze osservate.

### 6.2 Sviluppo di un Modello ML Interpretabile
Partendo dai medesimi dati strutturati, si potrebbe:
- Addestrare modelli di machine learning (regressione logistica, random forest, gradient boosting) che combinino feature eco, CMR, TC e PET.
- Utilizzare tecniche di spiegabilità (SHAP, feature importance, modelli intrinsicamente interpretabili come EBM) per confrontare le predizioni dei modelli con gli score clinici.
- Valutare se un modello combinato migliora la performance diagnostica senza perdere interpretabilità.

### 6.3 Estrazione Automatica da Referti (NLP)
Un'ulteriore evoluzione sarebbe:
- Sviluppare modelli o regole per estrarre automaticamente le feature degli score dai referti testuali di ecocardiografia, CMR, TC e PET/TC.
- Valutare la qualità dell'estrazione (precision, recall, F1-score) rispetto a una annotazione manuale di riferimento.
- Utilizzare le feature estratte per popolare automaticamente il POC o un sistema di supporto decisionale più avanzato.

### 6.4 Sistema di Supporto Decisionale Completo
A lungo termine, si potrebbe immaginare:
- Un'integrazione con sistemi ospedalieri (PACS, EHR) per suggerire automaticamente il next step diagnostico all'atto del referto.
- Un'interfaccia che mostri non solo il punteggio, ma anche le immagini chiave, le misure rilevanti e i confronti temporali.
- Un modulo prognostico che, oltre alla diagnosi benigno/maligno, stimi il rischio di eventi avversi (mortalita, ricorrenza, necessità di re-intervento).

### 6.5 Studio Prospttico di Impatto Clinico
Infine, si potrebbe valutare l'impatto reale dello strumento sul percorso diagnostico:
- Misurare la riduzione di tempi di attesa per esami avanzati.
- Valutare la variazione nella proporzione di pazienti inviati direttamente a chirurgia, biopsia o follow-up.
- Raccogliere feedback qualitativo da cardiologi e radiologi sull'usabilità e l'utilità percepita.

## 7. Conclusioni

Il progetto ha dimostrato che, partendo da una solida comprensione del dominio clinico, è possibile sviluppare un proof of concept informatico che non si limita a ripetere meccanicamente formule, ma le interpreta e le restituisce in un formato utile per il processo decisionale clinico. Il POC realizzato rappresenta un punto di partenza solido per approcci più avanzati, fondati sulla validazione su dati reali, sull'apprendimento automatico spiegabile e sull'integrazione con i flussi lavoro clinici esistenti.

Il vero valore di un tale lavoro non sta tanto nel codice prodotto, quanto nella capacità di creare un ponte linguistico e concettuale tra due discipline—informatica e medicina—che spesso parlano lingue diverse ma condividono l'obiettivo ultimo di migliorare il percorso di cura del paziente.

---
*Documento creato il: $(date)*
*Ultimo aggiornamento: $(date)*