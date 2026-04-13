"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup, checkEmail, getLanguages } from "@/features/auth/auth.query";
import Button from "@/components/Button";
import MultiSelect, { MultiSelectOption } from "@/components/MultiSelectBox";
import { useForm, FieldErrors } from "react-hook-form";
import { useAlertStore } from "@/store/alertStore";
import { SignupFormValues } from "@/features/auth/auth.type";

export default function SignupForm() {
  const router = useRouter();
  const setAlert = useAlertStore((state) => state.setAlert);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const [languageOptions, setLanguageOptions] = useState<MultiSelectOption[]>(
    [],
  );
  const [languages, setLanguages] = useState<string[]>([]);

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const password = watch("password");

  // 🔥 언어 로딩
  useEffect(() => {
    async function loadLanguages() {
      const langs = await getLanguages();

      const mapped = langs.map((lang) => ({
        value: lang.dtlCdId,
        label: lang.dtlCdNm,
      }));

      setLanguageOptions(mapped);
    }

    loadLanguages();
  }, []);

  // 🔥 이메일 중복 체크
  const handleCheckEmail = async () => {
    const email = watch("email");

    if (!email?.trim()) {
      setAlert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setAlert("올바른 이메일 형식을 입력해주세요");
      return;
    }

    try {
      const exists = await checkEmail(email);

      setEmailChecked(true);
      setEmailAvailable(!exists);
    } catch {
      setAlert("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  // 🔥 submit
  const onSubmit = async (data: SignupFormValues) => {
    if (!emailChecked || !emailAvailable) {
      setAlert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (languages.length === 0) {
      setAlert("관심분야를 최소 1개 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      await signup({
        ...data,
        dtlCdIds: languages,
      });

      setAlert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";

      setAlert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 validation 실패 시 alert
  const onInvalid = (errors: FieldErrors<SignupFormValues>) => {
    const first = Object.values(errors)[0];
    setAlert(first?.message ?? "");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-6"
      >
        {/* 닉네임 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            닉네임
          </label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            {...register("name", {
              required: "닉네임을 입력해주세요.",
            })}
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
              {...register("email", {
                required: "이메일을 입력해주세요.",
              })}
              onChange={() => {
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
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상 입력해주세요.",
              },
            })}
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
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            })}
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
            {...register("phone", {
              required: "핸드폰번호를 입력해주세요.",
            })}
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
