import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SyntheticCaseLoader } from './SyntheticCaseLoader'
import { useCaseStore } from '../stores/case.store'

describe('SyntheticCaseLoader', () => {
  beforeEach(() => {
    useCaseStore.getState().reset()
  })

  it('loads the selected synthetic case into the current form state', () => {
    render(<SyntheticCaseLoader />)

    fireEvent.change(screen.getByLabelText('Golden case'), { target: { value: 'GC-04' } })
    fireEvent.click(screen.getByRole('button', { name: 'Load synthetic case' }))

    const state = useCaseStore.getState()
    expect(state.metadata.caseId).toBe('GC-04')
    expect(state.cmrAvailable).toBe(true)
    expect(state.cmr.infiltration).toBe(true)
    expect(state.cmr.firstPassPerfusion).toBe(true)
    expect(state.echoAvailable).toBe(false)
  })
})
