import React, { useEffect, useState, useLayoutEffect } from "react";
import * as tw from "./components.styles";
import hljs from "highlight.js";  

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
        <tw.CodeWrapC className="hljs">
            {language && (
                <tw.ClassWrap>
                    <tw.ClassLabel>{language}</tw.ClassLabel>
                </tw.ClassWrap>
            )}
            <tw.CodeBoxC>
                <tw.Code dangerouslySetInnerHTML={{ __html: highlightedCode || "" }} />
            </tw.CodeBoxC>
        </tw.CodeWrapC>
    );
}
