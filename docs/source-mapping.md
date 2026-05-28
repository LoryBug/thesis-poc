# Source Mapping

This document maps the implemented CDSS logic to the clinical source families used by the thesis prototype.

It is intended for thesis writing, review with clinicians, and future ISE reuse. It distinguishes between paper-derived score logic and local workflow synthesis implemented by the prototype.

## Scope And Interpretation

The prototype implements a deterministic decision support workflow. It does not claim autonomous diagnosis and does not provide clinical performance validation on patient-level data.

Mapping categories:

| Category | Meaning |
|---|---|
| Direct score implementation | Feature weights, cutoffs, or thresholds implemented from a named paper source. |
| Paper-derived workflow synthesis | Deterministic workflow rule derived from how the papers frame multimodality assessment, but not a newly validated clinical score. |
| Local safety behavior | Conservative software behavior for missing data, discordance, and human review. |

## Source Registry

| Source ID | Citation used in traceability | Implemented area |
|---|---|---|
| `paolisso_2022_dem_score` | Paolisso et al., Development and Validation of a Diagnostic Echocardiographic Mass Score in the Approach to Cardiac Masses, JACC Cardiovascular Imaging, 2022. | DEM Score, echocardiographic first-line assessment. |
| `paolisso_2024_cmr_mass_score` | Paolisso et al., Cardiac Magnetic Resonance to Predict Cardiac Mass Malignancy: The CMR Mass Score, Circulation: Cardiovascular Imaging, 2024. | CMR Mass Score. |
| `dangelo_2020_ct_pet` | D'Angelo et al., Diagnostic Accuracy of Cardiac Computed Tomography and 18F-FDG Positron Emission Tomography in Cardiac Masses, JACC Cardiovascular Imaging, 2020. | Cardiac CT signs and 18F-FDG PET/CT thresholds. |
| `angeli_2022_multimodality_context` | Angeli et al., multimodality framing and diagnostic pathway for cardiac masses, 2022. | Multimodality diagnostic context and next-step framing. |

Implementation reference:

- Source metadata: `packages/core/src/traceability/sources.ts`.
- Trace graph construction: `packages/core/src/traceability/builder.ts`.

## DEM Score Mapping

Implementation reference:

- `packages/core/src/scores/dem-score.ts`.
- `packages/core/src/traceability/builder.ts`.

Score definition:

| Implemented feature | Internal key | Points | Source category | Traceability node |
|---|---|---:|---|---|
| Infiltration | `infiltration` | 2 | Direct score implementation | `echo:feature:infiltration` |
| Polylobate mass | `polylobated` | 2 | Direct score implementation | `echo:feature:polylobated` |
| Moderate-severe pericardial effusion | `pericardialEffusion` | 2 | Direct score implementation | `echo:feature:pericardialEffusion` |
| Sessile appearance | `sessile` | 1 | Direct score implementation | `echo:feature:sessile` |
| Inhomogeneity | `inhomogeneity` | 1 | Direct score implementation | `echo:feature:inhomogeneity` |
| Non-left localization | `nonLeftLocation` | 1 | Direct score implementation | `echo:feature:nonLeftLocation` |

Implemented constants:

| Construct | Value | Source category | Code reference |
|---|---:|---|---|
| Maximum score | 9 | Direct score implementation | `DEM_MAX` |
| Malignancy cutoff | >= 3 | Direct score implementation | `DEM_CUTOFF` |

Implemented probability map:

| DEM Score | Estimated malignancy probability |
|---:|---:|
| 0 | 0% |
| 1 | 2% |
| 2 | 8% |
| 3 | 29% |
| 4 | 65% |
| 5 | 89% |
| 6 | 97% |
| 7 | 99% |
| 8 | 100% |
| 9 | 100% |

Rules using DEM Score:

| Rule | Condition | Output role | Source category |
|---|---|---|---|
| DEM-positive evidence | `DEM Score >= 3` | Adds evidence text and modality status. | Direct score implementation. |
| Echocardiographic suspicion | `DEM Score >= 3` without positive CMR or CT/PET dominance | Returns `Significant echocardiographic suspicion`, risk `mid`, recommends CMR. | Paper-derived workflow synthesis. |
| Echo-CMR discordance | `DEM Score >= 3` and `CMR Mass Score < 5` | Returns `Echo-CMR discordance`, risk `mid`. | Paper-derived workflow synthesis plus local safety behavior. |

Traceability behavior:

- Selected DEM features support the DEM score node.
- The DEM score node triggers the cutoff node.
- If the score reaches cutoff, the `DEM Score above cutoff` rule is activated.
- The rule cites `paolisso_2022_dem_score`.

## CMR Mass Score Mapping

Implementation reference:

- `packages/core/src/scores/cmr-score.ts`.
- `packages/core/src/traceability/builder.ts`.

Score definition:

