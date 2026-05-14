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

## Workspace-Level Architecture & Stateless Management

PEDAL operates at the **Workspace Root** level and uses a **Stateless**, directory-based structure to avoid merge conflicts and state synchronization issues. It relies on **Git Worktrees** to isolate feature development.

### Directory Structure

```text
/Workspace-Root/
├── .pedal/                 # PEDAL templates and specification
├── A_Project/              # Main Git Repository
│   └── docs/               # Persistent Wiki and Archived PEDAL docs
└── A_Project_feature_1/    # Git Worktree for 'feature_1' (Ephemeral)
    └── docs/
        ├── 01-plan/
        ├── 02-engineering/
        └── ...
```

### Stateless Phase Inference

Instead of relying on a `.pedal-status.json` file, the active status and current phase of any feature are determined dynamically:
1. **Worktree Existence**: If `A_Project_feature_1` exists in the workspace root, `feature_1` is active.
2. **Document Progression**: Inside the worktree, the presence of `docs/01-plan/*.plan.md`, `docs/02-engineering/*.engineering.md`, etc., indicates the completed phases.
3. **Archived**: Once merged and archived, the worktree is deleted, and the artifacts are moved to `A_Project/docs/archived/feature_1/`.

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
| **archive**     | Preserve PEDAL docs; remove noise     | Main repo `docs/archived/{feature}/`                               |

### plan (Plan)

1. **Auto-Worktree**: Create a new git worktree for the feature. From the Workspace Root, run: `git -C {project} worktree add ../{project}_{feature} -b feature/{feature}`.
2. **Move to Worktree**: All subsequent actions for this feature MUST occur within the new `{project}_{feature}` directory.
3. **Read wiki**: if `docs/wiki/index.md` exists, read it to understand current project state.
4. **Create prompt log**: write `docs/01-plan/{feature}.prompt.md` with the user's original request.
5. Create `docs/01-plan/{feature}.plan.md` from `templates/plan.template.md`.
6. User reviews the plan.

### engineering (Engineering)

1. Require a Plan document.
2. **Read wiki**: read relevant pages (architecture, APIs, data models, and `CONVENTIONS.md`) for context.
3. **Append to prompt log** if the user provided new direction.
4. Create `docs/02-engineering/{feature}.engineering.md` from `templates/engineering.template.md`.
5. Include ASCII art for expected UI where relevant.
6. User reviews the engineering document.

### do (Do)

1. Require Engineering document.
2. **Append to prompt log** if the user provided new direction.
3. Implement per Engineering (architecture, data model, API, etc.).
4. Complete Self-Review Criteria before Analyze.

### analyze (Analyze)

1. **Append to prompt log** if the user provided new direction.
2. Run gap / quality analysis. Compare Engineering document vs implementation.
3. Compute severity-weighted match rate. Any **Critical** issue forces iterate.
4. Create `docs/03-analysis/{feature}.analysis.md`.
5. User reviews the analysis.

### iterate (Improvement loop)

1. **Append to prompt log** if the user provided new direction.
2. Trigger when match rate < 90% **or** any Critical issue remains.
3. Apply fixes and re-verify.

### learn (Wiki + completion report)

1. **Append to prompt log** if the user provided new direction.
2. Require Analyze: match rate >= 90% and **zero** Critical issues.
3. **Integrate into wiki**: update existing wiki pages (or create new ones) in `docs/wiki/` with verified facts.
4. Write `docs/04-learn/{feature}.report.md` using `templates/learn.template.md`.
5. Typical close-out: `git push`, open PR with report as body.

### archive (Archive)

1. Ensure changes are merged into the main branch.
2. Copy the final PEDAL artifacts (`plan.md`, `engineering.md`, `analysis.md`, `report.md`, `prompt.md`) from the worktree to the main repository: `{project}/docs/archived/{feature}/`.
3. Switch context back to the Workspace Root.
4. **Remove Worktree**: Delete the worktree folder: `rm -rf {project}_{feature}`.
5. Prune git worktrees: `git -C {project} worktree prune`.
6. Delete the feature branch (if desired/merged): `git -C {project} branch -d feature/{feature}`.

## Directory structure inside a Project / Worktree

```
docs/
├── 01-plan/
│   ├── {feature}.prompt.md
│   └── {feature}.plan.md
├── 02-engineering/
│   └── {feature}.engineering.md
├── 03-analysis/
│   └── {feature}.analysis.md
├── 04-learn/
│   └── {feature}.report.md
├── wiki/
│   ├── index.md
│   └── overview.md
└── archived/
    └── {feature}/
        ├── {feature}.plan.md
        ├── ...
```
