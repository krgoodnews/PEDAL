# conventions Plan Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-12
> **Document**: docs/01-plan/conventions.plan.md

## Critical

- **컨벤션 파일 경로가 저장소 실제 상태와 불일치함.** 플랜과 템플릿은 `docs/01-plan/conventions.md`를 전제로 하나, 저장소에는 해당 경로의 파일이 없고 컨벤션 본문은 저장소 루트의 `01-plan/conventions.md`에만 존재한다. 마이그레이션·DoD·체크리스트(§6.1)는 이 사실을 명시하지 않으면 구현 단계에서 잘못된 가정으로 이어질 수 있다. Engineering·구현 전 플랜 본문과 범위 항목에서 **소스 경로를 `01-plan/conventions.md`(실제)로 정정**하고, 기존에 템플릿만이 가리키던 `docs/01-plan/conventions.md`가 **유령 경로**였음을 한 줄이라도 적어야 한다. — Wiki SSOT 원칙: [`.pedal/PEDAL.md`](../../.pedal/PEDAL.md) (Wiki 디렉터리 설명)

- **§6.1 “Existing Project Conventions” 체크박스가 자기모순.** `docs/wiki/conventions.md` (생성 예정)에 `[x]`로 표시되어 있으나 문서 전반에서는 아직 생성·이전이 Pending이다. 템플릿 체크리스트 의미상 “이미 충족”과 “예정”을 혼동하게 만든다. — 비교: [`.pedal/templates/plan.template.md`](../../.pedal/templates/plan.template.md) §6.1

## Warning

- **FR-02 범위가 템플릿 전체를 덮지 못할 수 있음.** `plan.template.md`와 `engineering.template.md`만 명시되어 있으나 [`.pedal/templates/analysis.template.md`](../../.pedal/templates/analysis.template.md)에도 `docs/01-plan/conventions.md` 참조가 있어, 위키 경로로 바꿀 때 동일하게 수정하지 않으면 Analyze 단계만 구 경로를 가리키게 된다. 사용자 프롬프트의 TDD·테스트는 Analysis 단계와도 직결되므로 누락 위험이 크다.

- **“Project config file has coding conventions section”을 `[x]`로 둔 근거가 불명확.** 루트 `package.json` 등에서 ‘coding conventions’ 전용 섹션을 확인하기 어렵고, ESLint는 `landing/eslint.config.mjs` 수준에 국한된다. 플랜이 사실이라면 근거 파일명을 적고, 아니면 미체크로 두는 편이 일관된다. — [npm package.json 필드 문서](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) *(일반 참고: package.json은 관례적으로 “coding conventions” 전용 섹션을 갖지 않음)*

- **리스크 표가 경로 불일치·깨진 링크에 대한 완화를 다루지 않음.** 이동 후 `01-plan/conventions.md`를 가리키는 외부/문서 링크, 또는 잘못된 `docs/01-plan/conventions.md` 기대가 있을 수 있다. “이동 후 루트에 stub 또는 README 한 줄 안내” 같은 완화를 고려할 가치가 있다. — 정보성 (내부 저장소 구조 기준)

## Info / Suggestions

- **성공 기준(§4.1)에 `.cursor/rules/pedal.mdc` 반영 여부를 DoD에 명시**하면 §2.1 “검토” 항목과 맞물린다. 현재는 “등”으로 묶여 있어 완료 판정이 모호할 수 있다.

- **`GEMINI.md`에 동일한 컨벤션 경로가 있다면** 워크플로 도구 간 일관성을 위해 한 줄 업데이트 후보로 적어두면 좋다. — 선택 사항

- **사용자 의도(프롬프트)의 “무조건 참조”**에 대해, `.pedal/PEDAL.md`의 Phase 표에 이미 “conventions” 열이 암시적으로 있다면(§Wiki), 필수 읽기 문장을 Plan/Engineering/Do/Analyze 중 어디까지 넣을지 Engineering에서 구체화하면 된다. 플랜 단계에서는 범위만으로 충분하나, FR-03에 Analyze 단계 명시 여부를 검토할 수 있다.

## Verdict

**REVISE_REQUIRED** — 저장소에 맞는 소스 경로 정정, §6.1 체크박스 정리, `analysis.template.md`를 포함한 템플릿·참조 일괄 갱신 범위 명시가 필요하다. 위 항목을 반영하면 Engineering 단계로 진행 가능한 수준으로 본다.
