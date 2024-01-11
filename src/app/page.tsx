import Header from "@/components/header/Header"
import MdxReader from "@/components/mdx/Front-matter"
import Link from "next/link"

export default function Home() {
    return (
        <>
            <Header />
            <MdxReader />
            <Link href="/shallow/test">Go to Post</Link>
        </>
    )
}
