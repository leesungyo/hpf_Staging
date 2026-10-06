# 가정의 벗 — 표지 · 광고 아카이브

1968–2005년 잡지 『가정의 벗』의 표지 428건과 광고 659건을 보여주는 정적 웹사이트입니다.
HTML · CSS · JavaScript만 쓰며 빌드 도구나 설치가 필요 없습니다.

## 실행

```bash
cd hh-archive
python3 -m http.server 8765 --bind 127.0.0.1
# 브라우저에서 http://127.0.0.1:8765
```

`index.html`을 바로 열어도 동작합니다.

## 파일 구조

```
hh-archive/
├── index.html        페이지 뼈대 (GNB · 본문 · 상세 모달 · 알림창 자리)
├── styles.css        디자인 전체 (섹션 목차가 맨 위에 있음)
├── fonts.css         Noto Serif KR 웹폰트 선언
├── app.js            화면 동작 (섹션 목차가 맨 위에 있음)
├── translations.js   화면 문구(한/영) · 라벨 표시 이름
├── data.js           자료 1,087건 (자동 생성 — 직접 수정 가능)
├── assets/
│   ├── covers/       표지 webp (긴 변 1400px) + thumb/ (목록용 520px)
│   ├── ads/          광고 webp + thumb/
│   └── fonts/        글꼴 파일 · 라이선스(OFL.txt)
└── _review/          검수 자료 (시트 사본 · 검수 목록) — 사이트에서는 쓰지 않음
```

## 자주 하는 수정 — 어디를 고치면 되나

| 하고 싶은 일 | 파일 | 위치 |
|---|---|---|
| 화면 글자 바꾸기 (버튼 · 안내문 · 소개문) | `translations.js` | `ARCHIVE_I18N.ko` / `.en` |
| 라벨 한글/영어 이름 바꾸기 (Woman → 여성) | `translations.js` | `ARCHIVE_LABELS` |
| 자료의 라벨 · 설명글 고치기 | `data.js` | 해당 `"id"` 줄 |
| 색 · 글꼴 · 자간 바꾸기 | `styles.css` | `1. 디자인 토큰` |
| 특정 화면 디자인 바꾸기 | `styles.css` | 목차의 해당 섹션 |
| 모바일만 바꾸기 | `styles.css` | `11. 반응형 — 모바일` |
| 표지 필터 추가 · 순서 변경 | `app.js` | `CONFIG.coverFilters` |
| 광고 분류 체계 바꾸기 | `app.js` | `CONFIG.categories` |
| 정렬 규칙 바꾸기 | `app.js` | `4. 데이터 조회` → `sortRecords()` |

## 동작 규칙

- **상태는 URL에 저장됩니다.** 예: `#ad?lang=ko&main=모자보건&item=ad-120`. 이 주소를 공유하면 같은 화면이 열립니다.
- **정렬**: 기본은 시간순(연도 → 월)입니다. 광고에서 연도를 골랐을 때만 구글 시트 `Ad_Category_Archive` 순서(분류별)로 정렬합니다.
- **필터 드롭다운**: 대분류를 고르지 않고 중분류를 누르면 알림창이 뜹니다. 키보드(↑ ↓ Enter Esc)로도 조작할 수 있습니다.
- **상세 모달**: 연도를 누르면 그 해 목록으로, 라벨 태그를 누르면 그 라벨 목록으로 이동합니다(광고 중·소분류는 상위 분류도 함께 걸림).
- **검색**: 라벨 값과 한글/영어 표시 이름, 연도를 찾습니다. 설명글은 검색하지 않습니다.
- **랜딩 페이지 숫자**(428 Covers 등)는 `data.js` 자료 수를 자동으로 셉니다. 소개문 속 숫자(436 · 658)는 원고 글자입니다.

## 데이터 출처

| 항목 | 출처 |
|---|---|
| 표지 라벨 | 구글 시트 `Iconographic_Analysis` 탭 (사본: `_review/iconographic_analysis.psv`) |
| 표지 설명글 | 구글 시트 `Cover_page_Archive` 탭 (사본: `_review/cover_descriptions.json`) |
| 광고 라벨 · 순서 | 구글 시트 `Ad_Category_Archive` 탭 (사본: `_review/ad_category_archive.psv`) |
| 이미지 원본 | `가정의벗/표지모음`, `가정의벗/광고모음` (PNG · 그대로 보존) |

## 배포 (GitHub Pages)

처음 한 번:

1. github.com 에서 새 저장소 만들기 — 이름 `hh-archive`, **Public**, README 추가 체크 해제
2. GitHub Desktop → File → Add Local Repository → 이 폴더 선택 → "create a repository" → Create
3. Commit to main → Publish repository ("Keep this code private" 체크 해제)
4. 저장소 Settings → Pages → Source: Deploy from a branch → Branch `main` / `/ (root)` → Save
5. 1~2분 뒤 `https://<아이디>.github.io/hh-archive/` 로 접속

수정 후 반영: GitHub Desktop 에서 Commit → Push (1~2분 뒤 사이트에 반영)

- 경로가 모두 상대 경로라 저장소 이름이 바뀌어도 그대로 동작합니다.
- `.gitignore` 로 백업 · 검수 자료(`_backup_*`, `_review/`)와 안 쓰는 옛 파일은 올라가지 않습니다.
- 검토 기간에는 `index.html` 의 `<meta name="robots" content="noindex, nofollow">` 로 검색엔진 노출을 막아 두었습니다. 정식 공개 때 이 줄을 지우세요.
- 무료 계정의 Pages 는 Public 저장소만 지원합니다. 링크를 아는 사람은 누구나 볼 수 있습니다.

## 남은 일

- 이미지 없는 표지 8호 (1970.5 · 6 · 7 · 10, 1975.4, 1977.10, 1993.5 · 6) 다시 캡처
- 시트에 없는 광고 `보건 행정/진료소.png` 처리 결정
- 영문 설명글 · 기획팀 번역 반영
- `assets/` 바로 아래 옛 이미지 28개, `assets/fonts/NotoSerifKR-Regular.otf · .ttf` 삭제 (사용 안 함)
