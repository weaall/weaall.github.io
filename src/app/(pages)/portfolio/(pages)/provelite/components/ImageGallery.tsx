import React, { useState } from 'react';

interface ImageGalleryProps {
    isToggled: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ isToggled }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="w-full h-1/2 py-10">
            <div className="flex justify-between items-start gap-4">
                {Array.from({ length: 5 }).map((_, index) => {
                    const isHovered = hoveredIndex === index;
                    const baseImage = isToggled ? 'new' : 'old';
                    const hoverImage = isToggled ? 'old' : 'new';
                    const imageName = isHovered ? hoverImage : baseImage;

                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative w-1/5 cursor-grab"
                        >
                            <img
                                className="object-contain w-full rounded-xl bg-white"
                                src={`/assets/portfolio/prove-lite/user_layout_${imageName}_${index + 1}.png`}
                                alt={`User Layout ${imageName} ${index + 1}`}
                            />
                            {imageName === 'old' && (
                                <div className="absolute bottom-3 right-3 bg-white text-gray-600 text-xs font-bold px-2.5 py-1 rounded-xl shadow-md border border-gray-100">
                                    개선 전
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;