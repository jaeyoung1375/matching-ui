"use client";

import Button from "@/app/components/Button";
import Editor from "@/app/components/Editor";
import Input from "@/app/components/Input";
import Label from "@/app/components/Label";
import SelectBox, { SelectOption } from "@/app/components/SelectBox";
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
  const { recruit, progress, techStack, recruitPosit, contactMethod } =
    selectOptions;

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
            <SelectBox
              className="select-primary w-114.75"
              options={recruit}
              placeholder="스터디/프로젝트"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">모집 인원</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={[]}
              placeholder="인원 미정 ~ 10명 이상"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">진행 방식</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={progress}
              placeholder="온라인/오프라인"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">진행 기간</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={[]}
              placeholder="기간 미정 ~ 6개월 이상"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">기술 스택</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={techStack}
              placeholder="프로젝트 사용 스택"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">모집 마감일</Label>

            <SelectBox className="select-primary w-114.75" options={[]} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label title="type">모집 포지션</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={recruitPosit}
              placeholder="프론트엔드, 백엔드..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label title="position">연락 방법</Label>
            <SelectBox
              className="select-primary w-114.75"
              options={contactMethod}
              placeholder="카카오톡/이메일"
            />
            <Input
              className="select-primary w-114.75"
              placeholder="오픈 카톡방 링크"
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
          />
          <Editor />
        </div>
        <div className="flex flex-row gap-3 justify-end">
          <Button className="btn-primary">취소</Button>
          <Button className="btn-primary">등록하기</Button>
        </div>
        <div className="text-right"></div>
      </div>
    </>
  );
}
