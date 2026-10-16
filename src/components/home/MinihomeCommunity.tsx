"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { formatKoreanDate, type GuestbookEntry } from "@/lib/guestbook";
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
                <time dateTime={post.published_at}>{formatKoreanDate(post.published_at)}</time>
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
          {entries.length > 0 ? <span className="mini-community__count">{entries.length}개의 인사</span> : null}
        </div>
        <p className="mini-section__intro">방문 인사를 남겨주세요. 작성하면 바로 공개됩니다.</p>

        <div className="mini-guestbook__grid">
          <div className="mini-guestbook__entries" aria-live="polite">
            {loading ? <p className="mini-community__message">방명록을 불러오는 중이에요.</p> : null}
            {!loading && entries.length === 0 ? <p className="mini-community__empty">첫 인사를 기다리고 있어요.</p> : null}
            {entries.length > 0 ? <ol className="mini-guestbook__list">
              {entries.map((entry) => (
                <li className="mini-guestbook__entry" key={entry.id}>
                  <div className="mini-guestbook__meta">
                    <strong>{entry.display_name}</strong>
                    <time dateTime={entry.created_at}>{formatKoreanDate(entry.created_at)}</time>
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
