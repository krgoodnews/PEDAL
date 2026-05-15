# Agent Instructions

## PEDAL workflow

When the user mentions PEDAL, planning, engineering documents, gap analysis, iteration, completion reports, or asks for `plan`, `engineering`, `do`, `analyze`, `iterate`, `learn`, `archive`, `status`, `next`, `spec`, `build`, or `dev`, read and follow `.pedal/PEDAL.md`.

PEDAL is tool-agnostic. Do not assume Gemini-only slash commands are required. If this agent does not support slash commands, treat natural language requests such as `PEDAL plan A_Project user-auth` as the equivalent PEDAL action.

Key rules:

1. Run PEDAL from the workspace root that contains the project repositories.
2. Use git worktrees for feature work as described in `.pedal/PEDAL.md`.
3. After creating a feature worktree, perform feature-specific file operations inside that worktree, not the main project directory.
4. Infer PEDAL status from worktree and `docs/` files; do not create a separate state file.
5. During Plan, Engineering, Do, and Analyze phases, read `docs/wiki/CONVENTIONS.md` if it exists.
6. Keep tool-specific behavior in the relevant adapter file. The shared workflow source of truth is `.pedal/PEDAL.md`.
