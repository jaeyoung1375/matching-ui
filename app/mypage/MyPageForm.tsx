"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MultiSelect, { MultiSelectOption } from "@/components/MultiSelectBox";
import {
  getLanguages,
  getMe,
  updateUser,
  withdrawUser,
} from "@/features/auth/auth.query";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAlertStore } from "@/store/alertStore";
import { useAuth } from "../context/AuthContext";
import { MyPageFormValues } from "@/features/auth/auth.type";

export default function MyPageForm() {
  const router = useRouter();
  const setAlert = useAlertStore((state) => state.setAlert);
  const { logout, setUser, user } = useAuth();

  const { register, handleSubmit, setValue, watch } =
    useForm<MyPageFormValues>();

  const [languageOptions, setLanguageOptions] = useState<MultiSelectOption[]>(
    [],
  );
  const [languages, setLanguages] = useState<string[]>([]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setLanguages(user.languages?.map((l) => l.dtlCdId) ?? []);
    }
  }, [user]);
  // 언어 목록 로딩
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

  // submit 처리
  const onSubmit = async (data: MyPageFormValues) => {
    if (!user) return;

    const { name, password, confirmPassword } = data;

    // 비밀번호 검증
    if (password) {
      if (password.length < 8) {
        setAlert("비밀번호는 8자 이상 입력해주세요.");
        return;
      }

      if (password !== confirmPassword) {
        setAlert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    await updateUser({
      name,
      password: password || undefined,
      dtlCdIds: languages,
    });

    const updatedUser = await getMe();
    setUser(updatedUser);

    router.refresh();
  };

  // 변경 여부 체크 (watch 활용)
  const nameValue = watch("name");
  const passwordValue = watch("password");

  const isChanged =
    nameValue !== user?.name ||
    passwordValue ||
    JSON.stringify(languages) !==
      JSON.stringify(user?.languages?.map((l) => l.dtlCdId));

  // 이미지 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 회원 탈퇴
  const handleWithdraw = async () => {
    await withdrawUser();

    localStorage.removeItem("accessToken");
    logout();

    router.replace("/");
  };

  // 로딩 처리
  if (!user) return <div>loading...</div>;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (!isChanged) {
          setAlert("변경된 내용이 없습니다.");
          return;
        }

        setAlert("정말 수정하시겠습니까?", async () => {
          await onSubmit(data);
        });
      })}
      className="flex flex-col gap-8"
    >
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-neutral-100">
          {preview ? (
            <img src={preview} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-neutral-500">프로필</span>
          )}
        </div>

        <label className="cursor-pointer text-sm text-blue-500">
          프로필 이미지 변경
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* 닉네임 */}
      <input
        {...register("name", {
          required: "닉네임을 입력해주세요.",
        })}
        className="h-12 w-full rounded-xl border px-4"
        placeholder="닉네임"
      />

      {/* 비밀번호 (소셜 제외) */}
      {user.provider !== "GOOGLE" && (
        <>
          <input
            type="password"
            placeholder="새 비밀번호"
            {...register("password")}
            className="h-12 rounded-xl border px-4"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            {...register("confirmPassword")}
            className="h-12 rounded-xl border px-4"
          />
        </>
      )}

      {/* 관심분야 */}
      <MultiSelect
        options={languageOptions}
        value={languages}
        onChange={setLanguages}
        placeholder="관심분야 선택"
      />

      {/* 수정 */}
      <Button type="submit" className="h-10 bg-orange-400 text-white">
        수정하기
      </Button>

      {/* 탈퇴 */}
      <Button
        type="button"
        onClick={() =>
          setAlert("정말 회원 탈퇴하시겠습니까?", async () => {
            await handleWithdraw();
          })
        }
        className="h-10 bg-red-400 text-white"
      >
        회원 탈퇴
      </Button>
    </form>
  );
}
