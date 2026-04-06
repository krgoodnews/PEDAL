# PEDAL Workflow

> **Tool-agnostic specification.** Use this document from any AI assistant or CLI (e.g. Gemini CLI, Cursor).
> Gemini-specific slash commands and hooks live in [GEMINI.md](../GEMINI.md).

## What is PEDAL?

**PEDAL** is a development workflow inspired by the classic PDCA cycle, adapted for software delivery:

| Letter | Phase         | Focus |
| ------ | ------------- | ----- |
| **P**  | **Plan**      | Goals, scope, requirements, risks |
| **E**  | **Engineering** | Design, architecture, APIs, UI intent |
| **D**  | **Do**        | Implement (code); no separate PEDAL document |
| **A**  | **Analyze**   | Gap analysis vs engineering + quality |
| **L**  | **Learn**     | Wiki update + completion report + handoff |

**Iterate** is a remediation loop between Analyze and Do (not a separate letter). **Archive** stores completed PEDAL artifacts for a feature.

Every phase that produces a PEDAL document goes through **cross-review** by a different AI agent. See [REVIEW.md](REVIEW.md) for the full protocol.

## Phases (actions)

Use natural language or your tool's command style. Conceptually:

| Phase | Purpose | Primary output |
| ----- | ------- | -------------- |
| **plan** | Capture planning for `{feature}` | `docs/01-plan/features/{feature}.plan.md` |
| **engineering** | Specify how to build it | `docs/02-engineering/features/{feature}.engineering.md` |
| **do** | Implement per Engineering doc | Source code |
| **analyze** | Compare engineering vs implementation | `docs/03-analysis/{feature}.analysis.md` |
| **iterate** | Fix gaps until thresholds met | Updated code; optional iteration notes |
| **learn** | Document and close the cycle | `docs/wiki/{feature}.wiki.md`, `docs/04-learn/{feature}.report.md` |
| **archive** | Preserve PEDAL docs; remove noise | `docs/archived/{feature}/` |

### plan (Plan)

1. Sync main branch and create a feature branch `feature/{feature}` or `fix/{feature}` when appropriate.
2. Ensure `docs/01-plan/features/{feature}.plan.md` exists; create from `templates/plan.template.md` if missing.
3. **Cross-review**: invoke the reviewer agent to produce `{feature}.plan.review.md` (see [REVIEW.md](REVIEW.md)).
4. Critically evaluate the review; accept valid points, reject with justification.
5. Optional task label: `[Plan] {feature}`

> **Important:** Do not enter a special "plan-only" mode that blocks normal work. Write the Plan in normal interaction and report progress to the user.

### engineering (Engineering)

1. Require an approved Plan document.
2. Create `docs/02-engineering/features/{feature}.engineering.md` from `templates/engineering.template.md`.
3. Include ASCII art for expected UI where relevant.
4. **Cross-review**: invoke the reviewer agent to produce `{feature}.engineering.review.md`.
5. Critically evaluate the review; accept valid points, reject with justification.
6. Optional task label: `[Engineering] {feature}` (depends on Plan)

### do (Do)

Do produces **code**, not a PEDAL document. Follow the Engineering document.

1. Require Engineering document.
2. Implement per Engineering (architecture, data model, API, etc.).
3. Complete **Self-Review Checklist** (Section 12 in `engineering.template.md`) before Analyze.
4. Optional task label: `[Do] {feature}` (depends on Engineering)

> No cross-review for Do -- code quality is validated in the Analyze phase.

### analyze (Analyze)

1. Run gap / quality analysis (e.g. gap-detector pattern).
2. Compare Engineering document vs implementation.
3. Compute **severity-weighted match rate** (see below).
4. Any **Critical** issue forces iterate regardless of aggregate match rate.
5. **Cross-review**: invoke the reviewer agent to produce `{feature}.analysis.review.md`.
6. Critically evaluate the review; accept valid points, reject with justification.
7. Optional task label: `[Analyze] {feature}`

### iterate (Improvement loop)

Not a standalone PEDAL "letter"; it sits between Analyze and Do. See `templates/iterate.template.md` for Evaluator-Optimizer details.

1. Trigger when match rate < 90% **or** any Critical issue remains.
2. Apply fixes and re-verify.
3. Default max 5 iterations (10 if only Critical items); stop if no improvement for 3 consecutive rounds.

> No cross-review for Iterate -- it is a remediation loop, not a document phase.

### learn (Wiki + completion report)

