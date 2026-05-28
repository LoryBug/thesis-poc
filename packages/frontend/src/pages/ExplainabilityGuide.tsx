const pipelineSteps = [
  { title: 'Structured findings', detail: 'Echo, CMR, cardiac CT, and 18F-FDG PET/CT inputs are entered as explicit features.' },
  { title: 'Score layer', detail: 'DEM Score, CMR Mass Score, CT sign count, and PET thresholds are calculated deterministically.' },
  { title: 'Consensus engine', detail: 'Priority-ordered workflow rules handle concordance, discordance, gray zones, and missing data.' },
  { title: 'Traceable output', detail: 'The app shows the decision, supporting evidence, missing data, sources, report, and JSON export.' },
]

const traceSteps = [
  'Observed feature',
  'Score contribution',
  'Cutoff comparison',
  'Activated rule',
  'Clinical source',
  'Recommendation',
]

const validationLayers = [
  { title: 'E2E workflow', detail: 'Browser-level validation of dashboard, new evaluation, save, detail, report, import, export, and delete.' },
  { title: 'Component tests', detail: 'UI behavior for panels, forms, traceability, and helper tools.' },
  { title: 'Golden cases', detail: 'Synthetic scenarios GC-00 to GC-09 covering missing data, low suspicion, concordance, discordance, and CT/PET gray zones.' },
  { title: 'Core logic', detail: 'Unit tests for score algorithms, PET thresholds, consensus rules, and traceability construction.' },
]

const coverageRows = [
  ['GC-00', 'M', 'M', 'M', 'M', 'Empty-state behavior'],
  ['GC-03', '+', '+', 'M', 'M', 'Echo-CMR concordance'],
  ['GC-05', '+', '- / D', 'M', 'M', 'Echo-CMR discordance'],
  ['GC-07', 'M', 'M', 'G', '+', 'PET clarification of CT gray zone'],
  ['GC-09', 'M', '- / D', '+', '+', 'Advanced-modality discordance'],
]

export function ExplainabilityGuide() {
  return (
    <div className="cm-page">
      <section className="cm-hero">
        <div className="cm-hero-main">
          <div className="cm-eyebrow">Explainability Guide</div>
          <h1 className="cm-title-xl">How the CDSS reaches and explains an output</h1>
          <p className="cm-lead">
            Visual guide to the deterministic pipeline, traceability model, and validation approach used by this prototype.
          </p>
        </div>
        <aside className="cm-hero-side">
          <div className="cm-status-panel">
            <div className="cm-status-label">Scope</div>
            <div className="cm-status-value">Functional validation</div>
            <div className="cm-status-subtitle">Not a clinical performance claim.</div>
          </div>
          <p className="cm-decision-text">
            Use this page as an orientation layer. For a specific case, the operational explanation remains the live <strong>Why this output?</strong> panel and saved-case clinical traceability.
          </p>
        </aside>
      </section>

      <section className="cm-stack">
        <article className="cm-card">
          <div className="cm-card-header">
            <div className="cm-card-title">
              <h2>CDSS pipeline</h2>
              <p>From structured imaging findings to a traceable recommendation.</p>
            </div>
          </div>
          <div className="cm-guide-flow" aria-label="CDSS pipeline diagram">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="cm-guide-node">
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="cm-card">
          <div className="cm-card-header">
            <div className="cm-card-title">
              <h2>Traceability chain</h2>
              <p>Each output should be reconstructable from feature to recommendation.</p>
            </div>
          </div>
          <div className="cm-trace-flow" aria-label="Traceability chain diagram">
            {traceSteps.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </article>

        <section className="cm-guide-grid">
          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>Validation pyramid</h2>
                <p>Different layers validate different failure modes.</p>
              </div>
            </div>
            <div className="cm-validation-pyramid" aria-label="Validation pyramid diagram">
              {validationLayers.map((layer) => (
                <div key={layer.title}>
                  <strong>{layer.title}</strong>
                  <small>{layer.detail}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="cm-card">
            <div className="cm-card-header">
              <div className="cm-card-title">
                <h2>Golden case coverage</h2>
                <p>Representative synthetic scenarios used for regression and screenshots.</p>
              </div>
            </div>
            <div className="cm-coverage-table" role="table" aria-label="Golden case coverage matrix">
              <div role="row" className="cm-coverage-head">
                <span>Case</span>
                <span>Echo</span>
                <span>CMR</span>
                <span>CT</span>
                <span>PET</span>
                <span>Target</span>
              </div>
              {coverageRows.map(([id, echo, cmr, ct, pet, target]) => (
                <div role="row" key={id}>
                  <span>{id}</span>
                  <span>{echo}</span>
                  <span>{cmr}</span>
                  <span>{ct}</span>
                  <span>{pet}</span>
                  <span>{target}</span>
                </div>
              ))}
            </div>
            <p className="cm-score-note">Legend: + positive evidence, - below cutoff, G gray zone, M missing, D discordance.</p>
          </article>
        </section>

        <article className="cm-card cm-disclaimer">
          <strong>Interpretation boundary</strong><br />
          These diagrams explain deterministic software behavior. They do not report clinical sensitivity, specificity, AUC, or real-world diagnostic performance.
        </article>
      </section>
    </div>
  )
}
