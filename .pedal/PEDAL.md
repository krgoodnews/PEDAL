# PEDAL Workflow

> **Tool-agnostic specification.** Use this document from any AI assistant or CLI (e.g. Gemini CLI, Cursor).
> Gemini-specific slash commands and hooks live in [GEMINI.md](../GEMINI.md).

## What is PEDAL?

**PEDAL** is a development workflow inspired by the classic PDCA cycle, adapted for software delivery:

| Letter | Phase           | Focus                                        |
| ------ | --------------- | -------------------------------------------- |
| **P**  | **Plan**        | Goals, scope, requirements, risks            |
| **E**  | **Engineering** | Design, architecture, APIs, UI intent        |
| **D**  | **Do**          | Implement (code); no separate PEDAL document |
| **A**  | **Analyze**     | Gap analysis vs engineering + quality        |
| **L**  | **Learn**       | Wiki update + completion report + handoff    |

**Iterate** is a remediation loop between Analyze and Do (not a separate letter). **Archive** stores completed PEDAL artifacts for a feature.

Every phase that produces a PEDAL document goes through **cross-review** by a different AI agent. See [REVIEW.md](REVIEW.md) for the full protocol.

## 2-Tier State Management

To support parallel workflows (multiple worktrees/agents), PEDAL uses a split state architecture:

1.  **Shared State (`.pedal-status.shared.json`)**: Git-tracked. Contains feature phases, status, and history. The single source of truth for the project's progress.
2.  **Runtime State (`~/.pedal/<repo-id>/runtime.json`)**: Local-only (untracked). Contains active worktrees, agent PIDs, and last activity timestamps.

**Mandatory**: All state transitions must be performed via `scripts/pedal-sync.sh` to ensure advisory locking and atomic JSON merging (via `jq`).

## Phases (actions)

Use natural language or your tool's command style. Conceptually:

| Phase           | Purpose                               | Primary output                                                     |
| --------------- | ------------------------------------- | ------------------------------------------------------------------ |
| **plan**        | Capture planning for `{feature}`      | `docs/01-plan/{feature}.plan.md`                                   |
| **engineering** | Specify how to build it               | `docs/02-engineering/{feature}.engineering.md`                     |
| **do**          | Implement per Engineering doc         | Source code                                                        |
| **analyze**     | Compare engineering vs implementation | `docs/03-analysis/{feature}.analysis.md`                           |
| **iterate**     | Fix gaps until thresholds met         | Updated code; optional iteration notes                             |
| **learn**       | Document and close the cycle          | Wiki updates, `docs/04-learn/{feature}.report.md`                  |
| **archive**     | Preserve PEDAL docs; remove noise     | `docs/archived/{feature}/`                                         |

**Compound commands** (run multiple phases sequentially, with human approval gates in between):

| Command   | Phases run                        | Gate before next command                  |
| --------- | --------------------------------- | ----------------------------------------- |
| **spec**  | plan → engineering                | ⛔ Human approval required before `do`    |
| **build** | do → analyze                      | ⛔ Human approval required before `learn` |
| **dev**   | plan → engineering → do → analyze | Both gates above apply                    |

### plan (Plan)

1. **Auto-Worktree**: Execute `scripts/pedal-sync.sh plan --feature {feature}`. This creates a new feature branch and a dedicated git worktree in the parent directory (`../{repo}-{feature}`).
2. **Move to Worktree**: Move the agent's context to the newly created worktree directory before proceeding.
3. **Read wiki**: if `docs/wiki/index.md` exists, read it and any relevant pages (especially `docs/wiki/CONVENTIONS.md` for coding standards) to understand current project state before planning.
4. **Create prompt log**: write `docs/01-plan/{feature}.prompt.md` with the user's original request (see Prompt Log below).
5. Ensure `docs/01-plan/{feature}.plan.md` exists; create from `templates/plan.template.md` if missing.
6. **Cross-review**: invoke the reviewer agent to produce `{feature}.plan.review.md` (see [REVIEW.md](REVIEW.md)).
7. Critically evaluate the review; accept valid points, reject with justification.
8. Optional task label: `[Plan] {feature}`

