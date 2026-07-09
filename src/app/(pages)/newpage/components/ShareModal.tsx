import { useEffect, useState } from "react";

// 노션풍 공유 모달: 링크 복사 + MDX 내보내기.
interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    onExport: () => void;
    postUrl: string;
}

export default function ShareModal({ open, onClose, onExport, postUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) {
            setCopied(false);
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* 클립보드 권한 없음 등 */
        }
    };

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/30 pt-[15vh]"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="w-[440px] max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-(--border) bg-(--menu-bg) shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-(--border) px-5 pb-3 pt-4">
                    <div className="text-sm font-semibold text-(--text)">공유</div>
                </div>
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={postUrl}
                            onFocus={(e) => e.currentTarget.select()}
                            className="min-w-0 flex-1 rounded-md border border-(--border) bg-transparent px-3 py-2 text-sm text-(--text-muted)"
                        />
                        <button
                            onClick={copyLink}
                            className="whitespace-nowrap rounded-md bg-[#3772ff] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            {copied ? "복사됨" : "링크 복사"}
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            onExport();
                            onClose();
                        }}
                        className="rounded-md border border-(--border) px-3 py-2 text-sm font-medium text-(--text) hover:bg-(--hover-bg)"
                    >
                        MDX 내보내기
                    </button>
                </div>
            </div>
        </div>
    );
}
