import * as tw from "./PostTitle.styles";
import { PostFrontmatter } from "@/interface/PostData";
import { PageIcon } from "@/app/(pages)/newpage/lib/pageIcon";

export default function PostTitle({ frontmatter }: { frontmatter: PostFrontmatter }) {
    const hasCover = frontmatter.imageUrl && frontmatter.imageUrl !== "none";
    // 커버가 data URL(webp)이면 그대로, 아니면 기존처럼 상대경로
    const coverSrc = frontmatter.imageUrl?.startsWith("data:") ? frontmatter.imageUrl : `../../${frontmatter.imageUrl}`;

    return (
        <>
            <tw.Container>
                {hasCover ? (
                    <div className="relative mb-8">
                        <tw.ImgWrap>
                            <tw.Img alt={frontmatter.title} src={coverSrc}></tw.Img>
                        </tw.ImgWrap>
                        {frontmatter.icon && (
                            <div className="absolute -bottom-6 left-0 flex h-[64px] w-[64px] items-center justify-center rounded-[8px] bg-(--page-bg) p-[4px] shadow">
                                <PageIcon icon={frontmatter.icon} size={56} />
                            </div>
                        )}
                    </div>
                ) : (
                    frontmatter.icon && (
                        <div className="mb-1">
                            <PageIcon icon={frontmatter.icon} size={56} />
                        </div>
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
                                <span key={`${t}-${i}`} className="rounded-[6px] bg-(--hover-bg) px-2 py-0.5 text-xs text-(--text-muted)">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    );
                })()}
            </tw.Container>
        </>
    );
}
