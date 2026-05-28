import { test, expect, type Page } from '@playwright/test'

const newCaseBtn = (page: Page) =>
  page.getByRole('button', { name: 'Nuova Valutazione', exact: true }).last()

const echoSection = (page: Page) =>
  page.getByText('Ecocardiografia (DEM Score)').locator('..').locator('..')

const cmrSection = (page: Page) =>
  page.getByText('Risonanza Magnetica (CMR Mass Score)').locator('..').locator('..')

const ctpetSection = (page: Page) =>
  page.getByText('TC / PET-TC').locator('..').locator('..')

test.describe('Flusso clinico completo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Dashboard vuota mostra messaggio iniziale', async ({ page }) => {
    await expect(page.getByText('Nessuna valutazione salvata.')).toBeVisible()
    await expect(newCaseBtn(page)).toBeVisible()
  })

  test('Navigazione a Nuova Valutazione mostra i tre pannelli', async ({ page }) => {
    await newCaseBtn(page).click()
    await expect(page.getByText('Ecocardiografia (DEM Score)')).toBeVisible()
    await expect(page.getByText('Risonanza Magnetica (CMR Mass Score)')).toBeVisible()
    await expect(page.getByText('TC / PET-TC')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Esegui Valutazione' })).toBeVisible()
  })

  test('Flusso completo: compila, esegui, salva e verifica', async ({ page }) => {
    await newCaseBtn(page).click()

    // Echo: 3 features → 6/9, POSITIVO
    await echoSection(page).getByText('Disponibile').click()
    await echoSection(page).getByText('Infiltrazione').click()
    await echoSection(page).getByText('Polilobato').click()
    await echoSection(page).getByText('Versamento pericardico').click()
    await expect(echoSection(page).getByText('6/9')).toBeVisible()
    await expect(echoSection(page).getByText('POSITIVO')).toBeVisible()

    // CMR: Infiltrazione(2)+Perfusione first-pass(2)+Versamento pericardico(1)+Polilobato(1)=6/8, POSITIVO
    await cmrSection(page).getByText('Disponibile').click()
    await cmrSection(page).getByText('Infiltrazione').click()
    await cmrSection(page).getByText('Perfusione first-pass').click()
    await cmrSection(page).getByText('Versamento pericardico').click()
    await cmrSection(page).getByText('Sessile (base larga)').click()
    await expect(cmrSection(page).getByText('6/8')).toBeVisible()
    await expect(cmrSection(page).getByText('POSITIVO')).toBeVisible()

    // CT/PET: 4 signs + SUVmax 7.5 → alto sospetto
    await ctpetSection(page).getByText('Disponibile').click()
    await ctpetSection(page).getByText('Margini irregolari').click()
    await ctpetSection(page).getByText('Invasione').click()
    await ctpetSection(page).getByText('Natura solida').click()
    await ctpetSection(page).getByText('Calcificazioni').click()
    await expect(ctpetSection(page).getByText('4/8')).toBeVisible()
    await ctpetSection(page).getByPlaceholder('≥ 4.9').fill('7.5')

    // Run → title should contain "Concordanza eco-CMR" (both echo + CMR positive)
    await page.getByRole('button', { name: 'Esegui Valutazione' }).click()
    await expect(page.getByText('Concordanza eco-CMR ad alto sospetto')).toBeVisible()
    await expect(page.getByText('Salva valutazione')).toBeVisible()

    // Save → Dashboard with saved case
    await page.getByRole('button', { name: 'Salva valutazione' }).click()
    await expect(page.getByText(/Valutazione del/)).toBeVisible()
    await expect(page.getByText('Concordanza eco-CMR ad alto sospetto')).toBeVisible()
  })

  test('Salva e visualizza dettaglio caso', async ({ page }) => {
    await newCaseBtn(page).click()
    await echoSection(page).getByText('Disponibile').click()
    await echoSection(page).getByText('Infiltrazione').click()
    await echoSection(page).getByText('Versamento pericardico').click()
    await cmrSection(page).getByText('Disponibile').click()
    await cmrSection(page).getByText('Infiltrazione').click()
    await ctpetSection(page).getByText('Disponibile').click()
    await ctpetSection(page).getByText('Margini irregolari').click()

    await page.getByRole('button', { name: 'Esegui Valutazione' }).click()
    await page.getByRole('button', { name: 'Salva valutazione' }).click()

    await page.getByRole('button', { name: 'Dettaglio' }).click()
    await expect(page.getByRole('heading', { name: 'Dettaglio Valutazione' })).toBeVisible()
    await expect(page.getByText('Spiegazione')).toBeVisible()
    await expect(page.getByText('Prossimo passo')).toBeVisible()
    await expect(page.getByText('Evidenze')).toBeVisible()
    await page.getByText('Dati imaging originali').click()
    await expect(page.locator('pre')).toBeVisible()
  })

  test('Elimina caso dalla Dashboard', async ({ page }) => {
    await newCaseBtn(page).click()
    await echoSection(page).getByText('Disponibile').click()
    await echoSection(page).getByText('Infiltrazione').click()
    await cmrSection(page).getByText('Disponibile').click()
    await cmrSection(page).getByText('Infiltrazione').click()

    await page.getByRole('button', { name: 'Esegui Valutazione' }).click()
    await page.getByRole('button', { name: 'Salva valutazione' }).click()
    await expect(page.getByText(/Valutazione del/)).toBeVisible()

    await page.getByRole('button', { name: 'Elimina' }).click()
    await expect(page.getByText(/Valutazione del/)).not.toBeVisible()
    await expect(page.getByText('Nessuna valutazione salvata.')).toBeVisible()
  })
})
