"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { useCodeQuery } from "@/features/code/code.query";
import SelectBox from "@/components/SelectBox";
import TeamoDatePicker from "@/components/TeamoDatePicker";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[14px] font-semibold text-ink-800">
      {children}
      {required && <span className="text-teamo ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  defaultValue,
  rightIcon,
}: {
  placeholder?: string;
  defaultValue?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-11.5 px-4 border border-ink-200 rounded-[10px] text-[14px] text-ink-900 placeholder:text-ink-300 bg-white outline-none focus:border-teamo transition-colors"
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none">
          {rightIcon}
        </span>
      )}
    </div>
  );
}

export default function PostRegister() {
  const router = useRouter();

  /** 모집역할코드 조회 */
  const { data: ROLES } = useCodeQuery({ comCdId: "RECRUIT_POSIT_TYPE_CD" });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  return (
    <main className="min-h-screen bg-ink-50">
      <div className="max-w-190 mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.back()}
            className="text-ink-500 hover:text-ink-800 transition-colors"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-[22px] font-extrabold text-ink-900 tracking-[-0.02em]">
            스터디 모집글 작성
          </h1>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-6">
          {/* 스터디 제목 */}
          <div className="flex flex-col gap-2">
            <FieldLabel required>스터디 제목</FieldLabel>
            <TextInput placeholder="예: React + TypeScript 실전 프로젝트 스터디" />
          </div>

          {/* 진행 방식 / 모집 인원 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <FieldLabel required>진행 방식</FieldLabel>
              <TextInput defaultValue="온라인" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel required>모집 인원</FieldLabel>
              {/* <TextInput defaultValue="2명" /> */}
              <SelectBox
                options={[
                  { label: "1명", value: "1" },
                  { label: "2명", value: "2" },
                  { label: "3명", value: "3" },
                ]}
                value="1"
              />
            </div>
          </div>

          {/* 예상 기간 / 모집 마감일 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <FieldLabel>예상 기간</FieldLabel>
              <TextInput defaultValue="1개월" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel required>모집 마감일</FieldLabel>
              {/* <TextInput
                placeholder="년-월-일"
                rightIcon={<Calendar size={16} />}
              /> */}
              <TeamoDatePicker />
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>기술 스택</FieldLabel>
            <TextInput placeholder="예: React, TypeScript, Node.js (쉼표로 구분)" />
            <p className="text-[12px] text-ink-400">
              주요 기술 스택을 쉼표로 구분하여 입력해주세요
            </p>
          </div>

          {/* 모집 역할 */}
          <div className="flex flex-col gap-2">
            <FieldLabel required>모집 역할</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ROLES?.map((role) => {
                const active = selectedRoles.includes(role.dtlCdNm);
                return (
                  <button
                    key={role.dtlCdId}
                    type="button"
                    onClick={() => toggleRole(role.dtlCdNm)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors duration-150",
                      active
                        ? "bg-teamo text-white border-teamo"
                        : "bg-white text-ink-600 border-ink-200 hover:border-teamo hover:text-teamo",
                    )}
                  >
                    {role.dtlCdNm}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 스터디 소개 */}
          <div className="flex flex-col gap-2">
            <FieldLabel required>스터디 소개</FieldLabel>
            <div className="relative">
              <textarea
                placeholder="스터디 목표, 진행 방식, 참여 조건 등을 자유롭게 작성해주세요"
                className="w-full min-h-40 px-4 py-3 border border-ink-200 rounded-[10px] text-[14px] text-ink-900 placeholder:text-ink-300 bg-white outline-none focus:border-teamo transition-colors resize-y leading-relaxed"
              />
            </div>
            <p className="text-[12px] text-ink-400">최대 1000자</p>
          </div>

          {/* 모집 대상 */}
          <div className="flex flex-col gap-2">
            <FieldLabel>모집 대상</FieldLabel>
            <textarea
              placeholder="어떤 분들과 함께하고 싶으신가요? (선호 경력, 수준 등)"
              className="w-full min-h-25 px-4 py-3 border border-ink-200 rounded-[10px] text-[14px] text-ink-900 placeholder:text-ink-300 bg-white outline-none focus:border-teamo transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="neutral" size="lg" onClick={() => router.back()}>
              취소
            </Button>
            <Button variant="primary" size="lg">
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
