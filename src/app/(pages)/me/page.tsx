import * as tw from "./page.styles"

export default async function Page() {
    const skillItems = [
        { src: "../../assets/mono/react_mono.svg", alt: "React" },
        { src: "../../assets/mono/nextjs_mono.svg", alt: "Next.js" },
        { src: "../../assets/mono/nodejs_mono.svg", alt: "Node.js" },
        { src: "../../assets/mono/mysql_mono.svg", alt: "MySQL" },
        { src: "../../assets/mono/mongodb_mono.svg", alt: "MongoDB" },
        { src: "../../assets/mono/aws_mono.svg", alt: "AWS" },
    ];

    const partItems = [
        { src: "../../assets/part/ux_ui.svg", alt: "UX & UI", exp: "사용자 경험을 중시하는 UX/UI 설계를 통해 실용성과 직관성을 추구합니다." },
        { src: "../../assets/part/web_mobile.svg", alt: "Web & Mobile", exp: "아이디어를 웹/모바일 경험에 알맞게 최적화합니다." },
        { src: "../../assets/part/be.svg", alt: "Backend", exp: "보안과 효율성을 가장 중심으로한 백엔드 설계를 지향합니다." },
        { src: "../../assets/part/dev_ops.svg", alt: "DevOps", exp: "AWS 기반으로 자동화, 모니터링, 그리고 비용 효율적인 설계를 제공합니다." },
    ];

    return (
        <tw.Container>
            <tw.BannerWrap>
                <tw.ProfileWrap>
                    <tw.ProfileBg>
                        <tw.ProfilePic alt="" src={"../../assets/portfolio/me.png"} />
                    </tw.ProfileBg>
                </tw.ProfileWrap>
                <tw.BannerLabelWrap>
                    <tw.BannerLabel>Hello</tw.BannerLabel>
                    <tw.BannerUnderline />
                    <tw.BannerText>I&apos;m DongHyun-Wi.</tw.BannerText>
                </tw.BannerLabelWrap>
            </tw.BannerWrap>

            <tw.SkillWrap>
                {skillItems.map(({ src, alt }) => (
                    <tw.Skills key={alt} alt={alt} src={src} />
                ))}
            </tw.SkillWrap>

            <tw.PartsWrap>
                <tw.PartsWrapTitle>What do I strive for?</tw.PartsWrapTitle>
                <tw.PartList>
                    {partItems.map(({ src, alt, exp }) => (
                        <tw.PartWrap key={alt}>
                            <tw.PartSvg key={alt} alt={alt} src={src} />
                            <tw.PartLabel>{alt}</tw.PartLabel>
                            <tw.PartText>{exp}</tw.PartText>
                        </tw.PartWrap>
                    ))}
                </tw.PartList>
            </tw.PartsWrap>

            <tw.ProjectsWrap>
                <tw.ProjectWrap>
                    <a href="https://www.travelo.store" target="_blank" rel="noopener noreferrer">
                        <tw.ProjectImg src="../../assets/portfolio/main.png" loading="lazy" />
                    </a>
                    <tw.ProjectImg src="../../assets/portfolio/core1.png" loading="lazy" />
                    <tw.ProjectImg src="../../assets/portfolio/core2.png" loading="lazy" />
                    <tw.ProjectImg src="../../assets/portfolio/arch1.png" loading="lazy" />
                    <tw.ProjectImg src="../../assets/portfolio/arch2.png" loading="lazy" />
                    <tw.ProjectImg src="../../assets/portfolio/sub.png" loading="lazy" />
                </tw.ProjectWrap>
            </tw.ProjectsWrap>

            <tw.RearWrap></tw.RearWrap>
        </tw.Container>
    );
}
