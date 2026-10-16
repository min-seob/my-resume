"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { formatKoreanDate, type GuestbookEntry } from "@/lib/guestbook";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 50;

type AccessStatus = "loading" | "signed-out" | "checking" | "admin" | "denied" | "error" | "unavailable";

export function GuestbookAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>(supabase ? "loading" : "unavailable");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;
    function updateSession(nextSession: Session | null, hasError = false) {
      if (!active) return;
      setSession(hasError ? null : nextSession);
      setAccessStatus(hasError ? "error" : nextSession ? "checking" : "signed-out");
      if (hasError || !nextSession) {
        setEntries([]);
        setTotal(0);
        setPage(0);
      }
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      updateSession(nextSession);
    });

    void client.auth.getSession().then(({ data, error }) => {
      updateSession(data.session, Boolean(error));
    }).catch(() => {
      updateSession(null, true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const sessionUserId = session?.user.id;

  useEffect(() => {
    const client = supabase;
    if (accessStatus !== "checking" || !client || !sessionUserId) return;

    let active = true;
    void client.from("guestbook_admins")
      .select("email")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAccessStatus("error");
          return;
        }
        setAccessStatus(data ? "admin" : "denied");
      });

    return () => { active = false; };
  }, [accessStatus, sessionUserId]);

  useEffect(() => {
    const client = supabase;
    if (accessStatus !== "admin" || !client) return;

    let active = true;
    const from = page * PAGE_SIZE;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setEntriesLoading(true);
      setEntriesError("");

      try {
        const { data, count, error } = await client.from("guestbook_entries")
          .select("id, display_name, message, created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(from, from + PAGE_SIZE - 1);

        if (!active) return;
        if (error) {
          setEntriesError("방명록을 불러오지 못했어요. 새로고침해 주세요.");
          return;
        }
        setEntries((data ?? []) as GuestbookEntry[]);
        setTotal(count ?? data?.length ?? 0);
      } catch {
        if (active) setEntriesError("방명록을 불러오지 못했어요. 새로고침해 주세요.");
      } finally {
        if (active) setEntriesLoading(false);
      }
    });

    return () => { active = false; };
  }, [accessStatus, page, refreshVersion]);

  async function sendAdminLoginLink() {
    if (!supabase || loginBusy) return;

    setLoginBusy(true);
    setFeedback("");
    try {
      const response = await fetch("/api/guestbook-admin/login", { method: "POST" });
      const result = await response.json().catch(() => null) as { error?: string } | null;

      if (!response.ok) {
        setFeedback(result?.error ?? "로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setFeedback("등록된 관리자 이메일로 로그인 링크를 보냈어요. 메일 링크를 열면 이 페이지에서 관리할 수 있습니다.");
    } catch {
      setFeedback("로그인 링크를 보내지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function signOutAdmin() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setFeedback(error ? "로그아웃하지 못했어요. 다시 시도해 주세요." : "로그아웃했습니다.");
  }

  async function deleteGuestbookEntry(entryId: string) {
    if (!supabase || accessStatus !== "admin" || deletingEntryId) return;
    if (!window.confirm("이 방명록을 삭제할까요?")) return;

    setDeletingEntryId(entryId);
    const { error } = await supabase.from("guestbook_entries").delete().eq("id", entryId);
    setDeletingEntryId(null);

    if (error) {
      setFeedback("삭제하지 못했어요. 관리자 로그인 상태를 확인해 주세요.");
      return;
    }

    if (entries.length === 1 && page > 0) {
      setTotal((current) => Math.max(0, current - 1));
      setPage((current) => Math.max(0, current - 1));
    } else {
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      setTotal((current) => Math.max(0, current - 1));
    }
    setFeedback("방명록을 삭제했습니다.");
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="mini-admin-panel" aria-labelledby="mini-admin-title">
      <header className="mini-admin__header">
        <div>
          <span className="mini-community__eyebrow">GUESTBOOK ADMIN</span>
          <h1 id="mini-admin-title">방명록 관리</h1>
        </div>
        {session ? (
          <button type="button" className="mini-admin__text-button" onClick={() => void signOutAdmin()}>
            로그아웃
          </button>
        ) : null}
      </header>

      <p className="mini-admin__intro">관리자 로그인 후 방명록을 확인하고 삭제할 수 있습니다.</p>

      {accessStatus === "loading" || accessStatus === "checking" ? (
        <p className="mini-admin__status" role="status">관리자 권한을 확인하고 있어요.</p>
      ) : null}

      {accessStatus === "unavailable" ? (
        <p className="mini-admin__status" role="status">관리자 로그인을 준비 중이에요.</p>
      ) : null}

      {accessStatus === "error" ? (
        <p className="mini-admin__status" role="alert">관리자 권한을 확인하지 못했어요. 잠시 후 다시 확인해 주세요.</p>
      ) : null}

      {accessStatus === "signed-out" ? (
        <div className="mini-admin__login">
          <p>로그인 링크를 보내면 관리자 이메일에서 확인할 수 있어요.</p>
          <button type="button" onClick={() => void sendAdminLoginLink()} disabled={loginBusy || !supabase}>
            {loginBusy ? "보내는 중…" : "관리자 로그인"}
          </button>
        </div>
      ) : null}

      {accessStatus === "denied" ? (
        <p className="mini-admin__status" role="status">이 계정에는 방명록 관리 권한이 없습니다. 관리자 이메일로 다시 로그인해 주세요.</p>
      ) : null}

      {feedback ? <p className="mini-admin__feedback" role="status">{feedback}</p> : null}

      {accessStatus === "admin" ? (
        <div className="mini-admin__management">
          <div className="mini-admin__summary">
            <p>방명록 <strong>{total}</strong>개</p>
            <button
              type="button"
              className="mini-admin__text-button"
              onClick={() => setRefreshVersion((current) => current + 1)}
              disabled={entriesLoading}
            >
              {entriesLoading ? "불러오는 중…" : "새로고침"}
            </button>
          </div>

          {entriesError ? <p className="mini-admin__status" role="alert">{entriesError}</p> : null}
          {entriesLoading && entries.length === 0 ? <p className="mini-admin__status">방명록을 불러오는 중이에요.</p> : null}
          {!entriesLoading && entries.length === 0 ? <p className="mini-admin__status">등록된 방명록이 없습니다.</p> : null}

          {entries.length > 0 ? (
            <ol className="mini-admin__list" aria-label="방명록 목록">
              {entries.map((entry) => (
                <li className="mini-admin__entry" key={entry.id}>
                  <div className="mini-admin__entry-meta">
                    <strong>{entry.display_name}</strong>
                    <time dateTime={entry.created_at}>{formatKoreanDate(entry.created_at)}</time>
                  </div>
                  <p>{entry.message}</p>
                  <button
                    type="button"
                    className="mini-guestbook__delete"
                    aria-label={`${entry.display_name} 방명록 삭제`}
                    disabled={deletingEntryId === entry.id}
                    onClick={() => void deleteGuestbookEntry(entry.id)}
                  >
                    {deletingEntryId === entry.id ? "삭제 중…" : "삭제"}
                  </button>
                </li>
              ))}
            </ol>
          ) : null}

          {pageCount > 1 ? (
            <nav className="mini-admin__pagination" aria-label="방명록 페이지">
              <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0 || entriesLoading}>
                이전
              </button>
              <span>{page + 1} / {pageCount}</span>
              <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1 || entriesLoading}>
                다음
              </button>
            </nav>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
