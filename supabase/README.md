# 미니홈 Supabase 연결

1. Supabase 조직 안에 프로젝트를 만들고 `setup.sql`을 SQL Editor에서 실행합니다.
2. 프로젝트 Connect 화면의 Project URL과 Publishable key를 `.env.local`에 넣습니다. 키 이름은 `.env.example`을 참고합니다.
3. `dev_blog_posts`는 Table Editor에서 작성합니다. `status`를 `published`로, `published_at`을 현재 시각으로 설정한 글만 사이트에 표시됩니다. `content`는 일반 텍스트이며 빈 줄로 문단을 나눕니다.
4. 방문자는 로그인 없이 방명록을 읽고 작성할 수 있으며, 새 글은 즉시 공개됩니다. 수정 권한은 없고 삭제는 등록된 관리자만 할 수 있습니다. 관리자는 페이지의 `관리자 로그인`에서 이메일 링크로 인증하면 삭제 버튼을 사용할 수 있습니다.
5. 관리자를 등록하려면 SQL Editor에서 `guestbook_admins` 테이블에 이메일을 추가합니다. 등록된 관리자 이메일과 일치하는 로그인 세션에만 삭제 권한이 부여됩니다.

```sql
insert into public.guestbook_admins (email)
values ('owner@example.com')
on conflict (email) do nothing;
```

6. Authentication > URL Configuration에서 Site URL을 `https://minseob-resume-developer.vercel.app`으로 설정하고 Redirect URLs에 `https://minseob-resume-developer.vercel.app/minihome`, `http://localhost:3000/minihome`을 추가합니다.
7. Vercel에는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, 서버 전용 `SUPABASE_GUESTBOOK_OWNER_EMAIL`, `SUPABASE_AUTH_REDIRECT_ORIGIN`을 등록합니다. 이메일 주소는 Secret으로 저장하고, 리다이렉트 origin은 `https://minseob-resume-developer.vercel.app`으로 설정합니다.

이 앱은 브라우저에서 Publishable key로 공개 글과 방명록을 읽고 새 방명록을 제출합니다. 익명 역할은 방명록 읽기·제출만 가능하며 삭제할 수 없습니다. 사이트의 관리자 로그인 링크는 서버 전용 이메일 주소로 전송되고, 삭제 권한은 `guestbook_admins`에 등록된 이메일 세션에만 RLS로 허용됩니다. 관리자 이메일은 공개 환경변수나 프론트엔드 번들에 넣지 않습니다. Secret/service-role key는 프론트엔드에 넣지 않습니다.
