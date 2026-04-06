# photo-list Wiki

> **Feature Overview**: DummyJSON API를 사용하여 상위 100개의 상품을 3열 그리드로 표시하고 상세 정보를 제공하는 React 애플리케이션

---

## 1. 개요 (Overview)

DummyJSON의 `/products` 엔드포인트를 호출하여 상품 목록을 가져오고, 각 상품의 썸네일과 제목을 3열 그리드 레이아웃으로 보여줍니다. 사용자가 상품을 클릭하면 상세 페이지로 이동하여 상세 설명과 가격, 원본 이미지를 확인할 수 있습니다.

---

## 2. 아키텍처 (Architecture)

### 2.1 기술 스택
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Routing**: React Router v7
- **Styling**: Vanilla CSS
- **Testing**: Vitest + happy-dom + React Testing Library

### 2.2 레이어 구조 (Starter Level)
- `src/components`: UI 컴포넌트 (`PhotoCard`, `PhotoGrid`, `Layout`, `PhotoInfo`)
- `src/pages`: 페이지 컨테이너 (`ListPage`, `DetailPage`)
- `src/lib`: 인프라 레이어 (API 클라이언트 `api.ts`)
- `src/types`: 도메인 타입 정의 (`photo.ts`)
- `src/styles`: 전역 및 컴포넌트 스타일

---

## 3. UI 레이아웃 (UI Layout)

### 3.1 메인 리스트 (ListPage)
```text
┌─────────────────────────────────────────────────────┐
│                   Photo Gallery                     │ (Header)
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │              │ (3-Column Grid)
│ │ Title... │ │ Title... │ │ Title... │              │
│ └──────────┘ └──────────┘ └──────────┘              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │              │
│ │ Title... │ │ Title... │ │ Title... │              │
│ └──────────┘ └──────────┘ └──────────┘              │
│ ... (Vertical Scroll)                               │
└─────────────────────────────────────────────────────┘
```

### 3.2 상세 페이지 (DetailPage)
```text
┌─────────────────────────────────────────────────────┐
│ [Back]            Photo Detail                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│        ┌──────────────────────────────┐             │
│        │                              │             │
│        │        [Full Image]          │             │
│        │                              │             │
│        └──────────────────────────────┘             │
│                                                     │
│  Title: Product Title                               │
│  Price: $100                                        │
│  Description: Detailed description here...          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. API 명세 (API Specification)

### 4.1 기초 URL
- `VITE_API_URL` 환경 변수 사용 (기본값: `https://dummyjson.com`)

### 4.2 엔드포인트
- `GET /products?limit=100`: 상품 목록 조회
- `GET /products/:id`: 상품 상세 조회

### 4.3 에러 처리 및 재시도 로직
- **429 Rate Limit 대응**: API 호출 실패 시 `fetchWithRetry` 함수를 통해 최대 3회 자동 재시도하며, `Retry-After` 헤더 또는 기본 5초의 지연 시간을 가집니다.
- **UI 피드백**: 로딩 중에는 `Loading...` 메시지를, 실패 시에는 상황에 맞는 에러 메시지와 함께 `Retry` 버튼을 제공합니다.

---

## 5. 설정 및 설치 (Configuration)

### 5.1 환경 변수 (`.env`)
```env
VITE_API_URL=https://dummyjson.com
```

### 5.2 실행 및 테스트
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm test
```

---

## 6. 주요 파일 위치 (File Locations)

- API 로직: `src/lib/api.ts`
- 상품 타입: `src/types/photo.ts`
- 그리드 스타일: `src/styles/components.css` (.photo-grid)

---

## 7. 버전 이력 (Changelog)

### v1.0.0 (2026-04-06)
- 초기 구현 완료 (Vite/React/TS)
- JSONPlaceholder에서 DummyJSON API로 전환
- 429 Rate Limit 대응 및 Retry 로직 추가
- Unit Test 환경 구축 (Vitest)
