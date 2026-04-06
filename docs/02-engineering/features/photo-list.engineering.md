# photo-list Engineering Document

> **Summary**: JSONPlaceholder API를 사용하여 상위 100개의 사진을 3열 그리드로 표시하고 상세 페이지로 전환하는 React (Vite/TS) 애플리케이션 설계
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-06
> **Status**: Draft
> **Planning Doc**: [photo-list.plan.md](../../01-plan/features/photo-list.plan.md)

### Related Documents

| Document                                        | Status    |
| ----------------------------------------------- | --------- |
| [Plan](../../01-plan/features/photo-list.plan.md)   | ✅ |
| [Conventions](../../01-plan/conventions.md)         | N/A       |

---

## 1. Overview

### 1.1 Engineering Goals

- Vite와 TypeScript를 활용한 빠르고 안정적인 React 개발 환경 구축
- JSONPlaceholder API 연동 및 효율적인 데이터 처리 (100개 제한)
- 반응형 3열 그리드 레이아웃 구현 및 직관적인 페이지 전환 (React Router)
- 컴포넌트 기반 아키텍처를 통한 재사용성 및 유지보수성 확보

### 1.2 Engineering Principles

- **KISS (Keep It Simple, Stupid)**: 불필요한 전역 상태 관리(Context/Redux) 대신 로컬 상태와 Props를 우선 사용
- **Component Decomposition**: UI를 작은 단위의 컴포넌트(Card, Grid, Header)로 분리하여 관리
- **Type Safety**: API 응답 및 컴포넌트 Props에 대한 엄격한 타입 정의
- **Responsive Design**: 모바일과 데스크톱 환경을 모두 고려한 CSS Grid 활용

---

## 2. Architecture & Layer Structure

### 2.1 Component Diagram

```
┌───────────────────────────────────────────────────────────┐
│                       App (Router)                        │
└──────────────┬──────────────────────────────┬─────────────┘
               │                              │
      ┌────────▼────────┐            ┌────────▼────────┐
      │     Layout      │            │     Layout      │
      └────────┬────────┘            └────────┬────────┘
               │                              │
      ┌────────▼────────┐            ┌────────▼────────┐
      │    ListPage     │            │   DetailPage    │
      └────────┬────────┘            └────────┬────────┘
               │                              │
      ┌────────▼────────┐            ┌────────▼────────┐
      │    PhotoGrid    │            │   PhotoInfo     │
      └────────┬────────┘            └─────────────────┘
               │
      ┌────────▼────────┐
      │    PhotoCard    │
      └─────────────────┘
```

### 2.2 Layer Structure (Starter Level)

| Layer              | Responsibility                                    | Location        |
| ------------------ | ------------------------------------------------- | --------------- |
| **Presentation**   | UI, Views, User-facing components                 | `src/components`, `src/pages`, `src/styles` |
| **Domain/Types**   | Entities, Types, Core business rules              | `src/types` |
| **Infrastructure** | API Client, external services                     | `src/lib/api.ts` |

### 2.3 Data Flow

```
API (JSONPlaceholder) → API Client (src/lib/api.ts) → ListPage (State) → PhotoGrid (Props) → PhotoCard (Props)
                                     └─→ DetailPage (fetch by ID)
```

### 2.4 Dependencies

| Component     | Depends On    | Purpose   |
| ------------- | ------------- | --------- |
| `App`         | `react-router-dom` | 페이지 라우팅 및 앱 진입점 |
| `ListPage`    | `src/lib/api.ts` | 사진 목록 데이터 fetch 및 관리 |
| `DetailPage`  | `src/lib/api.ts` | 특정 사진 데이터 fetch 및 관리 |
| `PhotoGrid`   | `PhotoCard`   | 그리드 레이아웃 구성 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// src/types/photo.ts
export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
```

---

## 4. API & Routing Specification

### 4.1 App Routes (React Router)

| Path            | Component    | Description |
| --------------- | ------------ | ----------- |
| `/`             | `ListPage`   | 사진 3열 그리드 목록 페이지 |
| `/photo/:id`    | `DetailPage` | 특정 사진 상세 정보 페이지 |

### 4.2 External API (JSONPlaceholder)

| Method | Path                | Description | Auth     |
| ------ | ------------------- | ----------- | -------- |
| GET    | `/photos`           | 사진 목록 가져오기 | None |
| GET    | `/photos/:id`       | 특정 사진 상세 정보 가져오기 | None |

#### `GET /photos` Handling
- **URL**: `https://jsonplaceholder.typicode.com/photos?_limit=100`
- **Note**: JSONPlaceholder의 `_limit` 쿼리 파라미터를 사용하여 서버 측에서 100개로 제한하여 가져옴.