1. Require Analyze: match rate >= 90% and **zero** Critical issues.
2. Update `docs/wiki/{feature}.wiki.md` with verified facts, agent-friendly structure, and ASCII layouts for UI surfaces.
3. Write `docs/04-learn/{feature}.report.md` using `templates/learn.template.md`.
4. **Cross-review**: invoke the reviewer agent to produce `{feature}.report.review.md`.
5. Critically evaluate the review; accept valid points, reject with justification.
6. Typical close-out: `git push`, open PR with report as body (e.g. `gh pr create`), PR title with Gitmoji, open PR URL when applicable.

### archive (Archive)

1. Create `docs/archived/{feature}/`.
2. Move PEDAL artifacts: plan, engineering, analysis, report (and wiki copy if you version it).
3. **Remove** review files (`*.review.md`) and other non-PEDAL noise.
4. Set feature to `archived` in `.pedal-status.json`.
5. Example commit message: `chore: 🗃️ Archive {feature} PEDAL documents`

## Directory structure

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

## PEDAL flow

```
[Plan] → [Review] → [Engineering] → [Review] → [Do] → [Analyze] → [Review] ──→ [Learn] → [Review] → [Archive]
                                                           │    ↑
                                                           ↓    │
                                                        [Iterate]
                                                  (matchRate < 90%
                                                   OR Critical)
```

## Cross-review

Each document-producing phase invokes a **different AI agent** as reviewer. The reviewer writes a `*.review.md` file with findings classified as Critical / Warning / Info.

The main agent must **not** blindly accept the review:
- **Accept** valid findings and update the document.
- **Reject with justification** findings that are incorrect or out of scope.
- **All Critical items** from the review must be addressed (accepted or rejected with reason) before proceeding.

Full protocol, reviewer role definition, output format, and severity table: [REVIEW.md](REVIEW.md).

Tool-specific reviewer commands are in [GEMINI.md](../GEMINI.md) and [.cursor/rules/pedal.mdc](../.cursor/rules/pedal.mdc).

## Severity-weighted scoring

| Severity   | Weight | Iterate trigger |
| ---------- | :----: | ---------------- |
| Critical   | x3     | Always (even if >= 90%) |
| Warning    | x2     | If match rate < 90% |
| Info       | x1     | If match rate < 90% |

```
weightedScore = Σ(issue_severity_weight × issue_count)
maxPossibleScore = total_checked_items × 3
weightedMatchRate = (1 - weightedScore / maxPossibleScore) × 100
```

Any **Critical** issue -> iterate is **mandatory**, regardless of match rate threshold.

## `.pedal-status.json` schema

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

| Field                         | Type     | Description |
| ----------------------------- | -------- | ----------- |
| `version`                     | string   | Schema version |
| `lastUpdated`                 | ISO 8601 | Last update (use real system time) |
| `activeFeatures`              | string[] | Active feature names |
| `primaryFeature`              | string   | Current focus feature |
| `features.{name}.phase`       | enum     | `plan` \| `engineering` \| `do` \| `analyze` \| `iterate` \| `learn` \| `archived` |
| `features.{name}.status`      | enum     | `pending` \| `in_progress` \| `completed` \| `blocked` \| `archived` |
| `features.{name}.updatedAt`   | ISO 8601 | Phase update time |
| `features.{name}.description` | string   | Short description |
| `session.startedAt`           | ISO 8601 | Session start |
| `session.lastActivity`        | ISO 8601 | Last activity |
| `history[]`                   | array    | Event log |

## General rules

### Document language

PEDAL markdown (Plan, Engineering, Analysis, Report, Wiki) must use the **same language as the user's prompt**, unless the project mandates otherwise.

### Git workflow

- Commit at meaningful phase boundaries.
- Commit messages: `[type]: [gitmoji] [description]` with lowercase type (`feat`, `fix`, `docs`, `chore`, `style`, `refactor`, ...).
- PR titles follow the same Gitmoji convention when opening PRs.
- For parallel features, prefer isolated branches/worktrees.
- Timestamps in `.pedal-status.json`: use real system time (e.g. `date -u +"%Y-%m-%dT%H:%M:%SZ"`), not fake sequences.

### Phase guidance

After each phase, state clearly what the **next** PEDAL phase is and what the user should ask for next.

## Template references

Relative to this file:

- `templates/plan.template.md`
- `templates/engineering.template.md`
- `templates/iterate.template.md`
- `templates/analysis.template.md`
- `templates/learn.template.md`
- `REVIEW.md` (cross-review protocol)
