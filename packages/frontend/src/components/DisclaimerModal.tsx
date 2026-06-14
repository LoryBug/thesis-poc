import { useState } from 'react'

const DISCLAIMER_KEY = 'cm-dss-disclaimer-v1'

export function DisclaimerModal() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(DISCLAIMER_KEY))

  if (!visible) return null

  function accept() {
    localStorage.setItem(DISCLAIMER_KEY, '1')
    setVisible(false)
  }

  return (
    <div className="cm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div className="cm-modal">
        <h2 id="disclaimer-title">Research Prototype</h2>
        <p>
          This application is a <strong>proof-of-concept</strong> developed for research purposes
          at the University of Bologna. It must not be used as the sole basis for clinical decisions.
        </p>
        <ul>
          <li>Does <strong>not</strong> replace clinical judgment, specialist reporting, or Heart Team discussion</li>
          <li>Thresholds are derived from published literature (Paolisso et al., D'Angelo et al.)</li>
          <li>All data stays on this device — nothing is transmitted externally</li>
        </ul>
        <button type="button" className="cm-button" onClick={accept} autoFocus>
          I understand, continue
        </button>
      </div>
    </div>
  )
}
