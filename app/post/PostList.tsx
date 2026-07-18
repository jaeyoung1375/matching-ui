"use client";
import { Card } from "@/components/Card";
import { SelectOption } from "@/components/SelectBox";
import { PostResponse } from "@/features/post/post.type";

export type SelectOptions = {
  techStack: SelectOption[];
  recruitPosit: SelectOption[];
  progress: SelectOption[];
  recruit: SelectOption[];
};

export default function PostList({ data }: { data: PostResponse[] }) {
  /**
   * 게시글 목록을 조회하는 React Query 훅을 사용하여 데이터를 가져옵니다.
   */

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        {/* <SearchHeader selectOptions={selectOptions} onSearch={handleSearch} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-16">
          {data?.map((item) => {
            return <Card key={item.postId} data={item} />;
          })}
        </div>
      </div>
    </>
  );
}
