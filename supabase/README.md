# 미니홈 Supabase 연결

1. Supabase 조직 안에 프로젝트를 만들고 `setup.sql`을 SQL Editor에서 실행합니다.
2. 프로젝트 Connect 화면의 Project URL과 Publishable key를 `.env.local`에 넣습니다. 키 이름은 `.env.example`을 참고합니다.
3. `dev_blog_posts`는 Table Editor에서 작성합니다. `status`를 `published`로, `published_at`을 현재 시각으로 설정한 글만 사이트에 표시됩니다. `content`는 일반 텍스트이며 빈 줄로 문단을 나눕니다.
4. 방문자가 제출한 방명록은 `pending` 상태로 저장됩니다. Table Editor에서 내용을 확인한 뒤 `approved`로 바꾸면 공개됩니다. 보류하거나 지우려면 `rejected`로 바꾸거나 행을 삭제합니다.
5. 배포할 때는 같은 두 환경 변수를 Vercel 프로젝트에도 등록합니다.

이 앱은 브라우저에서 Publishable key로 공개 글을 읽고 방명록을 제출합니다. RLS 정책이 공개 읽기 범위와 대기 상태 제출만 허용합니다. Secret/service-role key는 프론트엔드나 `NEXT_PUBLIC_` 환경 변수에 넣지 않습니다.
