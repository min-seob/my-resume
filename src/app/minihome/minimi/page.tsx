import type { Metadata } from "next";

import { MinihomeMinimiPage } from "@/components/home/MinihomeMinimiPage";

import "../minihome.css";
import "../collection.css";

export const metadata: Metadata = {
  title: "미니미 | 김민섭의 미니홈",
  description: "김민섭의 미니홈에서 현재 선택된 미니미를 살펴보세요.",
};

export default function MinimiPage() {
  return <MinihomeMinimiPage />;
}
