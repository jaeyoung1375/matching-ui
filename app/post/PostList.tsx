"use client";
import { SearchXIcon } from "lucide-react";
import { Card } from "@/components/Card";
import { SelectOption } from "@/components/SelectBox";
import { PostResponse } from "@/features/post/post.type";

export type SelectOptions = {
  techStack: SelectOption[];
  recruitPosit: SelectOption[];
  progress: SelectOption[];
  recruit: SelectOption[];
};

export default function PostList({
  data,
  onResetFilter,
}: {
  data: PostResponse[];
  onResetFilter?: () => void;
}) {
  /**
   * 게시글 목록을 조회하는 React Query 훅을 사용하여 데이터를 가져옵니다.
   */

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        {/* <SearchHeader selectOptions={selectOptions} onSearch={handleSearch} /> */}
        {data && data.length === 0 ? (
          <div className="flex flex-col items-center text-center py-24">
            <div className="w-18 h-18 rounded-full bg-teamo-soft flex items-center justify-center mb-6">
              <SearchXIcon size={32} className="text-teamo" strokeWidth={1.8} />
            </div>
            <h3 className="text-[17px] font-bold text-ink-900 tracking-[-0.01em] mb-2">
              조건에 맞는 스터디가 없어요
            </h3>
            <p className="text-[13px] text-ink-400 leading-relaxed mb-7">
              검색어나 필터를 조정하면
              <br />
              더 많은 스터디를 찾을 수 있어요
            </p>
            {onResetFilter && (
              <button
                type="button"
                onClick={onResetFilter}
                className="text-[13px] font-bold text-teamo bg-teamo-soft hover:bg-teamo-light transition-colors duration-150 rounded-[10px] px-5 py-2.5"
              >
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-16">
            {data?.map((item) => {
              return <Card key={item.postId} data={item} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}
