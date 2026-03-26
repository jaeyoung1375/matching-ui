"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkEmail, getLanguages } from "../features/auth/auth.query";
import Button from "@/components/Button";
import MultiSelect, { MultiSelectOption } from "@/components/MultiSelectBox";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [languageOptions, setLanguageOptions] = useState<MultiSelectOption[]>(
    [],
  );

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [languages, setLanguages] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadLanguages() {
      const langs = await getLanguages();

      const mapped = langs.map((lang: any) => ({
        value: lang.dtlCdId,
        label: lang.dtlCdNm,
      }));

      setLanguageOptions(mapped);
    }

    loadLanguages();
  }, []);

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
      setErrorMessage("닉네임을 입력해주세요.");
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

    if (password.length < 8) {
      setPasswordError("비밀번호는 8자리 이상이어야 합니다.");
      return;
    }

    if (confirmPasswordError.length < 8) {
      setConfirmPasswordError("비밀번호는 8자리 이상이어야 합니다.");
    }

    if (!phone.trim()) {
      setErrorMessage("핸드폰번호를 입력해주세요.");
      return;
    }

    if (!emailChecked || !emailAvailable) {
      setErrorMessage("이메일 중복 확인을 해주세요.");
      return;
    }

    if (languages.length === 0) {
      setErrorMessage("관심분야를 최소 1개 선택해주세요.");
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
        dtlCdIds: languages,
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 닉네임 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            닉네임
          </label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
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

            <Button
              type="button"
              onClick={handleCheckEmail}
              className="h-12 px-4 text-sm border border-neutral-300 rounded-xl hover:bg-neutral-100 whitespace-nowrap"
            >
              중복확인
            </Button>
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
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);

              if (value.length < 8) {
                setPasswordError("비밀번호는 8자리 이상이어야 합니다.");
              } else {
                setPasswordError(""); // 조건 만족하면 에러 제거
              }
            }}
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
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);

              if (password !== value) {
                setPasswordError("비밀번호가 일치하지 않습니다.");
              } else {
                setPasswordError("");
              }
            }}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {passwordError && (
          <p className="mt-1 text-sm text-red-500">{passwordError}</p>
        )}

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

        {/* 관심분야 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-700">
            관심분야
          </label>

          <MultiSelect
            options={languageOptions}
            value={languages}
            onChange={setLanguages}
            placeholder="관심분야 선택"
            className="h-10"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button
          type="submit"
          loading={isLoading}
          className="mt-4 inline-flex items-center justify-center h-10 px-5 text-xs rounded-md bg-orange-400 text-white hover:bg-orange-500"
        >
          회원가입
        </Button>
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
