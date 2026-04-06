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
  - .pedal/templates/do.template.md
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
| `do [feature]`          | Do phase guide                            | `/pedal do user-auth`          |
| `analyze [feature]`     | Run Gap analysis                          | `/pedal analyze user-auth`     |
| `iterate [feature]`     | Auto improvement loop                     | `/pedal iterate user-auth`     |
| `learn [feature]`       | Write Wiki and generate completion report | `/pedal learn user-auth`       |
| `archive [feature]`     | Archive PEDAL documents                   | `/pedal archive user-auth`     |
| `status`                | Show current status                       | `/pedal status`                |
| `next`                  | Guide to next phase                       | `/pedal next`                  |

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

1. Verify Engineering document exists.
2. Provide implementation guide based on do.template.md.
3. Create Task: `[Do] {feature}` (blockedBy: Engineering)

### analyze (Analyze Phase)

1. Call gap-detector agent.
2. Compare Engineering document vs actual implementation.
3. Calculate Match Rate.
4. Create Task: `[Analyze] {feature}`

### iterate (Improvement Loop)

Iterate is not a standalone PEDAL phase — it is a remediation loop between Analyze and Do.

1. Triggered when matchRate < 90%.
2. Auto-fix issues and re-verify.
3. Max 5 iterations.

### learn (Wiki & Completion Report)

1. Verify Analyze matchRate >= 90%.
2. Update project Wiki based on what was accomplished in this PEDAL cycle.
3. Create completion report (`{feature}.report.md`) based on learn.template.md.
4. Auto `git push` and create a GitHub PR via `gh pr create`, using the report content as the PR body.
5. PR title must include the appropriate Gitmoji (e.g., `feat: ✨ Feature name`).
6. Automatically open the created PR URL in the browser via `open`.

## PEDAL Flow

```
[Plan] → [Engineering] → [Do] → [Analyze] → [Iterate] → [Learn]
                                       ↑_________|
                                    (if < 90%)
```

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

## References

- .pedal/templates/plan.template.md
- .pedal/templates/engineering.template.md
- .pedal/templates/do.template.md
- .pedal/templates/analysis.template.md
- .pedal/templates/learn.template.md
