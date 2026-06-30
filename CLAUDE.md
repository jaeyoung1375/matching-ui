# teamo-ui

팀 매칭 서비스 **Teamo**의 Next.js 프론트엔드.

## 기술 스택
- **프레임워크**: Next.js 16 (App Router), React 19, TypeScript
- **상태관리**: Zustand, TanStack Query v5 (서버 상태)
- **스타일**: Tailwind CSS v4
- **폼**: react-hook-form
- **에디터**: Tiptap (게시글 작성)
- **알림**: amqplib (메시지 큐 기반)
- **HTTP**: Axios (`util/AxiosUtil.ts` 래퍼 사용)

## 주요 명령어
```bash
npm run dev    # 개발 서버
npm run build  # 빌드
npm run lint   # 린트
```

## 디렉토리 구조
```
app/           # Next.js App Router 페이지
  page.tsx         # 메인(홈)
  post/            # 게시글 목록 / 상세 / 등록
  login/           # 로그인
  signup/          # 회원가입
  mypage/          # 마이페이지
  admin/           # 관리자 (대시보드, 유저, 로그, 공통코드)
  auth/            # 토큰 처리 (TokenHandler)
  context/         # AuthContext (전역 로그인 상태)
  components/      # 레이아웃(Header, Footer), 에러바운더리, 로딩

features/      # 도메인별 API / 타입 / 쿼리
  auth/            # 로그인, 회원가입, 내 정보
  post/            # 게시글 CRUD
  comment/         # 댓글
  apply/           # 지원
  notification/    # 알림
  admin/           # 관리자
  admin-log/       # 관리자 로그
  client-log/      # 클라이언트 에러 로그

components/    # 공용 UI 컴포넌트 (Button, Input, Card, Editor 등)
util/          # 공통 유틸 (AxiosUtil, DateUtil, FileUtil 등)
styles/        # globals.css, editor.css
```

## API 통신 규칙
- `util/AxiosUtil.ts`의 `get / post / put / patch / deleteData` 래퍼를 사용
- 응답 포맷: `{ code, data, message }` — code `"0000"` 이 성공
- 인증: `localStorage`의 `accessToken`을 Bearer 토큰으로 자동 첨부
- 401 발생 시 토큰 삭제 후 홈으로 리다이렉트 (로그인 상태였던 경우에만)
- 환경변수: `NEXT_PUBLIC_API_BASE_URL`

## 인증 흐름
- `AuthContext`가 앱 전역 로그인 상태 관리
- 초기 로드 시 `localStorage`의 토큰으로 `/api/v1/auth/me` 호출해 유저 확인
- `useAuth()` 훅으로 `user`, `login`, `logout` 접근

## 주요 패턴
- 도메인별 `features/<domain>/<domain>.api.ts` + `query.ts` + `type.ts` 구조
- 공통 코드(기술스택 등)는 `features/common/commonCode.ts`
- 관리자 페이지는 `app/admin/` 하위, `AdminAuthGuard`로 접근 제한
- 클라이언트 에러는 `ClientLogUtil`로 자동 서버 전송
