"use client";

import { useEffect, useRef, useState } from "react";
import * as tw from "./page.styles";
import { roboto } from "@/util/font";
import { WebImageSlider } from "./components/ImageSlider/ImageSlider";
import { ImageWithTransition } from "./components/ImageWithTransition/ImageWithTransition";

interface PartItem {
    src: string;
    alt: string;
    exp: string;
}

interface PartItems {
    partItems: PartItem[];
}

const AnimatedText = ({ text }: { text: string }) => {
    const [letters, setLetters] = useState<string[]>([]);

    useEffect(() => {
        setLetters(text.split(""));
    }, [text]);

    return (
        <tw.BannerLabel>
            {letters.map((letter, index) => (
                <span key={index} className="inline-block animate-reveal" style={{ animationDelay: `${index * 0.15}s` }}>
                    {letter}
                </span>
            ))}
            <span
                className="relative inline-block after:content-['.'] after:text-red-500 animate-fallBounce opacity-0"
                style={{
                    animationDelay: `${letters.length * 0.15 + 0.3}s`,
                }}
            />
        </tw.BannerLabel>
    );
};

const AnimatedPart = ({ partItems }: PartItems) => {
    const [isVisible, setIsVisible] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.8 },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <tw.PartList ref={containerRef}>
            {partItems.map(({ src, alt, exp }, index) => (
                <tw.PartWrap
                    key={alt}
                    style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
                    className={` ease-in-out 
                        ${isVisible ? "animate-reveal" : "opacity-0"}`}
                >
                    <tw.PartSvg alt={alt} src={src} />
                    <tw.PartLabel className={roboto.className}>{alt}</tw.PartLabel>
                    <tw.PartText>{exp}</tw.PartText>
                </tw.PartWrap>
            ))}
        </tw.PartList>
    );
};

const images = [
    { src: "../../assets/portfolio/aboutme.png", alt: "Me", project: "weaall.github.io", type: "me" },
    { src: "../../assets/portfolio/main.png", alt: "Project Index", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/core1.png", alt: "Core Design1", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/core2.png", alt: "Core Design2", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/arch1.png", alt: "Service Arch", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/arch2.png", alt: "AWS Arch", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/sub.png", alt: "Project Index", project: "weaall.github.io", type: "sub" },
    { src: "../../assets/portfolio/moding.png", alt: "Sub Project", project: "moding", type: "sub" },
].reverse();

const mobileImages = [
    { src: "../../assets/portfolio/aboutme.png", alt: "Me", project: "weaall.github.io", type: "me" },
    { src: "../../assets/portfolio/main.png", alt: "Project Index", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/core1.png", alt: "Core Design1", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/core2.png", alt: "Core Design2", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/arch1.png", alt: "Service Arch", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/arch2.png", alt: "AWS Arch", project: "travelo.store", type: "main" },
    { src: "../../assets/portfolio/sub.png", alt: "Project Index", project: "weaall.github.io", type: "sub" },
    { src: "../../assets/portfolio/moding.png", alt: "Sub Project", project: "moding", type: "sub" },
]

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
                        <tw.ProfilePic
                            style={{
                                animationDelay: "1.5s",
                            }}
                            alt=""
                            src={"../../assets/portfolio/me.png"}
                        />
                    </tw.ProfileBg>
                </tw.ProfileWrap>
                <tw.BannerLabelWrap>
                    <tw.BannerLabelBox>
                        <AnimatedText text="Hello" />
                    </tw.BannerLabelBox>
                    <tw.BannerUnderline />
                    <tw.BannerText
                        className={roboto.className}
                        style={{
                            animationDelay: "1s",
                        }}
                    >
                        I&apos;m DongHyun-Wi.
                    </tw.BannerText>
                </tw.BannerLabelWrap>
            </tw.BannerWrap>

            <tw.SkillWrap>
                {skillItems.map(({ src, alt }, index) => (
                    <tw.BorderRotateWrap
                        key={alt}
                        style={{
                            animationDelay: `${index * 0.2 + 1.8}s`,
                        }}
                    >
                        <tw.Skills alt={alt} src={src} />
                        <tw.BorderRotate />
                    </tw.BorderRotateWrap>
                ))}
            </tw.SkillWrap>

            <tw.PartsWrap>
                <tw.PartsWrapTitle className={roboto.className}>What do I strive for?</tw.PartsWrapTitle>
                <tw.PartsLine />
                <AnimatedPart partItems={partItems} />
            </tw.PartsWrap>

            <tw.ProjectsWrap className={roboto.className}>
                <tw.ProjectWrap>
                    {mobileImages.map((img, index) => (
                        <ImageWithTransition key={index} src={img.src} alt={img.alt} project={img.project} type={img.type} />
                    ))}
                </tw.ProjectWrap>
            </tw.ProjectsWrap>

            <tw.IamgeSliderWrap className={roboto.className}>
                <WebImageSlider images={images} />
            </tw.IamgeSliderWrap>
        </tw.Container>
    );
}
