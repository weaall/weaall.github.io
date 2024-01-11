import React from "react"

export function P({ children }: { children?: React.ReactNode }) {
  return <p className="mdx-p">{children}</p>
}

export function H2({ children }: { children?: React.ReactNode }) {
    return <h2 className="bg-red-500">{children}</h2>
}

export function H1({ children }: { children?: React.ReactNode }) {
    return <h1 className="bg-red-500">{children}</h1>
  }