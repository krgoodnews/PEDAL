# photo-list Engineering Document

> **Summary**: DummyJSON API의 응답 이미지 데이터를 사용하여 상품을 표시하는 React 설계
>
> **Project**: pedal
> **Version**: 1.0.0
> **Author**: Gemini CLI
> **Date**: 2026-04-06
> **Status**: Draft
> **Planning Doc**: [photo-list.plan.md](../../01-plan/features/photo-list.plan.md)

---

## 4. API & Routing Specification

### 4.2 External API (DummyJSON)

#### Image URL Logic
- **Thumbnail (ListPage)**: `product.thumbnail` (API 제공 썸네일 사용)
- **Full Image (DetailPage)**: `product.images[0]` (API 제공 원본 이미지 사용)

---

## Version History

| Version | Date   | Changes       | Author   |
| ------- | ------ | ------------- | -------- |
| 0.1     | 2026-04-06 | Initial design | Gemini CLI |
| 0.2     | 2026-04-06 | 리뷰어 피드백 반영 | Gemini CLI |
| 0.3     | 2026-04-06 | API 소스 변경 (DummyJSON) | Gemini CLI |
| 0.4     | 2026-04-06 | 429 Rate Limit 대응 설계 추가 | Gemini CLI |
| 0.5     | 2026-04-06 | API 응답 이미지 사용 로직으로 수정 | Gemini CLI |
