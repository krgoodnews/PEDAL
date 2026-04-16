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
| BP-006 | 템플릿 내 유령 경로 (Phantom Path) | 템플릿의 이전 버전 경로가 실제 파일 구조와 일치하지 않음 | `.pedal/templates/` 하위 파일들의 경로를 실제 위키 경로로 일괄 업데이트 | 템플릿에서 외부 문서를 참조할 때 반드시 실제 경로와 대조. 특히 SSOT(Wiki) 이전 시 모든 템플릿 경로를 즉시 업데이트할 것 |
| BP-007 | 셸 스크립트 기반 락 메커니즘의 Race Condition | `mkdir`은 원자적이지만, `stat` 실패 시 잘못된 락 해제 로직으로 데이터가 깨짐 | `mkdir` 직후 PID 기록, 락 해제 전 소유권(PID) 확인, 타임아웃 기반 Stale Lock 해제 강화 | 셸 기반 락 구현 시 반드시 소유자 PID 확인 로직 포함. `stat` 결과가 빈 값일 경우의 예외 처리를 철저히 할 것 |
| BP-008 | 병렬 프로세스 간 임시 파일명 충돌 | 여러 에이전트가 동일한 `.tmp` 파일명을 사용하여 파일을 덮어씀 | `SHARED_FILE.$$`와 같이 PID를 포함한 고유 임시 파일명 사용 | 파일 시스템에 파일을 기록할 때, 병렬 접근이 예상되면 반드시 프로세스 고유 ID를 파일명에 포함할 것 |
