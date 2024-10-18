import React from "react"
import hljs from "highlight.js";
import * as tw from "./components.styles"
import "highlight.js/styles/atom-one-dark.css";

export function H1({ children }: { children?: React.ReactNode }) {
    return <tw.H1>{children}</tw.H1>
}

export function H2({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <tw.H2>
                <a href={`#${children || ""}`}>{children}</a>
            </tw.H2>
        </>
    )
}

export function H3({ children }: { children?: React.ReactNode }) {
    return <tw.H3>{children}</tw.H3>
}

export function CheckBoxT({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={true} disabled />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    )
}

export function CheckBoxF({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={false} disabled />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    )
}

export function P({ children }: { children?: React.ReactNode }) {
    return <tw.P>{children}</tw.P>
}

export function A({ href, children }: { href?: string, children?: React.ReactNode }) {
    return <tw.A target="_blank" href={href}>{children}</tw.A>
}

export function Li({ children }: { children?: React.ReactNode }) {
    return <tw.Li>{children}</tw.Li>
}

export function Hr({ children }: { children?: React.ReactNode }) {
    return <tw.Hr>{children}</tw.Hr>
}

export function Code({ className, children }: { className?: string; children?: React.ReactNode }) {
    const language = className ? className.replace("language-", "") : ""; // className에서 언어 추출

    let highlightedCode: string;
    if (typeof window === "undefined") {
        if (language && hljs.getLanguage(language)) {
            highlightedCode = hljs.highlight(children?.toString() || "", { language }).value;
        } else {
            highlightedCode = hljs.highlightAuto(children?.toString() || "").value; 
        }
    } else {
        highlightedCode = children?.toString() || ""; 
    }

    return (
        <>
            {className === undefined ? (
                <tw.CodeWrap>
                    <tw.Code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                </tw.CodeWrap>
            ) : (
                <tw.CodeWrapC>
                    <tw.ClassWrap>
                        <tw.ClassLabel>{language}</tw.ClassLabel>
                    </tw.ClassWrap>
                    <tw.CodeBoxC>
                        <tw.Code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </tw.CodeBoxC>
                </tw.CodeWrapC>
            )}
        </>
    );
}

export function Pre({ className, children }: { className?: string; children?: React.ReactNode }) {
    return <tw.Pre>{children}</tw.Pre>
}

export function Strong({ children }: { children?: React.ReactNode }) {
    return <tw.Strong>{children}</tw.Strong>
}

export function Em({ children }: { children?: React.ReactNode }) {
    return <tw.Em>{children}</tw.Em>
}

export function Img({ title, src, children }: { title?:string; src?:string; children?: React.ReactNode }) {
    return (
        <tw.ImgWrap>
            <tw.Img src={src}>{children}</tw.Img>
            <tw.ImgTitle>{title}</tw.ImgTitle>
        </tw.ImgWrap>
    )
}
