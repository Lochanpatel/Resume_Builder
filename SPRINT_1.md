Sprint 1 — 2 weeks

Goal

Deliver core data model and profile editor with save/load functionality and a simple preview.

Dates

- Sprint length: 2 weeks

Selected Stories

- User profile management 
- Education entries
- Work experience entries 
- Save/Load resumes (local)

Tasks (example)

- Design data model for resume JSON schema
- Build profile editor UI with validation
- Implement add/edit/remove for education and work entries
- Implement local save/load (localStorage or file export)
- Create simple preview renderer that maps data to a basic template
- Write unit tests for model and save/load
- Create PR and request review

Definition of Done for Sprint 1

- Selected stories implemented and demoable
- Unit tests added and passing in CI
- PRs reviewed and merged
- Basic README updated with how to run locally

Demo

- Demo scenario: create a new resume, add education & experience, save it, reload it, open preview.

Risks & Mitigations

- Risk: PDF export may remain incomplete — defer to Sprint 2.
- Mitigation: keep preview accurate so export later is straightforward.
