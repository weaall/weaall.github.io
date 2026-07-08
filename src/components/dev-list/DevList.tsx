"use client"

import { useState } from "react"
import * as tw from "./DevList.styles"
import { PostData } from "@/interface/PostData"

interface PostsProps {
    posts: PostData[]
}

export default function DevList({ posts }: PostsProps) {
    return (
        <tw.Container>
            <tw.DrawerContainer>
            <tw.IntroWrap href={"./intro"}>시작하기</tw.IntroWrap>
                {posts.map(
                    (item) =>
                        !item.label.startsWith("intro") && (
                            <tw.DrawerWrap href={item.postUrl} key={item.slug}>
                                <tw.DrawerLabel>{item.title}</tw.DrawerLabel>
                            </tw.DrawerWrap>
                        ),
                )}
            </tw.DrawerContainer>
        </tw.Container>
    )
}
