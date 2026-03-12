"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkEmail } from "../features/auth/auth.query";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      const exists = await checkEmail(email);

      setEmailChecked(true);

      if (exists) {
        setEmailAvailable(false);
        setErrorMessage("");
      } else {
        setEmailAvailable(true);
        setErrorMessage("");
      }
    } catch {
      setErrorMessage("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("핸드폰번호를 입력해주세요.");
      return;
    }

    if (!emailChecked || !emailAvailable) {
      setErrorMessage("이메일 중복 확인을 해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      await signup({
        name,
        email,
        password,
        confirmPassword,
        phone,
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 이름 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            이름
          </label>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            이메일
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailChecked(false);
                setEmailAvailable(null);
              }}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
            />

            <button
              type="button"
              onClick={handleCheckEmail}
              className="h-12 whitespace-nowrap rounded-xl border border-neutral-300 px-4 text-sm hover:bg-neutral-100"
            >
              중복확인
            </button>
          </div>

          {emailChecked && emailAvailable && (
            <p className="mt-1 text-sm text-green-600">
              사용 가능한 이메일입니다.
            </p>
          )}

          {emailChecked && emailAvailable === false && (
            <p className="mt-1 text-sm text-red-500">
              이미 사용중인 이메일입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            비밀번호 확인
          </label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {/* 핸드폰 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            핸드폰번호
          </label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-12 rounded-xl bg-black text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-neutral-900">
          로그인
        </Link>
      </div>
    </div>
  );
}
