# SpotyBoys publication evidence

Source reviewed: https://github.com/Bobosi-coder/SpotyBoys at 457c025ce77a99d9437ad374346458bee06aa8f7 (main). Training branch: 4d5b7f961e0f01973c1c142b6d18aaa4649b166c. Read-only local clone; no upstream edits or deployment.

## Attribution

User identifies this as their spring-semester project and explicitly requests collaborator credit. Git author history identifies Dawei Sun, Yonghyeon Shin (also yonghyeon), Vishal Jha (also vishaljha2121). Both collaborators appear in the opening, closing credit and project-card description. No relative contribution percentages or unverified collaborator profile links.

Vishal's relevant commits include 8d918af (demo stack), d21d4a5 (require full ML runtime), 9041361 (playback refresh), 9b06489/bbe40ab (monitoring and review fixes), e2c1fbd/457c025 (load harness and cookie authentication). Team recommender/training are described collectively.

## Claim map

- Retrieval limits: src/retriever/retriever.py (100/80/20, max 200).
- GRU dimensions and scoring: src/ranker/model.py.
- Runtime/fixture separation, playable intersection, neutral prefix labels: packages/recommendation_engine/pipeline.py.
- Fallback states and nonfatal telemetry: packages/recommendation_engine/{serving_state,service}.py.
- Playback ID lifecycle: navidrome-patches/ui/src/eventbridge/SpotiboysEventBridge.jsx.
- Export defaults: workers/delta-export-worker/export_and_trigger.py. Avoid precise label-boundary claim: README and code differ at exactly 0.2.
- Airflow SSH task: service_vm/airflow/dags/retrain_phase2.py.
- Training promotion thresholds: training branch scripts/promote.py (0.99/1.05).
- Serving activation checks and explicit override: jobs/promotion-gate/promotion_gate.py.
- Rollups and sample gating: packages/monitoring/rollups.py.
- Rollback remains manual even with flag: workers/rollback-check-worker/check_rollback.py.
- Tests described as checked-in contract tests; not represented as a new infrastructure qualification.

No fresh training, historical infrastructure access, runtime screenshot or load benchmark performed. No quality, latency or active-user numbers invented. SVG is an explanatory diagram. Prior exploratory FAISS commits are not represented as the current serving retriever, which uses NumPy dot products.

## Scope

New article, project entry and scoped article styles/image only. Resume, experience, analytics and project repository untouched. Publication checks and deployed commit recorded at completion.

## Validation

Next production build (TypeScript/lint included) and static export passed. Existing warnings: stale caniuse-lite and unavailable Google Fonts inlining. Generated article, home, Projects and `/blog` listing contain the entry; article/home/project credits checked. All article anchors resolve, SVG parses, image exists, all pinned source links resolve in the inspected Git commits. `/writing` is a legacy placeholder page; current navigation uses `/blog`, so it remains outside this change.

Chrome connector unavailable during verification (browser inventory empty). No desktop/mobile visual verification claimed. No alternative UI automation used.
