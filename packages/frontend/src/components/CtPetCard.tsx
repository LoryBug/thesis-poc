import { useCaseStore } from '../stores/case.store'
import { calculateCtSigns, evaluatePet, ctPetLevel, CT_MAX } from '@cm-dss/core'
import type { CtFeatures } from '@cm-dss/core'

const ctLabels: [keyof CtFeatures, string][] = [
  ['irregularMargins', 'Margini irregolari'],
  ['pericardialEffusion', 'Versamento pericardico'],
  ['invasion', 'Invasione'],
  ['solidNature', 'Natura solida'],
  ['diameterOver30mm', 'Diametro >30mm'],
  ['contrastUptake', 'Captazione contrasto'],
  ['preContrastSuspicious', 'Sospetta densità pre-contrasto'],
  ['calcifications', 'Calcificazioni'],
]

export function CtPetCard() {
  const { ct, pet, ctpetAvailable, setCtpetAvailable, setCtFeature, setPetParam } =
    useCaseStore()
  const ctSigns = ctpetAvailable ? calculateCtSigns(ct) : 0
  const petPositive = ctpetAvailable ? evaluatePet(pet) : false
  const level = ctpetAvailable ? ctPetLevel(ctSigns, petPositive, true) : 'unavailable'

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-blue-900">TC / PET-TC</h2>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={ctpetAvailable}
            onChange={(e) => setCtpetAvailable(e.target.checked)}
            className="rounded"
          />
          Disponibile
        </label>
      </div>

      {!ctpetAvailable ? (
        <p className="text-gray-400 text-sm italic">Seleziona la disponibilità per inserire i dati.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Segni TC</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ctLabels.map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ct[key]}
                    onChange={(e) => setCtFeature(key, e.target.checked)}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="text-sm mt-2">
              Segni TC:{' '}
              <span className="font-bold">
                {ctSigns}/{CT_MAX}
              </span>
            </p>
          </div>

          <div className="border-t pt-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Parametri PET</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">SUVmax</label>
                <input
                  type="number"
                  step="0.1"
                  value={pet.suvMax ?? ''}
                  onChange={(e) => setPetParam('suvMax', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="≥ 4.9"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">MTV (mL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pet.mtv ?? ''}
                  onChange={(e) => setPetParam('mtv', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="≥ 8.2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">TLG</label>
                <input
                  type="number"
                  step="0.1"
                  value={pet.tlg ?? ''}
                  onChange={(e) => setPetParam('tlg', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="≥ 29"
                />
              </div>
            </div>
            {pet.suvMax !== null && (
              <p className="text-xs mt-2">
                PET:
                <span
                  className={`ml-1 font-medium ${petPositive ? 'text-red-600' : 'text-green-600'}`}
                >
                  {petPositive ? 'Positiva' : 'Negativa'}
                </span>
              </p>
            )}
          </div>

          <div className="border-t pt-2">
            <p className="text-xs text-gray-500">
              Classificazione TC/PET:{' '}
              <span
                className={`font-medium ${
                  level === 'high'
                    ? 'text-red-600'
                    : level === 'gray'
                      ? 'text-yellow-600'
                      : level === 'discordant'
                        ? 'text-orange-600'
                        : 'text-green-600'
                }`}
              >
                {level === 'high' && 'Alto sospetto'}
                {level === 'gray' && 'Zona grigia'}
                {level === 'discordant' && 'Discordante'}
                {level === 'low' && 'Basso sospetto'}
                {level === 'unavailable' && 'Non disponibile'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