---

## 5. UI/UX Design

### 5.1 Screen Layout

#### List Page (3-Column Grid)
```
┌─────────────────────────────────────────────────────┐
│                   Photo Gallery                     │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │              │
│ │ Title... │ │ Title... │ │ Title... │              │
│ └──────────┘ └──────────┘ └──────────┘              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │              │
│ │ Title... │ │ Title... │ │ Title... │              │
│ └──────────┘ └──────────┘ └──────────┘              │
│ ... (Vertical Scroll)                               │
└─────────────────────────────────────────────────────┘
```

#### Detail Page
```
┌─────────────────────────────────────────────────────┐
│ [Back]            Photo Detail                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│        ┌──────────────────────────────┐             │
│        │                              │             │
│        │                              │             │
│        │        [Full Image]          │             │
│        │                              │             │
│        │                              │             │
│        └──────────────────────────────┘             │
│                                                     │
│  Title: Accusamus beatae ad facilis cum similique   │
│  ID: 1                                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 User Flow

```
ListPage (브라우징) → PhotoCard 클릭 → DetailPage 이동 (/photo/:id) → [Back] 클릭 → ListPage 복귀 (/)
```

### 5.3 Component List

| Component    | Location        | Responsibility |
| ------------ | --------------- | -------------- |
| `PhotoCard`  | `src/components/` | 개별 사진 썸네일 및 제목 표시, 클릭 시 상세 페이지 이동 |
| `PhotoGrid`  | `src/components/` | `PhotoCard`들을 3열 그리드(`display: grid`)로 배치 |
| `Layout`     | `src/components/` | 공통 헤더 및 메인 컨테이너 레이아웃 |

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message        | Cause            | Handling                     |
| ---- | -------------- | ---------------- | ---------------------------- |
| -    | Network Error  | API 호출 실패    | "데이터를 불러오는데 실패했습니다" 메시지 및 재시도 버튼 |
| 404  | Not Found      | 잘못된 사진 ID   | "존재하지 않는 사진입니다" 표시 및 목록 이동 유도 |

---

## 7. Security Considerations

- [x] API URL 환경 변수 관리 (`VITE_API_URL`)
- [x] 이미지 태그에 `alt` 속성 필수 포함 (Accessibility 준수)

---

## 8. Test Plan

### 8.1 Test Scope

| Type             | Target         | Tool          |
| ---------------- | -------------- | ------------- |
| Unit Test        | `PhotoCard` 렌더링 | Vitest & RTL  |
| Integration Test | API Fetching (`_limit=100`) | Vitest (Mock Service Worker) |

---

## 9. Coding Convention Reference

### 9.1 Naming Conventions

| Target     | Rule       | Example          |
| ---------- | ---------- | ---------------- |
| Components | PascalCase | `PhotoCard.tsx`  |
| Variables  | camelCase  | `photoList`      |
| Styles     | kebab-case | `photo-grid.css` |

---

## 10. Implementation Guide

### 10.1 File Structure

```
src/
├── components/
│   ├── PhotoCard.tsx
│   ├── PhotoGrid.tsx
│   └── Layout.tsx
├── pages/
│   ├── ListPage.tsx
│   └── DetailPage.tsx
├── lib/
│   └── api.ts
├── types/
│   └── photo.ts
├── styles/
│   ├── global.css
│   └── components.css
├── App.tsx
└── main.tsx
```

### 10.2 Implementation Order

1. [ ] Vite 프로젝트 스캐폴딩 및 `react-router-dom` 설치
2. [ ] `types/photo.ts` 정의 및 `src/lib/api.ts` fetch 로직 구현 (`_limit=100` 적용)
3. [ ] `ListPage` 및 `PhotoGrid`, `PhotoCard` 구현 (3열 그리드 스타일링)
4. [ ] `DetailPage` 구현 및 `/photo/:id` 라우팅 연결
5. [ ] 에러 처리 UI 구현 및 기본적인 테스트 작성

---

## 11. Self-Review Checklist (Do → Analyze Gate)

- [x] 모든 엔지니어링 요구사항 구현 완료 (상위 100개 로드, 3열 그리드, 라우팅)
- [x] 타입 정의 적절성 (`Photo` 인터페이스 등)
- [x] 에러 핸들링 완료 (API 실패 시 대응)
- [x] 컴파일러/타입 에러 없음
- [x] 린터 경고 없음
- [x] 사용자 입력 검증 (id 파라미터 숫자 변환 등) 및 `alt` 속성 확인
- [x] 환경 변수(`VITE_API_URL`) 사용 확인

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial design | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 (링크 수정, 앱 라우트 명시, 구조 통합, API 경로 정리) | Gemini CLI |
