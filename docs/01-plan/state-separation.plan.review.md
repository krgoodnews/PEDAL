# state-separation Plan Review

> **Reviewed by**: Cursor (Composer)
> **Date**: 2026-04-16
> **Document**: [docs/01-plan/state-separation.plan.md](./state-separation.plan.md)

## Critical

- **기존 `.pedal-status.json`에서 이행(migration) 요구사항이 빠짐.** 현재 SSOT인 [`.pedal/PEDAL.md`](../../.pedal/PEDAL.md)는 단일 파일 스키마·워크플로를 전제로 하며, 본 플랜은 2계층으로 전환한다고만 서술합니다. 초기 생성 규칙, 기존 파일과의 공존 기간, 단일 워크트리 사용자에 대한 기본 동작(폴백) 등이 FR/NFR에 없으면 구현 단계에서 호환성 깨짐이나 이중 진실원(source of truth) 충돌이 발생할 수 있습니다. 최소한 “이행·호환”을 FR 또는 비기능 제약으로 명시해야 합니다.

## Warning

- **프롬프트의 런타임 경로와 플랜의 경로가 불일치.** [프롬프트 로그](./state-separation.prompt.md)는 `~/.pedal/runtime.json`을 요구하고, 플랜은 `~/.pedal/<repo-id>/runtime.json`을 제시합니다. 다중 클론/워크트리에서 repo-id 분리는 타당할 수 있으나, 사용자 의도와 다를 수 있으므로 Requirements에 **경로 결정 근거**(예: 동일 머신에서 동시에 여러 체크아웃)와 **프롬프트 대비 변경 사항**을 한 줄이라도 적어야 합니다.

- **공유 파일명: `shared.json` vs `.pedal-status.shared.json`.** 프롬프트는 일반명 `shared.json`에 가깝고, 플랜은 기존 [`.pedal-status.json`](../../.pedal/PEDAL.md) 네이밍과 맞춘 `.pedal-status.shared.json`으로 고정합니다. 의도적 정제로 볼 수 있으나, **명시적 확정**(Engineering 또는 본 플랜의 Naming 표에 “프롬프트 대비 최종명”)이 없으면 이후 문서·스크립트가 엇갈릴 수 있습니다.

- **리스크 표의 “Append-Only 로직”이 범위·요구사항과 연결되지 않음.** [§5 Risks](./state-separation.plan.md)에서 완화책으로만 언급되며, In Scope·FR에는 없습니다. 실제로 채택할지, 아니면 “main 기준 pull 후 병합”만 할지에 따라 설계가 달라지므로, 채택 시 FR 보조 항목 또는 “의도적으로 비채택” 메모가 필요합니다.

- **동시성 완화(10초 stale lock)의 근거·한계가 불명확.** 장시간 작업(대용량 리베이스, 오프라인 등)에서 잘못된 강제 해제는 데이터 손상으로 이어질 수 있습니다. 운영체제/셸에서 흔히 쓰는 **권고(advisory) 락** 패턴은 POSIX `flock` 등에 문서화되어 있습니다 — [flock(2) — Linux manual](https://man7.org/linux/man-pages/man2/flock.2.html), macOS에서는 동일 개념이 [flock(2)](https://keith.github.io/xcode-man-pages/flock.2.html)로 제공됩니다. Engineering 단계에서 타임아웃·재시도·락 소유자 PID 기록 여부를 구체화하는 것이 좋습니다.

## Info / Suggestions

- **§6.1 미체크 항목**(`CONVENTIONS.md` 루트, 린터/포매터 등)은 저장소 실제 상태([`docs/wiki/CONVENTIONS.md`](../../docs/wiki/CONVENTIONS.md)만 존재)와 맞지 않아 독자가 “미완료 템플릿”으로 오해할 수 있습니다. “해당 없음” 또는 “wiki 경로로 충족”처럼 정리하는 편이 낫습니다.

- **프롬프트 대비 추가 범위**로 `.pedal/PEDAL.md` 갱신이 포함된 것은 타당합니다. 다만 사용자가 명시한 세 항목만 보면 PEDAL SSOT 변경이 **암묵 확장**이므로, Overview나 Scope에 “SSOT 문서 동기화 포함” 한 문장이 있으면 의도 추적이 쉬워집니다.

- **스트레스 테스트(§3.2)**의 “여러 셸” 기준이 정량화되지 않았습니다. DoD와 맞추려면 최소한 동시 프로세스 수·반복 횟수·성공 기준(예: 최종 JSON 유효성 + 필드 무결성)을 Engineering 또는 본 플랜 보조 문단에 두는 것을 권합니다.

## Verdict

**REVISE_REQUIRED**

의도(2계층 분리, 락 기반 스크립트, GEMINI/Cursor 규칙 반영)는 [프롬프트 로그](./state-separation.prompt.md)와 대체로 일치하나, **기존 `.pedal-status.json` 이행·호환**이 요구사항으로 빠져 있어 단계 진행 전 보완이 필요합니다. 추가로 **런타임 경로(`runtime.json` vs `<repo-id>/runtime.json`)**와 **공유 파일 최종명**을 Requirements 또는 Naming에 고정하면 재작업을 줄일 수 있습니다.