> **Important:** Do not enter a special "plan-only" mode that blocks normal work. Write the Plan in normal interaction and report progress to the user.

### engineering (Engineering)

1. Require an approved Plan document.
2. **Read wiki**: read `docs/wiki/index.md` and relevant pages (architecture, APIs, data models, and `docs/wiki/CONVENTIONS.md`) for context on existing system and standards.
3. **Append to prompt log** if the user provided new direction or scope changes.
4. Create `docs/02-engineering/{feature}.engineering.md` from `templates/engineering.template.md`.
5. Include ASCII art for expected UI where relevant.
6. **Cross-review**: invoke the reviewer agent to produce `{feature}.engineering.review.md`.
7. Critically evaluate the review; accept valid points, reject with justification.
8. Optional task label: `[Engineering] {feature}` (depends on Plan)

### do (Do)

Do produces **code**, not a PEDAL document. Follow the Engineering document.

1. Require Engineering document.
2. **Read wiki**: read `docs/wiki/bug-patterns.md` and `docs/wiki/CONVENTIONS.md` (if exists) to avoid known mistakes and follow standards. Optionally read other relevant wiki pages for module boundaries.
3. **Append to prompt log** if the user provided new direction or scope changes.
4. Implement per Engineering (architecture, data model, API, etc.).
5. Complete **Self-Review Criteria** (Section 12 in `engineering.template.md`) before Analyze.
6. Optional task label: `[Do] {feature}` (depends on Engineering)

> No cross-review for Do -- code quality is validated in the Analyze phase.

### analyze (Analyze)

1. **Append to prompt log** if the user provided new direction or scope changes.
2. Run gap / quality analysis (e.g. gap-detector pattern).
3. Compare Engineering document vs implementation.
4. Compute **severity-weighted match rate** (see below).
5. Any **Critical** issue forces iterate regardless of aggregate match rate.
6. **Cross-review**: invoke the reviewer agent to produce `{feature}.analysis.review.md`.
7. Critically evaluate the review; accept valid points, reject with justification.
8. Optional task label: `[Analyze] {feature}`

### iterate (Improvement loop)

Not a standalone PEDAL "letter"; it sits between Analyze and Do. See `templates/ITERATOR.md` for Evaluator-Optimizer details.

1. **Append to prompt log** if the user provided new direction or scope changes.
2. Trigger when match rate < 90% **or** any Critical issue remains.
3. Apply fixes and re-verify.
4. Default max 5 iterations (10 if only Critical items); stop if no improvement for 3 consecutive rounds.

> No cross-review for Iterate -- it is a remediation loop, not a document phase.

### learn (Wiki + completion report)

1. **Append to prompt log** if the user provided new direction or scope changes.
2. Require Analyze: match rate >= 90% and **zero** Critical issues.
3. **Integrate into wiki**: read `docs/wiki/index.md`, then update existing wiki pages (or create new ones) with verified facts from this cycle. Update contradictory information to reflect current state. Update `index.md` after changes. See the **Wiki** section for full protocol.
4. **Append bug patterns** from Analyze/Iterate findings to `docs/wiki/bug-patterns.md`.
5. Write `docs/04-learn/{feature}.report.md` using `templates/learn.template.md`.
6. **Cross-review**: invoke the reviewer agent to produce `{feature}.report.review.md`.
7. Critically evaluate the review; accept valid points, reject with justification.
8. Typical close-out: `git push`, open PR with report as body (e.g. `gh pr create`), PR title with Gitmoji, open PR URL when applicable.

### archive (Archive)

