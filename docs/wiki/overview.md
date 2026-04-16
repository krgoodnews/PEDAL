# Project Overview

## PEDAL이란?

PEDAL은 전통적인 PDCA 사이클에서 영감을 받아 AI Agent에 최적화된 소프트웨어 개발 워크플로우다.

| Letter | Phase | Focus |
|--------|-------|-------|
| **P** | Plan | 목표, 범위, 요구사항, 리스크 |
| **E** | Engineering | 설계, 아키텍처, API, UI 의도 |
| **D** | Do | Engineering 문서 기반 구현 (코드 산출) |
| **A** | Analyze | Engineering vs 구현 갭 분석 |
| **L** | Learn | Wiki 업데이트 + 완료 보고서 + 핸드오프 |

핵심 메커니즘:
- **크로스 리뷰**: 문서 작성 Agent와 다른 AI Agent가 리뷰 (에코 챔버 방지)
- **Wiki SSOT**: 검증된 사실만 축적, 다음 사이클의 컨텍스트로 활용
- **Severity-Weighted Scoring**: Critical(×3), Warning(×2), Info(×1) 가중치로 품질 수치화
- **Human Approval Gate**: Engineering 완료 후, Analyze 완료 후 사람 승인 필수

## 저장소 구조

```
PEDAL/
├── .pedal/              ← 워크플로우 정의 (PEDAL.md, REVIEW.md, templates/)
├── .cursor/rules/       ← Cursor 전용 규칙 (pedal.mdc)
├── landing/             ← 소개 랜딩 페이지 (Next.js 16, 독립 프로젝트)
├── docs/
│   ├── 01-plan/         ← Plan 문서 + Prompt Log
│   ├── 02-engineering/  ← Engineering 문서
│   ├── 03-analysis/     ← Analysis 보고서
│   ├── 04-learn/        ← Completion Report
│   ├── wiki/            ← 프로젝트 Wiki (SSOT)
│   └── archived/        ← 완료된 PEDAL 아티팩트
├── GEMINI.md            ← Gemini CLI 전용 설정
├── README.md
├── .pedal-status.shared.json ← PEDAL 공유 상태 추적 (Git)
├── scripts/             ← 관리 스크립트 (pedal-sync.sh 등)
├── README.md
└── .pedal-status.json.bak ← (이전된 경우) 레거시 상태 백업
```

## 2계층 상태 및 자동 워크트리 관리

병렬 작업 및 다중 에이전트 환경을 지원하기 위해 상태와 작업 공간을 자동화하여 관리한다.

1. **Shared State (`.pedal-status.shared.json`)**: Git으로 관리되는 팀 공통의 진행 상황.
2. **Runtime State (`~/.pedal/<repo-id>/runtime.json`)**: 로컬 머신 전용의 실행 정보(PID, 워크트리 경로 등).
3. **Automatic Worktree**: `/pedal plan` 시 상위 디렉토리에 `{repo-name}-{feature}` 형태의 전용 작업 폴더를 자동으로 생성한다. (필요 시 `--no-worktree` 옵션으로 수동 관리 가능)

**필수 규칙**:
- 모든 상태 변경은 반드시 `scripts/pedal-sync.sh`를 통해서 수행한다.
- 작업 완료 후 `/pedal archive`를 호출하여 워크트리 리소스를 정리한다.

## 지원 도구

| 도구 | 설정 파일 | 역할 |
|------|----------|------|
| Cursor | `.cursor/rules/pedal.mdc` | 주요 개발 에이전트 |
| Gemini CLI | `GEMINI.md` | 크로스 리뷰어, 슬래시 커맨드 |

## 라이선스

Apache License 2.0
