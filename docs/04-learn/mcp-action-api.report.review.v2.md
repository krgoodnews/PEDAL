# mcp-action-api Learn Review (v2)

> **Reviewed by**: Codex (Cursor CLI, GPT-5 계열)
> **Date**: 2026-04-26
> **Document**: `docs/04-learn/mcp-action-api.report.md`
> **Prompt Log**: `docs/01-plan/mcp-action-api.prompt.md`

## Critical

- 없음.

## Warning

- `## 3.1 Functional Requirements (Traceability)`의 근거 표기(`server.py:64-106`, `server.py:126-172`)가 상대 경로나 파일 기준점 없이 작성되어 있어, 학습/회고 문서의 추적 가능성(auditability)이 떨어진다. 최소한 저장소 기준 경로(`mcp-server/server.py`)로 통일하고, 동일 규칙을 모든 증적 항목에 일관 적용하는 것이 필요하다. — [Diataxis: Reference documentation should enable efficient lookup](https://diataxis.fr/reference/)

- NFR 섹션에서 `Security | API Key Auth`를 “달성”으로 선언했지만, 위협 모델(예: 키 로테이션, 키 유출 대응, TLS 전제)이 빠져 있어 운영 관점의 보안 완결성이 부족하다. “구현 여부”와 “운영 가능 보안 수준”은 구분해 기술해야 한다. — [OWASP API Security Top 10 (API2: Broken Authentication)](https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/)

- `## 4.1 Final Analyze Results`의 “Engineering Match Rate 100% (+17% from v0.2)”는 비교 기준 문서(어느 버전의 분석 문서/측정식인지)에 대한 직접 참조가 없어 재현 검증이 어렵다. 수치형 메트릭은 산출 근거 링크 또는 계산식 요약이 필요하다. — [Google SRE Workbook: Measuring and Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

## Info / Suggestions

- 원 요청의 핵심 의도(“MCP 서버에서 PEDAL 단계 이동 가능한 POST API”, “기존 FastAPI 백엔드 보고서 참조”)는 현재 보고서 범위에서 대체로 충실히 반영되어 있다. 다만 “대시보드에서도 상태 변경 가능” 요구는 API 제공으로 간접 충족되었음을 명시하고, 실제 대시보드 연동은 후속 작업으로 분리 표기하면 해석 모호성이 줄어든다. — [Richardson Maturity Model (REST interface as integration contract)](https://martinfowler.com/articles/richardsonMaturityModel.html)

- `## 7. Next Steps`의 체크리스트는 유용하나, 운영 전 필수/권장 항목을 구분하면 배포 게이트로 바로 사용하기 좋다.

## Verdict

REVISE_REQUIRED