1. **Cleanup**: Execute `scripts/pedal-sync.sh archive --feature {feature}`. This removes the dedicated git worktree and prunes git metadata.
2. Create `docs/archived/{feature}/`.
3. Move PEDAL artifacts: plan, engineering, analysis, report (and wiki copy if you version it).
4. **Remove** review files (`*.review.md`) and other non-PEDAL noise.
5. Set feature to `archived` in `.pedal-status.shared.json`.
6. Move prompt log together with other artifacts; it becomes part of the historical record.
7. Example commit message: `chore: 🗃️ Archive {feature} PEDAL documents`

### spec (Plan + Engineering)

Runs **plan** then **engineering** back-to-back. Stops after Engineering is committed and waits for human approval before the user starts `do` or `build`.

```
1. Execute plan phase fully (all steps, cross-review, commit).
2. Execute engineering phase fully (all steps, cross-review, commit).
3. STOP — present a summary and prompt the user:
   "spec complete. Review docs/02-engineering/{feature}.engineering.md
    and approve before running 'do' or 'build'."
```

> **Why gate here?** Engineering is the implementation blueprint. Running `do` against an unapproved blueprint risks wasted work.

### build (Do + Analyze)

Runs **do** then **analyze** back-to-back (including any triggered **iterate** cycles). Stops after Analyze is committed and waits for human approval before `learn`.

```
1. Require an approved Engineering document (spec gate must have been passed).
2. Execute do phase fully (implementation + self-review checklist, commit).
3. Execute analyze phase fully (gap analysis, iterate if needed, cross-review, commit).
4. STOP — present a summary and prompt the user:
   "build complete. Review docs/03-analysis/{feature}.analysis.md
    and approve before running 'learn'."
```

> **Why gate here?** Analyze may surface issues that require scope re-negotiation with the user before writing the final Learn report.

### dev (Plan + Engineering + Do + Analyze)

Runs **spec** then **build** in sequence. Both human approval gates are enforced.

```
1. Execute spec (plan → engineering) — commit after each phase.
2. PAUSE: "Engineering complete. Approve to continue to Do?" → wait for explicit user approval.
3. Execute build (do → analyze + iterate if needed) — commit after each phase.
4. PAUSE: "Analyze complete. Approve to continue to Learn?" → wait for explicit user approval.
5. STOP — present a full cycle summary.
```

**Sequence diagram:**

```
dev
 ├─ plan ──commit──┐
 ├─ engineering ───commit──[GATE 1: human approval]
 ├─ do ────commit──┐
 └─ analyze ──(iterate?)──commit──[GATE 2: human approval]
```

> Each phase must reach its final step (including cross-review and commit) before the next phase starts. Never overlap phases.

## Prompt Log

Each feature has a **single append-only** file `docs/01-plan/{feature}.prompt.md` that records user prompts throughout the PEDAL cycle.

### Purpose

```
User prompt ──→ Main agent interprets ──→ PEDAL document
                       ↑
         Reviewer needs the original to verify this transformation
```

Without the raw prompt, the reviewer can only judge the document on its own merits but cannot verify whether the main agent **correctly interpreted** the user's intent.

### Rules

| Rule                  | Detail                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Create**            | At the start of the Plan phase, before writing `plan.md`.                                 |
| **Append**            | At any phase, when the user gives a prompt that changes direction, scope, or constraints. |
| **Skip**              | Trivial prompts ("proceed", "looks good", "continue") are NOT recorded.                   |
| **Immutable entries** | Once an entry is written, it must never be edited or deleted. Append only.                |
| **Archive**           | Moved together with other PEDAL artifacts during the archive phase.                       |

### Format

```markdown
# Prompt Log: {feature}

## [Plan] {ISO timestamp}

{verbatim user prompt}

## [Engineering] {ISO timestamp}

{verbatim user prompt — only if the user changed direction/scope}

## [Iterate] {ISO timestamp}

{verbatim user prompt — e.g. "focus on security issues first"}
```

- Section heading = `## [{phase}] {ISO 8601 timestamp}`
- Body = the user's prompt, copied verbatim (no interpretation, no summarization).
- Multiple entries per phase are allowed (e.g. two `[Do]` entries if the user changed scope twice).

