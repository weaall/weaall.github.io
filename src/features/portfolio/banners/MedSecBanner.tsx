import { GUIDELINE } from "../sections/medsec/content";

/**
 * 의료기기 사이버보안 페이지 히어로.
 * 제품 배너와 달리 로고 대신 식약처 마크를 오른쪽에 둔다.
 */
export function MedSecBanner() {
    return (
        <header className="flex w-full m:flex-col-reverse">
            <div className="flex w-1/2 flex-col gap-6 m:w-full m:items-center m:gap-4">
                <h1 className="break-keep text-[4rem] font-semibold leading-[1.05] tracking-tighter text-gray-900 m:text-center m:text-[2.5rem]">
                    의료기기 인프라
                    <br />및 사이버보안 설계
                </h1>
                <p className="break-keep text-[1.3rem] font-medium leading-none tracking-[-0.07em] text-[#191918] m:text-center m:text-[1rem] m:leading-normal">
                    의료기기 <span className="text-[#416bac]">사이버보안 시험성적서</span>를 위한
                    <br />
                    <span className="tracking-[-0.18em]">인프라 설계·구축 · 시스템 아키텍처 · 인증·암호화·감사로그·백업/복구 구현 </span>
                </p>
                <p className="w-fit text-[11px] font-normal tracking-tight text-gray-400 m:mx-auto m:text-center">{GUIDELINE.version}</p>
            </div>
            <div className="flex w-1/2 flex-col items-center justify-start m:w-full m:pb-8">
                <div className="mx-auto my-auto flex w-full items-center justify-center gap-4">
                    <img className="h-32 w-auto max-w-full object-contain m:h-20" src="/assets/portfolio/medsec/mfds-logo.svg" alt="식품의약품안전처" />
                </div>
                <div className="h-px w-full bg-[#416bac] m:hidden" />
            </div>
        </header>
    );
}
