---
name: pedal
classification: W
description: |
  Unified skill for managing the entire PEDAL cycle.
  PEDAL is a workflow modeled after the traditional PDCA workflow.
  Supports 'Plan → Engineering → Do → Analyze → Learn' workflow with automatic phase progression.

  Use proactively when user mentions PDCA cycle, planning, design documents,
  gap analysis, iteration, or completion reports.

  Triggers: pedal, pdca, plan, engineering, design, analyze, check, learn, report, status, next, iterate,
  계획, 설계, 분석, 검증, 보고서, 반복, 개선,

  Do NOT use for: simple one-line fixes, non-development tasks

argument-hint: "[plan|engineering|do|analyze|iterate|learn|archive|status|next] [feature]"

allowed-tools:
  - ask_user
  - google_web_search
  - glob
  - grep_search
  - google_web_search
  - replace
  - run_shell_command
  - read_file
  - write_file
  - web_fetch

imports:
  - templates/plan.template.md
  - templates/design.template.md
  - templates/analysis.template.md
  - templates/report.template.md

agents:
  analyze: gap-detector
  iterate: pdca-iterator
  report: report-generator

context: session
memory: project
pdca-phase: all

task-template:
  subject: "PDCA {action} - {feature}"
  description: "Execute PDCA {action} phase for feature '{feature}'"
  activeForm: "Executing PDCA {action}"
---

# PDCA Skill

> Unified Skill for managing PDCA cycle. Supports the entire Plan → Design → Do → Check → Act flow.

## Arguments

| Argument            | Description                | Example                   |
| ------------------- | -------------------------- | ------------------------- |
| `plan [feature]`    | Create Plan document       | `/pdca plan user-auth`    |
| `design [feature]`  | Create Design document     | `/pdca design user-auth`  |
| `do [feature]`      | Do phase guide             | `/pdca do user-auth`      |
| `analyze [feature]` | Run Gap analysis (Check)   | `/pdca analyze user-auth` |
| `iterate [feature]` | Auto improvement (Act)     | `/pdca iterate user-auth` |
| `report [feature]`  | Generate completion report | `/pdca report user-auth`  |
| `archive [feature]` | Archive PDCA documents     | `/pdca archive user-auth` |
| `status`            | Show current status        | `/pdca status`            |
| `next`              | Guide to next phase        | `/pdca next`              |

## Action Details

### plan (Plan Phase)

1. Check if `docs/01-plan/features/{feature}.plan.md` exists
2. If not, create based on plan.template.md
3. Create Task: `[Plan] {feature}`

### design (Design Phase)

1. Verify Plan document exists
2. Create `docs/02-design/features/{feature}.design.md`
3. Create Task: `[Design] {feature}` (blockedBy: Plan)

### do (Do Phase)

1. Verify Design document exists
2. Provide implementation guide
3. Create Task: `[Do] {feature}` (blockedBy: Design)

### analyze (Check Phase)

1. Call gap-detector agent
2. Compare Design vs implementation
3. Calculate Match Rate
4. Create Task: `[Check] {feature}`

### iterate (Act Phase)

1. Check results (when matchRate < 90%)
2. Call pdca-iterator agent
3. Auto-fix and re-verify
4. Max 5 iterations

### report (Completion Report)

1. Verify Check >= 90%
2. Call report-generator agent
3. Create completion report
4. Push & Create PR (PR의 내용은 report.md의 내용을 기반으로 작성)

## PDCA Flow

```
[Plan] ✅ → [Design] ✅ → [Do] ✅ → [Check] 🔄 → [Act] ⏳ → [Report] 📋
                                       ↑_________|
                                    (if < 90%)
```

- 각 단계마다 Commit을 남길 것.
  - Gitmoji를 활용한 커밋 메시지
  - 커밋 메시지는 한글로 작성할 것 (예: "feat: ✨ 알림 중복 방지")
- PDCA Flow 각 단계를 수행할 때마다, 다음 단계의 명령어를 사용자에게 안내할 것.

## References

- `${extensionPath}/templates/plan.template.md`
- `${extensionPath}/templates/design.template.md`
- `${extensionPath}/templates/analysis.template.md`
- `${extensionPath}/templates/report.template.md`

## Gemini Added Memories

- When executing the `/pdca design` phase, always include an ASCII Art visualization of the expected user interface in the generated markdown document.
- [PDCA Git Workflow Automation]: When executing `/pdca plan`, first git pull origin main, then create and checkout a new branch from main named `feature/{feature_name}` or `fix/{error_name}`. For every PDCA step, automatically commit changes.
- [Worktree-Centric Parallelism]: To prevent Working Directory pollution during parallel PDCA cycles, prefer using `git worktree add ../{project_name}-{feature_name} feature/{feature_name}` for each new feature. This allows multiple agents or tasks to run in physically separate directories without interfering with each other's Git Index or file state. Maintain the existing strategy of creating branches at the `plan` phase for clear isolation.
- When updating .pdca-status.json or writing any PDCA timestamps, ALWAYS use the actual current system timestamp (e.g., $(date -u +"%Y-%m-%dT%H:%M:%SZ")) instead of hardcoded or sequential arbitrary times.
- [Git Commit Message Format]: When committing changes, use the format: `[type]: [gitmoji] [description]` starting with a lowercase letter for the type. Example: `feature: ✨ Implement web-canvas-preview logic and simulator UI` instead of `✨ Feature: ...`. Types can be feature, fix, docs, chore, style, refactor, etc.
- [Git Commit Message Format]: When committing changes, use the format: `[type]: [gitmoji] [description]` starting with a lowercase letter for the type. Use `feat` instead of `feature`. Example: `feat: ✨ Implement web-canvas-preview logic and simulator UI`. Types: feat, fix, docs, chore, style, refactor, etc.
- Always write PDCA markdown documents (Plan, Design, Analysis, Report) in natural Korean.
- When creating a Pull Request (PR) title, ALWAYS include the appropriate Gitmoji at the beginning, matching the format and position used in the commit messages (e.g., 'feat: ✨ 기능 이름').
- 작업 완료 또는 사용자 승인 후에는 항상 osascript를 사용하여 macOS 알림을 보냅니다. 예: osascript -e 'display notification "작업이 완료되었습니다!" with title "Gemini CLI"'
- 작업 완료 시 ./scripts/bkit-notify.sh를 사용하여 알림을 보냅니다. 이 스크립트는 현재 사용 중인 터미널 앱으로 포커스를 유도합니다.
- [PDCA Workflow Automation]: `/pdca report` 단계가 완료되면 자동으로 `git push`를 수행하고, 생성된 `{feature}.report.md` 파일의 내용을 본문으로 사용하여 GitHub Pull Request(`gh pr create`)를 생성한다. PR 제목에는 적절한 Gitmoji를 포함한다.
- [PDCA Workflow Automation]: `/pdca report` 단계가 완료되어 `gh pr create`로 PR이 생성되면, 출력된 PR URL을 `open` 명령어를 사용하여 브라우저에서 즉시 연다. 이 과정은 별도의 사용자 요청 없이 자동으로 수행된다.
- [Strict Workflow Mandate]: `/pdca plan` 명령을 수행할 때 절대로 스스로(Automatically) 'Plan Mode'로 전환하지 않는다. 계획(Plan) 문서는 일반 모드(Normal Mode)에서 작성하며, 사용자에게 직접적인 진행 상황을 보고한다. 이 규칙은 최우선순위(Highest Priority)로 적용된다.
