import React, { useState, useLayoutEffect } from "react";

import hljs from "highlight.js";

import * as tw from "./WuiComponents.styles";

export default function Code({ className, children }: { className?: string; children?: React.ReactNode }) {
    const language = className ? className.replace("language-", "") : "";
    const [highlightedCode, setHighlightedCode] = useState(children?.toString() || "");

    useLayoutEffect(() => {
        if (language && hljs.getLanguage(language)) {
            setHighlightedCode(hljs.highlight(children?.toString() || "", { language }).value);
        } else {
            setHighlightedCode(children?.toString() || "");
        }
    }, [children, language]);

    return (
        <>
        <tw.CodeMidWrap></tw.CodeMidWrap>
        <tw.CodeWrapC className="hljs">
            <tw.Code dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
        </tw.CodeWrapC>
        </>
    );
}
