"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCodeQuery } from "@/features/code/code.query";
import SelectBox from "@/components/SelectBox";
import TeamoDatePicker from "@/components/TeamoDatePicker";
import { Controller, useForm } from "react-hook-form";
import {
  PostRegisterRequest,
  RecruitPosition,
} from "@/features/post/post.type";
import { formatDateToYYYYMMDD, parseYYYYMMDD } from "@/util/DateUtil";
import MultiSelect from "@/components/MultiSelectBox";
import { useRegisterPostMutation } from "@/features/post/post.mutation";

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
  value,
  onChange,
}: {
  placeholder?: string;
  defaultValue?: string;
  rightIcon?: React.ReactNode;
  value?: string;
  onChange: () => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

  /** 포지션별 모집인원 state */
  const [recruitPositions, setRecruitPositions] = useState<RecruitPosition[]>(
    [],
  );
  const [selectedPositCd, setSelectedPositCd] = useState<string>("");
  const [selectedPositCnt, setSelectedPositCnt] = useState<string>("1");

  /** 모집역할코드 조회 */
  const { data: ROLES } = useCodeQuery({ comCdId: "RECRUIT_POSIT_TYPE_CD" });

  /** 기술스택코드 조회 */
  const { data: TECH_STACKS } = useCodeQuery({ comCdId: "TECH_STACK" });

  const { mutate: registerPost } = useRegisterPostMutation();

  const { control, register, handleSubmit } = useForm<PostRegisterRequest>({
    defaultValues: {
      title: "",
      recruitEndDate: formatDateToYYYYMMDD(new Date()),
      progressTypeCd: "10",
      progressPeriod: "1",
    },
  });

  /** 포지션 추가 */
  const handleAddPosition = () => {
    if (!selectedPositCd) return;
    const alreadyAdded = recruitPositions.some(
      (p) => p.recruitPositTypeCd === selectedPositCd,
    );
    if (alreadyAdded) return;
    setRecruitPositions((prev) => [
      ...prev,
      {
        recruitPositTypeCd: selectedPositCd,
        recruitPositTypeNm: "",
        recruitCnt: Number(selectedPositCnt),
      },
    ]);
    setSelectedPositCd("");
    setSelectedPositCnt("1");
  };

  /** 포지션 삭제 */
  const handleRemovePosition = (cd: string) => {
    setRecruitPositions((prev) =>
      prev.filter((p) => p.recruitPositTypeCd !== cd),
    );
  };

  /** 전체 모집인원 합산 */
  const totalRecruitCnt = recruitPositions.reduce(
    (sum, p) => sum + p.recruitCnt,
    0,
  );

  /**
   * 글쓰기 버튼
   */
  const onsubmit = (data: PostRegisterRequest) => {
    registerPost(
      { ...data, recruitPositions },
      {
        onSuccess: ({ data }) => {
          router.push(`/post/${data.postId}`);
        },
        onError: (err) => console.log("err : ", err),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
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
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextInput
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="예: React + TypeScript 실전 프로젝트 스터디"
                  />
                )}
              />
            </div>

            {/* 진행 방식 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel required>진행 방식</FieldLabel>
                <Controller
                  control={control}
                  name="progressTypeCd"
                  render={({ field }) => (
                    <SelectBox
                      options={[
                        { label: "온라인", value: "10" },
                        { label: "오프라인", value: "20" },
                        { label: "온/오프라인", value: "30" },
                      ]}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </div>

            {/* 예상 기간 / 모집 마감일 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel>예상 기간</FieldLabel>
                <Controller
                  control={control}
                  name="progressPeriod"
                  render={({ field }) => (
                    <SelectBox
                      options={[
                        { label: "1개월", value: "1" },
                        { label: "2개월", value: "2" },
                        { label: "3개월", value: "3" },
                        { label: "4개월", value: "4" },
                      ]}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel required>모집 마감일</FieldLabel>

                <Controller
                  control={control}
                  name="recruitEndDate"
                  render={({ field }) => (
                    <TeamoDatePicker
                      value={field.value ? parseYYYYMMDD(field.value) : null}
                      onChange={(date) =>
                        field.onChange(date ? formatDateToYYYYMMDD(date) : "")
                      }
                    />
                  )}
                />
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>기술 스택</FieldLabel>
              <Controller
                control={control}
                name="techStackTypeCd"
                render={({ field }) => (
                  <MultiSelect
                    options={
                      TECH_STACKS?.map((t) => ({
                        label: t.dtlCdNm,
                        value: t.dtlCdId,
                      })) ?? []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="기술 스택을 선택해주세요"
                  />
                )}
              />
            </div>

            {/* 모집 역할 */}
            <div className="flex flex-col gap-2">
              <FieldLabel required>모집 역할</FieldLabel>

              {/* 포지션 추가 입력 행 */}
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <SelectBox
                    options={
                      ROLES?.filter(
                        (r) =>
                          !recruitPositions.some(
                            (p) => p.recruitPositTypeCd === r.dtlCdId,
                          ),
                      ).map((r) => ({ label: r.dtlCdNm, value: r.dtlCdId })) ??
                      []
                    }
                    value={selectedPositCd}
                    onChange={setSelectedPositCd}
                    placeholder="포지션 선택"
                  />
                </div>
                <div className="w-28">
                  <SelectBox
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i + 1}명`,
                      value: String(i + 1),
                    }))}
                    value={selectedPositCnt}
                    onChange={setSelectedPositCnt}
                  />
                </div>
                <Button
                  type="button"
                  variant="outlined"
                  size="md"
                  leftIcon={<Plus size={14} />}
                  onClick={handleAddPosition}
                  disabled={!selectedPositCd}
                >
                  추가
                </Button>
              </div>

              {/* 추가된 포지션 목록 */}
              {recruitPositions.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                  {recruitPositions.map((pos) => {
                    const nm =
                      ROLES?.find((r) => r.dtlCdId === pos.recruitPositTypeCd)
                        ?.dtlCdNm ?? pos.recruitPositTypeCd;
                    return (
                      <div
                        key={pos.recruitPositTypeCd}
                        className="flex items-center justify-between px-4 py-2.5 bg-teamo-soft border border-teamo/20 rounded-[10px]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-teamo">
                            {nm}
                          </span>
                          <span className="text-[13px] text-ink-500">
                            {pos.recruitCnt}명 모집
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePosition(pos.recruitPositTypeCd)
                          }
                          className="text-ink-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                  <p className="text-[12px] text-ink-400 text-right">
                    전체 모집인원:{" "}
                    <span className="font-bold text-teamo">
                      {totalRecruitCnt}명
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* 스터디 소개 */}
            <div className="flex flex-col gap-2">
              <FieldLabel required>스터디 소개</FieldLabel>
              <div className="relative">
                <textarea
                  placeholder="스터디 목표, 진행 방식, 참여 조건 등을 자유롭게 작성해주세요"
                  className="w-full min-h-40 px-4 py-3 border border-ink-200 rounded-[10px] text-[14px] text-ink-900 placeholder:text-ink-300 bg-white outline-none focus:border-teamo transition-colors resize-y leading-relaxed"
                  {...register("content")}
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
                {...register("recruitTarget")}
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
    </form>
  );
}
