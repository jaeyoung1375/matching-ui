"use client";

import { useState } from "react";
import LanguageSelect from "../signup/LanguageSelect";
import { updateUser, withdrawUser } from "@/app/features/auth/auth.query";
import { useRouter } from "next/navigation";

interface Props {
  defaultName: string;
  defaultLanguages: string[];
}

export default function MyPageForm({ defaultName, defaultLanguages }: Props) {
  const router = useRouter();

  const [name, setName] = useState(defaultName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [languages, setLanguages] = useState<string[]>(defaultLanguages);

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

    await updateUser(token, {
      name,
      password: password || undefined,
      dtlCdIds: languages,
    });

    alert("회원 정보가 수정되었습니다.");

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

    const confirmWithdraw = confirm("정말 회원 탈퇴하시겠습니까?");
    if (!confirmWithdraw) return;

    await withdrawUser(token);

    alert("회원 탈퇴가 완료되었습니다.");

    localStorage.removeItem("accessToken");

    router.push("/");
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

        {/* 관심 기술 */}
        <LanguageSelect
          defaultLanguages={defaultLanguages}
          onChange={setLanguages}
        />

        {/* 수정 버튼 */}
        <button
          onClick={handleSubmit}
          className="mt-2 h-12 rounded-xl bg-black text-sm font-semibold text-white hover:opacity-90"
        >
          수정하기
        </button>

        {/* 회원탈퇴 */}
        <button
          onClick={handleWithdraw}
          className="h-12 rounded-xl border border-red-400 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}
