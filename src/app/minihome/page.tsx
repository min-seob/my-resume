import type { Metadata } from "next";

import { Minihome } from "@/components/home/Minihome";

import "./minihome.css";
import "./miniroom.css";

export const metadata: Metadata = {
  title: "김민섭의 미니홈",
  description: "김민섭의 미니홈. 작업과 생각을 천천히 모으는 공간입니다.",
};

export default function MinihomePage() {
  return <Minihome />;
}
