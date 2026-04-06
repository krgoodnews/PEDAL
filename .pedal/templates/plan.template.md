---
template: plan
version: 1.0
description: PEDAL Plan phase document template with Architecture and Convention considerations
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name (from package.json or GEMINI.md)
  - version: Project version (from package.json)
---

# {feature} Planning Document

> **Summary**: {One-line description}
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Date**: {date}
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

{The problem this feature solves or the goal it achieves}

### 1.2 Background

{Why this feature is needed, business context}

### 1.3 Related Documents

- Requirements: {link}
- References: {link}

---

## 2. Scope

### 2.1 In Scope

- [ ] {Included item 1}
- [ ] {Included item 2}
- [ ] {Included item 3}

### 2.2 Out of Scope

- {Excluded item 1}
- {Excluded item 2}

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority        | Status  |
| ----- | ------------------------- | --------------- | ------- |
| FR-01 | {Requirement description} | High/Medium/Low | Pending |
| FR-02 | {Requirement description} | High/Medium/Low | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Performance   | {e.g., Response time < 200ms}   | {Tool/Method}         |
| Security      | {e.g., OWASP Top 10 compliance} | {Verification method} |
| Accessibility | {e.g., WCAG 2.1 AA}             | {Verification method} |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] All functional requirements implemented
- [ ] Unit tests written and passing
- [ ] Code review completed
- [ ] Documentation completed

### 4.2 Quality Criteria

- [ ] Test coverage above 80%
- [ ] Zero lint errors
- [ ] Build succeeds

---

## 5. Risks and Mitigation

| Risk     | Impact          | Likelihood      | Mitigation        |
| -------- | --------------- | --------------- | ----------------- |
| {Risk 1} | High/Medium/Low | High/Medium/Low | {Mitigation plan} |
| {Risk 2} | High/Medium/Low | High/Medium/Low | {Mitigation plan} |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level          | Characteristics                                    | Recommended For                             | Selected |
| -------------- | -------------------------------------------------- | ------------------------------------------- | :------: |
| **Starter**    | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages     |    ☐     |
| **Dynamic**    | Feature-based modules, services layer              | Web apps with backend, SaaS MVPs            |    ☐     |
| **Enterprise** | Strict layer separation, DI, microservices         | High-traffic systems, complex architectures |    ☐     |

### 6.2 Key Architectural Decisions

| Decision         | Options                         | Selected   | Rationale |
| ---------------- | ------------------------------- | ---------- | --------- |
| Language         | {List project-relevant options} | {selected} | {reason}  |
| Framework        | {List project-relevant options} | {selected} | {reason}  |
| State Management | {List project-relevant options} | {selected} | {reason}  |
| Data Storage     | {List project-relevant options} | {selected} | {reason}  |
| Styling          | {List project-relevant options} | {selected} | {reason}  |
| Testing          | {List project-relevant options} | {selected} | {reason}  |

### 6.3 Clean Architecture Approach

```
Selected Level: {Starter/Dynamic/Enterprise}

Folder Structure Preview:
┌─────────────────────────────────────────────────────┐
│ Starter:                                            │
│   Simple flat structure with minimal separation     │
├─────────────────────────────────────────────────────┤
│ Dynamic:                                            │
│   Feature-based modules with services layer         │
├─────────────────────────────────────────────────────┤
│ Enterprise:                                         │
│   Strict layer separation (presentation,            │
│   application, domain, infrastructure)              │
└─────────────────────────────────────────────────────┘
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

Check which conventions already exist in the project:

- [ ] Project config file has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists
- [ ] `CONVENTIONS.md` exists at project root
- [ ] Linter configuration exists
- [ ] Formatter configuration exists
- [ ] Language-specific configuration exists

### 7.2 Conventions to Define/Verify

| Category                  | Current State    | To Define         | Priority |
| ------------------------- | ---------------- | ----------------- | :------: |
| **Naming**                | {exists/missing} | {specific rules}  |   High   |
| **Folder structure**      | {exists/missing} | {structure rules} |   High   |
| **Import order**          | {exists/missing} | {import rules}    |  Medium  |
| **Environment variables** | {exists/missing} | {env var list}    |  Medium  |
| **Error handling**        | {exists/missing} | {error patterns}  |  Medium  |

### 7.3 Environment Variables Needed

| Variable     | Purpose         | Scope         | To Be Created |
| ------------ | --------------- | ------------- | :-----------: |
| {variable}   | {purpose}       | Client/Server |       ☐       |
| {variable}   | {purpose}       | Client/Server |       ☐       |
| {variable}   | {purpose}       | Client/Server |       ☐       |

---

## 8. Next Steps

1. [ ] Write engineering document (`{feature}.engineering.md`)
2. [ ] Team review and approval
3. [ ] Start implementation

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | {date} | Initial draft | {author} |
