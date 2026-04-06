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
  - .pedal/PEDAL.md
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

# PEDAL Skill (Gemini CLI)

> Full workflow specification: **[.pedal/PEDAL.md](.pedal/PEDAL.md)** (tool-agnostic).  
> This file adds **Gemini CLI** slash commands and hooks only.

## Slash commands

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

Execute each phase according to **Action Details** in [.pedal/PEDAL.md](.pedal/PEDAL.md). Map slash commands to those phases 1:1.

## Cross-review (when Gemini is main agent)

When Gemini CLI is the main agent authoring PEDAL documents, **Cursor CLI** acts as the reviewer. After each document-producing phase, run:

```bash
agent -p "Review the file {path_to_document}. Also read {path_to_prompt_log} for the user's original intent. You are a critical reviewer. Follow the protocol in .pedal/REVIEW.md. Write your review to {path_to_review_output}." --model "composer 2"
```

**Examples:**

```bash
# After Plan phase
agent -p "Review docs/01-plan/features/user-auth.plan.md. Also read docs/01-plan/features/user-auth.prompt.md for original intent. You are a critical reviewer. Follow .pedal/REVIEW.md. Write review to docs/01-plan/features/user-auth.plan.review.md" --model "composer 2"

# After Engineering phase
agent -p "Review docs/02-engineering/features/user-auth.engineering.md. Also read docs/01-plan/features/user-auth.prompt.md for original intent. You are a critical reviewer. Follow .pedal/REVIEW.md. Write review to docs/02-engineering/features/user-auth.engineering.review.md" --model "composer 2"
```

After receiving the review, critically evaluate each finding. Accept valid points, reject incorrect ones with justification. See [.pedal/REVIEW.md](.pedal/REVIEW.md) for full protocol.

## Gemini-specific

### Notifications

- On task completion, send a notification using `./scripts/bkit-notify.sh` to bring focus to the active terminal.

### Imports (templates)

Templates are listed in YAML `imports` above and in [.pedal/PEDAL.md](.pedal/PEDAL.md#template-references).
