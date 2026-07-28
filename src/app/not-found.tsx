export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 text-center">
            <p className="text-[64px] font-extrabold leading-none tracking-tight text-(--text)">404</p>
            <h1 className="mt-4 text-xl font-semibold text-(--text)">페이지를 찾을 수 없어요</h1>
            <p className="mt-2 max-w-md text-(--text-muted)">주소가 변경되었거나 삭제된 페이지일 수 있어요.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <a href="/" className="rounded-lg bg-(--text) px-4 py-2 text-sm font-medium text-(--page-bg) transition-opacity hover:opacity-90">
                    홈으로
                </a>
                <a href="/post" className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:bg-(--hover-bg)">
                    게시물
                </a>
                <a href="/search" className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:bg-(--hover-bg)">
                    검색
                </a>
            </div>
        </div>
    );
}
