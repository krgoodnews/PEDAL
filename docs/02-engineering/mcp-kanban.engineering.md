---
template: engineering
version: 1.2
description: MCP Kanban Dashboard Engineering Document (Final Revised)
variables:
  - feature: mcp-kanban
  - date: 2026-04-16
  - author: Gemini
  - project: PEDAL
  - version: 0.1.1
---

# mcp-kanban Engineering Document

> **Summary**: MCP status API를 기반으로 PEDAL 워크플로 상태를 시각화하는 Next.js 칸반 대시보드 설계 (v1.2)
>
> **Project**: PEDAL
> **Version**: 0.1.1
> **Author**: Gemini
> **Date**: 2026-04-16
> **Status**: Approved (Self-certified after v2 review)
> **Planning Doc**: [mcp-kanban.plan.md](../01-plan/mcp-kanban.plan.md)

### Related Documents

| Document                                 | Status |
| ---------------------------------------- | ------ |
| [Wiki (SSOT)](../wiki/index.md)          | ✅      |
| [Plan](../01-plan/mcp-kanban.plan.md)     | ✅      |
| [Conventions](../wiki/CONVENTIONS.md) | ✅      |
| [Prompt](../01-plan/mcp-kanban.prompt.md) | ✅      |

---

## 1. Overview

### 1.1 Engineering Goals

- MCP 서버의 `/api/status` 엔드포인트로부터 실시간 상태 데이터를 안전하게 조회하여 표시합니다.
- PEDAL의 7가지 단계(Plan, Engineering, Do, Analyze, Iterate, Learn, Archived)를 칸반 컬럼으로 구조화합니다.
- 각 피처의 현재 상태를 카드 형태로 렌더링하고, 타임스탬프와 설명을 직관적으로 보여줍니다.
- Next.js App Router와 Tailwind CSS를 활용하여 일관된 디자인 시스템을 구축합니다.

### 1.2 Engineering Principles

- **Data Driven**: PEDAL 공식 스키마(`.pedal/PEDAL.md`)에 따라 타입 세이프(Type-safe)하게 정의하여 UI와 결합합니다.
- **Client-Side Fetching**: 로컬 환경 MCP 서버와의 직접 통신 및 실시간성 확보를 위해 **Client Component** 기반의 `fetch` (cache: 'no-store') 방식을 채택합니다.
- **Accessibility First**: 키보드 내비게이션, 시맨틱 마크업, 적정 명도 대비를 보장하여 누구나 접근 가능한 도구를 지향합니다.

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────────────────────────────┐
│              Dashboard Page              │
│    (landing/src/app/dashboard/page.tsx)  │
│          [ 'use client' ]                │
└──────────────────┬───────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌────────────────┐   ┌────────────────┐
│  StatusHeader  │   │  KanbanBoard   │
└────────────────┘   └─────────┬──────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
              ┌───────────────┐   ┌───────────────┐
              │ KanbanColumn  │   │ KanbanColumn  │
              └───────┬───────┘   └───────┬───────┘
                      │                   │
               ┌──────┴──────┐     ┌──────┴──────┐
               ▼             ▼     ▼             ▼
        ┌───────────┐ ┌───────────┐ ┌───────────┐
        │FeatureCard│ │FeatureCard│ │FeatureCard│
        └───────────┘ └───────────┘ └───────────┘
```

### 2.2 Data Flow & Freshness Strategy

```
Next.js (Client) → fetch(API, { cache: 'no-store' }) → MCP Server → Response → UI Update
```

- **Strategy**: **Manual Refresh** (UI Button) + **No Cache** (`cache: 'no-store'`).
- **Reason**: 개발 워크플로 특성상 사용자가 명시적으로 상태를 확인하고 싶을 때 최신 정보를 보장받는 것이 가장 중요하며, 로컬 서버 부하가 낮으므로 캐싱을 배제하여 데이터 정합성을 유지합니다.

### 2.3 Layer Structure (Clean Architecture)

| Layer              | Responsibility                                    | Location                           |
| ------------------ | ------------------------------------------------- | ---------------------------------- |
| **Presentation**   | UI, components, page logic                        | `landing/src/app/dashboard/`, `landing/src/components/dashboard/` |
| **Domain (Types)** | PEDAL status entities, Enums                      | `landing/src/lib/types.ts`         |
| **Infrastructure** | API fetch logic, Error handling                   | `landing/src/lib/api.ts`           |

---

## 3. Data Model

### 3.1 Entity Definition (Aligned with .pedal/PEDAL.md)

```typescript
// landing/src/lib/types.ts

