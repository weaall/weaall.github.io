/**
 * 의료기기 사이버보안 포트폴리오의 글 내용.
 * 화면 조립(MedSecSections)과 분리해 두어, 문구만 고칠 때 마크업을 건드리지 않게 한다.
 */

/** 담당 영역 카드 */
export const DUTIES = [
    {
        t: "시험성적서 · 규제 대응",
        d: "KS X IEC 62443-4-2 시험성적서 작성, 식약처 가이드라인 준거, ISO 14971 위험관리",
    },
    {
        t: "클라우드 인프라",
        d: "CSAP 인증 네이버 클라우드 기반, Kubernetes(NKS)로 무중단·자동 복구",
    },
    {
        t: "배포 · 무결성",
        d: "GitOps(ArgoCD)로 배포를 코드화하고 이미지 다이제스트를 고정해 추적성 확보",
    },
    {
        t: "보안 방어",
        d: "WAF·IDS(ModSecurity·Falco)로 공격 탐지·차단, 취약점·공급망(Trivy·SBOM) 관리",
    },
    {
        t: "암호화 · 인증 · 감사로그",
        d: "TLS·AES·SHA 암호화와 접근 통제, 전 과정 감사로그로 기밀성·부인방지",
    },
    {
        t: "데이터 · 관측",
        d: "백업·복구(PITR), Kafka 로그 파이프라인, Grafana·Loki 모니터링",
    },
] as const;

/** 관련 프로젝트 카드. color 는 제품 브랜드 색. */
export const CASES = [
    {
        href: "/post/varabom-ce-security",
        tag: "VR 인지기능 훈련 · 로컬 설치형 SaMD",
        title: "바라봄 CE",
        desc: "폐쇄망 PC 설치형 SaMD. 인증·감사로그·암호화·업데이트 절차를 설계 단계부터 직접 구현하고 시험성적서로 검증.",
        applied: "35개 중 29개 적용",
        status: "임상시험 허가",
        done: true,
        mark: "/assets/posts/varabom/icon.ico",
        logo: "/assets/portfolio/medsec/varabom-logo.png",
        logoW: "60%",
        color: "#7ba62b", // VARABOM 라임(포인트)
        titleColor: "#26303a", // VARABOM 워드마크 블랙
    },
    {
        href: "/post/chiyu-forest-security",
        tag: "폐쇄망 설치형 SaMD",
        title: "치유포레스트",
        desc: "폐쇄망 범용 PC 설치형 SaMD. 인증·무결성·암호화·백업·복구를 자체 구현하고 시험성적서로 검증.",
        applied: "35개 중 27개 적용",
        status: "의료기기 중대한 변경 허가",
        done: true,
        mark: "/assets/posts/chiyu/icon.ico",
        logo: "/assets/portfolio/medsec/cheeu-logo.png",
        logoW: "66%",
        color: "#2f7d46", // CHEEU. Forest 그린
        titleColor: "#2f7d46",
    },
    {
        href: "/post/mnai-security-test",
        tag: "클라우드 SaMD",
        title: "마인즈내비 AI",
        desc: "CSAP 네이버 클라우드 위 인프라·GitOps·관측성이 그대로 보안 요구사항의 근거가 되는 클라우드형 SaMD.",
        applied: "35개 중 32개 적용",
        status: "GMP 임상시험, 인허가 진행중",
        done: false,
        mark: "/assets/portfolio/medsec/mnai-mark.png",
        logo: "/assets/portfolio/medsec/mindsnavi-logo.png",
        logoW: "74%",
        color: "#1d6f8f", // Minds. NAVI 딥틸
        titleColor: "#1d6f8f",
    },
];

/** 식약처 가이드라인 인용 */
export const GUIDELINE = {
    quote:
        "의료기기의 해킹, 정보 유출 등 사이버보안 위협사례가 꾸준히 보고되고 있고, 이러한 위협사례는 재산적 손실뿐만 아니라 환자 생명에 직접적인 위해를 줄 수 있어 의료기기의 사이버보안에 대한 중요성이 부각되고 있다.",
    source: "식품의약품안전처 「의료기기의 사이버보안 허가·심사 가이드라인」 · 민원인 안내서 2025.1",
    version: "식품의약품안전처 「의료기기의 사이버보안 허가·심사 가이드라인」 · 2025.1 개정(안내서-0995-05)",
} as const;
