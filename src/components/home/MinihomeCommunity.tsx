"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  published_at: string;
};

type GuestbookEntry = {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(value));
}

export function MinihomeCommunity() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [loadError, setLoadError] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });
    void client.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const sessionUserId = session?.user.id;
  const isAdmin = Boolean(sessionUserId && adminUserId === sessionUserId);

  useEffect(() => {
    const client = supabase;
    if (!client || !sessionUserId) return;

    let active = true;
    void client.from("guestbook_admins")
      .select("email")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        const authorized = !error && Boolean(data);
        setAdminUserId(authorized ? sessionUserId : null);
        if (authorized) {
          setAdminLoginOpen(false);
          setAdminMessage("관리자로 로그인했습니다.");
        } else {
          setAdminMessage("이 이메일에는 삭제 권한이 없습니다.");
        }
      });

    return () => { active = false; };
  }, [sessionUserId]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    let active = true;
    async function loadCommunity() {
      const [blogResult, guestbookResult] = await Promise.all([
        client.from("dev_blog_posts")
          .select("id, slug, title, summary, content, category, tags, published_at")
          .eq("status", "published")
          .not("published_at", "is", null)
          .lte("published_at", new Date().toISOString())
          .order("published_at", { ascending: false })
          .limit(6),
        client.from("guestbook_entries")
          .select("id, display_name, message, created_at")
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      if (!active) return;
      if (!blogResult.error) setPosts((blogResult.data ?? []) as BlogPost[]);
      if (!guestbookResult.error) setEntries((guestbookResult.data ?? []) as GuestbookEntry[]);
      setLoadError(Boolean(blogResult.error || guestbookResult.error));
      setLoading(false);
    }

    void loadCommunity();
    return () => { active = false; };
  }, []);

  async function submitGuestbook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = supabase;
    if (!client || submitting) return;

    if (website.trim()) {
      setDisplayName("");
      setMessage("");
      setWebsite("");
      setFeedback("고맙습니다.");
      return;
    }

    const cleanName = displayName.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) return;

    setSubmitting(true);
    setFeedback("");
    const { data, error } = await client.from("guestbook_entries")
      .insert({ display_name: cleanName, message: cleanMessage })
      .select("id, display_name, message, created_at")
      .single();
    setSubmitting(false);

    if (error || !data) {
      setFeedback("등록하지 못했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setEntries((current) => [data as GuestbookEntry, ...current].slice(0, 12));
    setDisplayName("");
    setMessage("");
    setFeedback("방명록에 바로 공개됐어요.");
  }

  async function sendAdminLoginLink() {
    if (!supabase || adminBusy) return;

    setAdminBusy(true);
    setAdminMessage("");
    try {
      const response = await fetch("/api/guestbook-admin/login", { method: "POST" });
      const result = await response.json().catch(() => null) as { error?: string } | null;

      if (!response.ok) {
        setAdminMessage(result?.error ?? "로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setAdminMessage("로그인 링크를 이메일로 보냈어요. 링크를 열면 삭제 기능이 활성화됩니다.");
    } catch {
      setAdminMessage("로그인 링크를 보내지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setAdminBusy(false);
    }
  }

  async function signOutAdmin() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAdminMessage("로그아웃하지 못했어요. 다시 시도해 주세요.");
      return;
    }
    setAdminLoginOpen(false);
    setAdminMessage("");
  }

  async function deleteGuestbookEntry(entryId: string) {
    if (!supabase || !isAdmin || deletingEntryId) return;
    if (!window.confirm("이 방명록을 삭제할까요?")) return;

    setDeletingEntryId(entryId);
    const { error } = await supabase.from("guestbook_entries").delete().eq("id", entryId);
    setDeletingEntryId(null);

    if (error) {
      setAdminMessage("삭제하지 못했어요. 관리자 로그인 상태를 확인해 주세요.");
      return;
    }

    setEntries((current) => current.filter((entry) => entry.id !== entryId));
    setAdminMessage("방명록을 삭제했습니다.");
  }

  return (
    <>
      <section id="blog" className="mini-section mini-blog" aria-labelledby="blog-title">
        <div className="mini-section__head">
          <div>
            <span className="mini-community__eyebrow">DEVELOPMENT LOG</span>
            <h2 id="blog-title">개발 블로그</h2>
          </div>
          {posts.length > 0 ? <span className="mini-community__count">{posts.length}개의 글</span> : null}
        </div>
        <p className="mini-section__intro">사이드 프로젝트를 만들며 고민한 점과 구현 과정을 기록합니다.</p>

        {loading ? <p className="mini-community__message">글을 불러오는 중이에요.</p> : null}
        {loadError ? <p className="mini-community__message" role="status">일부 내용을 불러오지 못했어요. 잠시 후 다시 확인해 주세요.</p> : null}
        {!loading && posts.length === 0 ? (
          <p className="mini-community__empty">아직 공개된 개발 글이 없습니다.</p>
        ) : null}
        {posts.length > 0 ? <div className="mini-blog__list">
          {posts.map((post) => (
            <article className="mini-blog__entry" key={post.id}>
              <div className="mini-blog__meta">
                <span className="mini-blog__category">{post.category}</span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
              <h3>{post.title}</h3>
              {post.summary ? <p className="mini-blog__summary">{post.summary}</p> : null}
              {post.tags?.length ? <ul className="mini-blog__tags" aria-label="글 주제">
                {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul> : null}
              {post.content ? <details className="mini-blog__details">
                <summary>글 전체 보기 <span aria-hidden="true">↓</span></summary>
                <div className="mini-blog__content">
                  {post.content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
                    <p key={`${post.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </details> : null}
            </article>
          ))}
        </div> : null}
      </section>

      <section id="guestbook" className="mini-section mini-guestbook" aria-labelledby="guestbook-title">
        <div className="mini-section__head">
          <div>
            <span className="mini-community__eyebrow">GUESTBOOK</span>
            <h2 id="guestbook-title">방명록</h2>
          </div>
          <div className="mini-guestbook__head-actions">
            {entries.length > 0 ? <span className="mini-community__count">{entries.length}개의 인사</span> : null}
            {isAdmin ? (
              <button type="button" className="mini-guestbook__admin-toggle" onClick={signOutAdmin}>
                관리자 로그아웃
              </button>
            ) : (
              <button
                type="button"
                className="mini-guestbook__admin-toggle"
                onClick={() => {
                  setAdminLoginOpen((open) => !open);
                  setAdminMessage("");
                }}
              >
                관리자 로그인
              </button>
            )}
          </div>
        </div>
        <p className="mini-section__intro">방문 인사를 남겨주세요. 작성하면 바로 공개됩니다.</p>
        {adminLoginOpen && !isAdmin ? (
          <div className="mini-guestbook__form mini-guestbook__admin-form">
            <p>등록된 관리자 이메일로 로그인 링크를 보냅니다.</p>
            {adminMessage ? <p className="mini-guestbook__feedback" role="status">{adminMessage}</p> : null}
            <button type="button" onClick={() => void sendAdminLoginLink()} disabled={adminBusy}>
              {adminBusy ? "보내는 중…" : "내 이메일로 로그인 링크 받기"}
            </button>
          </div>
        ) : null}
        {adminMessage && !adminLoginOpen ? <p className="mini-guestbook__admin-message" role="status">{adminMessage}</p> : null}

        <div className="mini-guestbook__grid">
          <div className="mini-guestbook__entries" aria-live="polite">
            {loading ? <p className="mini-community__message">방명록을 불러오는 중이에요.</p> : null}
            {!loading && entries.length === 0 ? <p className="mini-community__empty">첫 인사를 기다리고 있어요.</p> : null}
            {entries.length > 0 ? <ol className="mini-guestbook__list">
              {entries.map((entry) => (
                <li className="mini-guestbook__entry" key={entry.id}>
                  <div className="mini-guestbook__meta">
                    <strong>{entry.display_name}</strong>
                    <div className="mini-guestbook__entry-actions">
                      <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
                      {isAdmin ? (
                        <button
                          type="button"
                          className="mini-guestbook__delete"
                          aria-label={`${entry.display_name} 방명록 삭제`}
                          disabled={deletingEntryId === entry.id}
                          onClick={() => void deleteGuestbookEntry(entry.id)}
                        >
                          {deletingEntryId === entry.id ? "삭제 중…" : "삭제"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p>{entry.message}</p>
                </li>
              ))}
            </ol> : null}
          </div>

          <form className="mini-guestbook__form" onSubmit={submitGuestbook}>
            <label>
              이름
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)}
                name="display_name" autoComplete="nickname" maxLength={32} required />
            </label>
            <label>
              남기고 싶은 말
              <textarea value={message} onChange={(event) => setMessage(event.target.value)}
                name="message" rows={4} maxLength={500} required />
            </label>
            <div className="mini-guestbook__honeypot" aria-hidden="true">
              <label htmlFor="guestbook-website">Website</label>
              <input id="guestbook-website" value={website} onChange={(event) => setWebsite(event.target.value)}
                name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {feedback ? <p className="mini-guestbook__feedback" role="status">{feedback}</p> : null}
            {!supabase ? <p className="mini-guestbook__setup">방명록을 준비 중이에요.</p> : null}
            <button type="submit" disabled={!supabase || submitting}>
              {submitting ? "등록 중…" : "인사 남기기"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
