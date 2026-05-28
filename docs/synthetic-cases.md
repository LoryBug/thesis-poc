# Synthetic Golden Cases

This document defines deterministic synthetic cases for functional validation, documentation, screenshots, and thesis discussion.

These are not real patient cases and must not be interpreted as clinical validation. Their role is to verify that the prototype behaves consistently with its implemented score definitions, cutoffs, consensus rules, and traceability model.

## Clinical Sources Covered

| Area | Implemented construct | Source family |
|---|---|---|
| Echocardiography | DEM Score, cutoff >= 3, probability map | Paolisso et al. 2022 |
| Cardiac magnetic resonance | CMR Mass Score, cutoff >= 5 | Paolisso et al. 2024 |
| Cardiac CT | CT suspicious signs count | D'Angelo et al. 2020 |
| 18F-FDG PET/CT | SUVmax, MTV, TLG thresholds | D'Angelo et al. 2020 |
| Integrated workflow | Multimodality concordance, discordance, next-step logic | Angeli et al. 2022 and paper-derived workflow synthesis |

## Feature Weights And Thresholds Used

DEM Score:

| Feature | Points |
|---|---:|
| Infiltration | 2 |
| Polylobate mass | 2 |
| Moderate-severe pericardial effusion | 2 |
| Sessile appearance | 1 |
| Inhomogeneity | 1 |
| Non-left localization | 1 |

CMR Mass Score:

| Feature | Points |
|---|---:|
| Infiltration | 2 |
| First-pass contrast perfusion | 2 |
| Pericardial effusion | 1 |
| Sessile appearance | 1 |
| Polylobate shape | 1 |
| Heterogeneity enhancement | 1 |

Cardiac CT and 18F-FDG PET/CT:

| Construct | Threshold |
|---|---:|
| CT low suspicion | <= 2 signs |
| CT gray zone | 3-4 signs |
| CT high suspicion | >= 5 signs |
| SUVmax positive | >= 4.9 |
| MTV positive | >= 8.2 |
| TLG positive | >= 29 |

## Case Matrix

| ID | Scenario | Expected risk | Expected decision |
|---|---|---|---|
| GC-00 | No examination available | not | Decision not evaluated |
| GC-01 | Echocardiography low suspicion | low | Low suspicion with available data |
| GC-02 | Echo-positive only | mid | Significant echocardiographic suspicion |
| GC-03 | Concordant high-suspicion echo-CMR | high | Concordant high-suspicion echo-CMR |
| GC-04 | CMR-driven high suspicion | high | CMR-driven high suspicion |
| GC-05 | Echo-CMR discordance | mid | Echo-CMR discordance |
| GC-06 | CT gray zone without PET | mid | Cardiac CT gray zone |
| GC-07 | CT gray zone with positive PET | high | CT/PET-driven high suspicion |
| GC-08 | CT/PET discordance | mid | Discordant CT/PET result |
| GC-09 | CMR negative but CT/PET high suspicion | high | Discordance between advanced modalities |

## GC-00: No Examination Available

Purpose:

- Verify the empty-state behavior.
- Verify that no score is calculated without modality input.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | unavailable |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| Risk | not |
| Decision | Decision not evaluated |
| Next step | Complete clinical/imaging input. |
| Traceability | Missing echocardiography, CMR, and cardiac CT/PET data |

Thesis use:

- Demonstrates safe handling of absent data.

## GC-01: Echocardiography Low Suspicion

Purpose:

- Verify that first-line imaging below cutoff does not trigger malignancy suspicion.

Input:

| Modality | Data |
|---|---|
| Echocardiography | all DEM features absent |
| CMR | unavailable |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| DEM Score | 0/9 |
| DEM probability | 0% |
| Risk | low |
| Decision | Low suspicion with available data |
| Traceability | DEM score below cutoff; CMR and CT/PET missing |

Thesis use:

- Demonstrates that the system does not force escalation when no implemented cutoff is exceeded.

## GC-02: Echo-Positive Only

Purpose:

- Verify DEM-positive first-line triage and CMR recommendation.

Input:

| Modality | Data |
|---|---|
| Echocardiography | infiltration, polylobated |
| CMR | unavailable |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| DEM Score | 4/9 |
| DEM probability | 65% |
| Risk | mid |
| Decision | Significant echocardiographic suspicion |
| Activated rule | DEM Score above cutoff |
| Next step | Perform cardiac CMR if available |

Traceability expectation:

- Infiltration and polylobated features support DEM Score.
- DEM Score triggers cutoff >= 3.
- Cutoff triggers the echo-positive rule.
- CMR and CT/PET are recorded as missing data.

Thesis use:

- Demonstrates the role of echocardiography as first-line filter.

## GC-03: Concordant High-Suspicion Echo-CMR

Purpose:

- Verify concordance between DEM-positive echocardiography and CMR-positive assessment.

Input:

| Modality | Data |
|---|---|
| Echocardiography | infiltration, polylobated, moderate-severe pericardial effusion |
| CMR | all CMR Mass Score features present |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| DEM Score | 6/9 |
| DEM probability | 97% |
| CMR Mass Score | 8/8 |
| Risk | high |
| Decision | Concordant high-suspicion echo-CMR |
| Next step | Rapid Heart Team discussion |

Traceability expectation:

- Echo features support DEM positivity.
- CMR features support CMR Mass Score positivity.
- Integrated rule identifies concordant high-suspicion echo-CMR.
- CT/PET is recorded as missing data.

