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
import { uploadProfileImage } from "@/features/auth/auth.query";

export default function MyPageForm() {
  const router = useRouter();
  const setAlert = useAlertStore((state) => state.setAlert);
  const { logout, setUser, user } = useAuth();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<MyPageFormValues>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
      });

      if (user.languages) {
        const userLangIds = user.languages.map((l: any) => l.dtlCdId);
        setLanguages(userLangIds);
      }

      if (user.profileImageUrl) {
        setPreview(`${baseUrl}${user.profileImageUrl}`);
      }
    }
  }, [user, reset]);

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
  }, [router]);

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

    try {
      if (profileImage) {
        await uploadProfileImage(profileImage);
      }

      await updateUser({
        name,
        password: password || undefined,
        dtlCdIds: languages,
      });

      const updatedUser = await getMe();
      setUser(updatedUser);

      // reset() 호출 제거: 같은 페이지로 replace 시 useEffect([user])가
      // 이미 최신 값으로 폼을 채워주므로 빈 화면이 되는 문제 방지
      router.replace("/mypage");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "정보 수정 중 오류가 발생했습니다.";
      setAlert(message);
    }
  };

  // 변경 여부 체크 (watch 활용)
  const nameValue = watch("name");
  const passwordValue = watch("password");

  const isChanged =
    nameValue !== user?.name ||
    passwordValue ||
    JSON.stringify(languages) !==
      JSON.stringify(user?.languages?.map((l) => l.dtlCdId)) ||
    profileImage !== null;

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

  // 로딩 처리
  if (!user) return null;

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
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 flex flex-col gap-4">
            <h2 className="text-lg font-bold">회원 탈퇴</h2>

            {!["GOOGLE", "KAKAO", "GITHUB"].includes(user.provider) && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="현재 비밀번호 입력"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  className="h-10 border rounded px-3 w-full"
                />

                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "숨김" : "보기"}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 bg-gray-300 rounded h-10"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawPassword("");
                }}
              >
                취소
              </button>

              <button
                type="button"
                className="flex-1 bg-red-500 text-white rounded h-10"
                onClick={async () => {
                  try {
                    if (
                      !["GOOGLE", "KAKAO", "GITHUB"].includes(user.provider)
                    ) {
                      if (!withdrawPassword) {
                        setAlert("비밀번호를 입력해주세요.");
                        return;
                      }

                      await withdrawUser({
                        currentPassword: withdrawPassword,
                      });
                    } else {
                      await withdrawUser();
                    }

                    // logout()을 먼저 호출해야 logoutApi()가 정상 실행됨
                    // (accessToken이 있어야 블랙리스트 등록 가능)
                    // clearAuth() 내부에서 localStorage 정리 + router.push("/") 처리
                    await logout();
                  } catch (error: any) {
                    const code = error?.response?.data?.code;
                    // U0010: SOCIAL_TOKEN_EXPIRED — 소셜 토큰 만료로 탈퇴 불가
                    if (code === "U0010") {
                      setAlert("소셜 토큰이 만료되었습니다. 다시 로그인 후 탈퇴해주세요.", async () => {
                        await logout(); // clearAuth()가 localStorage 정리 + 홈 이동
                        router.replace("/login");
                      });
                    } else {
                      const message = error?.response?.data?.message || "비밀번호가 일치하지 않습니다.";
                      setAlert(message);
                    }
                  }
                }}
              >
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
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
      {!["GOOGLE", "KAKAO", "GITHUB"].includes(user.provider) && (
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
        onClick={() => setShowWithdrawModal(true)}
        className="h-10 bg-red-400 text-white"
      >
        회원 탈퇴
      </Button>
    </form>
  );
}
