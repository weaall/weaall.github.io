import React from "react"
import * as tw from "./components.styles"

export function H1({ children }: { children?: React.ReactNode }) {
    return <tw.H1>{children}</tw.H1>
}

export function H2({ children }: { children?: React.ReactNode }) {
    return <tw.H2>{children}</tw.H2>
}

export function H3({ children }: { children?: React.ReactNode }) {
    return <tw.H3>{children}</tw.H3>
}

export function CheckBoxT({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={true} />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    )
}

export function CheckBoxF({ children }: { children?: React.ReactNode }) {
    return (
        <tw.CheckBoxWrap>
            <tw.H4 type="checkbox" defaultChecked={false} />
            <tw.CheckBoxLabel>{children}</tw.CheckBoxLabel>
        </tw.CheckBoxWrap>
    )
}

export function P({ children }: { children?: React.ReactNode }) {
    console.log(children)
    return <tw.P>{children}</tw.P>
}

export function Hr({ children }: { children?: React.ReactNode }) {
    return <tw.Hr>{children}</tw.Hr>
}

export function Code({ children }: { children?: React.ReactNode }) {
    return <tw.Code>{children}</tw.Code>
}

export function Pre({ children }: { children?: React.ReactNode }) {
    return <tw.Pre>{children}</tw.Pre>
}

export function Strong({ children }: { children?: React.ReactNode }) {
    return <tw.Strong>{children}</tw.Strong>
}
