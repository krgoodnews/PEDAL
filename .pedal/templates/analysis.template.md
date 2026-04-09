---
template: analysis
version: 1.0
description: PEDAL Analyze phase document template with Clean Architecture and Convention compliance checks
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name (from package.json or GEMINI.md)
  - version: Project version (from package.json)
---

# {feature} Analysis Report

> **Analysis Type**: Gap Analysis / Code Quality / Performance Analysis
>
> **Project**: {project}
> **Version**: {version}
> **Analyst**: {author}
> **Date**: {date}
> **Engineering Doc**: [{feature}.engineering.md](../02-engineering/features/{feature}.engineering.md)

### Related Documents (for verification)

| Document                                                        | Verification Target   |
| --------------------------------------------------------------- | --------------------- |
| [Plan](../01-plan/features/{feature}.plan.md)                   | Requirements match    |
| [Engineering](../02-engineering/features/{feature}.engineering.md) | Implementation match  |
| [Conventions](../01-plan/conventions.md)                        | Convention compliance |

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

{Purpose of conducting this analysis}

### 1.2 Analysis Scope

- **Engineering Document**: `docs/02-engineering/features/{feature}.engineering.md`
- **Implementation Path**: `src/features/{feature}/`
- **Analysis Date**: {date}

---

## 2. Gap Analysis (Engineering vs Implementation)

### 2.1 API Endpoints

| Engineering                | Implementation            | Status                    | Notes         |
| -------------------------- | ------------------------- | ------------------------- | ------------- |
| POST /api/{resource}       | POST /api/{resource}      | ✅ Match                  |               |
| GET /api/{resource}/:id    | GET /api/{resource}/:id   | ✅ Match                  |               |
| -                          | POST /api/{resource}/bulk | ⚠️ Missing in engineering | Added in impl |
| DELETE /api/{resource}/:id | -                         | ❌ Not implemented        | Needs impl    |

### 2.2 Data Model

| Field     | Engineering Type | Impl Type | Status                    |
| --------- | ---------------- | --------- | ------------------------- |
| id        | string           | string    | ✅                        |
| email     | string           | string    | ✅                        |
| createdAt | Date             | Date      | ✅                        |
| metadata  | -                | object    | ⚠️ Missing in engineering |

### 2.3 Component Structure

| Engineering Component | Implementation File             | Status             |
| ---------------- | ------------------------------- | ------------------ |
| {ComponentA}     | {actual path}                   | ✅ Match           |
| {ComponentB}     | -                               | ❌ Not implemented |

### 2.4 Match Rate Summary

```
┌─────────────────────────────────────────────┐
│  Overall Match Rate: 75%                     │
├─────────────────────────────────────────────┤
│  ✅ Match:          12 items (60%)           │
│  ⚠️ Missing engineering: 4 items (20%)        │
│  ❌ Not implemented:  4 items (20%)           │
└─────────────────────────────────────────────┘
```

---

## 3. Code Quality Analysis

### 3.1 Complexity Analysis

| File         | Function    | Complexity | Status  | Recommendation |
| ------------ | ----------- | ---------- | ------- | -------------- |
| {service}.ts | processData | 15         | ⚠️ High | Split function |
| utils.ts     | formatDate  | 3          | ✅ Good | -              |

### 3.2 Code Smells

| Type           | File       | Location | Description                 | Severity |
| -------------- | ---------- | -------- | --------------------------- | -------- |
| Long function  | api.ts     | L45-120  | 75 lines (recommended: <50) | 🟡       |
| Duplicate code | helpers.ts | L10, L45 | Same logic repeated         | 🟡       |
| Magic number   | config.ts  | L23      | Hardcoded number            | 🟢       |

### 3.3 Security Issues

| Severity    | File    | Location | Issue                    | Recommendation  |
| ----------- | ------- | -------- | ------------------------ | --------------- |
| 🔴 Critical | auth.ts | L42      | Hardcoded secret         | Move to env var |
| 🟡 Warning  | api.ts  | L15      | Missing input validation | Add validation  |
| 🟢 Info     | -       | -        | -                        | -               |

---

## 4. Performance Analysis (if applicable)

### 4.1 Response Time

| Endpoint             | Measured | Target | Status |
| -------------------- | -------- | ------ | ------ |
| GET /api/{resource}  | 150ms    | 200ms  | ✅     |
| POST /api/{resource} | 350ms    | 200ms  | ❌     |

### 4.2 Bottlenecks

| Location             | Problem         | Impact                  | Recommendation   |
| -------------------- | --------------- | ----------------------- | ---------------- |
| Repository.findAll() | N+1 query       | Increased response time | Eager Loading    |
| ImageProcessor       | Sync processing | Blocking                | Async processing |

---

## 5. Test Coverage

### 5.1 Coverage Status

| Area       | Current | Target | Status |
| ---------- | ------- | ------ | ------ |
| Statements | 72%     | 80%    | ❌     |
| Branches   | 65%     | 75%    | ❌     |
| Functions  | 80%     | 80%    | ✅     |
| Lines      | 73%     | 80%    | ❌     |

### 5.2 Uncovered Areas

- {uncovered file 1}
- {uncovered file 2}

---

## 6. Architecture Compliance

> Reference: Engineering document Architecture section

### 6.1 Layer Dependency Verification

| Layer          | Expected Dependencies  | Actual Dependencies | Status |
| -------------- | ---------------------- | ------------------- | ------ |
| Presentation   | Application, Domain    | {actual imports}    | ✅/❌  |
| Application    | Domain, Infrastructure | {actual imports}    | ✅/❌  |
| Domain         | None (independent)     | {actual imports}    | ✅/❌  |
| Infrastructure | Domain only            | {actual imports}    | ✅/❌  |

