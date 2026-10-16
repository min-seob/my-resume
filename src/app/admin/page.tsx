import type { Metadata } from "next";

import { MinihomeFooter } from "@/components/home/MinihomeFooter";
import { MinihomeHeader } from "@/components/home/MinihomeHeader";
import { GuestbookAdmin } from "@/components/home/GuestbookAdmin";

import "../minihome/minihome.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "방명록 관리 | 김민섭의 미니홈",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="minihome">
      <MinihomeHeader />
      <main className="mini-admin-page">
        <div className="mini-admin-shell">
          <GuestbookAdmin />
        </div>
      </main>
      <MinihomeFooter />
    </div>
  );
}
