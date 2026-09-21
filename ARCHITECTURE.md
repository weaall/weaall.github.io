# 코드 구조

WeHub 사이트(Next.js App Router, 정적 export)의 폴더 지도와 배치 규칙.
새 화면을 만들거나 기존 화면을 고칠 때, **어디를 열어야 하는지** 이 문서만 보고 찾을 수 있게 하는 것이 목적이다.

---

## 1. 한 줄 요약

```
src/app        라우팅만 한다. page.tsx 는 20줄 안팎으로 얇게 유지한다.
src/features   화면의 알맹이. 기능별로 banners / components / sections 로 나뉜다.
src/components 여러 기능이 함께 쓰는 공용 UI.
src/utils      순수 함수 (날짜, 폰트, 메타데이터).
posts/         글 본문 (MDX). 코드가 아니라 콘텐츠다.
public/assets  이미지.
```

---

## 2. 폴더 지도

### `src/app` — 라우팅

폴더 이름이 곧 URL이다. 괄호 폴더 `(main)` `(pages)` 는 URL에 나타나지 않는 그룹이다.

| 경로 | URL |
|---|---|
| `app/(main)/page.tsx` | `/` |
| `app/(pages)/portfolio/page.tsx` | `/portfolio` |
| `app/(pages)/portfolio/mnai/page.tsx` | `/portfolio/mnai` |
| `app/(pages)/post/[slug]/page.tsx` | `/post/<슬러그>` |
| `app/api/*/route.ts` | 개발용 API (정적 export 에는 포함되지 않는다) |

`page.tsx` 가 하는 일은 셋뿐이다. **메타데이터 선언 → 배너 배치 → 섹션 배치.**
내용을 여기에 쓰지 않는다. 길어지면 `src/features` 로 옮긴다.

```tsx
// app/(pages)/portfolio/mnai/page.tsx
export const metadata = getBaseMetadata({ ... });

export default function MnaiPage() {
    return (
        <div>
            <MnaiBanner />
            <MnaiSections />
        </div>
    );
}
```

### `src/features` — 기능별 알맹이

지금은 `portfolio` 하나다. 기능이 늘면 같은 모양으로 폴더를 하나 더 만든다.

```
features/portfolio/
  banners/      제품별 상단 히어로. 제품당 파일 하나.
  components/   포트폴리오 전용 UI 조각. 한 파일에 한 컴포넌트.
  sections/     제품별 본문. 제품당 폴더 하나.
    mnai/
      MnaiSections.tsx   섹션 조립 + 그 제품의 데이터
    medsec/
      MedSecSections.tsx 섹션 조립
      content.ts         글 내용 (마크업과 분리)
```

**`components/` 안의 조각들** — 모두 `index.ts` 배럴로 내보낸다.

| 컴포넌트 | 언제 쓰나 |
|---|---|
| `SectionTitle` | 섹션 제목 |
| `OverviewCard` | 페이지 맨 위 "프로젝트 오버뷰" 카드 |
| `DiagramPanel` | 다이어그램·이미지를 담는 회색 카드 |
| `ArchDiagram` | 그림 파일 없이 CSS로 그리는 구성도 |
| `StepFlow` | 번호가 붙는 단계 흐름 |
| `IconFlow` / `IconRow` | 아이콘 흐름 / 아이콘 나열 |
| `TaskCard` | "Task n." 한 일 카드 |
| `FactGrid` | 숫자 요약 4칸 |
| `CheckList` | 체크 표시 2열 목록 |
| `LinkCard` | 관련 글로 넘어가는 카드 |
| `tokens.ts` | 반복되는 색 (카드 회색, 본문 검정 등) |

### `src/components` — 공용 UI

| 폴더 | 내용 |
|---|---|
| `layout/` `header/` `footer/` | 전체 레이아웃 |
| `banner/` | 홈·포트폴리오 목록 히어로와 **공통 배너 레이아웃**(`Banner.styles.tsx`) |
| `mdx/` | MDX 렌더링. 본문 컴포넌트, 코드 하이라이트, 글 목록 |
| `PostListDrawer/` `post-title/` `dev-list/` `dev-mdx/` | 글 화면 조각 |
| `ui/icons/` | 아이콘. 쓰이는 자리로 파일이 나뉜다 |

**아이콘 파일**

