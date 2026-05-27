export interface ModalityStatus {
  status: string
  note: string
}

export interface ConsensusResult {
  risk: 'low' | 'mid' | 'high' | 'not'
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
