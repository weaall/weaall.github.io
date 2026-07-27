import * as tw from "./PostTitle.styles";
import { PostFrontmatter } from "@/types/PostData";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";
import { FolderIcon, CalendarIcon } from "@/components/ui/icons/MetaSvg";

export default function PostTitle({ frontmatter }: { frontmatter: PostFrontmatter }) {
    const hasCover = frontmatter.imageUrl && frontmatter.imageUrl !== "none";
    // 커버가 data URL(webp)이면 그대로, 아니면 기존처럼 상대경로
    const coverSrc = frontmatter.imageUrl?.startsWith("data:") ? frontmatter.imageUrl : `../../${frontmatter.imageUrl}`;
    const label = frontmatter.label && frontmatter.label !== "none" ? frontmatter.label : "";
    const date = frontmatter.date && frontmatter.date !== "none" ? frontmatter.date : "";

    // 에디터의 카테고리/날짜 칩과 동일 디자인
    const chipCls = "flex items-center gap-1 rounded-[6px] bg-(--hover-bg) px-2 py-1 text-xs font-medium text-(--text-muted)";
    const MetaChips = () =>
        label || date ? (
            <div className="flex flex-wrap items-center gap-2">
                {label && <span className={chipCls}><FolderIcon /> {label}</span>}
                {date && <span className={chipCls}><CalendarIcon /> {date}</span>}
            </div>
        ) : null;

    return (
        <>
            <tw.Container>
                {hasCover ? (
                    <>
                        <div className="relative mb-8">
                            <tw.ImgWrap>
                                <tw.Img alt={frontmatter.title} src={coverSrc}></tw.Img>
                            </tw.ImgWrap>
                            {frontmatter.icon && (
                                // 흰 배경 박스 대신, 아이콘 둘레에 흰 테두리를 둘러 커버와 분리
                                <div className="absolute -bottom-5 left-2 flex items-center justify-center">
                                    <PageIcon icon={frontmatter.icon} size={56} outline />
                                </div>
                            )}
                        </div>
                        {(label || date) && (
                            <div className="mb-1">
                                <MetaChips />
                            </div>
                        )}
                    </>
                ) : (
                    // 커버 없을 때도 동일 레이아웃: 아이콘(56) 단독 → 그 아래 카테고리·날짜 칩
                    (frontmatter.icon || label || date) && (
                        <>
                            {frontmatter.icon && (
                                <div className="mb-3">
                                    <PageIcon icon={frontmatter.icon} size={56} />
                                </div>
                            )}
                            {(label || date) && (
                                <div className="mb-1">
                                    <MetaChips />
                                </div>
                            )}
                        </>
                    )
                )}
                <tw.Title>{frontmatter.title}</tw.Title>
                {/* 부제목 (에디터와 동일 디자인) */}
                {frontmatter.subTitle && frontmatter.subTitle !== "none" && (
                    <div className="px-[2px] text-[16px] text-(--text-muted)">{frontmatter.subTitle}</div>
                )}
                {/* 태그 (에디터와 동일 디자인, default-tag 센티넬은 숨김) */}
                {(() => {
                    const tags = (frontmatter.tags || []).filter((t) => t && t !== "default-tag");
                    if (!tags.length) return null;
                    return (
                        <div className="mt-2 flex flex-wrap gap-1 px-[2px]">
                            {tags.map((t, i) => (
                                <a
                                    key={`${t}-${i}`}
                                    href={`/search?q=${encodeURIComponent(t)}`}
                                    className="rounded-[6px] bg-(--hover-bg) px-2 py-0.5 text-xs text-(--text-muted) transition-colors hover:bg-(--menu-hover-bg) hover:text-(--text)"
                                >
                                    #{t}
                                </a>
                            ))}
                        </div>
                    );
                })()}
            </tw.Container>
        </>
    );
}