Thesis use:

- Demonstrates multimodality concordance and escalation logic.

## GC-04: CMR-Driven High Suspicion

Purpose:

- Verify that CMR can drive high suspicion even when echocardiography is unavailable.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | infiltration, first-pass contrast perfusion, heterogeneity enhancement |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| CMR Mass Score | 5/8 |
| Risk | high |
| Decision | CMR-driven high suspicion |
| Activated rule | CMR Mass Score above cutoff |
| Next step | Manage as high suspicion |

Traceability expectation:

- CMR features support CMR Mass Score.
- CMR Mass Score reaches cutoff >= 5.
- CMR-positive rule is activated.
- Echocardiography and CT/PET are recorded as missing data.

Thesis use:

- Demonstrates the dominant role of CMR when available.

## GC-05: Echo-CMR Discordance

Purpose:

- Verify that discordance is not resolved by mechanically adding scores.

Input:

| Modality | Data |
|---|---|
| Echocardiography | infiltration, polylobated |
| CMR | all CMR Mass Score features absent |
| Cardiac CT / PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| DEM Score | 4/9 |
| CMR Mass Score | 0/8 |
| Risk | mid |
| Decision | Echo-CMR discordance |
| Next step | Reassess image quality and discordant features; consider CT/PET or follow-up |

Traceability expectation:

- DEM-positive rule is activated.
- CMR Mass Score remains below cutoff.
- Integrated discordance rule is activated.
- CT/PET is recorded as missing data.

Thesis use:

- Demonstrates clinically safer consensus logic compared with a summed mega-score.

## GC-06: CT Gray Zone Without PET

Purpose:

- Verify CT gray-zone handling when PET parameters are not entered.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | unavailable |
| Cardiac CT | irregular margins, pericardial effusion, invasion |
| PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| CT signs | 3/8 |
| PET status | unavailable |
| Risk | mid |
| Decision | Cardiac CT gray zone |
| Next step | Integrate with 18F-FDG PET/CT or reassess with CMR |

Traceability expectation:

- CT features support CT sign count.
- CT sign count falls in the 3-4 gray zone.
- Missing PET parameters are recorded.
- Echo and CMR are recorded as missing data.

Thesis use:

- Demonstrates missing-data-aware next-step recommendation.

## GC-07: CT Gray Zone With Positive PET

Purpose:

- Verify that positive PET shifts a CT gray-zone case toward high suspicion.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | unavailable |
| Cardiac CT | irregular margins, pericardial effusion, invasion |
| PET | SUVmax 6.2, MTV unavailable, TLG unavailable |

Expected output:

| Field | Expected value |
|---|---|
| CT signs | 3/8 |
| PET | positive by SUVmax >= 4.9 |
| Risk | high |
| Decision | CT/PET-driven high suspicion |
| Activated rule | CT/PET high-suspicion profile |

Traceability expectation:

- CT features support CT sign count.
- SUVmax supports PET positivity.
- CT/PET high-suspicion rule is activated.
- Echo and CMR are recorded as missing data.

Thesis use:

- Demonstrates integration of anatomic and metabolic evidence.

## GC-08: CT/PET Discordance

Purpose:

- Verify that PET positivity with <= 2 CT signs is treated as discordant, not automatically high suspicion.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | unavailable |
| Cardiac CT | irregular margins only |
| PET | SUVmax 7.0, MTV unavailable, TLG unavailable |

Expected output:

| Field | Expected value |
|---|---|
| CT signs | 1/8 |
| PET | positive by SUVmax >= 4.9 |
| Risk | mid |
| Decision | Discordant CT/PET result |
| Next step | Review PET quality/preparation and compare with CMR/CT |

Traceability expectation:

- CT sign count is low.
- PET positivity is recorded.
- CT/PET discordance rule is activated.
- Echo and CMR are recorded as missing data.

Thesis use:

- Demonstrates conservative handling of discordant advanced imaging.

## GC-09: CMR Negative But CT/PET High Suspicion

Purpose:

- Verify advanced-modality discordance between CMR and CT/PET.

Input:

| Modality | Data |
|---|---|
| Echocardiography | unavailable |
| CMR | all CMR Mass Score features absent |
| Cardiac CT | irregular margins, pericardial effusion, invasion, solid nature, diameter >30 mm |
| PET | unavailable |

Expected output:

| Field | Expected value |
|---|---|
| CMR Mass Score | 0/8 |
| CT signs | 5/8 |
| Risk | high |
| Decision | Discordance between advanced modalities |
| Next step | Review CMR, CT, and PET collegially; consider Heart Team discussion and histological diagnosis |

Traceability expectation:

- CMR Mass Score below cutoff limits CMR-driven suspicion.
- CT sign count reaches high-suspicion threshold.
- Integrated advanced-modality discordance rule is activated.

Thesis use:

- Demonstrates that the CDSS exposes discordance instead of hiding it behind a single aggregate score.

## How To Use These Cases

For thesis validation:

- Enter each case in the deployed PWA.
- Verify score values, risk level, decision title, next step, and clinical traceability section.
- Capture screenshots for representative cases.
- Record discrepancies as implementation issues or as intentional limitations.

For automated testing:

- Convert this matrix into unit tests for `evaluateConsensus` and `buildTraceability`.
- Add selected E2E coverage only for workflows that are clinically or UX-significant.

For the future ISE project:

- Translate each case into symbolic facts.
- Use the expected decision as the target reasoning outcome.
- Use traceability expectations as explanation queries.
