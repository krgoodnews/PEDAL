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

## 6. Wiki Update

> Update `docs/wiki/{feature}.wiki.md` with verified facts from this PEDAL cycle.

### 6.1 Wiki Checklist

- [ ] Feature overview matches current implementation
- [ ] Architecture decisions documented
- [ ] Key implementation details recorded
- [ ] Screen layouts included as ASCII Art (for UI-bearing features)
- [ ] API reference documented (if applicable)
- [ ] Configuration and setup notes added
- [ ] File locations and module structure documented

### 6.2 Wiki Guidelines

- Document only **verified facts** that match the current project state.
- Write in a format useful for both **humans reading guides** and **AI agents performing future tasks**.
- For mobile or web features, include **ASCII Art** depicting screen layouts and component hierarchy.
- Keep the wiki as the **single source of truth** for feature knowledge.

### 6.3 Wiki Location

```
docs/wiki/{feature}.wiki.md
```

---

## 7. Lessons Learned & Retrospective

### 7.1 What Went Well (Keep)

- {Positive 1: e.g., Engineering documentation improved implementation efficiency}
- {Positive 2: e.g., Early code review caught bugs proactively}
- {Positive 3}

### 7.2 What Needs Improvement (Problem)

- {Improvement 1: e.g., Initial scope estimation was inaccurate}
- {Improvement 2: e.g., Test cases written too late}
- {Improvement 3}

### 7.3 What to Try Next (Try)

- {Try 1: e.g., Adopt TDD approach}
- {Try 2: e.g., Smaller PR units}
- {Try 3}

---

## 8. Process Improvement Suggestions

### 8.1 PEDAL Process

| Phase       | Current                             | Improvement Suggestion          |
| ----------- | ----------------------------------- | ------------------------------- |
| Plan        | Insufficient requirement gathering  | Add user interviews             |
| Engineering | -                                   | -                               |
| Do          | Poor engineering document reference | Introduce engineering checklist |
| Analyze     | Manual analysis                     | Introduce automation tools      |

### 8.2 Tools/Environment

| Area    | Improvement Suggestion | Expected Benefit        |
| ------- | ---------------------- | ----------------------- |
| CI/CD   | Auto deployment        | Reduced deployment time |
| Testing | Add E2E tests          | Quality improvement     |

---

## 9. Next Steps

### 9.1 Immediate

- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User guide creation

### 9.2 Next PEDAL Cycle

| Item             | Priority | Expected Start |
| ---------------- | -------- | -------------- |
| {Next feature 1} | High     | {date}         |
| {Next feature 2} | Medium   | {date}         |

---

## 10. Changelog

### v1.0.0 ({date})

**Added:**

- {Added feature 1}
- {Added feature 2}

**Changed:**

- {Changed item}

**Fixed:**

- {Fixed bug}

---

## Version History

| Version | Date   | Changes                   | Author   |
| ------- | ------ | ------------------------- | -------- |
| 1.0     | {date} | Completion report created | {author} |
