/**
 * 네이버 클라우드 플랫폼 서비스 아이콘.
 *
 * 내려받은 .svg 들은 실제로는 파워포인트가 내보낸 래퍼라서, 안에 64x64 PNG 가
 * base64 로 박혀 있고 벡터 패스가 없다. 그래서 원본 모양을 보고 이 저장소의
 * 다른 아이콘과 같은 형식(색·크기 props, 24 viewBox, stroke 기반)으로 다시 그렸다.
 * 덕분에 확대해도 깨지지 않고 페이지 색상에 맞춰 재사용할 수 있다.
 */

/** Key Management Service — 방패 + 열쇠구멍 + 자물쇠 배지 */
export const NcpKmsIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10.6 2.6 4.3 5.1v5.4c0 3.8 2.5 7.2 6.3 8.4.5-.2 1-.4 1.4-.6"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M16.9 11V5.1l-6.3-2.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10.6" cy="8.7" r="1.7" stroke={color} strokeWidth="1.7" />
        <path d="M8.4 13.3c.2-1.3 1.1-2.2 2.2-2.2s2 .9 2.2 2.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="17.6" cy="17.6" r="4.6" stroke={color} strokeWidth="1.7" />
        <rect x="15.8" y="17.2" width="3.7" height="3.2" rx="0.8" stroke={color} strokeWidth="1.4" />
        <path d="M16.7 17.2v-.8a.95.95 0 0 1 1.9 0v.8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

/** Security Monitoring — 모니터 + 추이 그래프 + 방패 */
export const NcpSecurityMonitoringIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M21.4 11.6V5.5c0-.8-.6-1.4-1.4-1.4H3.6c-.8 0-1.4.6-1.4 1.4v9c0 .8.6 1.4 1.4 1.4h8.3"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="m5.6 11.4 2.5-2.6 2 2 3.1-3.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="m17.8 12.2-4.1 1.6v3.1c0 2.3 1.7 4.4 4.1 5 2.4-.6 4.1-2.7 4.1-5v-3.1l-4.1-1.6Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/** Cloud Security Watcher — 노드로 연결된 육각 경계 + 자물쇠 */
export const NcpCloudSecurityWatcherIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 3.6 19.1 7.7v8.2L12 20.1 4.9 15.9V7.7L12 3.6Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="3.6" r="1.8" fill={color} />
        <circle cx="4.9" cy="15.9" r="1.8" fill={color} />
        <circle cx="19.1" cy="15.9" r="1.8" fill={color} />
        <rect x="9.9" y="11.6" width="4.2" height="3.5" rx="0.9" stroke={color} strokeWidth="1.6" />
        <path d="M10.9 11.6v-1a1.1 1.1 0 0 1 2.2 0v1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

/**
 * WAF — 네이버 클라우드 아이콘 세트에 PNG 가 없어(EMF 뿐) 같은 선 스타일로 그렸다.
 * 벽돌 벽 + 방패로 웹 방화벽을 나타낸다.
 */
export const WafIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2.6 4.6 5.4v6c0 4.5 3.1 8.5 7.4 9.6 4.3-1.1 7.4-5.1 7.4-9.6v-6L12 2.6Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
        <path d="M4.8 9.4h14.4M5.4 13.6h13.2" stroke={color} strokeWidth="1.3" />
        <path d="M9.3 6.2v3.2M14.7 6.2v3.2M7.2 9.4v4.2M12 9.4v4.2M16.8 9.4v4.2M9.6 13.6v4.5M14.4 13.6v4.5" stroke={color} strokeWidth="1.3" />
    </svg>
);

/** SourcePipeline — 중앙 처리 노드와 연결된 단계 노드 */
export const NcpSourcePipelineIcon = ({ color = "#000", width = "100%", height = "100%" }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="1.7" />
        <path
            d="M9.9 12h4.2m-1.5-1.5L14.1 12l-1.5 1.5m-1.2-3L9.9 12l1.5 1.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="4.6" cy="4.6" r="1.9" stroke={color} strokeWidth="1.7" />
        <circle cx="19.4" cy="4.6" r="1.9" stroke={color} strokeWidth="1.7" />
        <circle cx="4.6" cy="19.4" r="1.9" stroke={color} strokeWidth="1.7" />
        <circle cx="19.4" cy="19.4" r="1.9" stroke={color} strokeWidth="1.7" />
        <path d="m6 6 2.8 2.8M18 6l-2.8 2.8M6 18l2.8-2.8M18 18l-2.8-2.8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
);
