# photo-list Engineering Document

> **Summary**: DummyJSON API를 사용하여 상위 100개의 상품을 3열 그리드로 표시하고 상세 페이지로 전환하는 React 애플리케이션 설계
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

---

## 1. Overview

### 1.1 Engineering Goals

- DummyJSON API 연동 및 효율적인 데이터 처리 (100개 제한)
- 커스텀 아이콘 이미지 URL 생성 및 표시
- 테스트 환경(Vitest) 완비 및 재시도(Retry) UI 구현

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
      │    PhotoGrid    │            │   PhotoInfo     │ (컴포넌트 분리)
      └────────┬────────┘            └─────────────────┘
               │
      ┌────────▼────────┐
      │    PhotoCard    │
      └─────────────────┘
```

---

## 3. Data Model

### 3.1 Entity Definition (Product)

```typescript
// src/types/photo.ts (상품 정보를 Photo 인터페이스로 추상화하여 기존 호환성 유지)
export interface Photo {
  id: number;
  title: string;
  description: string;
  price: number;
  url: string; // Detail image
  thumbnailUrl: string; // Grid icon
}
```

---

## 4. API & Routing Specification

### 4.2 External API (DummyJSON)

| Method | Path                | Description |
| ------ | ------------------- | ----------- |
| GET    | `/products`         | 상품 목록 가져오기 (`?limit=100`) |
| GET    | `/products/:id`     | 특정 상품 상세 정보 가져오기 |

#### Image URL Logic
- **Thumbnail**: `https://dummyjson.com/icon/product_{id}/500`
- **Full Image**: `product.images[0]` (API 응답 데이터 활용)

---

## 6. Error Handling

### 6.1 Error UI
- **Retry Logic**: API 호출 실패 시 에러 메시지와 함께 "Retry" 버튼을 표시하여 재시도를 유도함.

---

## 8. Test Plan

### 8.1 Environment Setup
- **`vite.config.ts`**: `test` 환경 설정 (environment: 'jsdom')
- **`package.json`**: `"test": "vitest"` 스크립트 추가

---

## 10. Implementation Guide

### 11.2 Implementation Order (Iteration)

1. [ ] **Test Env**: `vite.config.ts` 및 `package.json` 수정
2. [ ] **API Client**: `dummyjson.com` 연동 및 `limit=100` 적용
3. [ ] **Components**: `PhotoInfo` 분리 및 재시도 버튼 추가
4. [ ] **Verification**: 빌드 및 테스트 실행 확인

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial design | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 | Gemini CLI |
| 0.3     | 2026-04-06 | API 소스 변경 (DummyJSON), 테스트 환경 보강, 재시도 UI 추가 | Gemini CLI |
