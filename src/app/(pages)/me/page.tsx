"use client";

import { useEffect, useRef, useState } from "react";
import * as tw from "./page.styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
});

interface ImageProps {
    src: string;
    alt: string;
}


const ImageWithTransition = ({ src, alt }: ImageProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            {
                threshold: 0.6,
            },
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return <tw.ProjectImg ref={imgRef} className={` ${isVisible ? "opacity-100 scale-100" : ""}`} src={src} alt={alt} loading="lazy" />;
};

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
        { src: "../../assets/part/dev_ops.svg", alt: "DevOps", exp: "AWS 기반으로한 자동화 서비스, 모니터링 서비스, 비용 효율적인 설계를 제공합니다." },
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
                    <tw.BannerText className={roboto.className}>I&apos;m DongHyun-Wi.</tw.BannerText>
                </tw.BannerLabelWrap>
            </tw.BannerWrap>

            <tw.SkillWrap>
                {skillItems.map(({ src, alt }) => (
                        <tw.Skills key={alt} alt={alt} src={src} />
                ))}
            </tw.SkillWrap>

            <tw.PartsWrap>
                <tw.PartsWrapTitle className={roboto.className}>What do I strive for?</tw.PartsWrapTitle>
                <tw.PartsLine />
                <tw.PartList>
                    {partItems.map(({ src, alt, exp }) => (
                        <tw.PartWrap key={alt}>
                            <tw.PartSvg key={alt} alt={alt} src={src} />
                            <tw.PartLabel className={roboto.className}>{alt}</tw.PartLabel>
                            <tw.PartText>{exp}</tw.PartText>
                        </tw.PartWrap>
                    ))}
                </tw.PartList>
            </tw.PartsWrap>

            <tw.ProjectsWrap>
                <tw.ProjectTitle></tw.ProjectTitle>
                <tw.ProjectWrap>
                    <a href="https://www.travelo.store" target="_blank" rel="noopener noreferrer">
                        <ImageWithTransition src="../../assets/portfolio/main.png" alt="Main Image" />
                    </a>
                    <ImageWithTransition src="../../assets/portfolio/core1.png" alt="Core Image 1" />
                    <ImageWithTransition src="../../assets/portfolio/core2.png" alt="Core Image 2" />
                    <ImageWithTransition src="../../assets/portfolio/arch1.png" alt="Arch Image 1" />
                    <ImageWithTransition src="../../assets/portfolio/arch2.png" alt="Arch Image 2" />
                    <ImageWithTransition src="../../assets/portfolio/sub.png" alt="Sub Image" />
                </tw.ProjectWrap>
            </tw.ProjectsWrap>

            <tw.RearWrap></tw.RearWrap>
        </tw.Container>
    );
}