export type PedalPhase = 'plan' | 'engineering' | 'do' | 'analyze' | 'iterate' | 'learn' | 'archived';

export type FeatureStatusType = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'archived';

export interface FeatureStatus {
  phase: PedalPhase;
  status: FeatureStatusType;
  updatedAt: string;
  description: string;
}

export interface PedalStatusResponse {
  version: string;
  lastUpdated: string;
  activeFeatures: string[];
  primaryFeature: string;
  features: Record<string, FeatureStatus>;
  session: {
    startedAt: string;
    lastActivity: string;
  };
  history: Array<{
    timestamp: string;
    action: string;
    feature: string;
    details: string;
  }>;
}
```

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path                | Description | Auth     |
| ------ | ------------------- | ----------- | -------- |
| GET    | /api/status         | MCP 서버에서 PEDAL 전체 상태 조회 | None (Internal) |

### 4.2 Detailed Specification

- **Success (200 OK)**: `PedalStatusResponse` JSON 반환.
- **Error (Client Side)**: `{"error": "..."}` 필드 존재 시 UI 경고 노출. 네트워크 오류 발생 시 "MCP 서버 연결 실패" 메시지 노출.

---

## 5. UI/UX Design & Accessibility

### 5.1 Screen Layout

```
┌──────────────────────────────────────────────────────────┐
│  PEDAL Dashboard                               [ Refresh ]│
├──────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Plan    │ │ Eng...  │ │ Do      │ │ Analyze │ │ ...     │ │
│ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤ │
│ │ [Card]  │ │ [Card]  │ │         │ │         │ │ [Card]  │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Accessibility Criteria

- **Keyboard Navigation**: `Tab` 키를 통해 새로고침 버튼과 각 피처 카드에 포커싱 가능해야 함.
- **ARIA Roles**:
  - 새로고침 버튼: `aria-label="Refresh status"`
  - 각 카드: `role="article" aria-labelledby="feature-title-{id}"`
- **Contrast**: 텍스트와 배경의 명도 대비 4.5:1 이상 유지 (Tailwind 색상 팔레트 활용).

---

## 6. Security Considerations

- **CORS Management**: 개발 환경 `allow_origins=["*"]`를 운영 환경 배포 시 특정 오리진(대시보드 호스트)으로 제한할 것을 Wiki 가이드라인에 권고.
- **Read-only**: 대시보드 내에서는 데이터 변경(POST/PUT) 로직을 일절 배제함.

---

## 7. Test Plan & TDD Strategy

### 8.1 Tools and Placement

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library (@testing-library/react)
- **File Placement**: `landing/src/test/components/dashboard/` (UI 테스트) 및 `landing/src/test/unit/api.test.ts` (로직 테스트).

### 8.2 Test Cases (Key)

- [ ] **Data Mapping Test**: `PedalStatusResponse` 모의 데이터 주입 시 7개 컬럼에 정확히 배분되는지 확인.
- [ ] **Error Handling**: API 에러 객체(`{"error": ...}`) 수신 시 Alert 노출 검증.
- [ ] **Accessibility Test**: ARIA 라벨 존재 및 키보드 포커스 가능 여부 확인.

---

## 8. Implementation Guide

### 9.1 File Structure

```
landing/src/
├── app/dashboard/page.tsx (use client)
├── components/dashboard/ (Board, Column, Card, Header)
├── lib/ (api.ts, types.ts)
└── test/ (components/dashboard/, unit/api.test.ts)
```

---

## 9. Self-Review Criteria (Do → Analyze Gate)

- [ ] `cache: 'no-store'`가 적용된 클라이언트 Fetch 방식인가?
- [ ] `.pedal/PEDAL.md` 스키마(v2.0)와 데이터 모델이 일치하는가?
- [ ] 키보드 내비게이션 및 ARIA 라벨이 적용되었는가?
- [ ] Vitest 기반 테스트 코드가 `landing/src/test/` 하위에 작성되었는가?

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 1.1     | 2026-04-16 | Revised (Schema, CORS, Paths, TDD) | Gemini   |
| 1.2     | 2026-04-16 | Final Revised (Fetch strategy, Freshness, A11y) | Gemini |