| Implemented feature | Internal key | Points | Source category | Traceability node |
|---|---|---:|---|---|
| Infiltration | `infiltration` | 2 | Direct score implementation | `cmr:feature:infiltration` |
| First-pass contrast perfusion | `firstPassPerfusion` | 2 | Direct score implementation | `cmr:feature:firstPassPerfusion` |
| Pericardial effusion | `pericardialEffusion` | 1 | Direct score implementation | `cmr:feature:pericardialEffusion` |
| Sessile appearance | `sessile` | 1 | Direct score implementation | `cmr:feature:sessile` |
| Polylobate shape | `polylobated` | 1 | Direct score implementation | `cmr:feature:polylobated` |
| Heterogeneity enhancement | `heterogeneousEnhancement` | 1 | Direct score implementation | `cmr:feature:heterogeneousEnhancement` |

Implemented constants:

| Construct | Value | Source category | Code reference |
|---|---:|---|---|
| Maximum score | 8 | Direct score implementation | `CMR_MAX` |
| Malignancy cutoff | >= 5 | Direct score implementation | `CMR_CUTOFF` |

Rules using CMR Mass Score:

| Rule | Condition | Output role | Source category |
|---|---|---|---|
| CMR-positive evidence | `CMR Mass Score >= 5` | Adds evidence text and modality status. | Direct score implementation. |
| CMR-driven high suspicion | `CMR Mass Score >= 5`, with or without echo positivity | Returns high suspicion and recommends Heart Team/staging/histological or therapeutic assessment. | Paper-derived workflow synthesis. |
| Concordant high-suspicion echo-CMR | `DEM Score >= 3` and `CMR Mass Score >= 5` | Returns high suspicion and highlights concordance. | Paper-derived workflow synthesis. |
| Echo-CMR discordance | `DEM Score >= 3` and `CMR Mass Score < 5` | Returns mid risk and recommends review or additional imaging. | Paper-derived workflow synthesis plus local safety behavior. |

Traceability behavior:

- Selected CMR features support the CMR Mass Score node.
- The score node triggers the CMR cutoff node.
- If the score reaches cutoff, the `CMR Mass Score above cutoff` rule is activated.
- The rule cites `paolisso_2024_cmr_mass_score`.

## Cardiac CT And 18F-FDG PET/CT Mapping

Implementation reference:

- `packages/core/src/scores/ct-pet.ts`.
- `packages/core/src/traceability/builder.ts`.

Cardiac CT signs:

| Implemented feature | Internal key | Points/count | Source category | Traceability node |
|---|---|---:|---|---|
| Irregular margins | `irregularMargins` | 1 | Direct score implementation | `ct-pet:feature:irregularMargins` |
| Pericardial effusion | `pericardialEffusion` | 1 | Direct score implementation | `ct-pet:feature:pericardialEffusion` |
| Invasion | `invasion` | 1 | Direct score implementation | `ct-pet:feature:invasion` |
| Solid nature | `solidNature` | 1 | Direct score implementation | `ct-pet:feature:solidNature` |
| Diameter >30 mm | `diameterOver30mm` | 1 | Direct score implementation | `ct-pet:feature:diameterOver30mm` |
| Contrast uptake | `contrastUptake` | 1 | Direct score implementation | `ct-pet:feature:contrastUptake` |
| Pre-contrast suspicious density | `preContrastSuspicious` | 1 | Direct score implementation | `ct-pet:feature:preContrastSuspicious` |
| Calcifications | `calcifications` | 1 | Direct score implementation | `ct-pet:feature:calcifications` |

CT interpretation thresholds:

| CT signs | Implemented level | Source category |
|---:|---|---|
| <= 2 | Low suspicion unless PET discordance applies | Direct score implementation plus local safety behavior. |
| 3-4 | Gray zone | Direct score implementation. |
| >= 5 | High suspicion | Direct score implementation. |

PET thresholds:

| PET parameter | Internal key | Positive threshold | Source category | Traceability node |
|---|---|---:|---|---|
| SUVmax | `suvMax` | >= 4.9 | Direct score implementation | `ct-pet:pet:suvMax` |
| MTV | `mtv` | >= 8.2 | Direct score implementation | `ct-pet:pet:mtv` |
| TLG | `tlg` | >= 29 | Direct score implementation | `ct-pet:pet:tlg` |

Rules using CT/PET:

| Rule | Condition | Output role | Source category |
|---|---|---|---|
| Cardiac CT high suspicion | `CT signs >= 5` | Returns CT/PET high-suspicion profile. | Direct score implementation. |
| CT gray zone with positive PET | `CT signs 3-4` and at least one PET parameter above threshold | Returns high suspicion. | Direct score implementation. |
| CT gray zone without PET | `CT signs 3-4` and no PET parameter entered | Returns mid risk and recommends PET/CT or CMR. | Direct score implementation plus local safety behavior. |
| CT gray zone with negative PET | `CT signs 3-4` and entered PET parameters below threshold | Returns low suspicion with available data. | Direct score implementation. |
| CT/PET discordance | `CT signs <= 2` and PET positive | Returns mid risk and recommends contextual review. | Local safety behavior, because PET positivity alone is not treated as automatic high suspicion in the implemented workflow. |

