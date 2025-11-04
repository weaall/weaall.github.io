import ProveLiteBanner from "@/components/top-banner/portfolio/ProveLiteBanner";
import ProveLiteDevList from "./components/ProveLiteDevList";

export default function ProveLitePage() {
  return (
    <div>
                <div className="max-w-[1080px] mx-auto pt-40 flex flex-col gap-12">
                    <ProveLiteBanner />
                </div>
                <div className="w-full">
                    <div className="max-w-[1080px] mx-auto pt-12 pb-20">
                    <ProveLiteDevList />
                    </div>
                </div>
            </div>
  );
}