### Reviewer access

When invoking the reviewer, always include the prompt log in the review command so the reviewer can compare user intent vs document output. (See [REVIEW.md](REVIEW.md) for details.)

## Directory structure

```
docs/
├── 01-plan/
│   ├── {feature}.prompt.md   ← prompt log (append-only)
│   └── {feature}.plan.md
├── 02-engineering/
│   └── {feature}.engineering.md
├── 03-analysis/
│   └── {feature}.analysis.md
├── 04-learn/
│   └── {feature}.report.md
├── wiki/                            ← project-wide SSOT (see Wiki section)
│   ├── index.md                 ← catalog of all wiki pages
│   ├── overview.md              ← project summary, tech stack, architecture
│   ├── {topic}.md               ← topic pages (agent splits freely)
│   └── bug-patterns.md          ← bug pattern registry (append-only)
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
- **Review limit**: The review process is limited to a **maximum of 2 rounds**.
- **2nd round trigger**: A 2nd round is only required if the first review contains **Critical** items that are accepted and fixed.
- **Cycle termination**: After the 2nd round, the review loop ends. If Critical items remain unresolved, report to the user and wait for instructions.

Full protocol, reviewer role definition, output format, and severity table: [REVIEW.md](REVIEW.md).

Tool-specific reviewer commands are in [GEMINI.md](../GEMINI.md) and [.cursor/rules/pedal.mdc](../.cursor/rules/pedal.mdc).

## Wiki (Project Knowledge Base)

The wiki is a **persistent, compounding knowledge base** maintained by AI agents. It serves as the project's **Single Source of Truth (SSOT)** for current state — architecture, APIs, data models, conventions, and accumulated knowledge from all PEDAL cycles.

### Core Principle

```
PEDAL artifacts (Plan, Engineering, Analysis)  → per-feature, ephemeral, eventually archived
Wiki                                           → project-wide, persistent, cumulative
```

Unlike PEDAL documents scoped to a single feature cycle, the wiki reflects the **current state of the entire project**. Each Learn phase *integrates* new knowledge into the existing wiki rather than creating isolated feature files.

### Architecture

| Layer            | Content                                | Lifecycle                                |
| ---------------- | -------------------------------------- | ---------------------------------------- |
| **Source code**  | The actual implementation              | Ground truth                             |
| **Wiki**         | Project-wide synthesized knowledge     | LLM-maintained, persistent, incremental  |
| **PEDAL docs**   | Feature-scoped plans, specs, analyses  | Created per cycle, eventually archived   |

The wiki sits between PEDAL docs and source code — a compiled, navigable knowledge layer that saves the agent from re-deriving project understanding from scratch on every cycle.

### When to Read / Write

| Phase           | Action                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| **Plan**        | **Read** — understand current project state before scoping new work    |
| **Engineering** | **Read** — reference existing architecture, APIs, data models          |
| **Do**          | **Read** — check known bug patterns, conventions, module boundaries    |
| **Learn**       | **Write** — integrate verified facts from the completed cycle          |

### Directory Structure

```
docs/wiki/
├── index.md          ← catalog of all pages (agent reads this first)
├── overview.md       ← project summary, tech stack, high-level architecture
├── {topic}.md        ← topic pages as needed (split freely for readability)
└── bug-patterns.md   ← bug pattern registry (append-only)
```

The agent decides how to organize topic pages. Files can be split, merged, or reorganized as the project evolves. The only fixed conventions:

- `index.md` — always present, always current.
- `bug-patterns.md` — append-only registry.
- Everything else — agent's discretion based on project size and domain.

### index.md

A catalog of every wiki page with a one-line summary. The agent reads this **first** to locate relevant pages, then drills into them.

```markdown
# Wiki Index

