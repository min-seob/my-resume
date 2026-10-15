import { profile } from "@/data/portfolio";

export function MinihomeFooter() {
  return (
    <footer className="mini-footer">
      <div className="mini-footer__inner">
        <span>© 2026 {profile.name}</span>
        <span>여기까지 둘러봐줘서 고마워요 <b aria-hidden="true">☺</b></span>
      </div>
    </footer>
  );
}
