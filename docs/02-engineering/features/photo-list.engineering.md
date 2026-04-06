# photo-list Engineering Document

> **Summary**: DummyJSON API의 Rate Limit(429) 문제를 해결하기 위해 지연 재시도(Retry with Delay)를 구현하고 상품을 표시하는 React 설계
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-06
> **Status**: Draft
> **Planning Doc**: [photo-list.plan.md](../../01-plan/features/photo-list.plan.md)

---

## 1. Overview

### 1.1 Engineering Goals

- DummyJSON API의 Rate Limit (429) 발생 시 지연 후 자동 재시도 로직 구현
- 사용자에게 현재 상태(Rate Limit 중)를 명확히 알리는 UI 제공

---

## 6. Error Handling

### 6.1 Error Code Definition

| Code | Message | Cause | Handling |
| ---- | ------- | ----- | -------- |
| 429  | 요청이 너무 많습니다 (Rate Limit) | API 호출 한도 초과 | 지연 후 자동 재시도 및 사용자 알림 |
| 500  | 서버 오류 | API 서버 장애 | 에러 메시지 및 수동 재시도 버튼 표시 |

### 6.2 Retry Strategy
- **Wait Duration**: HTTP `Retry-After` 헤더를 우선 존중하거나, 기본 5초 대기 후 재시도.
- **Max Retries**: 최대 3회 자동 재시도.

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial design | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 | Gemini CLI |
| 0.3     | 2026-04-06 | API 소스 변경 (DummyJSON) | Gemini CLI |
| 0.4     | 2026-04-06 | 429 Rate Limit 대응 설계 추가 | Gemini CLI |
