# photo-list Planning Document

> **Summary**: JSONPlaceholder API를 사용하여 사진 리스트를 3열 그리드로 보여주고 상세 페이지로 연결되는 React 웹페이지 개발
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-06
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 JSONPlaceholder API에서 가져온 사진들을 3열 그리드 레이아웃으로 확인하고, 각 사진의 상세 정보를 볼 수 있는 직관적인 웹 인터페이스를 제공하는 것입니다.

### 1.2 Background

간단한 React 기반의 미디어 브라우저 구현을 통해 API 연동, 그리드 레이아웃 설계 및 라우팅 능력을 입증하기 위함입니다.

### 1.3 Related Documents

- Requirements: [JSONPlaceholder Photos API](https://jsonplaceholder.typicode.com/photos)
- References: [React Documentation](https://react.dev/), [React Router Documentation](https://reactrouter.com/)

---

## 2. Scope

### 2.1 In Scope

- [x] JSONPlaceholder API (`/photos`) 연동
- [x] 3열 그리드 레이아웃 (반응형 고려)
- [x] 세로 스크롤링 기능
- [x] 사진 클릭 시 상세 페이지 이동 (React Router)
- [x] 상세 페이지에서 사진 제목 및 원본 이미지 표시
- [x] **초기 로딩 시 데이터 개수 제한 (성능을 위해 상위 100개 우선 로드)**

### 2.2 Out of Scope

- 사용자 인증 및 로그인
- 사진 업로드/수정/삭제 기능
- 다크 모드 지원 (추후 고려 가능)
- 무한 스크롤 및 서버 측 페이징 (이번 단계에서는 클라이언트 측 100개 제한으로 단순화)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement               | Priority | Status  |
| ----- | ------------------------- | -------- | ------- |
| FR-01 | `/photos` API 호출 및 상위 100개 데이터 수신 | High     | Pending |
| FR-02 | 3열 그리드 레이아웃 구현 | High     | Pending |
| FR-03 | 이미지 썸네일 및 제목 표시 | High     | Pending |
| FR-04 | 클릭 시 상세 페이지 라우팅 (`/photo/:id`) | High     | Pending |
| FR-05 | 상세 페이지에서 `id`, `title`, `url` (전체 크기 이미지) 표시 | Medium   | Pending |

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
- [ ] API 호출 실패 시 에러 핸들링 구현
- [ ] 단위 테스트 작성 및 통과 (주요 컴포넌트)

### 4.2 Quality Criteria

- [ ] 빌드 에러 없음
- [ ] Lint 에러 및 Warning 최소화
- [ ] 일관된 스타일링 (Vanilla CSS 사용)

---

## 5. Risks and Mitigation

| Risk     | Impact | Likelihood | Mitigation        |
| -------- | ------ | ---------- | ----------------- |
| API 호출 실패 | Medium | Low        | 에러 바운더리 또는 로컬 캐시 처리 |
| 많은 수의 사진으로 인한 성능 저하 | High   | Medium     | 초기 로드 개수 제한 (100개) 및 향후 가상 스크롤 도입 검토 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level          | Characteristics                                    | Recommended For                             | Selected |
| -------------- | -------------------------------------------------- | ------------------------------------------- | :------: |
| **Starter**    | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages     |    ✅     |
| **Dynamic**    | Feature-based modules, services layer              | Web apps with backend, SaaS MVPs            |    ☐     |
| **Enterprise** | Strict layer separation, DI, microservices         | High-traffic systems, complex architectures |    ☐     |

### 6.2 Key Architectural Decisions

| Decision         | Options                         | Selected      | Rationale |
| ---------------- | ------------------------------- | ------------- | --------- |
| Language         | JavaScript, TypeScript          | TypeScript    | 타입 안정성 확보 |
| Framework        | React (Vite)                    | React (Vite)  | 빠르고 현대적인 번들링 환경 제공 |
| State Management | Props, Context API, Local State | Local State   | 리스트/상세 구조에서 전역 상태 없이도 충분히 구현 가능 (단순성 지향) |
| Routing          | React Router                    | React Router  | 업계 표준 |
| Styling          | Vanilla CSS, Styled Components  | Vanilla CSS   | 프로젝트 권장 사항 및 표준 준수 |
| Testing          | Jest, React Testing Library     | Jest & RTL    | 표준 테스팅 도구 |

### 6.3 Clean Architecture Approach

```
Selected Level: Starter

Folder Structure Preview:
src/
├── components/      # UI components (Grid, Card, Detail)
├── hooks/           # Custom hooks for fetching
├── lib/             # API client, utility functions
├── pages/           # Page containers (List, Detail)
├── types/           # TypeScript interfaces
└── styles/          # Global and component CSS
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

*(현재 프로젝트 초기 단계로 확인 필요)*

### 7.2 Conventions to Define/Verify

| Category                  | Current State | To Define         | Priority |
| ------------------------- | ------------- | ----------------- | :------: |
| **Naming**                | missing       | PascalCase for components, camelCase for variables | High |
| **Folder structure**      | missing       | src/ 하위 구조 정의 | High |
| **Import order**          | missing       | React -> External -> Internal | Medium |
| **Environment variables** | missing       | API Base URL      | Medium |

### 7.3 Environment Variables Needed

| Variable     | Purpose         | Scope  | To Be Created |
| ------------ | --------------- | ------ | :-----------: |
| VITE_API_URL | JSONPlaceholder API Base URL | Client |       ✅       |

---

## 8. Next Steps

1. [ ] Write engineering document (`photo-list.engineering.md`)
2. [ ] Team review and approval
3. [ ] Start implementation

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial draft | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 (Vite, 100개 제한, Local State) | Gemini CLI |
