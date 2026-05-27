import type { RiskLevel } from '../types'

export interface ModalityStatus {
  status: string
  note: string
}

export interface ConsensusResult {
  risk: RiskLevel
  title: string
  subtitle: string
  explanation: string
  nextStep: string
  evidence: string[]
  modalities: {
    echo: ModalityStatus
    cmr: ModalityStatus
    ctPet: ModalityStatus
  }
  integrated: ModalityStatus
}
