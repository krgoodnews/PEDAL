# Cross-Review Protocol

> Every PEDAL phase that produces a document must be reviewed by a **different AI agent** than the one that authored it. This creates adversarial quality control.

## Principle: opposite-agent review

The reviewer must be a **different model/tool** from the main agent. This prevents echo-chamber bias where the same model validates its own reasoning.

| Main agent (author) | Reviewer agent | Review command                             |
| ------------------- | -------------- | ------------------------------------------ |
| Gemini CLI          | Cursor CLI     | `agent -p "{prompt}" --model "composer 2"` |
| Cursor              | Gemini CLI     | `gemini -p "{prompt}" -m flash`            |

## When to review

Review occurs on every phase that produces a **PEDAL document**:

| Phase       | Document to review         | Review output                     |
| ----------- | -------------------------- | --------------------------------- |
| Plan        | `{feature}.plan.md`        | `{feature}.plan.review.md`        |
| Engineering | `{feature}.engineering.md` | `{feature}.engineering.review.md` |
| Analyze     | `{feature}.analysis.md`    | `{feature}.analysis.review.md`    |
| Learn       | `{feature}.report.md`      | `{feature}.report.review.md`      |

**Do** and **Iterate** produce code, not PEDAL documents, so they skip document review. (Code quality is covered by the Analyze phase.)

## Reviewer role

The reviewer is a **critical auditor**, not a co-author. Its job:

1. **Read** the document produced by the main agent.
2. **Challenge** assumptions, gaps, and weak reasoning.
3. **Classify** findings by severity.
4. **Cite sources** -- when asserting a best practice, known issue, or external standard as the basis for a finding, include a link to the relevant official documentation or authoritative reference (e.g. spec, RFC, security advisory, library docs).
5. **Write** a structured review file.

### What the reviewer checks

- **Intent fidelity** -- (When prompt log exists) Does the document faithfully reflect the user's original request and subsequent scope changes?
- **Completeness** -- Are all required template sections filled? Any placeholder left?
- **Consistency** -- Does the document contradict the Plan, Engineering doc, or existing code?
- **Feasibility** -- Are the proposed approaches realistic given the project constraints?
- **Risk blindness** -- Are risks, edge cases, or security concerns overlooked?
- **Scope creep** -- Does the document introduce work not justified by the Plan?
- **Quality of analysis** -- (Analyze phase) Are gap scores calculated correctly? Are severity ratings justified?

### What the reviewer does NOT do

- Rewrite the document.
- Implement fixes.
- Change the main agent's files directly.

## Review output format

The reviewer writes `{feature}.{action}.review.md` in the same directory as the reviewed document:

```markdown
# {feature} {Action} Review

> **Reviewed by**: {reviewer model}
> **Date**: {date}
> **Document**: {path to reviewed document}

## Critical

- {issue description + rationale} — [ref]({link to official docs or authoritative source})

## Warning

- {issue description + rationale} — [ref]({link to official docs or authoritative source})

## Info / Suggestions

- {suggestion} — [ref]({link, if applicable})

## Verdict

{PASS / REVISE_REQUIRED / MAJOR_CONCERNS}
```

### Severity definitions (for review findings)

| Severity     | Meaning                                                                   | Main agent action                   |
| ------------ | ------------------------------------------------------------------------- | ----------------------------------- |
| **Critical** | Factual error, security flaw, or missing requirement that blocks progress | Must address before proceeding      |
| **Warning**  | Suboptimal choice, incomplete reasoning, or moderate risk                 | Should address; justify if skipping |
| **Info**     | Style preference, minor improvement, or optional enhancement              | Consider; safe to skip              |

## Main agent response to review

The main agent must **not** blindly accept the review. Instead:

1. **Read** the review file.
2. **Evaluate critically** -- The reviewer can be wrong. Assess each finding on its own merit.
3. **Accept** findings that are valid and improve the document.
4. **Reject with justification** findings that are incorrect, out of scope, or based on misunderstanding. Add a brief rationale to the document or commit message.
5. **Update** the original document with accepted changes.
6. **Proceed** to the next phase only after addressing all Critical items (accept or reject-with-reason).

## Prompt log reference

The reviewer must also read the **prompt log** (`docs/01-plan/{feature}.prompt.md`) to verify that the document faithfully reflects the user's original intent and any subsequent scope changes.

When the prompt log exists, the reviewer should check:

- **Intent fidelity** -- Does the document address what the user actually asked for?
- **Scope drift** -- Has the main agent introduced concerns the user never mentioned, or dropped ones they did?
- **Chronological consistency** -- If the user changed direction mid-cycle, does the latest document reflect the latest prompt?

> If no prompt log exists (e.g. legacy features), the reviewer falls back to reviewing the document on its own merits only.

## Review prompt template

The main agent should invoke the reviewer with a prompt like:

```
Review the file {path_to_document}.
Also read {path_to_prompt_log} for the user's original intent.
You are a critical reviewer. Follow the protocol in .pedal/REVIEW.md.
Write your review to {path_to_review_output}.
```

## Archive behavior

Review files (`*.review.md`) are **not** archived with PEDAL documents. They are considered transient artifacts and are removed during the `archive` phase.
