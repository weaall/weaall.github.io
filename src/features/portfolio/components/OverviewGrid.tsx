import { ReactNode } from "react";

/**
 * 프로젝트 오버뷰 카드 격자. 한 줄에 세 장.
 *
 * 카드 수가 3의 배수가 아니면 마지막 줄이 왼쪽에 몰려 빈칸이 생긴다.
 * CSS grid 대신 flex-wrap 으로 놓고 가운데 정렬해서, 남는 카드가 가운데에 서게 한다.
 * 카드 폭은 (전체 - 간격 2개) / 3 으로 grid 와 같게 맞춘다. 모바일은 한 장씩.
 */
export function OverviewGrid({ children }: { children: ReactNode }) {
    return <div className="flex w-full flex-wrap justify-center gap-6 pt-2 [&>*]:w-[calc((100%-3rem)/3)] m:[&>*]:w-full">{children}</div>;
}
