"use client";

import React from "react";
import dynamic from "next/dynamic"; 
import * as tw from "./devComponents.styles"

export const Code = dynamic(() => import("./Code"), { ssr: false });

export function H1({ children }: { children?: React.ReactNode }) {
    return <tw.H1>{children}</tw.H1>
}

export function H2({ children }: { children?: React.ReactNode }) {
    return <tw.H2>{children}</tw.H2>;
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

export function A({ href, target = "_self", children }: { href?: string, target?: string, children?: React.ReactNode }) {
    return (
        <tw.A href={href} target={target}>
            {children}
        </tw.A>
    );
}

export function Li({ children }: { children?: React.ReactNode }) {
    return <tw.Li>{children}</tw.Li>
}

export function Hr({ children }: { children?: React.ReactNode }) {
    return <tw.Hr>{children}</tw.Hr>
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

export function Table({ children }: { children?: React.ReactNode }) {
    return <tw.Table>{children}</tw.Table>
}

export function Thead({ children }: { children?: React.ReactNode }) {
    return <tw.Thead>{children}</tw.Thead>
}

export function Tbody({ children }: { children?: React.ReactNode }) {
    return <tw.Tbody>{children}</tw.Tbody>
}

export function Tr({ children }: { children?: React.ReactNode }) {
    return <tw.Tr>{children}</tw.Tr>
}

export function Th({ children }: { children?: React.ReactNode }) {
    return <tw.Th>{children}</tw.Th>
}

export function Td({ children }: { children?: React.ReactNode }) {
    return <tw.Td>{children}</tw.Td>
}
