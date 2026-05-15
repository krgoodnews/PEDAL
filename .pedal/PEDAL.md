# PEDAL Workflow

> **Tool-agnostic specification.** This document can be used from any AI assistant or CLI, such as Gemini CLI or Cursor.
> Tool-specific commands, hooks, and auto-loading behavior should be implemented by each agent's adapter document by referencing this specification.

## What is PEDAL?

**PEDAL** is a development workflow inspired by the classic PDCA cycle and adapted for software delivery.

| Letter | Phase           | Focus                                        |
| ------ | --------------- | -------------------------------------------- |
| **P**  | **Plan**        | Goals, scope, requirements, risks            |
| **E**  | **Engineering** | Design, architecture, APIs, UI intent        |
| **D**  | **Do**          | Implementation (code); no separate PEDAL doc |
| **A**  | **Analyze**     | Gap analysis vs Engineering plus quality     |
| **L**  | **Learn**       | Wiki update, completion report, handoff      |

**Iterate** is an improvement loop between Analyze and Do (not a separate letter). **Archive** preserves completed PEDAL artifacts for each feature.

## Tool / Agent Integration Principles

This document is the single source of truth for PEDAL. Gemini, Copilot, Claude, Cursor, and other CLIs or agents execute PEDAL according to these principles.

1. **Common specification first**: Prefer this document's phase definitions and artifact rules over tool-specific instructions.
2. **Commands are adapters only**: Even without slash commands such as `/pedal plan ...`, natural-language requests can execute the same phases.
3. **Fixed phase names**: Tool-specific commands must map to one of `plan`, `engineering`, `do`, `analyze`, `iterate`, `learn`, `archive`, `status`, or `next`.
4. **Stateless operation**: Do not create a separate status file. Infer state from worktrees and `docs/` artifacts.
5. **Workspace-root execution**: Start PEDAL and check status from the workspace root. Perform feature-specific file work inside the feature worktree.
6. **Project convention compliance**: During Plan, Engineering, Do, and Analyze, read and follow `docs/wiki/CONVENTIONS.md` if it exists.
7. **Isolate tool-specific extensions**: Put tool-specific hooks, notifications, slash commands, and skill metadata in adapter documents, not in this file.

### Recommended Agent Entry Points

| Target tool / agent | Recommended file                         | Role                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------- |
| Gemini CLI          | `GEMINI.md`                              | Gemini slash commands, hooks, skill metadata      |
| GitHub Copilot      | `.github/copilot-instructions.md`        | Direct Copilot to this PEDAL specification        |
| General agents      | `AGENTS.md`                              | Help tool-neutral agents execute PEDAL            |
| Other tools         | Tool-specific custom instruction/rules   | Import or link to this document                   |

If a tool does not support dedicated commands, users can request PEDAL actions in natural language:

| Example request                                | Executed phase                         |
| ---------------------------------------------- | -------------------------------------- |
| `PEDAL plan A_Project user-auth`               | plan                                   |
| `PEDAL engineering A_Project user-auth`        | engineering                            |
| `PEDAL do A_Project user-auth`                 | do                                     |
| `PEDAL analyze A_Project user-auth`            | analyze                                |
| `PEDAL status A_Project`                       | status                                 |
| `PEDAL spec A_Project user-auth`               | plan -> engineering                    |
| `PEDAL build A_Project user-auth`              | do -> analyze (+ iterate if needed)    |
| `PEDAL dev A_Project user-auth`                | plan -> engineering -> do -> analyze   |

## Workspace-Level Architecture and Stateless Management

PEDAL operates at the **workspace root** level. To avoid merge conflicts and state synchronization issues, it uses a **stateless**, directory-based structure and relies on **Git worktrees** to isolate feature development.

### Directory Structure

```text
/Workspace-Root/
├── .pedal/                 # PEDAL templates and specification
├── A_Project/              # Main Git repository
│   └── docs/               # Persistent wiki and archived PEDAL docs
└── A_Project_feature_1/    # Git worktree for feature_1 (temporary)
    └── docs/
        ├── 01-plan/
        ├── 02-engineering/
        └── ...
```

### Stateless Phase Inference

Instead of relying on a `.pedal-status.json` file, determine each feature's active state and current phase dynamically.

