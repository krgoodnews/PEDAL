---
template: engineering
version: 1.0
description: PEDAL Engineering phase document template (between Plan and Do) with Clean Architecture and Convention support
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - author: Author
  - project: Project name (from package.json or GEMINI.md)
  - version: Project version (from package.json)
---

# {feature} Engineering Document

> **Summary**: {One-line description}
>
> **Project**: {project}
> **Version**: {version}
> **Author**: {author}
> **Date**: {date}
> **Status**: Draft
> **Planning Doc**: [{feature}.plan.md](../01-plan/{feature}.plan.md)

### Related Documents

| Document                                 | Status    |
| ---------------------------------------- | --------- |
| [Plan](../01-plan/{feature}.plan.md)     | ✅/❌/N/A |
| [Prompt](../01-plan/{feature}.prompt.md) | ✅/❌/N/A |

---

## 1. Overview

### 1.1 Engineering Goals

{Technical goals this engineering phase aims to achieve}

### 1.2 Engineering Principles

- {Principle 1: e.g., Single Responsibility Principle}
- {Principle 2: e.g., Extensible architecture}
- {Principle 3}

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶│  Database   │
│  (Browser)  │     │   (API)     │     │ (Storage)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.2 Data Flow

```
User Input → Validation → Business Logic → Data Storage → Response
```

### 2.3 Dependencies

| Component     | Depends On    | Purpose   |
| ------------- | ------------- | --------- |
| {Component A} | {Component B} | {Purpose} |

---

## 3. Data Model

### 3.1 Entity Definition

```
{Entity name}
- id: unique identifier
- createdAt: creation timestamp
- updatedAt: last update timestamp
- {additional fields...}
```

> Provide type definitions in the project's primary language.

### 3.2 Entity Relationships

```
[User] 1 ──── N [Post]
   │
   └── 1 ──── N [Comment]
```

### 3.3 Database Schema (if applicable)

```sql
CREATE TABLE {table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path                | Description | Auth     |
| ------ | ------------------- | ----------- | -------- |
| GET    | /api/{resource}     | List all    | Required |
| GET    | /api/{resource}/:id | Get detail  | Required |
| POST   | /api/{resource}     | Create      | Required |
| PUT    | /api/{resource}/:id | Update      | Required |
| DELETE | /api/{resource}/:id | Delete      | Required |

### 4.2 Detailed Specification

#### `POST /api/{resource}`

**Request:**

```json
{
  "field1": "string",
  "field2": "number"
}
```

**Response (201 Created):**

```json
{
  "id": "string",
  "field1": "string",
  "field2": "number",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**

- `400 Bad Request`: Input validation failed
- `401 Unauthorized`: Authentication required
- `409 Conflict`: Duplicate data

---

## 5. UI/UX Design (if applicable)

### 5.1 Screen Layout

```
┌────────────────────────────────────┐
│  Header                            │
├────────────────────────────────────┤
│                                    │
│  Main Content Area                 │
│                                    │
├────────────────────────────────────┤
│  Footer                            │
└────────────────────────────────────┘
```

### 5.2 User Flow

```
Home → Login → Dashboard → Use Feature → View Results
```

### 5.3 Component List

| Component    | Location        | Responsibility |
| ------------ | --------------- | -------------- |
| {ComponentA} | src/components/ | {Role}         |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message        | Cause            | Handling                     |
| ---- | -------------- | ---------------- | ---------------------------- |
| 400  | Invalid input  | Input error      | Request re-entry from client |
| 401  | Unauthorized   | Auth failure     | Redirect to login page       |
| 404  | Not found      | Resource missing | Show 404 page                |
| 500  | Internal error | Server error     | Log error and notify user    |

### 6.2 Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": {}
  }
}
```

---

## 7. Security Considerations

- [ ] Input validation (XSS, SQL Injection prevention)
- [ ] Authentication/Authorization handling
- [ ] Sensitive data encryption
- [ ] HTTPS enforcement
- [ ] Rate Limiting

---

## 8. Test Plan

### 8.1 Test Scope

| Type             | Target         | Tool          |
| ---------------- | -------------- | ------------- |
| Unit Test        | Business logic | {test runner} |
| Integration Test | API endpoints  | {test tool}   |
| E2E Test         | User scenarios | {e2e tool}    |

### 8.2 Test Cases (Key)

- [ ] Happy path: {description}
- [ ] Error scenario: {description}
- [ ] Edge case: {description}

---

## 9. Architecture

> Reference: `docs/01-plan/conventions.md` if available

### 9.1 Layer Structure

| Layer              | Responsibility                                    | Location        |
| ------------------ | ------------------------------------------------- | --------------- |
| **Presentation**   | UI, views, user-facing components                 | {project paths} |
| **Application**    | Use cases, services, business logic orchestration | {project paths} |
| **Domain**         | Entities, types, core business rules              | {project paths} |
| **Infrastructure** | API clients, DB, external services                | {project paths} |

### 9.2 Dependency Rules

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Direction                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Presentation ──→ Application ──→ Domain ←── Infrastructure│
│                          │                                  │
│                          └──→ Infrastructure                │
│                                                             │
│   Rule: Inner layers MUST NOT depend on outer layers        │
│         Domain is independent (no external dependencies)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 This Feature's Layer Assignment

| Component  | Layer          | Location |
| ---------- | -------------- | -------- |
| {module_a} | Presentation   | {path}   |
| {module_b} | Application    | {path}   |
| {module_c} | Domain         | {path}   |
| {module_d} | Infrastructure | {path}   |

---

## 10. Coding Convention Reference

> Reference: `docs/01-plan/conventions.md` if available. Adapt to the project's language and framework.

### 10.1 Naming Conventions

| Target     | Rule   | Example   |
| ---------- | ------ | --------- |
| {category} | {rule} | {example} |
| {category} | {rule} | {example} |
| {category} | {rule} | {example} |

### 10.2 This Feature's Conventions

| Item              | Convention Applied |
| ----------------- | ------------------ |
| Naming            | {convention used}  |
| File organization | {convention used}  |
| State management  | {convention used}  |
| Error handling    | {convention used}  |

---

## 11. Implementation Guide

### 11.1 File Structure

```
{project root}/
├── {feature module}/
│   ├── {sub-module}/
│   └── {sub-module}/
```

### 11.2 Implementation Order

1. [ ] Define data model
2. [ ] Implement core logic / API
3. [ ] Implement UI / presentation
4. [ ] Integration and testing

---

## 12. Self-Review Checklist (Do → Analyze Gate)

> Complete this checklist after implementation, before running `/pedal analyze {feature}`.

### 12.1 Implementation Completeness

- [ ] All engineering requirements implemented
- [ ] Types / data models properly defined
- [ ] Error handling complete

### 12.2 Code Quality

- [ ] No compiler / type errors
- [ ] No linter warnings
- [ ] No hardcoded values (use constants/config)
- [ ] No debug logging in production code

### 12.3 Security

- [ ] All user input validated
- [ ] Secrets stored securely (env vars, not hardcoded)
- [ ] Proper authorization enforced

### 12.4 Ready for Analyze

```bash
/pedal analyze {feature}
```

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | {date} | Initial draft | {author} |
