---
name: pedal
classification: W
description: |
  Unified skill for managing the entire PEDAL cycle.
  PEDAL is a workflow modeled after the traditional PDCA cycle.
  Supports 'Plan → Engineering → Do → Analyze → Learn' workflow with automatic phase progression.

  Use proactively when user mentions PEDAL cycle, planning, engineering documents,
  gap analysis, iteration, or completion reports.

  Do NOT use for: simple one-line fixes, non-development tasks

argument-hint: "[plan|engineering|do|analyze|iterate|learn|archive|status|next] [feature]"

allowed-tools:
  - ask_user
  - google_web_search
  - glob
  - grep_search
  - replace
  - run_shell_command
  - read_file
  - write_file
  - web_fetch

imports:
  - .pedal/templates/plan.template.md
  - .pedal/templates/engineering.template.md
  - .pedal/templates/iterate.template.md
  - .pedal/templates/analysis.template.md
  - .pedal/templates/learn.template.md

task-template:
  subject: "PEDAL {action} - {feature}"
  description: "Execute PEDAL {action} phase for feature '{feature}'"
  activeForm: "Executing PEDAL {action}"
---

# PEDAL Skill

> Unified Skill for managing PEDAL cycle. Supports the entire Plan → Engineering → Do → Analyze → Learn flow.

## Arguments

| Argument                | Description                               | Example                        |
| ----------------------- | ----------------------------------------- | ------------------------------ |
| `plan [feature]`        | Create Plan document                      | `/pedal plan user-auth`        |
| `engineering [feature]` | Create Engineering document               | `/pedal engineering user-auth` |
| `do [feature]`          | Begin implementation (no document output) | `/pedal do user-auth`          |
| `analyze [feature]`     | Run Gap analysis                          | `/pedal analyze user-auth`     |
| `iterate [feature]`     | Auto improvement loop                     | `/pedal iterate user-auth`     |
| `learn [feature]`       | Write Wiki and generate completion report | `/pedal learn user-auth`       |
| `archive [feature]`     | Archive PEDAL documents                   | `/pedal archive user-auth`     |
| `status`                | Show current status                       | `/pedal status`                |
| `next`                  | Guide to next phase                       | `/pedal next`                  |

## Directory Structure

```
docs/
├── 01-plan/
│   └── features/{feature}.plan.md
├── 02-engineering/
│   └── features/{feature}.engineering.md
├── 03-analysis/
│   └── {feature}.analysis.md
├── 04-learn/
│   └── {feature}.report.md
├── wiki/
│   └── {feature}.wiki.md
└── archived/
    └── {feature}/
        ├── {feature}.plan.md
        ├── {feature}.engineering.md
        ├── {feature}.analysis.md
        └── {feature}.report.md
```

## Action Details

### plan (Plan Phase)

1. Run `git pull origin main`, then create and checkout a new branch named `feature/{feature}` or `fix/{feature}` from main.
2. Check if `docs/01-plan/features/{feature}.plan.md` exists.
3. If not, create based on plan.template.md.
4. Create Task: `[Plan] {feature}`

> **Important**: Do NOT switch to "Plan Mode" automatically. The Plan document must be written in normal mode, reporting progress directly to the user.

### engineering (Engineering Phase)

1. Verify Plan document exists.
2. Create `docs/02-engineering/features/{feature}.engineering.md` based on engineering.template.md.
3. Always include an ASCII Art visualization of the expected UI in the generated document.
4. Create Task: `[Engineering] {feature}` (blockedBy: Plan)

### do (Do Phase)

The Do phase produces code, not a document. Implementation follows the Engineering document directly.

1. Verify Engineering document exists.
2. Implement according to the Engineering document's specifications (Architecture, Data Model, API, etc.).
3. Use the Self-Review Checklist in the Engineering document before moving to Analyze.
4. Create Task: `[Do] {feature}` (blockedBy: Engineering)

### analyze (Analyze Phase)

1. Call gap-detector agent.
2. Compare Engineering document vs actual implementation.
3. Calculate **severity-weighted Match Rate** (see Severity-Weighted Scoring).
4. If any 🔴 Critical issue exists, **force iterate** regardless of overall matchRate.
5. Create Task: `[Analyze] {feature}`

### iterate (Improvement Loop)

Iterate is not a standalone PEDAL phase — it is a remediation loop between Analyze and Do. See iterate.template.md for the full Evaluator-Optimizer pattern.

1. Triggered when matchRate < 90% **or** any 🔴 Critical issue exists.
2. Auto-fix issues and re-verify via Evaluator-Optimizer loop.
3. Max 5 iterations (10 for Critical-only fixes).
4. Stops early if no improvement for 3 consecutive iterations.

### learn (Wiki & Completion Report)

1. Verify Analyze matchRate >= 90% and zero 🔴 Critical issues.
2. Update project Wiki at `docs/wiki/{feature}.wiki.md`:
   - Document only verified facts matching the current implementation.
   - Write in a format useful for both humans and AI agents.
   - Include ASCII Art screen layouts for any UI-bearing features (mobile, web, etc.).
