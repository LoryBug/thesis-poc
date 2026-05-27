import type { ImagingData } from '../types'
import { calculateDemScore, DEM_CUTOFF } from '../scores/dem-score'
import { calculateCmrScore, CMR_CUTOFF } from '../scores/cmr-score'
import { calculateCtSigns, evaluatePet, ctPetLevel } from '../scores/ct-pet'
import type { ConsensusResult } from './types'

export type { ConsensusResult }

export function evaluateConsensus(data: ImagingData): ConsensusResult {
  const echoPositive = data.echoAvailable && data.echo !== null && calculateDemScore(data.echo) >= DEM_CUTOFF
  const cmrPositive = data.cmrAvailable && data.cmr !== null && calculateCmrScore(data.cmr) >= CMR_CUTOFF
  const cmrNegative = data.cmrAvailable && data.cmr !== null && !cmrPositive
  const demScore = data.echoAvailable && data.echo !== null ? calculateDemScore(data.echo) : null
  const cmrScore = data.cmrAvailable && data.cmr !== null ? calculateCmrScore(data.cmr) : null

  const petDataEntered = data.pet !== null && (data.pet.suvMax !== null || data.pet.mtv !== null || data.pet.tlg !== null)
  const ctSigns = data.ctpetAvailable && data.ct !== null ? calculateCtSigns(data.ct) : 0
  const petPositive = petDataEntered ? evaluatePet(data.pet!) : false
  const ctLevel = data.ctpetAvailable ? ctPetLevel(ctSigns, petPositive, petDataEntered) : 'unavailable'
  const ctHigh = ctLevel === 'high'
  const ctGray = ctLevel === 'gray'
  const ctDiscordant = ctLevel === 'discordant'
  const ctUnavailable = ctLevel === 'unavailable'

  const evidence: string[] = []

  if (echoPositive) evidence.push(`DEM Score >= ${DEM_CUTOFF} (punteggio: ${demScore}/9).`)
  if (cmrPositive) evidence.push(`CMR Mass Score >= ${CMR_CUTOFF} (punteggio: ${cmrScore}/8).`)
  if (data.cmrAvailable && data.echoAvailable && echoPositive && cmrNegative) {
    evidence.push('Discordanza eco-CMR: DEM positivo ma CMR Mass Score sotto cutoff.')
  }
  if (ctLevel === 'high') evidence.push(`TC/PET ad alto sospetto (segni TC: ${ctSigns}/8).`)
  if (ctLevel === 'gray') evidence.push(`TC in zona grigia (segni TC: ${ctSigns}/8).`)
  if (ctDiscordant) evidence.push(`Discordanza TC/PET: TC <= 2 segni ma PET patologica.`)
  if (evidence.length === 0) evidence.push('Nessun criterio di malignita identificato.')

  // Modality statuses (defensive: guard against malformed data.echo === null with echoAvailable === true)
  const safeDemScore = demScore !== null ? `${demScore}/9` : 'N/A'
  const safeCmrScore = cmrScore !== null ? `${cmrScore}/8` : 'N/A'

  const echoStatus = data.echoAvailable
    ? (echoPositive ? `DEM positivo (${safeDemScore})` : `DEM sotto cutoff (${safeDemScore})`)
    : 'Non disponibile'
  const echoNote = data.echoAvailable
    ? (echoPositive ? 'Primo livello positivo: indica approfondimento con imaging avanzato.' : 'Primo livello senza cutoff di malignita.')
    : 'Primo livello non inserito.'

  const cmrStatus = data.cmrAvailable
    ? (cmrPositive ? `CMR Mass Score positivo (${safeCmrScore})` : `CMR Mass Score sotto cutoff (${safeCmrScore})`)
    : 'Non disponibile'
  const cmrNote = data.cmrAvailable
    ? (cmrPositive ? 'Esame dominante positivo: integra morfologia e caratterizzazione tissutale.' : 'Esame dominante sotto cutoff.')
    : 'Esame non invasivo piu completo dopo ecocardiografia.'

  let ctPetStatus = 'Non disponibile'
  let ctPetNote = 'Percorso alternativo/complementare.'
  if (data.ctpetAvailable) {
    if (ctLevel === 'high' && ctSigns >= 5) {
      ctPetStatus = `TC ad alto sospetto (${ctSigns}/8)`
      ctPetNote = 'Almeno 5 segni TC: identifica fortemente natura maligna.'
    } else if (ctLevel === 'high' && ctSigns >= 3) {
      ctPetStatus = `TC zona grigia + PET positiva (${ctSigns}/8)`
      ctPetNote = 'PET risolve la zona grigia verso malignita.'
    } else if (ctLevel === 'gray') {
      ctPetStatus = petDataEntered ? `Zona grigia TC + PET negativa (${ctSigns}/8)` : `Zona grigia TC (${ctSigns}/8)`
      ctPetNote = petDataEntered
        ? 'PET sotto cutoff: aiuta a riclassificare i casi grigi verso benignita.'
        : 'TC 3-4 segni: serve PET/TC o CMR per chiarire.'
    } else if (ctLevel === 'discordant') {
      ctPetStatus = `Discordanza TC/PET (${ctSigns}/8)`
      ctPetNote = 'TC <=2 segni ma PET positiva: combinazione non equivalente all\'algoritmo principale.'
    } else if (ctSigns <= 2) {
      ctPetStatus = `TC a basso sospetto (${ctSigns}/8)`
      ctPetNote = 'Due o meno segni TC: malignita improbabile nel paper.'
    }
  }

  // Decision logic
  const anyExam = data.echoAvailable || data.cmrAvailable || data.ctpetAvailable

  let risk: ConsensusResult['risk'] = 'not'
  let title = 'Decisione non valutata'
  let subtitle = 'Nessun esame disponibile.'
  let explanation = 'Inserire almeno un esame per ottenere una valutazione.'
  let nextStep = 'Completare input clinico-imaging.'
  let integratedStatus = 'In attesa di input'
  let integratedNote = ''

  if (!anyExam) {
    // remains 'not'
  } else if (cmrPositive && echoPositive) {
    risk = 'high'
    title = 'Concordanza eco-CMR ad alto sospetto'
    subtitle = 'DEM e CMR Mass Score sono entrambi sopra cutoff.'
    explanation = 'La combinazione e coerente con la logica multimodale dei paper: l\'eco segnala il rischio e la CMR conferma con caratterizzazione tissutale.'
    nextStep = 'Discussione rapida in Heart Team; completare staging se contesto oncologico; valutare biopsia/chirurgia se utile alla gestione.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (cmrPositive) {
    risk = 'high'
    title = 'Alto sospetto guidato da CMR'
    subtitle = 'CMR Mass Score sopra cutoff, anche se eco non positiva o non disponibile.'
    explanation = 'Quando disponibile, la CMR e l\'esame non invasivo piu completo e supera l\'ecocardiografia per accuratezza diagnostica.'
    nextStep = 'Gestire come alto sospetto: Heart Team, staging/TC/PET se indicati, valutazione istologica o terapeutica.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctHigh && data.cmrAvailable && !cmrPositive) {
    risk = 'high'
    title = 'Discordanza tra metodiche avanzate'
    subtitle = 'CMR sotto cutoff ma TC/PET con criteri di alto sospetto.'
    explanation = 'La discordanza non va risolta con una somma di score: va rivalutata su immagini, qualita tecnica e contesto oncologico.'
    nextStep = 'Rivedere collegialmente CMR, TC e PET; considerare Heart Team e diagnosi istologica.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctHigh) {
    risk = 'high'
    title = 'Alto sospetto guidato da TC/PET'
    subtitle = 'Percorso TC/PET positivo secondo algoritmo del paper.'
    explanation = 'TC e PET/TC forniscono evidenza anatomica e metabolica complementare.'
    nextStep = 'Completare staging e discutere in Heart Team; considerare CMR se utile per caratterizzazione.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (echoPositive && cmrNegative) {
    risk = 'mid'
    title = 'Discordanza eco-CMR'
    subtitle = 'Eco sopra cutoff, CMR sotto cutoff.'
    explanation = 'La CMR riduce il sospetto ma non cancella automaticamente il segnale ecocardiografico.'
    nextStep = 'Rivalutare qualita delle immagini e feature discordanti; considerare TC/PET o follow-up.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (echoPositive) {
    risk = 'mid'
    title = 'Sospetto ecocardiografico significativo'
    subtitle = 'DEM Score sopra cutoff: indicato imaging di secondo livello.'
    explanation = 'L\'ecocardiografia e il primo filtro: se positiva, serve CMR per caratterizzazione tissutale.'
    nextStep = 'Eseguire CMR cardiaca se disponibile. Se CMR non fattibile, considerare TC cardiaca; PET/TC se TC in zona grigia o contesto oncologico.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctUnavailable && ctSigns >= 3) {
    risk = 'mid'
    title = 'Zona grigia TC'
    subtitle = 'TC con 3-4 segni e PET non disponibile.'
    explanation = 'TC 3-4 segni non discrimina in modo sufficiente; serve PET/TC o CMR.'
    nextStep = 'Integrare con PET/TC 18F-FDG oppure rivalutare con CMR.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctDiscordant) {
    risk = 'mid'
    title = 'Risultato TC/PET discordante'
    subtitle = 'PET patologica con basso numero di segni TC.'
    explanation = 'Combinazione da rivalutare nel contesto clinico, non classificazione automatica del paper.'
    nextStep = 'Rivedere qualita/preparazione PET, confrontare con CMR/TC e discutere in Heart Team se il sospetto resta elevato.'
    integratedStatus = title
    integratedNote = subtitle
  } else {
    risk = 'low'
    title = 'Basso sospetto con dati disponibili'
    subtitle = data.cmrAvailable
      ? 'CMR sotto cutoff e nessuna evidenza avanzata positiva.'
      : 'Nessun cutoff di malignita superato.'
    explanation = 'Le feature disponibili non raggiungono le soglie proposte dagli studi.'
    nextStep = 'Se il quadro clinico e coerente con benignita/trombo, gestire secondo sospetto clinico. Considerare follow-up o imaging avanzato se referto non conclusivo.'
    integratedStatus = title
    integratedNote = subtitle
  }

  return {
    risk,
    title,
    subtitle,
    explanation,
    nextStep,
    evidence,
    modalities: {
      echo: { status: echoStatus, note: echoNote },
      cmr: { status: cmrStatus, note: cmrNote },
      ctPet: { status: ctPetStatus, note: ctPetNote },
    },
    integrated: { status: integratedStatus, note: integratedNote },
  }
}