1. **Worktree existence**: If `A_Project_feature_1` exists at the workspace root, `feature_1` is active.
2. **Document progression**: Inside the worktree, the presence of `docs/01-plan/*.plan.md`, `docs/02-engineering/*.engineering.md`, and related artifacts indicates completed phases.
3. **Archived**: After merge and archive, the worktree is removed and artifacts move to `A_Project/docs/archived/feature_1/`.

## Phases (Actions)

Use natural language or the command style of the current tool. Conceptually:

| Phase           | Purpose                              | Primary output                                      |
| --------------- | ------------------------------------ | --------------------------------------------------- |
| **plan**        | Record the plan for `{feature}`      | `docs/01-plan/{feature}.plan.md`                    |
| **engineering** | Specify how to implement it          | `docs/02-engineering/{feature}.engineering.md`      |
| **do**          | Implement according to Engineering   | Source code                                         |
| **analyze**     | Compare Engineering and implementation | `docs/03-analysis/{feature}.analysis.md`          |
| **iterate**     | Fix gaps until criteria are met      | Updated code; optional iteration notes              |
| **learn**       | Document and close the cycle         | Wiki updates, `docs/04-learn/{feature}.report.md`  |
| **archive**     | Preserve PEDAL docs and remove noise | Main repo `docs/archived/{feature}/`                |

### Common Execution Flow

Before starting phase-specific work, each PEDAL phase first updates the prompt log.

1. If `docs/01-plan/{feature}.prompt.md` does not exist, create it with the user's original request.
2. If the prompt log already exists and the user provides a new direction, scope change, approval/rejection, or additional constraint, append that information.
3. Then execute the phase-specific procedure.

### plan (Plan)

1. **Automatic worktree**: Create a new git worktree for the feature from the workspace root: `git -C {project} worktree add ../{project}_{feature} -b feature/{feature}`.
2. **Move to the worktree**: All subsequent work for this feature must happen inside the new `{project}_{feature}` directory.
3. **Read the wiki**: If `docs/wiki/index.md` exists, read it to understand the current project state.
4. Create `docs/01-plan/{feature}.plan.md` from `templates/plan.template.md`.
5. The user reviews the plan and may edit `{feature}.plan.md` as needed.

### engineering (Engineering)

1. Require a Plan document. Treat `plan.md` as newly written and potentially subject to change.
2. **Read the wiki**: Read relevant pages such as architecture, API, data model, and `CONVENTIONS.md`.
3. Create `docs/02-engineering/{feature}.engineering.md` from `templates/engineering.template.md`.
4. Include ASCII art for expected UI where relevant.
5. The user reviews the Engineering document.

### do (Do)

1. Require an Engineering document.
2. Before implementation, read `.pedal/DO.md` and apply it together with project-specific instructions such as `docs/wiki/CONVENTIONS.md`.
3. Implement according to Engineering, including architecture, data model, API, and related details.
4. Complete the Self-Review Criteria before Analyze.

### analyze (Analyze)

1. Run gap and quality analysis. Compare the Engineering document against the implementation.
2. Compute the severity-weighted match rate. Any **Critical** issue forces iterate.
3. Create `docs/03-analysis/{feature}.analysis.md`.
4. The user reviews the analysis.

### iterate (Improvement Loop)

1. Trigger when the match rate is below 90% or any **Critical** issue remains.
2. Apply fixes and verify again.

### learn (Wiki + Completion Report)

1. Require Analyze: match rate must be 90% or higher and **Critical** issues must be 0.
2. **Integrate into the wiki**: Update existing wiki pages or create new pages in `docs/wiki/` with verified facts.
3. Write `docs/04-learn/{feature}.report.md` using `templates/learn.template.md`.
4. Typical close-out tasks: `git push`, then create a PR with the report as the body.

### archive (Archive)

1. Ensure changes have been merged into the main branch.
2. Copy final PEDAL artifacts (`plan.md`, `engineering.md`, `analysis.md`, `report.md`, `prompt.md`) from the worktree to `{project}/docs/archived/{feature}/` in the main repository.
3. Switch context back to the workspace root.
4. **Remove the worktree**: Delete the worktree folder: `rm -rf {project}_{feature}`.
5. Prune git worktrees: `git -C {project} worktree prune`.
6. Delete the feature branch if desired and already merged: `git -C {project} branch -d feature/{feature}`.

## Project / Worktree Directory Structure

```text
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