| Page | Summary | Last Updated |
|------|---------|--------------|
| [overview](overview.md) | Project summary, tech stack, deployment | 2026-04-09 |
| [architecture](architecture.md) | System layers, dependencies, data flow | 2026-04-09 |
| [bug-patterns](bug-patterns.md) | Known bug patterns and prevention rules | 2026-04-09 |
```

Update `index.md` every time a wiki page is created, renamed, or significantly changed.

### Operations

**Integrate** (during Learn): Read the PEDAL artifacts and code from the completed cycle. Extract verified facts and update existing wiki pages — or create new ones. A single feature cycle may touch multiple wiki pages. When new information **contradicts** existing wiki content, update the wiki to reflect current state (do not keep both versions). Update `index.md` after changes.

**Reference** (during Plan / Engineering / Do): Read `index.md`, identify relevant pages, read them for context. Do **not** modify the wiki outside of the Learn phase.

**Lint** (optional, periodic): Check for stale information that no longer matches the codebase, orphan pages, missing cross-references, or gaps in coverage. The agent can suggest wiki maintenance when it detects drift.

### Guidelines

- Document only **verified facts** that match the current project state.
- Write for both **humans reading guides** and **AI agents performing future tasks**.
- For UI-bearing features, include **ASCII Art** depicting screen layouts and component hierarchy.
- Keep pages focused — prefer multiple smaller files over one giant file.
- The wiki is just markdown files in a git repo. Version history comes for free.

---

## Severity-weighted scoring

| Severity | Weight | Iterate trigger         |
| -------- | :----: | ----------------------- |
| Critical |   x3   | Always (even if >= 90%) |
| Warning  |   x2   | If match rate < 90%     |
| Info     |   x1   | If match rate < 90%     |

```
weightedScore = Σ(issue_severity_weight × issue_count)
maxPossibleScore = total_checked_items × 3
weightedMatchRate = (1 - weightedScore / maxPossibleScore) × 100
```

Any **Critical** issue -> iterate is **mandatory**, regardless of match rate threshold.

## `.pedal-status.shared.json` schema

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

| Field                         | Type     | Description                                                                        |
| ----------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `version`                     | string   | Schema version                                                                     |
| `lastUpdated`                 | ISO 8601 | Last update (use real system time)                                                 |
| `activeFeatures`              | string[] | Active feature names                                                               |
| `primaryFeature`              | string   | Current focus feature                                                              |
| `features.{name}.phase`       | enum     | `plan` \| `engineering` \| `do` \| `analyze` \| `iterate` \| `learn` \| `archived` |
| `features.{name}.status`      | enum     | `pending` \| `in_progress` \| `completed` \| `blocked` \| `archived`               |
| `features.{name}.updatedAt`   | ISO 8601 | Phase update time                                                                  |
| `features.{name}.description` | string   | Short description                                                                  |
| `session.startedAt`           | ISO 8601 | Session start                                                                      |
| `session.lastActivity`        | ISO 8601 | Last activity                                                                      |
| `history[]`                   | array    | Event log                                                                          |

## General rules

### Document language

PEDAL markdown (Plan, Engineering, Analysis, Report, Wiki) must use the **same language as the user's prompt**, unless the project mandates otherwise.

### Git workflow

- Commit at meaningful phase boundaries.
- Commit messages: `[type]: [gitmoji] [description]` with lowercase type (`feat`, `fix`, `docs`, `chore`, `style`, `refactor`, ...).
- PR titles follow the same Gitmoji convention when opening PRs.
- For parallel features, prefer isolated branches/worktrees.
- Timestamps in `.pedal-status.shared.json`: use real system time (e.g. `date -u +"%Y-%m-%dT%H:%M:%SZ"`), not fake sequences.

### Phase guidance

After each phase, state clearly what the **next** PEDAL phase is and what the user should ask for next.

## Template references

Relative to this file:

- `templates/plan.template.md`
- `templates/engineering.template.md`
- `templates/ITERATOR.md`
- `templates/analysis.template.md`
- `templates/learn.template.md`
- `REVIEW.md` (cross-review protocol)
