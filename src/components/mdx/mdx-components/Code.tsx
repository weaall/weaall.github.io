import React from "react";
import CodeBlock from "../CodeBlock";
import * as tw from "./components.styles";

export default function Code(props: { className?: string; children?: React.ReactNode }) {
    return <CodeBlock {...props} styles={tw} />;
}
