import MindsNaviBanner from "@/components/top-banner/portfolio/MindsNaviBanner";
import { Metadata } from "next";
import { getBaseMetadata } from "@/util/seo";
import MindsNaviDevList from "./components/MindsNaviDevList";

export const metadata: Metadata = getBaseMetadata({ title: "Minds. NAVI | WeHub" });

export default function MindsnaviPage() {
  return (
    <div>
      <div className="max-w-[1080px] mx-auto pt-40 flex flex-col gap-12">
        <MindsNaviBanner />
      </div>
      <div className="w-full">
        <div className="max-w-[1080px] mx-auto pt-12 pb-20">
          <MindsNaviDevList />
        </div>
      </div>
    </div>
  );
}