| 파일 | 용도 |
|---|---|
| `CommonIcons` | 화살표·닫기 같은 범용 UI |
| `PostMetaIcons` | 글 머리말 (날짜·태그·폴더) |
| `EditorIcons` | `/newpage` 에디터 메뉴 |
| `PortfolioIcons` | 포트폴리오 섹션 아이콘 |
| `NcpIcons` | 네이버 클라우드 서비스 아이콘 (직접 그린 벡터) |
| `BrandLogos` | 외부 브랜드 로고 |

---

## 3. 이름 규칙

| 대상 | 규칙 | 예 |
|---|---|---|
| 컴포넌트 파일 | PascalCase, 안의 컴포넌트와 같은 이름 | `DiagramPanel.tsx` |
| 폴더 | 소문자. 두 단어면 케밥 | `features/portfolio`, `ui/hover-header` |
| tailwind-styled-components 모음 | `*.styles.tsx` | `Banner.styles.tsx` |
| 데이터만 있는 파일 | 소문자 | `content.ts`, `tokens.ts` |
| export | **named export 를 기본**으로 한다. `page.tsx` 만 default | `export function MnaiSections()` |

배럴(`index.ts`)이 있는 폴더는 배럴로 가져온다.

```ts
import { DiagramPanel, TaskCard } from "@/features/portfolio/components";  // O
import { DiagramPanel } from "@/features/portfolio/components/DiagramPanel"; // 피한다
```

---

## 4. 레시피: 포트폴리오 제품 페이지 추가

1. `public/assets/portfolio/<제품>/` 에 이미지를 넣는다.
2. `src/features/portfolio/banners/<제품>Banner.tsx` 를 만들고 `banners/index.ts` 에 한 줄 추가한다.
   공통 레이아웃은 `@/components/banner/Banner.styles` 의 `StartWrap` / `EndWrap` / `Title` 을 쓴다.
3. `src/features/portfolio/sections/<제품>/<제품>Sections.tsx` 를 만든다.
   조각은 전부 `@/features/portfolio/components` 에서 가져온다.
4. `src/app/(pages)/portfolio/<제품>/page.tsx` 를 만든다 (배너 + 섹션 + 메타데이터).
5. `src/features/portfolio/components/PortfolioListBanner.tsx` 에 목록 카드를, `src/components/footer/Footer.tsx` 에 링크를 추가한다.

---

## 5. 글(MDX) 파이프라인

```
posts/post/*.mdx   →  /post/<파일명>
posts/dev/*.mdx    →  /dev/<파일명>
posts/prac/*.mdx   →  /prac/<파일명>
```

프론트매터(`title`, `date`, `tags`, `icon` 등)는 `src/types/PostData.ts` 에 정의돼 있고,
읽기·렌더링은 `src/components/mdx/` 가 담당한다. 새 MDX 컴포넌트는
`src/components/mdx/mdx-components/components.tsx` 에 등록한다.

---

## 6. 빌드와 배포

```bash
npm run dev      # 개발 서버 (3003)
npm run build    # 정적 export → out/
npm run deploy   # 빌드 후 gh-pages 브랜치로 게시
```

`npm run deploy` 는 `scripts/deploy-pages.mjs` 를 쓴다.
임시 git worktree 에서 `git rm -r -- .` 한 번으로 브랜치를 비우고 `out/` 을 복사해 커밋·푸시한다.
(이전에 쓰던 `gh-pages` 패키지는 삭제할 파일 경로를 전부 명령줄 인자로 넘겨서,
파일이 800개를 넘자 윈도우 명령줄 길이 한도에 걸려 실패했다.)

---

## 7. 아직 정리하지 않은 곳

- `src/app/(pages)/newpage/` — 노션형 에디터. 이미 `components / hooks / lib` 로 나뉘어 있어
  구조 자체는 괜찮지만, `NewPage.tsx` 가 1,600줄이 넘고 파일 이름에 `Emoji.modal.tsx` 처럼
  옛 규칙이 남아 있다. 손대려면 별도 작업으로 떼어내는 편이 안전하다.
- `src/components` 안의 `PostListDrawer`(PascalCase 폴더)와 `dev-list`(케밥 폴더)가 섞여 있다.
  글 화면을 손볼 때 `features/post` 로 함께 옮기면 규칙이 맞는다.
