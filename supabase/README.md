# 미니홈 Supabase 연결

1. Supabase 조직 안에 프로젝트를 만들고 `setup.sql`을 SQL Editor에서 실행합니다.
2. 프로젝트 Connect 화면의 Project URL과 Publishable key를 `.env.local`에 넣습니다. 키 이름은 `.env.example`을 참고합니다.
3. `dev_blog_posts`는 Table Editor에서 작성합니다. `status`를 `published`로, `published_at`을 현재 시각으로 설정한 글만 사이트에 표시됩니다. `content`는 일반 텍스트이며 빈 줄로 문단을 나눕니다.
4. 방문자가 제출한 방명록은 즉시 공개됩니다. 방문자는 글을 읽고 작성할 수 있지만 수정·삭제 권한은 없습니다. 삭제가 필요하면 프로젝트 소유자가 Supabase Table Editor에서 행을 삭제합니다.
5. 배포할 때는 같은 두 환경 변수를 Vercel 프로젝트에도 등록합니다.

이 앱은 브라우저에서 Publishable key로 공개 글과 방명록을 읽고 새 방명록을 제출합니다. RLS 정책은 누구나 방명록을 읽고 `approved` 상태의 글을 제출하도록 허용하며, 공개 역할에는 수정·삭제 권한을 주지 않습니다. 삭제는 프로젝트 소유자가 Supabase Table Editor에서 처리합니다. Secret/service-role key는 프론트엔드나 `NEXT_PUBLIC_` 환경 변수에 넣지 않습니다.
