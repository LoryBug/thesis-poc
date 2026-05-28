# Thesis Roadmap

This document consolidates the thesis-specific plan. The broader domain notes remain in `progettotesilorenzo/`, while `docs/clinical-traceability-ise-plan.md` keeps the boundary between the thesis CDSS and the separate ISE project.

## Thesis Direction

The thesis is a deterministic, explainable TypeScript/PWA clinical decision support prototype for non-invasive cardiac mass evaluation.

The target contribution is not a new autonomous diagnostic model. The contribution is a clinically faithful implementation of literature-derived scores, multimodality consensus logic, and traceable explanations that make the reasoning inspectable by a clinician.

## Current Scope

Implemented scope:

- DEM Score for echocardiographic first-line assessment.
- CMR Mass Score for cardiac magnetic resonance assessment.
- Cardiac CT and 18F-FDG PET/CT pathway with CT sign count and PET thresholds.
- Multimodality consensus engine that handles concordance, discordance, missing modalities, and suggested next steps.
- React/PWA clinical cockpit with live score calculation, saved cases, case detail, and copyable report.
- Deterministic clinical traceability layer linking features, scores, cutoffs, activated rules, sources, missing data, and recommendations.
- GitHub Pages deployment.
- Unit, build, and E2E test coverage for the implemented workflow.

Out of scope for the current thesis prototype unless real data becomes available:

- Autonomous diagnosis.
- Computer vision on DICOM images.
- Training a predictive ML model.
- Certified clinical use.
- Direct PACS/EHR integration.

## Thesis Research Claim

Possible thesis claim:

```text
A deterministic, literature-grounded CDSS can make cardiac mass evaluation more transparent by combining validated scoring systems with explicit multimodality consensus and traceable rule-level explanations.
```

The claim should be framed as a software engineering and explainability contribution, not as clinical validation of diagnostic performance.

## What Is Already Covered

Domain grounding:

- The clinical domain has been summarized in `progettotesilorenzo/guida_dominio_masse_cardiache.md`.
- The rationale and early project discussion are in `progettotesilorenzo/discussione_progetto.md`.
- The software architecture direction is in `progettotesilorenzo/architettura_progetto.md`.

Implementation:

- `packages/core` contains deterministic scoring, consensus, and traceability logic.
- `packages/frontend` contains the PWA and clinical cockpit.
- `docs/clinical-traceability-ise-plan.md` defines the separation between the thesis project and the future ISE artifact.

Verification:

- Unit tests cover score algorithms, consensus paths, and traceability construction.
- Component tests cover UI-level behavior.
- Playwright E2E tests cover the main clinical workflow.
- GitHub Pages confirms deployability of the current prototype.

## What Is Still Missing For The Thesis

### 1. Golden Synthetic Cases

Purpose:

- Provide a reproducible validation set for the prototype.
- Document expected decisions for representative clinical scenarios.
- Support thesis figures, screenshots, and discussion.

Artifact:

- `docs/synthetic-cases.md`.

Status:

- Completed as documented golden cases and automated regression tests.

### 2. Formal Validation Narrative

Purpose:

- Explain that validation is functional and methodological, not clinical performance validation.
- Show that score calculations match published definitions.
- Show that consensus outcomes follow predefined deterministic rules.
- Show that traceability can reconstruct the evidence chain for each output.

Suggested artifact:

- A thesis chapter or `docs/validation-methodology.md`.

Status:

- Added in `docs/validation-methodology.md` with diagram-driven methodology, validation scope, golden case matrix, traceability validation, workflow validation, and limitations.

Minimum content:

- Test strategy.
- Golden case matrix.
- Expected vs observed outputs.
- Known limitations.
- Why real clinical validation would require retrospective/prospective patient data.

### 3. Source Mapping Table

Purpose:

- Make the literature grounding explicit and easy to cite in the thesis.
- Map each implemented rule to its clinical source.

Suggested artifact:

- `docs/source-mapping.md` or a thesis appendix.

Status:

- Added in `docs/source-mapping.md`.

Minimum content:

- DEM Score features, weights, cutoff, probability mapping, source.
- CMR Mass Score features, weights, cutoff, source.
- Cardiac CT signs and 18F-FDG PET/CT thresholds, source.
- Multimodality workflow assumptions, source.
- Limits and interpretation notes.

### 4. Clinical Safety And Limitations Section

Purpose:

- Avoid overclaiming.
- Clearly state that the tool is a prototype and not a certified medical device.
- Explain missing data behavior and dependency on paper-derived thresholds.

Suggested artifact:

- A dedicated section in the report/UI and in the thesis.

Minimum content:

- Human-in-the-loop use only.
- No autonomous diagnosis.
- No performance claims without patient-level validation.
- Single-center and selection-bias limitations inherited from source studies.
- Applicability depends on imaging quality and expert feature annotation.

### 5. Thesis Writing Structure

Proposed chapters:

- Introduction and clinical problem.
- State of the art on cardiac mass imaging and scores.
- Requirements and methodology.
- Software architecture.
- Scoring and consensus engine.
- Clinical traceability model.
- Prototype implementation and UI.
- Functional validation with golden cases.
- Discussion, limitations, and future work.

### 6. Optional Clinical Review

Purpose:

- Get feedback from a cardiologist/radiologist on wording, workflow, and usefulness.
- Identify misleading labels or clinically risky phrasing.

Output:

- Short qualitative evaluation or expert feedback paragraph.

This is useful but not strictly required to keep the software thesis coherent.

### 7. Future Backend And Audit Trail

Purpose:

- Persist cases beyond local browser storage.
- Add auditability for case edits and generated reports.

Status:

- Deferred.

This is not necessary for the current thesis prototype unless the thesis scope is expanded toward clinical deployment.

## Relationship With The ISE Project

The thesis CDSS and the ISE project must remain separate.

The thesis provides:

- Deterministic score calculations.
- Rule-based consensus.
- Structured traceability.
- Golden cases.

The future ISE project can reuse:

- Golden cases as symbolic facts.
- Traceability concepts as Prolog/Jason explanations.
- Next-step recommendations as planning goals.

The ISE project must not become a dependency of the thesis PWA.

## Immediate Next Steps

1. Prepare screenshots from GitHub Pages for the thesis document.
2. Export or redraw the main Mermaid diagrams from `docs/validation-methodology.md` for the thesis.
3. Create a dataset intake checklist for future real-case or CBIR work.
4. Consider a short expert-review paragraph after cardiologist/radiologist feedback.
5. Add a release tag when the current documentation and deployed UI are accepted.
