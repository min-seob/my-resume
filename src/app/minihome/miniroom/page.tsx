import type { Metadata } from "next";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { MinihomeMiniroomPage } from "@/components/home/MinihomeMiniroomPage";

import "../minihome.css";
import "../collection.css";

export const metadata: Metadata = {
  title: "미니룸 | 김민섭의 미니홈",
  description: "김민섭의 미니홈에 있는 세 방과 방마다 놓인 오브젝트를 살펴보세요.",
};

export default function MiniroomPage() {
  return (
    <div className="minihome">
      <MinihomeHeader activeMiniPage="miniroom" />
      <MinihomeMiniroomPage />
      <MinihomeFooter />
    </div>
  );
}
