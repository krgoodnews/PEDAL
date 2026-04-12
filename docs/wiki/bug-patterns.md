# Bug Patterns Registry

> Append-only. 각 PEDAL 사이클의 Analyze/Iterate에서 발견된 버그 패턴을 축적한다.
> Do 페이즈에서 이 문서를 읽고 알려진 패턴의 재발을 사전 방지한다.

## Patterns

| ID | Pattern | Root Cause | Fix Applied | Prevention Rule |
|----|---------|-----------|-------------|-----------------|
| BP-001 | `gsap.from()` React Strict Mode 깜빡임 | Strict Mode 이중 마운트 시 `from()`이 설정한 초기 상태가 해제되지 않음 | `gsap.set() + gsap.to()` 패턴으로 교체, `clearProps: "all"` 클린업 | GSAP 애니메이션에서 `from()` 대신 항상 `set() + to()` 패턴 사용. `useGSAP` 반환 함수에서 `clearProps` 호출 |
| BP-002 | `prefers-reduced-motion` 미연결 | `getAnimationConfig()` 유틸 정의 후 컴포넌트에서 호출하지 않음 | 모든 섹션 컴포넌트에 `getAnimationConfig()` 호출 추가 | 애니메이션 컴포넌트 작성 시 반드시 `getAnimationConfig()` 체크를 첫 줄에 포함. `enabled: false`면 정적 상태 표시 후 early return |
| BP-003 | 텍스트 하드코딩 (i18n 미대비) | 초기 구현 시 speed 우선으로 컴포넌트에 직접 문자열 작성 | `constants/content.ts`에 `SECTION_COPY` 객체로 분리 | 모든 사용자 노출 텍스트는 `constants/` 파일에 정의. 컴포넌트에 문자열 리터럴 직접 사용 금지 |
| BP-004 | Engineering 문서에 삭제된 컴포넌트 잔존 | 구현 중 `AnimatedSection`을 제거했으나 Engineering 문서를 동기화하지 않음 | Engineering §13.2에서 해당 언급 삭제 | 구현에서 컴포넌트를 제거/변경할 때 Engineering 문서의 컴포넌트 목록(§5.3)과 파일 구조(§13.1)를 함께 업데이트 |
| BP-005 | 인터페이스 정의와 실제 데이터 shape 불일치 | `SiteContent` 인터페이스를 먼저 정의 후, 구현 중 필드가 달라짐 | 인터페이스를 실제 구조에 맞게 재정의 | 데이터 타입을 먼저 정의할 때 "확정" 표시하지 않기. 구현 완료 후 최종 타입과 Engineering 문서를 동기화 |
