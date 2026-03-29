"use client";

import { useState } from "react";
import { SelectOptions } from "./PostList";
import SelectBox from "@/components/SelectBox";
import Button from "@/components/Button";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { PostRequest } from "@/features/post/post.type";

type searchHeaderProps = {
  selectOptions: SelectOptions;
  onSearch: (formData: PostRequest) => void;
};

export default function SearchHeader({
  selectOptions,
  onSearch,
}: searchHeaderProps) {
  const category = selectOptions.recruit;

  const [active, setActive] = useState<string>("");

  const { register, handleSubmit } = useForm<PostRequest>();

  const onSubmit = (data: PostRequest) => {
    // 부모 컴포넌트로 검색 조건 전달

    onSearch(data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-4">
      {/* 카테고리 */}
      <div className="flex items-center justify-between">
        <ul className="flex gap-6 text-lg font-semibold">
          {category.map((item) => (
            <li
              key={item.value}
              onClick={() => setActive(item.label)}
              className={`cursor-pointer pb-2 ${
                active === item.label
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* 뷰 모드 */}
        {/* <div className="flex items-center gap-2 cursor-pointer text-gray-600">
          <img src="/images/info/listview-icon.png" className="w-5 h-5" />
          <span>리스트뷰 보기</span>
        </div> */}
      </div>

      {/* 필터 영역 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 기술스택 */}
        <SelectBox
          placeholder="선택"
          className=" text-gray-600 w-50 h-12"
          options={selectOptions.techStack}
        />

        {/* 포지션 */}
        <SelectBox
          placeholder="선택"
          className=" text-gray-600 w-50 h-12"
          options={selectOptions.recruitPosit}
        />

        {/* 진행 방식 */}
        <SelectBox
          placeholder="선택"
          className=" text-gray-600 w-50 h-12"
          options={selectOptions.progress}
        />

        {/* 북마크 */}
        <Button className="px-4 border rounded-lg text-gray-500 h-12">
          👋 내 북마크 보기
        </Button>

        {/* 모집중 */}
        <Button className="px-4 py-2 bg-black text-white rounded-lg">
          👀 모집 중만 보기
        </Button>

        {/* 검색 */}
        <div className="ml-auto relative">
          <input
            placeholder="제목, 글 내용을 검색해보세요."
            className="border rounded-lg pl-10 pr-4 py-2 w-70"
            {...register("keyword")}
          />

          <Button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4"
            onClick={handleSubmit(onSubmit)}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
