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

  if (echoPositive) evidence.push(`DEM Score >= ${DEM_CUTOFF} (score: ${demScore}/9).`)
  if (cmrPositive) evidence.push(`CMR Mass Score >= ${CMR_CUTOFF} (score: ${cmrScore}/8).`)
  if (data.cmrAvailable && data.echoAvailable && echoPositive && cmrNegative) {
    evidence.push('Echo-CMR discordance: DEM positive but CMR Mass Score below cutoff.')
  }
  if (ctLevel === 'high') evidence.push(`Cardiac CT/PET high-suspicion profile (CT signs: ${ctSigns}/8).`)
  if (ctLevel === 'gray') evidence.push(`Cardiac CT gray zone (CT signs: ${ctSigns}/8).`)
  if (ctDiscordant) evidence.push('CT/PET discordance: CT <= 2 signs but PET positive.')
  if (evidence.length === 0) evidence.push('No malignancy criterion identified.')

  // Modality statuses (defensive: guard against malformed data.echo === null with echoAvailable === true)
  const safeDemScore = demScore !== null ? `${demScore}/9` : 'N/A'
  const safeCmrScore = cmrScore !== null ? `${cmrScore}/8` : 'N/A'

  const echoStatus = data.echoAvailable
    ? (echoPositive ? `DEM positive (${safeDemScore})` : `DEM below cutoff (${safeDemScore})`)
    : 'Unavailable'
  const echoNote = data.echoAvailable
    ? (echoPositive ? 'Positive first-line imaging: advanced imaging is indicated.' : 'First-line imaging does not reach the malignancy cutoff.')
    : 'First-line imaging not entered.'

  const cmrStatus = data.cmrAvailable
    ? (cmrPositive ? `CMR Mass Score positive (${safeCmrScore})` : `CMR Mass Score below cutoff (${safeCmrScore})`)
    : 'Unavailable'
  const cmrNote = data.cmrAvailable
    ? (cmrPositive ? 'Dominant examination positive: integrates morphology and tissue characterization.' : 'Dominant examination below cutoff.')
    : 'Most comprehensive non-invasive examination after echocardiography.'

  let ctPetStatus = 'Unavailable'
  let ctPetNote = 'Alternative or complementary pathway.'
  if (data.ctpetAvailable) {
    if (ctLevel === 'high' && ctSigns >= 5) {
      ctPetStatus = `Cardiac CT high suspicion (${ctSigns}/8)`
      ctPetNote = 'At least 5 CT signs: strongly supports a malignant nature.'
    } else if (ctLevel === 'high' && ctSigns >= 3) {
      ctPetStatus = `CT gray zone + PET positive (${ctSigns}/8)`
      ctPetNote = 'PET shifts the gray-zone CT result toward malignancy.'
    } else if (ctLevel === 'gray') {
      ctPetStatus = petDataEntered ? `CT gray zone + PET negative (${ctSigns}/8)` : `CT gray zone (${ctSigns}/8)`
      ctPetNote = petDataEntered
        ? 'PET below cutoff: helps reclassify gray-zone cases toward benignity.'
        : 'CT with 3-4 signs requires PET/CT or CMR clarification.'
    } else if (ctLevel === 'discordant') {
      ctPetStatus = `CT/PET discordance (${ctSigns}/8)`
      ctPetNote = 'CT <= 2 signs but PET positive: this combination is not equivalent to the main algorithm.'
    } else if (ctSigns <= 2) {
      ctPetStatus = `Cardiac CT low suspicion (${ctSigns}/8)`
      ctPetNote = 'Two or fewer CT signs: malignancy is unlikely in the paper algorithm.'
    }
  }

  // Decision logic
  const anyExam = data.echoAvailable || data.cmrAvailable || data.ctpetAvailable

  let risk: ConsensusResult['risk'] = 'not'
  let title = 'Decision not evaluated'
  let subtitle = 'No examination available.'
  let explanation = 'Enter at least one examination to obtain an assessment.'
  let nextStep = 'Complete clinical/imaging input.'
  let integratedStatus = 'Awaiting input'
  let integratedNote = ''

  if (!anyExam) {
    // remains 'not'
  } else if (cmrPositive && echoPositive) {
    risk = 'high'
    title = 'Concordant high-suspicion echo-CMR'
    subtitle = 'DEM and CMR Mass Score are both above cutoff.'
    explanation = 'This combination follows the multimodality logic of the papers: echocardiography flags risk and CMR confirms with tissue characterization.'
    nextStep = 'Rapid Heart Team discussion; complete staging if the oncology context applies; consider biopsy or surgery if useful for management.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (cmrPositive) {
    risk = 'high'
    title = 'CMR-driven high suspicion'
    subtitle = 'CMR Mass Score above cutoff, even if echocardiography is not positive or unavailable.'
    explanation = 'When available, CMR is the most comprehensive non-invasive examination and outperforms echocardiography for diagnostic accuracy.'
    nextStep = 'Manage as high suspicion: Heart Team, staging/CT/PET if indicated, histological or therapeutic assessment.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctHigh && data.cmrAvailable && !cmrPositive) {
    risk = 'high'
    title = 'Discordance between advanced modalities'
    subtitle = 'CMR below cutoff but CT/PET meets high-suspicion criteria.'
    explanation = 'Discordance should not be resolved by adding scores together: review images, technical quality, and oncology context.'
    nextStep = 'Review CMR, CT, and PET collegially; consider Heart Team discussion and histological diagnosis.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctHigh) {
    risk = 'high'
    title = 'CT/PET-driven high suspicion'
    subtitle = 'CT/PET pathway positive according to the paper algorithm.'
    explanation = 'Cardiac CT and PET/CT provide complementary anatomic and metabolic evidence.'
    nextStep = 'Complete staging and discuss in Heart Team; consider CMR if useful for characterization.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (echoPositive && cmrNegative) {
    risk = 'mid'
    title = 'Echo-CMR discordance'
    subtitle = 'Echocardiography above cutoff, CMR below cutoff.'
    explanation = 'CMR lowers suspicion but does not automatically erase the echocardiographic signal.'
    nextStep = 'Reassess image quality and discordant features; consider CT/PET or follow-up.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (echoPositive) {
    risk = 'mid'
    title = 'Significant echocardiographic suspicion'
    subtitle = 'DEM Score above cutoff: second-level imaging is indicated.'
    explanation = 'Echocardiography is the first-line filter: if positive, CMR is needed for tissue characterization.'
    nextStep = 'Perform cardiac CMR if available. If CMR is not feasible, consider cardiac CT; PET/CT if CT is in the gray zone or in an oncology context.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctUnavailable && ctSigns >= 3) {
    risk = 'mid'
    title = 'Cardiac CT gray zone'
    subtitle = 'CT with 3-4 signs and PET unavailable.'
    explanation = 'CT with 3-4 signs is not sufficiently discriminative; PET/CT or CMR is required.'
    nextStep = 'Integrate with 18F-FDG PET/CT or reassess with CMR.'
    integratedStatus = title
    integratedNote = subtitle
  } else if (ctDiscordant) {
    risk = 'mid'
    title = 'Discordant CT/PET result'
    subtitle = 'PET positive with a low number of CT signs.'
    explanation = 'This combination should be reassessed in the clinical context and is not an automatic paper classification.'
    nextStep = 'Review PET quality/preparation, compare with CMR/CT, and discuss in Heart Team if suspicion remains high.'
    integratedStatus = title
    integratedNote = subtitle
  } else {
    risk = 'low'
    title = 'Low suspicion with available data'
    subtitle = data.cmrAvailable
      ? 'CMR below cutoff and no positive advanced-imaging evidence.'
      : 'No malignancy cutoff exceeded.'
    explanation = 'The available features do not reach the thresholds proposed by the studies.'
    nextStep = 'If the clinical picture is consistent with benignity or thrombus, manage according to clinical suspicion. Consider follow-up or advanced imaging if the report is inconclusive.'
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