Traceability behavior:

- Selected CT signs support the cardiac CT signs node.
- The CT signs node triggers the CT cutoff node.
- PET parameters are represented as finding nodes and support or limit the CT/PET cutoff node depending on threshold comparison.
- High, gray-zone, and discordant CT/PET rules cite `dangelo_2020_ct_pet`.

## Integrated Consensus Mapping

Implementation reference:

- `packages/core/src/consensus/engine.ts`.
- `packages/core/src/traceability/builder.ts`.

The consensus engine intentionally avoids creating a single summed multimodality score. It evaluates clinically meaningful workflow states in priority order.

| Decision title | Main condition | Risk | Source category | Rationale |
|---|---|---|---|---|
| Decision not evaluated | No examination available | not | Local safety behavior | Do not produce a diagnostic interpretation without input data. |
| Concordant high-suspicion echo-CMR | DEM positive and CMR positive | high | Paper-derived workflow synthesis | Echo flags suspicion and CMR confirms with tissue characterization. |
| CMR-driven high suspicion | CMR positive, even if echo is unavailable or not positive | high | Paper-derived workflow synthesis | CMR is treated as the dominant non-invasive modality when available. |
| Discordance between advanced modalities | CMR below cutoff and CT/PET high suspicion | high | Local safety behavior plus paper-derived workflow synthesis | The tool exposes discordance and recommends collegial review rather than adding scores. |
| CT/PET-driven high suspicion | CT/PET pathway positive and no higher-priority CMR contradiction except advanced-modality discordance | high | Direct CT/PET implementation plus workflow synthesis | CT and PET provide complementary anatomic and metabolic evidence. |
| Echo-CMR discordance | DEM positive and CMR below cutoff | mid | Local safety behavior plus paper-derived workflow synthesis | CMR lowers suspicion but does not erase the echo signal automatically. |
| Significant echocardiographic suspicion | DEM positive and no CMR/CT-PET high-suspicion rule dominates | mid | Paper-derived workflow synthesis | Positive echo should trigger second-level imaging. |
| Cardiac CT gray zone | CT 3-4 signs and PET unavailable | mid | Direct CT/PET implementation plus local safety behavior | Gray-zone CT requires PET/CT or CMR clarification. |
| Discordant CT/PET result | CT <= 2 signs and PET positive | mid | Local safety behavior | PET positivity with low CT signs requires contextual review. |
| Low suspicion with available data | No malignancy cutoff exceeded | low | Local safety behavior based on implemented thresholds | Available data do not reach paper-derived cutoffs. |

Traceability behavior:

- Every consensus decision becomes an integrated rule node.
- The rule node recommends the next step produced by the consensus engine.
- The recommendation cites `angeli_2022_multimodality_context` as multimodality framing.
- Evidence strings generated by the consensus engine are represented as integrated finding nodes.

## Missing Data Mapping

Implementation reference:

- `packages/core/src/traceability/builder.ts`.

Missing-data behavior:

| Missing input | Traceability label | Interpretation |
|---|---|---|
| Echocardiography unavailable or not entered | Echocardiography not entered | DEM Score cannot be evaluated. |
| CMR unavailable or not entered | CMR not entered | CMR Mass Score cannot be evaluated. |
| Cardiac CT unavailable or not entered | Cardiac CT/PET not entered | CT/PET pathway cannot be evaluated. |
| PET unavailable or no PET parameters entered | PET parameters not entered | SUVmax, MTV and TLG are not available. |

Source category:

- Local safety behavior.

Rationale:

- Missing data are explicitly surfaced instead of silently interpreted as negative findings.
- This supports human review and prevents overconfident output from incomplete modality data.

## Report Mapping

Implementation reference:

- `packages/frontend/src/lib/report.ts`.

Report sections mapped to sources:

| Report section | Data source | Purpose |
|---|---|---|
| Scores | Core scoring functions | Show deterministic score values and PET status. |
| Consensus | `evaluateConsensus` | Show integrated decision, explanation, and next step. |
| Evidence | Consensus evidence list | Show concise evidence supporting the decision. |
| Clinical Traceability | `buildTraceability` | Show summary, activated rules, evidence chain, missing data, and sources. |

## Thesis Use

Use this document to support:

- The methodology chapter, by showing exactly what is implemented.
- The implementation chapter, by linking clinical concepts to code modules.
- The validation chapter, by deriving expected outputs for golden cases.
- The limitations section, by distinguishing direct source implementation from local workflow synthesis.

## Known Limitations Of The Mapping

- The prototype maps literature-derived score logic, but does not revalidate diagnostic performance.
- The integrated consensus is a deterministic workflow synthesis, not a published composite score.
- The source mapping depends on correct manual feature annotation by the user.
- Clinical applicability still requires expert review, local protocol alignment, and patient-level validation.
