import { useCaseStore } from '../stores/case.store'
import { RiskPill } from './ui/RiskPill'

const clinicalContexts = [
  'Sospetta massa cardiaca',
  'Riscontro incidentale',
  'Paziente oncologico',
  'Sospetto trombo',
  'Sospetta endocardite',
]

const locations = [
  'Non specificata',
  'Camere sinistre',
  'Camere destre',
  'Pericardio',
  'Grossi vasi',
]

export function CaseMetadataCard() {
  const metadata = useCaseStore((s) => s.metadata)
  const setMetadataField = useCaseStore((s) => s.setMetadataField)

  return (
    <article className="cm-card">
      <div className="cm-card-header">
        <div className="cm-card-title">
          <h2>Dati del caso</h2>
          <p>Campi opzionali per generare un report sintetico copiabile.</p>
        </div>
        <RiskPill>Input clinico</RiskPill>
      </div>

      <div className="cm-form-grid">
        <label className="cm-field">
          ID caso / paziente
          <input
            className="cm-input"
            value={metadata.caseId}
            onChange={(event) => setMetadataField('caseId', event.target.value)}
            placeholder="Es. CM-001"
          />
        </label>

        <label className="cm-field">
          Contesto clinico
          <select
            className="cm-select"
            value={metadata.clinicalContext}
            onChange={(event) => setMetadataField('clinicalContext', event.target.value)}
          >
            {clinicalContexts.map((context) => <option key={context}>{context}</option>)}
          </select>
        </label>

        <label className="cm-field">
          Localizzazione prevalente
          <select
            className="cm-select"
            value={metadata.location}
            onChange={(event) => setMetadataField('location', event.target.value)}
          >
            {locations.map((location) => <option key={location}>{location}</option>)}
          </select>
        </label>

        <label className="cm-field">
          Nota rapida
          <input
            className="cm-input"
            value={metadata.note}
            onChange={(event) => setMetadataField('note', event.target.value)}
            placeholder="Es. massa atriale destra, dispnea NYHA III"
          />
        </label>
      </div>
    </article>
  )
}
