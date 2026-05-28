import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { EvaluationToolsCard } from './EvaluationToolsCard'
import { useCaseStore } from '../stores/case.store'

describe('EvaluationToolsCard', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('loads the selected synthetic case into the current form state', () => {
    render(<EvaluationToolsCard />)

    fireEvent.change(screen.getByLabelText('Golden case'), { target: { value: 'GC-04' } })
    fireEvent.click(screen.getByRole('button', { name: 'Load synthetic case' }))

    const state = useCaseStore.getState()
    expect(state.metadata.caseId).toBe('GC-04')
    expect(state.cmrAvailable).toBe(true)
    expect(state.cmr.infiltration).toBe(true)
    expect(state.cmr.firstPassPerfusion).toBe(true)
    expect(state.echoAvailable).toBe(false)
  })

  it('imports a case JSON file into the current form state', async () => {
    render(<EvaluationToolsCard />)

    const content = JSON.stringify({
      metadata: {
        caseId: 'JSON-01',
        clinicalContext: 'Suspected cardiac mass',
        location: 'Unspecified',
        note: 'Imported test case',
      },
      imagingData: {
        echoAvailable: false,
        echo: null,
        cmrAvailable: true,
        cmr: {
          infiltration: true,
          firstPassPerfusion: true,
          pericardialEffusion: false,
          sessile: false,
          polylobated: false,
          heterogeneousEnhancement: true,
        },
        ctpetAvailable: false,
        ct: null,
        pet: null,
      },
    })
    const file = new File([content], 'case.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: async () => content })

    fireEvent.change(screen.getByLabelText('Case JSON file'), { target: { files: [file] } })
    expect(await screen.findByText(/Imported JSON-01/)).toBeVisible()

    const state = useCaseStore.getState()
    expect(state.metadata.caseId).toBe('JSON-01')
    expect(state.cmrAvailable).toBe(true)
    expect(state.cmr.infiltration).toBe(true)
  })
})