### 6.2 Dependency Violations

| File   | Layer   | Violation     | Severity    | Recommendation |
| ------ | ------- | ------------- | ----------- | -------------- |
| {file} | {layer} | {violation}   | 🔴/🟡/🟢   | {fix}          |

### 6.3 Layer Assignment Verification

| Component  | Engineered Layer | Actual Location | Status |
| ---------- | ---------------- | --------------- | ------ |
| {module_a} | Presentation     | {actual path}   | ✅/❌  |
| {module_b} | Application      | {actual path}   | ✅/❌  |
| {module_c} | Domain           | {actual path}   | ✅/❌  |
| {module_d} | Infrastructure   | {actual path}   | ✅/❌  |

### 6.4 Architecture Score

```
┌─────────────────────────────────────────────┐
│  Architecture Compliance: {score}%           │
├─────────────────────────────────────────────┤
│  ✅ Correct layer placement: {n}/{total}     │
│  ⚠️ Dependency violations:   {n} files       │
│  ❌ Wrong layer:              {n} files       │
└─────────────────────────────────────────────┘
```

---

## 7. Convention Compliance

> Reference: `docs/01-plan/conventions.md` if available

### 7.1 Naming Convention Check

| Category   | Convention | Files Checked | Compliance | Violations |
| ---------- | ---------- | :-----------: | :--------: | ---------- |
| {category} | {rule}     |    {count}    |   {pct}%   | {details}  |
| {category} | {rule}     |    {count}    |   {pct}%   | {details}  |

### 7.2 Folder Structure Check

| Expected Path | Exists | Contents Correct | Notes     |
| ------------- | :----: | :--------------: | --------- |
| {path}        |  ✅/❌ |      ✅/⚠️/❌    | {notes}   |

### 7.3 Convention Score

```
┌─────────────────────────────────────────────┐
│  Convention Compliance: {score}%             │
├─────────────────────────────────────────────┤
│  Naming:           {score}%                  │
│  Folder Structure: {score}%                  │
│  Other:            {score}%                  │
└─────────────────────────────────────────────┘
```

---

## 8. Overall Score

```
┌─────────────────────────────────────────────┐
│  Overall Score: {score}/100                  │
├─────────────────────────────────────────────┤
│  Engineering Match:   {score} points         │
│  Code Quality:        {score} points         │
│  Security:            {score} points         │
│  Testing:             {score} points         │
│  Performance:         {score} points         │
│  Architecture:        {score} points         │
│  Convention:          {score} points         │
└─────────────────────────────────────────────┘
```

---

## 9. Severity-Weighted Match Rate

Issues are weighted by severity per PEDAL rules. 🔴 Critical issues **force iterate** regardless of overall matchRate.

### 9.1 Issue Summary by Severity

| Severity    | Count | Weight | Weighted Score |
| ----------- | :---: | :----: | :------------: |
| 🔴 Critical |  {n}  |   x3   |   {n × 3}     |
| 🟡 Warning  |  {n}  |   x2   |   {n × 2}     |
| 🟢 Info     |  {n}  |   x1   |   {n × 1}     |
| **Total**   |       |        |   {total}      |

### 9.2 Weighted Match Rate

```
Total checked items:    {total_items}
Max possible score:     {total_items × 3}
Weighted issue score:   {weighted_score}
Weighted Match Rate:    {(1 - weighted_score / max_possible) × 100}%
```

### 9.3 Iterate Decision

```
┌──────────────────────────────────────────────────┐
│  Weighted Match Rate: {rate}%                     │
│  🔴 Critical Issues:  {count}                     │
│                                                   │
│  Decision: ✅ PASS / ❌ ITERATE REQUIRED          │
│  Reason:   {matchRate >= 90% AND 0 critical}     │
│            {OR matchRate < 90%}                   │
│            {OR critical > 0 → FORCE ITERATE}      │
└──────────────────────────────────────────────────┘
```

---

## 10. Recommended Actions

### 10.1 Immediate (within 24 hours)

| Priority | Item                    | File       | Assignee |
| -------- | ----------------------- | ---------- | -------- |
| 🔴 1     | Remove hardcoded secret | auth.ts:42 | -        |
| 🔴 2     | Add input validation    | api.ts:15  | -        |

### 10.2 Short-term (within 1 week)

| Priority | Item           | File          | Expected Impact             |
| -------- | -------------- | ------------- | --------------------------- |
| 🟡 1     | Fix N+1 query  | repository.ts | 60% response time reduction |
| 🟡 2     | Split function | service.ts    | Improved maintainability    |

### 10.3 Long-term (backlog)

| Item          | File   | Notes                   |
| ------------- | ------ | ----------------------- |
| Refactoring   | utils/ | Clean up duplicate code |
| Documentation | -      | Add JSDoc               |

---

## 11. Engineering Document Updates Needed

The following items require engineering document updates to match implementation:

- [ ] Add POST /api/{resource}/bulk endpoint
- [ ] Add metadata field to data model
- [ ] Update error code list

---

## 12. Next Steps

- [ ] Fix Critical issues
- [ ] Update engineering document
- [ ] Write completion report (`{feature}.report.md`)

---

## Version History

| Version | Date   | Changes          | Author   |
| ------- | ------ | ---------------- | -------- |
| 0.1     | {date} | Initial analysis | {author} |