3. Create completion report at `docs/04-learn/{feature}.report.md` based on learn.template.md.
4. Auto `git push` and create a GitHub PR via `gh pr create`, using the report content as the PR body.
5. PR title must include the appropriate Gitmoji (e.g., `feat: ✨ Feature name`).
6. Automatically open the created PR URL in the browser via `open`.

### archive (Archive Phase)

1. Create `docs/archived/{feature}/` directory.
2. Move all PEDAL documents for the feature into the archive:
   - `docs/01-plan/features/{feature}.plan.md`
   - `docs/02-engineering/features/{feature}.engineering.md`
   - `docs/03-analysis/{feature}.analysis.md`
   - `docs/04-learn/{feature}.report.md`
3. Remove non-PEDAL artifacts (agent review files, temporary analysis outputs, etc.).
4. Update `.pedal-status.json`: set the feature's status to `archived`.
5. Commit: `chore: 🗃️ Archive {feature} PEDAL documents`

## PEDAL Flow

```
[Plan] → [Engineering] → [Do] → [Analyze] ──→ [Learn] → [Archive]
                                    │    ↑
                                    ↓    │
                                 [Iterate]
                           (matchRate < 90%
                            OR 🔴 Critical)
```

## Severity-Weighted Scoring

Issues found during Analyze are weighted by severity. Critical issues force iteration regardless of overall matchRate.

| Severity    | Weight | Iterate Trigger             |
| ----------- | :----: | --------------------------- |
| 🔴 Critical |   x3   | **Always** (even if >= 90%) |
| 🟡 Warning  |   x2   | Only if matchRate < 90%     |
| 🟢 Info     |   x1   | Only if matchRate < 90%     |

**Weighted Match Rate formula:**

```
weightedScore = Σ(issue_severity_weight × issue_count)
maxPossibleScore = total_checked_items × 3
weightedMatchRate = (1 - weightedScore / maxPossibleScore) × 100
```

If any 🔴 Critical issue exists → iterate is **mandatory**, bypassing the matchRate threshold.

## `.pedal-status.json` Schema

```json
{
  "version": "2.0",
  "lastUpdated": "2026-04-06T12:00:00Z",
  "activeFeatures": ["feature-a", "feature-b"],
  "primaryFeature": "feature-a",
  "features": {
    "feature-a": {
      "phase": "do",
      "status": "in_progress",
      "updatedAt": "2026-04-06T12:00:00Z",
      "description": "Short description of the feature"
    },
    "feature-b": {
      "phase": "learn",
      "status": "completed",
      "updatedAt": "2026-04-05T15:30:00Z",
      "description": "Short description of the feature"
    }
  },
  "session": {
    "startedAt": "2026-04-01T09:00:00Z",
    "lastActivity": "2026-04-06T12:00:00Z"
  },
  "history": [
    {
      "timestamp": "2026-04-06T12:00:00Z",
      "action": "phase_progression",
      "feature": "feature-a",
      "details": "Completed Engineering phase, moving to Do"
    }
  ]
}
```

| Field                          | Type     | Description                                                                             |
| ------------------------------ | -------- | --------------------------------------------------------------------------------------- |
| `version`                      | string   | Schema version                                                                          |
| `lastUpdated`                  | ISO 8601 | Last update timestamp (always use system time)                                          |
| `activeFeatures`               | string[] | Currently active feature names                                                          |
| `primaryFeature`               | string   | Feature currently being worked on                                                       |
| `features.{name}.phase`        | enum     | `plan` \| `engineering` \| `do` \| `analyze` \| `iterate` \| `learn` \| `archived`     |
| `features.{name}.status`       | enum     | `pending` \| `in_progress` \| `completed` \| `blocked` \| `archived`                   |
| `features.{name}.updatedAt`    | ISO 8601 | Phase update timestamp                                                                  |
| `features.{name}.description`  | string   | Brief feature description                                                               |
| `session.startedAt`            | ISO 8601 | Session start time                                                                      |
| `session.lastActivity`         | ISO 8601 | Last activity timestamp                                                                 |
| `history[]`                    | array    | Chronological event log                                                                 |

## General Rules

### Document Language

- PEDAL markdown documents (Plan, Engineering, Analysis, Report, etc.) must be written in the language of the user's prompt.

### Git Workflow

- Commit at every PEDAL phase transition.
- Commit message format: `[type]: [gitmoji] [description]` (lowercase type).
  - Types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, etc.
  - Example: `feat: ✨ Implement notification deduplication`
- PR titles must also follow the same Gitmoji format.
- Prefer `git worktree add ../{project}-{feature} feature/{feature}` for parallel PEDAL cycles to prevent working directory pollution.
- When writing PEDAL timestamps (e.g., `.pedal-status.json`), always use the actual system time via `$(date -u +"%Y-%m-%dT%H:%M:%SZ")`. Never use hardcoded or sequential values.

### Phase Guidance

- After completing each PEDAL phase, guide the user to the next phase command.

### Notifications

- On task completion, send a notification using `./scripts/bkit-notify.sh` to bring focus to the active terminal.

## References

- .pedal/templates/plan.template.md
- .pedal/templates/engineering.template.md
- .pedal/templates/iterate.template.md
- .pedal/templates/analysis.template.md
- .pedal/templates/learn.template.md
