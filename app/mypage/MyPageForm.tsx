"use client";

import { useEffect, useState } from "react";
import MultiSelect, { MultiSelectOption } from "@/components/MultiSelectBox";
import {
  getLanguages,
  updateUser,
  withdrawUser,
} from "@/app/features/auth/auth.query";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAlertStore } from "@/store/alertStore";
import { useAuth } from "../context/AuthContext";

interface Props {
  defaultName: string;
  defaultLanguages: string[];
}

export default function MyPageForm({ defaultName, defaultLanguages }: Props) {
  const router = useRouter();

  const [name, setName] = useState(defaultName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [languageOptions, setLanguageOptions] = useState<MultiSelectOption[]>(
    [],
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [languages, setLanguages] = useState<string[]>(defaultLanguages);
  const { logout } = useAuth();

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

  const setAlert = useAlertStore((state) => state.setAlert);

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // 비밀번호 입력했을 때만 검증
    if (password) {
      if (password.length < 8) {
        alert("비밀번호는 8자 이상 입력해주세요.");
        return;
      }

      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    await updateUser({
      name,
      password: password || undefined,
      dtlCdIds: languages,
    });

    window.location.reload();
  };

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

  const handleWithdraw = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    await withdrawUser();

    localStorage.removeItem("accessToken");
    logout();

    router.replace("/");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-100">
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

      {/* 폼 */}
      <div className="flex flex-col gap-6">
        {/* 닉네임 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            닉네임
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            비밀번호 변경
          </label>
          <input
            type="password"
            placeholder="변경할 비밀번호 (8자 이상)"
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

        {/* 관심분야 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            관심분야
          </label>

          <MultiSelect
            options={languageOptions}
            value={languages}
            onChange={setLanguages}
            placeholder="관심분야 선택"
          />
        </div>

        {/* 수정 버튼 */}
        <Button
          onClick={() =>
            setAlert("정말 수정하시겠습니까?", async () => {
              await handleSubmit();
            })
          }
          className="inline-flex items-center justify-center h-10 px-5 text-xs rounded-md bg-orange-400 text-white hover:bg-orange-500"
        >
          수정하기
        </Button>

        <Button
          onClick={() =>
            setAlert("정말 회원 탈퇴하시겠습니까?", async () => {
              await handleWithdraw();
            })
          }
          className="inline-flex items-center justify-center h-10 px-5 text-xs rounded-md bg-red-400 text-white hover:bg-red-500"
        >
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
