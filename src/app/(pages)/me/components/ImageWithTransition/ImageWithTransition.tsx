"use client";

import { useEffect, useRef, useState } from "react";
import * as tw from "./ImageWithTransition.styles"

interface ImageProps {
    src: string;
    alt: string;
    project: string;
    type: string;
}

export const ImageWithTransition = ({ src, alt, project, type }: ImageProps) => {
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