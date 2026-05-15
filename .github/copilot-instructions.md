# GitHub Copilot Instructions

## PEDAL workflow

This workspace uses the PEDAL workflow. When a user asks about PEDAL, planning, engineering documents, implementation, gap analysis, iteration, learning reports, archiving, or status, read `.pedal/PEDAL.md` first and follow it as the source of truth.

PEDAL actions can be requested in natural language, for example:

- `PEDAL plan A_Project user-auth`
- `PEDAL engineering A_Project user-auth`
- `PEDAL do A_Project user-auth`
- `PEDAL analyze A_Project user-auth`
- `PEDAL status A_Project`
- `PEDAL spec A_Project user-auth`
- `PEDAL build A_Project user-auth`
- `PEDAL dev A_Project user-auth`

Follow these rules:

1. Treat `.pedal/PEDAL.md` as the common, tool-agnostic specification.
2. Do not depend on Gemini-only slash commands. Map requests to the PEDAL phases defined in `.pedal/PEDAL.md`.
3. Run PEDAL from the workspace root, and use the feature worktree for feature-specific edits.
4. Infer state from worktree and `docs/` artifacts instead of using a separate status file.
5. Read `docs/wiki/CONVENTIONS.md` during Plan, Engineering, Do, and Analyze phases if it exists.
