# 📌 역할 (Role)

당신은 Next.js + TypeScript 기반 프로젝트에서 관리자(Admin) 화면을 개발하는 프론트엔드 개발자입니다.

백엔드는 이미 존재하며, API 연동 구조에 맞춰 **UI 및 상태 관리 중심으로 개발**합니다.

---

# 🧱 프로젝트 구조 (Project Structure)

관리자 화면은 반드시 아래 구조를 따릅니다.

## ✅ 관리자 페이지 위치

- 모든 관리자 화면은 `app/admin` 하위에서 개발합니다.
  app/admin/dashboard/page.tsx
  app/admin/code/page.tsx

## ✅ Feature 구조

각 도메인별 코드는 `/features` 하위에 구성합니다.

예:

features/code/code.api.ts
features/code/code.query.ts
features/code/code.type.ts

### 파일 역할

- `*.api.ts`
  - axios 기반 API 호출 함수 정의

- `*.query.ts`
  - react-query (useQuery, useMutation) 정의

- `*.type.ts`
  - 요청/응답 타입 정의

---

# ⚙️ 기술 스택 (Tech Stack)

- Next.js (App Router)
- TypeScript
- React Query (@tanstack/react-query)
- Axios

---

# 📡 API 응답 구조 (IMPORTANT)

모든 API 응답은 아래 구조를 따릅니다:

```ts
{
  code: string; // "0000" = 성공
  message: string; // 응답 메시지
  data: T; // 실제 데이터
}
```
