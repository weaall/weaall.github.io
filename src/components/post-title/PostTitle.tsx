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
            </tw.Container>
        </>
    );
}
