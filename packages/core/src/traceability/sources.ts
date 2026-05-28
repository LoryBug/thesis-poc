import type { TraceSource } from './types'

export const TRACE_SOURCES = {
  demScore: {
    id: 'paolisso_2022_dem_score',
    title: 'Diagnostic Echocardiographic Mass (DEM) Score',
    citation: 'Paolisso et al., Development and Validation of a Diagnostic Echocardiographic Mass Score in the Approach to Cardiac Masses, JACC Cardiovascular Imaging, 2022.',
    year: 2022,
  },
  ctPet: {
    id: 'dangelo_2020_ct_pet',
    title: 'Cardiac CT and 18F-FDG PET/CT for cardiac masses',
    citation: "D'Angelo et al., Diagnostic Accuracy of Cardiac Computed Tomography and 18F-FDG Positron Emission Tomography in Cardiac Masses, JACC Cardiovascular Imaging, 2020.",
    year: 2020,
  },
  cmrMassScore: {
    id: 'paolisso_2024_cmr_mass_score',
    title: 'CMR Mass Score',
    citation: 'Paolisso et al., Cardiac Magnetic Resonance to Predict Cardiac Mass Malignancy: The CMR Mass Score, Circulation: Cardiovascular Imaging, 2024.',
    year: 2024,
  },
  multimodality: {
    id: 'angeli_2022_multimodality_context',
    title: 'Multimodality diagnostic approach to cardiac masses',
    citation: 'Angeli et al., multimodality framing and diagnostic pathway for cardiac masses, 2022.',
    year: 2022,
  },
} satisfies Record<string, TraceSource>
