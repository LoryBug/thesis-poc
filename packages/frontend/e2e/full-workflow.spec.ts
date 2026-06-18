import { test, expect, type Page } from '@playwright/test'

const newCaseBtn = (page: Page) =>
  page.getByRole('button', { name: 'New Evaluation', exact: true }).last()

const echoSection = (page: Page) =>
  page.locator('[data-exam-card="echo"]')

const cmrSection = (page: Page) =>
  page.locator('[data-exam-card="cmr"]')

const ctpetSection = (page: Page) =>
  page.locator('[data-exam-card="ctpet"]')

const scoreNumber = (section: ReturnType<typeof echoSection>, score: string) =>
  section.locator('.cm-score-number', { hasText: score })

async function acceptDisclaimer(page: Page) {
  const button = page.getByRole('button', { name: 'I understand, continue' })
  if (await button.isVisible().catch(() => false)) {
    await button.click()
  }
}

test.describe('Complete clinical workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await acceptDisclaimer(page)
  })

  test('Empty dashboard shows initial message', async ({ page }) => {
    await expect(page.getByText('No saved evaluations.')).toBeVisible()
    await expect(newCaseBtn(page)).toBeVisible()
  })

  test('Navigation to New Evaluation shows the three panels', async ({ page }) => {
    await newCaseBtn(page).click()
    await expect(page.getByRole('heading', { name: /Echocardiography.*DEM.*Score/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cardiac magnetic resonance - CMR Mass Score' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Cardiac CT and 18F-FDG PET/CT' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Demo / Import Tools' })).toBeVisible()
    await expect(page.getByText('Case metadata')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Why this output?' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save evaluation' })).toBeVisible()
  })

  test('Explainability Guide shows the visual methodology', async ({ page }) => {
    await page.getByRole('button', { name: 'Guide' }).click()
    await expect(page.getByRole('heading', { name: 'How the CDSS reaches and explains an output' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CDSS pipeline' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Traceability chain' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Validation pyramid' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Golden case coverage' })).toBeVisible()
  })

  test('Imports a case JSON file into the evaluation form', async ({ page }) => {
    await newCaseBtn(page).click()

    await page.getByLabel('Case JSON file').setInputFiles({
      name: 'gc-04.cm-dss.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({
        metadata: {
          caseId: 'GC-04-IMPORT',
          clinicalContext: 'Suspected cardiac mass',
          location: 'Unspecified',
          note: 'Imported CMR-driven high suspicion',
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
      })),
    })

    await expect(page.getByLabel('Case / patient ID')).toHaveValue('GC-04-IMPORT')
    await expect(scoreNumber(cmrSection(page), '5/8')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CMR-driven high suspicion' })).toBeVisible()
    await expect(page.getByText(/Imported and saved GC-04-IMPORT/)).toBeVisible()
  })

  test('Loads a synthetic golden case into the evaluation form', async ({ page }) => {
    await newCaseBtn(page).click()

    await page.getByLabel('Golden case').selectOption('GC-04')
    await page.getByRole('button', { name: 'Load synthetic case' }).click()

    await expect(page.getByLabel('Case / patient ID')).toHaveValue('GC-04')
    await expect(scoreNumber(cmrSection(page), '5/8')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'CMR-driven high suspicion' })).toBeVisible()
    await page.getByRole('heading', { name: 'Why this output?' }).click()
    await expect(page.getByText('CMR Mass Score above cutoff', { exact: true }).first()).toBeVisible()
  })

  test('Complete flow: fill, evaluate, save, and verify', async ({ page }) => {
    await newCaseBtn(page).click()

    // Echo: 3 features -> 6/9, positive.
    await echoSection(page).getByText('Echocardiography available').click()
    await echoSection(page).getByText('Infiltration').click()
    await echoSection(page).getByText('Polylobate mass').click()
    await echoSection(page).getByText('Pericardial effusion').click()
    await expect(scoreNumber(echoSection(page), '6/9')).toBeVisible()
    await expect(echoSection(page).getByText('Positive')).toBeVisible()

    // CMR: infiltration(2)+first-pass perfusion(2)+pericardial effusion(1)+sessile(1)=6/8, positive.
    await cmrSection(page).getByText('CMR available').click()
    await cmrSection(page).getByText('Infiltration').click()
    await cmrSection(page).getByText('First-pass contrast perfusion').click()
    await cmrSection(page).getByText('Pericardial effusion').click()
    await cmrSection(page).getByText('Sessile appearance').click()
    await expect(scoreNumber(cmrSection(page), '6/8')).toBeVisible()
    await expect(cmrSection(page).getByText('Positive')).toBeVisible()

    // CT/PET: 4 signs + SUVmax 7.5 -> high suspicion.
    await ctpetSection(page).getByText('CT/PET available').click()
    await ctpetSection(page).getByText('Irregular margins').click()
    await ctpetSection(page).getByText('Invasion').click()
    await ctpetSection(page).getByText('Solid nature').click()
    await ctpetSection(page).getByText('Calcifications').click()
    await expect(scoreNumber(ctpetSection(page), '4/8')).toBeVisible()
    await ctpetSection(page).getByPlaceholder('>= 4.9').fill('7.5')

    // Live result -> both echo and CMR are positive.
    await expect(page.getByRole('heading', { name: 'Concordant high-suspicion echo-CMR' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Why this output?' })).toBeVisible()
    await page.getByRole('heading', { name: 'Why this output?' }).click()
    await expect(page.getByText('Activated rules', { exact: true })).toBeVisible()
    await expect(page.getByText('Save evaluation')).toBeVisible()

    // Save -> Dashboard with saved case.
    await page.getByRole('button', { name: 'Save evaluation' }).click()
    await expect(page.getByText(/Evaluation on/)).toBeVisible()
    await expect(page.getByText('Concordant high-suspicion echo-CMR')).toBeVisible()
  })

  test('Saves and views case detail', async ({ page }) => {
    await newCaseBtn(page).click()
    await echoSection(page).getByText('Echocardiography available').click()
    await echoSection(page).getByText('Infiltration').click()
    await echoSection(page).getByText('Pericardial effusion').click()
    await cmrSection(page).getByText('CMR available').click()
    await cmrSection(page).getByText('Infiltration').click()
    await ctpetSection(page).getByText('CT/PET available').click()
    await ctpetSection(page).getByText('Irregular margins').click()

    await page.getByRole('button', { name: 'Save evaluation' }).click()

    await page.getByRole('button', { name: 'Details' }).click()
    await expect(page.getByRole('heading', { name: 'Evaluation Detail' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Case JSON' })).toBeVisible()
    await expect(page.getByText('Explanation')).toBeVisible()
    await expect(page.getByText('Next step', { exact: true })).toBeVisible()
    await expect(page.getByText('Evidence', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Clinical Traceability' })).toBeVisible()
    await page.getByText('Original imaging data').click()
    await expect(page.locator('pre')).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download case JSON' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.cm-dss\.json$/)
  })

  test('Deletes case from Dashboard', async ({ page }) => {
    await newCaseBtn(page).click()
    await echoSection(page).getByText('Echocardiography available').click()
    await echoSection(page).getByText('Infiltration').click()
    await cmrSection(page).getByText('CMR available').click()
    await cmrSection(page).getByText('Infiltration').click()

    await page.getByRole('button', { name: 'Save evaluation' }).click()
    await expect(page.getByText(/Evaluation on/)).toBeVisible()

    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText(/Evaluation on/)).not.toBeVisible()
    await expect(page.getByText('No saved evaluations.')).toBeVisible()
  })

  test('Import JSON auto-saves to dashboard', async ({ page }) => {
    await newCaseBtn(page).click()

    await page.getByLabel('Case JSON file').setInputFiles({
      name: 'gc-04.cm-dss.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({
        metadata: { caseId: 'GC-04-IMPORT', clinicalContext: 'Suspected cardiac mass', location: 'Unspecified', note: 'Auto-save test' },
        imagingData: {
          echoAvailable: false, echo: null,
          cmrAvailable: true,
          cmr: { infiltration: true, firstPassPerfusion: true, pericardialEffusion: false, sessile: false, polylobated: false, heterogeneousEnhancement: true },
          ctpetAvailable: false, ct: null, pet: null,
        },
      })),
    })

    await expect(page.getByText(/Imported and saved/)).toBeVisible()

    // Navigate to Home and verify case persisted
    await page.getByRole('navigation').getByRole('button', { name: 'Dashboard' }).click()
    await expect(page.getByText('GC-04-IMPORT')).toBeVisible()
  })

  test('PET warning on clinically unusual value', async ({ page }) => {
    await newCaseBtn(page).click()
    await ctpetSection(page).getByText('CT/PET available').click()

    const suvInput = ctpetSection(page).getByPlaceholder('>= 4.9')
    await suvInput.fill('55')

    await expect(ctpetSection(page).getByText(/Valore insolitamente alto/)).toBeVisible()
  })

  test('Decision path visible in consensus panel', async ({ page }) => {
    await newCaseBtn(page).click()

    await echoSection(page).getByText('Echocardiography available').click()
    await echoSection(page).getByText('Infiltration').click()
    await echoSection(page).getByText('Polylobate mass').click()
    await echoSection(page).getByText('Pericardial effusion').click()

    await cmrSection(page).getByText('CMR available').click()
    await cmrSection(page).getByText('Infiltration').click()
    await cmrSection(page).getByText('First-pass contrast perfusion').click()
    await cmrSection(page).getByText('Pericardial effusion').click()
    await cmrSection(page).getByText('Sessile appearance').click()

    // Echo 6/9 positive, CMR 6/8 positive -> concordant-high-echo-cmr
    await expect(page.getByRole('heading', { name: 'Concordant high-suspicion echo-CMR' })).toBeVisible()
    await expect(page.locator('.cm-decision').getByText('concordant-high-echo-cmr', { exact: true })).toBeVisible()
  })
})
