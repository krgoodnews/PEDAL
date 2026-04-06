# photo-list Planning Document

> **Summary**: DummyJSON API를 사용하여 상품 리스트를 3열 그리드로 보여주고 상세 페이지로 연결되는 React 웹페이지 개발
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-06
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 DummyJSON API에서 가져온 상품들을 3열 그리드 레이아웃으로 확인하고, 각 상품의 상세 정보를 볼 수 있는 직관적인 웹 인터페이스를 제공하는 것입니다.

### 1.2 Background

JSONPlaceholder API의 이미지 주소 문제로 인해 더 신뢰할 수 있는 DummyJSON API로 교체하여 구현합니다.

### 1.3 Related Documents

- Requirements: [DummyJSON Products API](https://dummyjson.com/docs/products)
- References: [React Documentation](https://react.dev/), [React Router Documentation](https://reactrouter.com/)

---

## 2. Scope

### 2.1 In Scope

- [x] DummyJSON API (`/products`) 연동
- [x] 3열 그리드 레이아웃 (반응형 고려)
- [x] 세로 스크롤링 기능
- [x] 상품 클릭 시 상세 페이지 이동 (React Router)
- [x] 상세 페이지에서 상품 제목 및 커스텀 아이콘 이미지 표시
- [x] **초기 로딩 시 데이터 개수 제한 (100개)**

### 2.2 Out of Scope

- 사용자 인증 및 로그인
- 상품 추가/수정/삭제 기능
- 다크 모드 지원

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority | Status  |
| ----- | ------------------------- | -------- | ------- |
| FR-01 | `/products` API 호출 및 상위 100개 데이터 수신 | High     | Pending |
| FR-02 | 3열 그리드 레이아웃 구현 | High     | Pending |
| FR-03 | 상품 아이콘 및 제목 표시 | High     | Pending |
| FR-04 | 클릭 시 상세 페이지 라우팅 (`/photo/:id`) | High     | Pending |
| FR-05 | 상세 페이지에서 `id`, `title`, `description`, `price` 및 이미지 표시 | Medium   | Pending |

### 3.2 Non-Functional Requirements

| Category      | Criteria                        | Measurement Method    |
| ------------- | ------------------------------- | --------------------- |
| Performance   | 초기 로딩 시 이미지 최적화 (지연 로딩) | Lighthouse / Browser DevTools |
| Accessibility | 이미지에 대한 Alt 텍스트 제공 | Screen Reader Check |
| UI/UX         | 모바일 대응 (반응형 그리드) | Responsive Design Check |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 기능 요구 사항 (FR-01 ~ FR-05) 구현 완료
- [ ] React Router를 통한 페이지 전환 정상 작동
- [ ] 테스트 환경 구성 (Vitest) 및 기본 테스트 통과
- [ ] 설계된 재시도 버튼 UI 구현

---

## 5. Risks and Mitigation

| Risk     | Impact | Likelihood | Mitigation        |
| -------- | ------ | ---------- | ----------------- |
| API 호출 실패 | Medium | Low        | 재시도 버튼 및 에러 메시지 구현 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level          | Characteristics                                    | Recommended For                             | Selected |
| -------------- | -------------------------------------------------- | ------------------------------------------- | :------: |
| **Starter**    | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages     |    ✅     |

### 6.2 Key Architectural Decisions

| Decision         | Options                         | Selected      | Rationale |
| ---------------- | ------------------------------- | ------------- | --------- |
| Language         | TypeScript                      | TypeScript    | 타입 안정성 |
| Framework        | React (Vite)                    | React (Vite)  | 개발 효율성 |
| State Management | Local State                     | Local State   | 단순성 지향 |
| Routing          | React Router                    | React Router  | 표준 라우팅 |
| Testing          | Vitest, RTL                     | Vitest & RTL  | 빠르고 현대적인 테스팅 |

---

## 7. Convention Prerequisites

### 7.3 Environment Variables Needed

| Variable     | Purpose         | Scope  | To Be Created |
| ------------ | --------------- | ------ | :-----------: |
| VITE_API_URL | DummyJSON API Base URL | Client |       ✅       |

---

## 8. Next Steps

1. [ ] Update engineering document (`photo-list.engineering.md`)
2. [ ] Re-implement and Fix issues (Test env, Retry UI)

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial draft | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 (Vite, 100개 제한, Local State) | Gemini CLI |
| 0.3     | 2026-04-06 | API 소스 변경 (DummyJSON) 및 테스트 환경 요구사항 추가 | Gemini CLI |
