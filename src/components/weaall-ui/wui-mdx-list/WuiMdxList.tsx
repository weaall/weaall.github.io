"use client";

import { roboto } from "@/util/font";
import * as tw from "./WuiMdxList.styles";
import { useWuiMdxListStore } from "./wuiMdxListStore";

interface PostsProps {
    props: PostData[];
}

interface PostData {
    label: string;
    title: string;
    index: number;
    slug: string;
    postUrl: string;
}

export default function WuiMdxList({ props }: PostsProps) {
    const { openLabels, toggleLabel } = useWuiMdxListStore();

    const groupedPosts = props.reduce((acc, post) => {
        if (!acc[post.label]) acc[post.label] = [];
        acc[post.label].push(post);
        return acc;
    }, {} as Record<string, PostData[]>);

    return (
        <tw.Container className={roboto.className}>
            <tw.DrawerContainer style={{ height: "calc(100% - 65px)" }}>
                {Object.entries(groupedPosts).map(([label, items]) => (
                    <div key={label}>
                        <tw.DrawerBtn onClick={() => toggleLabel(label)}>{label}</tw.DrawerBtn>

                        {openLabels[label] &&
                            items.map((item) => (
                                <tw.DrawerWrap href={item.postUrl} key={item.slug} className="pl-8">
                                    <tw.DrawerLabel>{item.title}</tw.DrawerLabel>
                                </tw.DrawerWrap>
                            ))}
                    </div>
                ))}
            </tw.DrawerContainer>
        </tw.Container>
    );
}
