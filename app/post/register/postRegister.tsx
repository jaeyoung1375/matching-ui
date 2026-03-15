"use client";

import Button from "@/app/components/Button";
import Editor from "@/app/components/Editor";
import Input from "@/app/components/Input";
import Label from "@/app/components/Label";
import SelectBox, { SelectOption } from "@/app/components/SelectBox";
import TeamoDatePicker from "@/app/components/TeamoDatePicker";
import { ApiError } from "@/app/features/common/types/common.type";
import { PostDto } from "@/app/features/post/post.type";
import { useAlertStore } from "@/app/store/alertStore";
import { useConfirmStore } from "@/app/store/confirmStore";
import { post } from "@/app/util/AxiosUtil";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
// TODO : datePicker 컴포넌트 구현

type Props = {
  selectOptions: {
    recruit: SelectOption[];
    progress: SelectOption[];
    techStack: SelectOption[];
    recruitPosit: SelectOption[];
    contactMethod: SelectOption[];
  };
};

export default function PostRegister({ selectOptions }: Props) {
  const setAlert = useAlertStore((state) => state.setAlert);
  const setConfirm = useConfirmStore((state) => state.setConfirm);

  const router = useRouter();

  /** 공통코드 목록 조회 */
  const { recruit, progress, techStack, recruitPosit, contactMethod } =
    selectOptions;

  /**
   * 게시글 등록용 React Hook Form
   * - PostDto 타입 기반으로 필드 자동 매핑
   * - register: 각 input에 연결
   * - handleSubmit: 제출 시 데이터 수집
   * - control: Controller로 커스텀 컴포넌트(FormSelect 등) 연결
   */
  const { register, handleSubmit, control } = useForm<PostDto>({
    defaultValues: {
      userId: 36,
      recruitEndDate: new Date(),
    },
  });

  const onSubmit = async (data: PostDto) => {
    const mergedData = { ...data, userId: 36, recruitEndDate: new Date() };
    const res = await post<ApiError>("/api/v1/posts", mergedData);

    // 성공시 메인으로 이동 (임시)
    if (res && res.code === "0000") {
      router.push("/");
    }
  };

  return (
    <>
      <div className="wrapper">
        <section>
          <div className="_postContentWrapper_1bdow_14">
            <span className="_sequence_1bdow_30">1</span>
            <h2 className="_text_1bdow_22">
              프로젝트 기본 정보를 입력해주세요.
            </h2>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">모집 구분</Label>
            <Controller
              name="recruitTypeCd"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={recruit}
                  placeholder="스터디/프로젝트"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">모집 인원</Label>
            <Controller
              name="recruitCnt"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={[
                    { label: "인원미정", value: "00" },
                    { label: "1명", value: "01" },
                  ]}
                  placeholder="인원 미정 ~ 10명 이상"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">진행 방식</Label>
            <Controller
              name="progressTypeCd"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={progress}
                  placeholder="온라인/오프라인"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">진행 기간</Label>
            <Controller
              name="progressPeriod"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={[
                    { label: "1개월", value: "01" },
                    { label: "2개월", value: "02" },
                    { label: "3개월", value: "03" },
                    { label: "4개월", value: "04" },
                    { label: "장기", value: "99" },
                  ]}
                  placeholder="기간 미정 ~ 6개월 이상"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">기술 스택</Label>

            <Controller
              name="techStackTypeCd"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={techStack}
                  placeholder="프로젝트 사용 스택"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">모집 마감일</Label>
            {/* <SelectBox className="select-primary w-114.75" options={[]} /> */}
            <TeamoDatePicker className="select-primary w-114.75" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">모집 포지션</Label>
            <Controller
              name="recruitPositTypeCd"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={recruitPosit}
                  placeholder="프론트엔드, 백엔드..."
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">연락 방법</Label>
            <Controller
              name="contactMethodCd"
              control={control}
              render={({ field }) => (
                <SelectBox
                  className="select-primary w-114.75"
                  options={contactMethod}
                  placeholder="카카오톡/이메일"
                  {...field}
                />
              )}
            />
            <Input
              className="select-primary w-114.75"
              placeholder="오픈 카톡방 링크"
              // {...register('')}
            />
          </div>
        </div>

        <section>
          <div className="_postContentWrapper_1bdow_14">
            <span className="_sequence_1bdow_30">2</span>
            <h2 className="_text_1bdow_22">
              프로젝트 기본 정보를 입력해주세요.
            </h2>
          </div>
        </section>
        <div className="flex flex-col gap-1">
          <Label title="position">제목</Label>
          <Input
            className="select-primary w-114.75"
            placeholder="글 제목을 입력해주세요!"
            {...register("title")}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div className="flex flex-row gap-3 justify-end">
          <Button className="btn-primary">취소</Button>
          <Button className="btn-primary" onClick={handleSubmit(onSubmit)}>
            등록하기
          </Button>
        </div>
        <div className="text-right"></div>
      </div>
    </>
  );
}
