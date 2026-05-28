import { useCaseStore } from '../stores/case.store'
import { RiskPill } from './ui/RiskPill'

const clinicalContexts = [
  'Suspected cardiac mass',
  'Incidental finding',
  'Oncology patient',
  'Suspected thrombus',
  'Suspected endocarditis',
]

const locations = [
  'Unspecified',
  'Left chambers',
  'Right chambers',
  'Pericardium',
  'Great vessels',
]

export function CaseMetadataCard() {
  const metadata = useCaseStore((s) => s.metadata)
  const setMetadataField = useCaseStore((s) => s.setMetadataField)

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Case data</h2>
          <p>Optional fields used to generate a concise copyable report.</p>
        </div>
        <RiskPill>Clinical input</RiskPill>
      </div>

      <div className="cm-form-grid">
        <label className="cm-field">
          Case / patient ID
          <input
            className="cm-input"
            value={metadata.caseId}
            onChange={(event) => setMetadataField('caseId', event.target.value)}
            placeholder="e.g. CM-001"
          />
        </label>

        <label className="cm-field">
          Clinical context
          <select
            className="cm-select"
            value={metadata.clinicalContext}
            onChange={(event) => setMetadataField('clinicalContext', event.target.value)}
          >
            {clinicalContexts.map((context) => <option key={context}>{context}</option>)}
          </select>
        </label>

        <label className="cm-field">
          Predominant location
          <select
            className="cm-select"
            value={metadata.location}
            onChange={(event) => setMetadataField('location', event.target.value)}
          >
            {locations.map((location) => <option key={location}>{location}</option>)}
          </select>
        </label>

        <label className="cm-field">
          Quick note
          <input
            className="cm-input"
            value={metadata.note}
            onChange={(event) => setMetadataField('note', event.target.value)}
            placeholder="e.g. right atrial mass, NYHA III dyspnea"
          />
        </label>
      </div>
    </article>
  )
}
