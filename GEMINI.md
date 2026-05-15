---
name: pedal
classification: W
description: |
  Unified skill for managing the entire PEDAL cycle.
  PEDAL is a workspace-level workflow modeled after the traditional PDCA cycle.
  Supports 'Plan → Engineering → Do → Analyze → Learn' workflow with automatic phase progression.

  Use proactively when user mentions PEDAL cycle, planning, engineering documents,
  gap analysis, iteration, or completion reports.

  Do NOT use for: simple one-line fixes, non-development tasks

argument-hint: "[plan|engineering|do|analyze|iterate|learn|archive|status|next|spec|build|dev] [project] [feature]"

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
  - .pedal/PEDAL.md
  - .pedal/templates/plan.template.md
  - .pedal/templates/engineering.template.md
  - .pedal/templates/ITERATOR.md
  - .pedal/templates/analysis.template.md
  - .pedal/templates/learn.template.md

task-template:
  subject: "PEDAL {action} - {project} / {feature}"
  description: "Execute PEDAL {action} phase for feature '{feature}' in project '{project}'"
  activeForm: "Executing PEDAL {action}"
---

# PEDAL Skill (Gemini CLI)

> Full workflow specification: **[.pedal/PEDAL.md](.pedal/PEDAL.md)** (tool-agnostic).  
> This file adds **Gemini CLI** slash commands and hooks only.

## Slash commands

PEDAL operates at the **Workspace Root** level. All commands must be executed in the root directory that contains your project repositories.

**Single phase:**

| Argument                           | Description                               | Example                                    |
| ---------------------------------- | ----------------------------------------- | ------------------------------------------ |
| `plan [project] [feature]`         | Create Plan document & Worktree           | `/pedal plan A_Project user-auth`          |
| `engineering [project] [feature]`  | Create Engineering document               | `/pedal engineering A_Project user-auth`   |
| `do [project] [feature]`           | Begin implementation (no document output) | `/pedal do A_Project user-auth`            |
| `analyze [project] [feature]`      | Run Gap analysis                          | `/pedal analyze A_Project user-auth`       |
| `iterate [project] [feature]`      | Auto improvement loop                     | `/pedal iterate A_Project user-auth`       |
| `learn [project] [feature]`        | Write Wiki and generate completion report | `/pedal learn A_Project user-auth`         |
| `archive [project] [feature]`      | Archive docs and remove Worktree          | `/pedal archive A_Project user-auth`       |
| `status [project]`                 | Show current status based on files        | `/pedal status A_Project`                  |
| `next [project] [feature]`         | Guide to next phase                       | `/pedal next A_Project user-auth`          |

**Compound (multi-phase, sequential):**

| Argument                     | Aliases | Phases run                        | Gate                                         | Example                             |
| ---------------------------- | ------- | --------------------------------- | -------------------------------------------- | ----------------------------------- |
| `spec [project] [feature]`   | `pe`    | plan → engineering                | ⛔ Pauses; human must approve before `do`    | `/pedal spec A_Project user-auth`   |
| `build [project] [feature]`  | `da`    | do → analyze (+ iterate)          | ⛔ Pauses; human must approve before `learn` | `/pedal build A_Project user-auth`  |
| `dev [project] [feature]`    |         | plan → engineering → do → analyze | Both gates above apply                       | `/pedal dev A_Project user-auth`    |

> Each phase within a compound command runs to completion before the next phase starts.

Execute each phase according to **Action Details** in [.pedal/PEDAL.md](.pedal/PEDAL.md). Map slash commands to those phases 1:1.

## Gemini-specific Actions

### Workspace-level Git Worktree Management
- **Automatic Worktrees**: `/pedal plan [project] [feature]` runs `git -C [project] worktree add ../[project]_[feature] -b feature/[feature]`.
- **Targeting**: When running commands for a feature, Gemini MUST execute file operations and shell commands within the `[project]_[feature]` worktree directory, NOT the main `[project]` directory.
- **Cleanup**: `/pedal archive [project] [feature]` removes the `[project]_[feature]` worktree folder, runs `git -C [project] worktree prune`, and deletes the branch.

### Stateless Status Tracking
Gemini does NOT use a JSON state file. Instead, it infers the state of a feature dynamically by checking the file system:
- **Active Feature**: If directory `[project]_[feature]` exists in the root, the feature is in progress.
- **Phase Detection**:
  - If `docs/01-plan/[feature].plan.md` exists but `docs/02-engineering/[feature].engineering.md` does not, it is in the **Plan** phase.
  - If `02-engineering` exists but code hasn't been written/verified, it is in the **Engineering** or **Do** phase.
  - If `docs/03-analysis/[feature].analysis.md` exists, it has completed **Analyze**.
  - If it is in `docs/archived/[feature]`, it is **Archived**.

When a user runs `/pedal status [project]`, Gemini dynamically scans the workspace directories and `docs/` folders to output a beautiful terminal summary of what features are active and what phase they are in.

### Convention Compliance
- **Mandatory**: Always read `docs/wiki/CONVENTIONS.md` (if it exists) during Plan, Engineering, Do, and Analyze phases to ensure strict adherence to project standards.

### Notifications
- On task completion, send a notification using `./scripts/pedal-notification.sh` to bring focus to the active terminal.

### Imports (templates)
Templates are listed in YAML `imports` above and in [.pedal/PEDAL.md](.pedal/PEDAL.md#template-references).