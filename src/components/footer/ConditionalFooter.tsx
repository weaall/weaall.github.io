"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// 새 페이지 추가(에디터) 화면에서는 푸터를 숨긴다.
const HIDE_ON = ["/newpage"];

export default function ConditionalFooter() {
    const pathname = usePathname();
    if (HIDE_ON.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) return null;
    return <Footer />;
}
