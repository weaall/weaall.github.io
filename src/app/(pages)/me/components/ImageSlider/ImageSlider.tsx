"use client";

import { useRef, useState } from "react";

import * as tw from "./ImageSlider.styles";

interface ImageData {
    src: string;
    alt: string;
    project: string;
    type: string;
}

interface ImageSliderProps {
    images: ImageData[];
}

export const WebImageSlider = ({ images }: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(images.length - 1);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startY, setStartY] = useState<number>(0);
    const [endY, setEndY] = useState<number>(0);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [isLocked, setIsLocked] = useState<boolean>(false);

    const nextSlide = (): void => {
        if (isLocked) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = (): void => {
        if (isLocked) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setIsDragging(true);
        setStartY(e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!isDragging) return;
        setEndY(e.clientY);
    };

    const handleMouseUp = (): void => {
        if (isDragging) {
            if (startY > endY + 50) {
                nextSlide();
            } else if (startY < endY - 50) {
                prevSlide();
            }
            setIsDragging(false);

            setIsLocked(true);
            setTimeout(() => setIsLocked(false), 1000);
        }
    };
    return (
        <tw.ContainerWrap>
            <tw.Container>
                <tw.OuterWrap
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    <tw.InnderWrap>
                        <tw.SliderWrap
                            style={{
                                transform: `translateY(calc(${
                                    (currentIndex === 0 ? images.length - 1 : currentIndex === 1 ? images.length - 1 : images.length - currentIndex + 1) * 70
                                }px - 50%))`,
                            }}
                        >
                            {images.map((image, index) => {
                                const isActive = index === currentIndex;
                                const indexDiff = Math.abs(currentIndex - index);
                                const shouldKeepScale = currentIndex - index < 0;
                                const scale = shouldKeepScale ? 1.1 : isActive ? 1 : 1 - indexDiff * 0.1;
                                const maxHeight = indexDiff > 3 ? "0px" : isActive ? "495.25px" : "70px";
                                const translate = 70 * (1 - scale) * indexDiff;
                                const isInvisible = indexDiff > 3 || currentIndex < index;

                                return (
                                    <tw.ImagesWrap
                                        key={index}
                                        style={{
                                            transform: `scale(${scale}) translateY(${translate}px)`,
                                            maxHeight,
                                            transformOrigin: "top",
                                            borderBottomLeftRadius: isActive ? "10px" : "0px",
                                            borderBottomRightRadius: isActive ? "10px" : "0px",
                                            visibility: isInvisible ? "hidden" : "visible",
                                        }}
                                    >
                                        <tw.ImageWrap>
                                            <tw.ProjectImgHeader>
                                                <tw.ProjectImgLeftText>
                                                    <a href="https://www.travelo.store" target="_blank" rel="noopener noreferrer">
                                                        {image.project}
                                                    </a>
                                                    {image.project}
                                                </tw.ProjectImgLeftText>
                                                <tw.ProjectImgLabel>{image.alt}</tw.ProjectImgLabel>
                                                <tw.ProjectImgRightText>{image.type}</tw.ProjectImgRightText>
                                            </tw.ProjectImgHeader>
                                            <tw.Img src={image.src} alt={image.alt} draggable="false" onDragStart={(e) => e.preventDefault()} loading="lazy" />
                                        </tw.ImageWrap>
                                    </tw.ImagesWrap>
                                );
                            })}
                        </tw.SliderWrap>
                    </tw.InnderWrap>
                </tw.OuterWrap>
            </tw.Container>
            <tw.BtnWrap>
                <tw.Btn onClick={nextSlide}></tw.Btn>
                <tw.StateBarWrap>
                    {[...images].reverse().map((_, index) => (
                        <div key={index} className="w-[1px] h-[5px] bg-gray-400" />
                    ))}

                    <div
                        className="absolute top-[5px] h-[10px] w-[2px] bg-gray-500 transition-transform duration-300"
                        style={{ transform: `translateX(${(images.length - 1 - currentIndex) * 11}px)` }}
                    />
                </tw.StateBarWrap>
                <tw.Btn onClick={prevSlide}></tw.Btn>
            </tw.BtnWrap>
        </tw.ContainerWrap>
    );
};