"use client";

import { useEffect, useRef, useState } from "react";
import * as tw from "./page.styles";
import { roboto } from "@/util/font";

interface ImageProps {
    src: string;
    alt: string;
    project: string;
    type: string;
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

const ImageWithTransition = ({ src, alt, project, type }: ImageProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);

    return (
        <>
            <tw.ProjectImgWrap onClick={() => setIsModalOpen(true)}>
                <tw.ProjectImgOuterWrap>
                    <tw.ProjectImgHeader>
                        <tw.ProjectImgLeftText>{project}</tw.ProjectImgLeftText>
                        <tw.ProjectImgLabel>{alt}</tw.ProjectImgLabel>
                        <tw.ProjectImgRightText>{type}</tw.ProjectImgRightText>
                    </tw.ProjectImgHeader>
                    <tw.ProjectImg src={src} alt={alt} loading="lazy" />
                </tw.ProjectImgOuterWrap>
            </tw.ProjectImgWrap>

            {isModalOpen && (
                <tw.ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <tw.ModalContent>
                        <img src={src} alt={alt} className="w-full h-auto scale-150 mobile:rotate-90 mobile:scale-[1.7]" />
                    </tw.ModalContent>
                </tw.ModalOverlay>
            )}
        </>
    );
};

const images = [
    { src: "../../assets/portfolio/main.png", alt: "Image 1" },
    { src: "../../assets/portfolio/core1.png", alt: "Image 2" },
    { src: "../../assets/portfolio/core2.png", alt: "Image 3" },
    { src: "../../assets/portfolio/arch1.png", alt: "Image 4" },
    { src: "../../assets/portfolio/arch2.png", alt: "Image 5" },
    { src: "../../assets/portfolio/sub.png", alt: "Image 6" },
  ];
  
  const ImageSlider = () => {
      const [currentIndex, setCurrentIndex] = useState(1);

      const nextSlide = () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      };

      const prevSlide = () => {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      };

      return (
          <div className="flex justify-center items-center w-full h-screen bg-gray-100">
              <div className="relative w-full max-w-4xl h-full bg-white shadow-xl rounded-xl overflow-hidden">
                  <div className="absolute w-full h-full flex justify-center items-center top-20">
                      <div
                          className="flex flex-col transition-transform duration-500 ease-in-out"
                          style={{
                              transform: `translateY(-${currentIndex * 100}%)`,
                              height: `${images.length * 16.66666}%`,
                          }}
                      >
                          {images.map((image, index) => {
                              const scale = index === currentIndex ? 1 : 0.4; // 가운데 이미지 크게, 나머지 작게

                              return (
                                  <div
                                      key={index}
                                      className="relative w-auto flex-shrink-0 h-full rounded-xl overflow-hidden transition-transform duration-500 ease-in-out"
                                      style={{
                                          transform: `scale(${scale})`,
                                      }}
                                  >
                                      <img src={image.src} alt={image.alt} className="w-auto h-auto object-cover" />
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
                      <button onClick={prevSlide} className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600">
                          &lt;
                      </button>
                      <button onClick={nextSlide} className="text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600">
                          &gt;
                      </button>
                  </div>
              </div>
          </div>
      );
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

            <tw.ProjectsWrap className={roboto.className}>
                <tw.ProjectWrap>
                    {/* <a href="https://www.travelo.store" target="_blank" rel="noopener noreferrer">
                        travelo.store
                    </a> */}
                    <ImageWithTransition src="../../assets/portfolio/main.png" alt="Project Index" project="travelo.store" type="main" />
                    <ImageWithTransition src="../../assets/portfolio/core1.png" alt="Core Design1" project="travelo.store" type="main" />
                    <ImageWithTransition src="../../assets/portfolio/core2.png" alt="Core Design2" project="travelo.store" type="main" />
                    <ImageWithTransition src="../../assets/portfolio/arch1.png" alt="Service Arch" project="travelo.store" type="main" />
                    <ImageWithTransition src="../../assets/portfolio/arch2.png" alt="AWS Arch" project="travelo.store" type="main" />
                    <ImageWithTransition src="../../assets/portfolio/sub.png" alt="Project Index" project="weaall.github.io" type="sub" />
                </tw.ProjectWrap>
            </tw.ProjectsWrap>

            {/* <ImageSlider /> */}

        </tw.Container>
    );
}
