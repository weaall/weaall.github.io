// 포스트 관련 공유 타입. 예전엔 이 shape이 ~13개 파일에 중복 정의돼 있었다.

// MDX 파일 프론트매터(파일에 기록된 메타데이터)
export interface PostFrontmatter {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: string[];
    mins: string;
    imageUrl: string;
    icon?: string; // 페이지 아이콘(이모지 또는 webp data URL)
}

// 목록/라우팅용: 프론트매터 + 파일에서 파생되는 slug/postUrl
export interface PostData {
    label: string;
    title: string;
    subTitle: string;
    date: string;
    tags: string[];
    slug: string;
    postUrl: string;
    imageUrl: string;
    icon?: string;
    body?: string; // 검색용 본문 플레인 텍스트(검색 인덱스에서만 채움)
}
