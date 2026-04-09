---
template: learn
version: 1.0
description: PEDAL Learn phase document template (completion report and wiki update)
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name (from package.json or GEMINI.md)
  - version: Project version (from package.json)
---

# {feature} Completion Report

> **Status**: Complete / Partial / Cancelled
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Completion Date**: {date}
> **PEDAL Cycle**: #{cycle_number}

---

## 1. Summary

### 1.1 Project Overview

| Item       | Content      |
| ---------- | ------------ |
| Feature    | {feature}    |
| Start Date | {start_date} |
| End Date   | {date}       |
| Duration   | {duration}   |

### 1.2 Results Summary

```
┌─────────────────────────────────────────────┐
│  Completion Rate: 95%                        │
├─────────────────────────────────────────────┤
│  ✅ Complete:     19 / 20 items              │
│  ⏳ In Progress:   1 / 20 items              │
│  ❌ Cancelled:     0 / 20 items              │
└─────────────────────────────────────────────┘
```

---

## 2. Related Documents

| Phase       | Document                                                               | Status       |
| ----------- | ---------------------------------------------------------------------- | ------------ |
| Plan        | [{feature}.plan.md](../01-plan/{feature}.plan.md)                      | ✅ Finalized |
| Engineering | [{feature}.engineering.md](../02-engineering/{feature}.engineering.md) | ✅ Finalized |
| Analyze     | [{feature}.analysis.md](../03-analysis/{feature}.analysis.md)          | ✅ Complete  |
| Learn       | Current document                                                       | 🔄 Writing   |

---

## 3. Completed Items

### 3.1 Functional Requirements

| ID    | Requirement     | Status        | Notes           |
| ----- | --------------- | ------------- | --------------- |
| FR-01 | {Requirement 1} | ✅ Complete   |                 |
| FR-02 | {Requirement 2} | ✅ Complete   |                 |
| FR-03 | {Requirement 3} | ✅ Complete   | Scope reduced   |
| FR-04 | {Requirement 4} | ⏳ Next cycle | Time constraint |

### 3.2 Non-Functional Requirements

| Item          | Target      | Achieved     | Status |
| ------------- | ----------- | ------------ | ------ |
| Performance   | < 200ms     | 150ms        | ✅     |
| Test Coverage | 80%         | 82%          | ✅     |
| Accessibility | WCAG 2.1 AA | AA compliant | ✅     |

### 3.3 Deliverables

| Deliverable   | Location                           | Status |
| ------------- | ---------------------------------- | ------ |
| Components    | src/features/{feature}/components/ | ✅     |
| API           | src/features/{feature}/api/        | ✅     |
| Tests         | src/features/{feature}/**tests**/  | ✅     |
| Documentation | docs/                              | ✅     |

---

## 4. Incomplete Items

### 4.1 Carried Over to Next Cycle

| Item                     | Reason          | Priority | Estimated Effort |
| ------------------------ | --------------- | -------- | ---------------- |
| FR-04                    | Time constraint | High     | 2 days           |
| Performance optimization | Out of scope    | Medium   | 1 day            |

### 4.2 Cancelled/On Hold Items

| Item | Reason | Alternative |
| ---- | ------ | ----------- |
| -    | -      | -           |

---

## 5. Quality Metrics

### 5.1 Final Analyze Results

| Metric                 | Target     | Final | Change |
| ---------------------- | ---------- | ----- | ------ |
| Engineering Match Rate | 90%        | 95%   | +20%   |
| Code Quality Score     | 70         | 85    | +15    |
| Test Coverage          | 80%        | 82%   | +12%   |
| Security Issues        | 0 Critical | 0     | ✅     |

### 5.2 Resolved Issues

| Issue                    | Resolution       | Result      |
| ------------------------ | ---------------- | ----------- |
| Hardcoded secret         | Moved to env var | ✅ Resolved |
| N+1 query                | Eager Loading    | ✅ Resolved |
| Missing input validation | Added Zod schema | ✅ Resolved |

---

## 6. Wiki Integration

> The wiki is the project-wide SSOT. This cycle's verified facts must be **integrated** into the existing wiki — not saved as a standalone feature file. See `PEDAL.md § Wiki` for full protocol.

### 6.1 Pages Touched

| Wiki Page | Action | Summary of Changes |
| --------- | ------ | ------------------ |
| {page}.md | Created / Updated | {what was added or changed} |

### 6.2 Integration Checklist

> **Agent**: verify internally — do not modify this file to tick boxes.

- Architecture / system overview updated to reflect this feature
- New APIs, data models, or components documented in relevant wiki pages
- Contradictory or outdated information in existing pages corrected
- ASCII Art included for new UI surfaces (if applicable)
- `docs/wiki/index.md` updated with any new or renamed pages

### 6.3 Wiki Quality

- Document only **verified facts** that match the current project state.
- Write for both **humans reading guides** and **AI agents performing future tasks**.
- When new facts contradict existing wiki content, **replace** the old content (do not keep both).
- Prefer multiple focused pages over a single large file.

---

## 7. Bug Patterns

> Extract recurring bug patterns from the Analyze/Iterate phases. These are **objective facts** (not subjective retrospectives) that help prevent the same mistakes in future PEDAL cycles.
> After writing this section, append new entries to `docs/wiki/bug-patterns.md`.

### 7.1 Patterns Found in This Cycle

| ID | Pattern | Root Cause | File(s) | Fix Applied | Prevention Rule |
| -- | ------- | ---------- | ------- | ----------- | --------------- |
| BP-{NNN} | {short name} | {why it happened} | {file:line} | {what was changed} | {concrete rule for future Do/Analyze} |

### 7.2 Registry Reference

Append patterns above to the project-wide registry:

```
docs/wiki/bug-patterns.md
```

> **Agent note**: During future `do` phases, read `bug-patterns.md` and actively check for recurrence of known patterns.

---

## 8. Next Steps

### 8.1 Immediate

- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User guide creation

### 8.2 Next PEDAL Cycle

| Item             | Priority | Expected Start |
| ---------------- | -------- | -------------- |
| {Next feature 1} | High     | {date}         |
| {Next feature 2} | Medium   | {date}         |

---

## Version History

| Version | Date   | Changes                   | Author   |
| ------- | ------ | ------------------------- | -------- |
| 1.0     | {date} | Completion report created | {author} |
