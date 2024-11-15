"use client";

import React from "react";
import * as tw from "./MdxBanner.styles";

interface LinkHandlerProps {
    url: string;
    children: React.ReactNode;
}

export default function LinkHandler({ url, children }: LinkHandlerProps) {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.history.pushState(null, "", url);
    };

    return (
        <tw.PostWrap href={url} onClick={handleLinkClick}>
            {children}
        </tw.PostWrap>
    );
}
