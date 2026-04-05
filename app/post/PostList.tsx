"use client";
import Card from "@/components/Card";
import { usePostListQuery } from "@/features/post/post.query";
import SearchHeader from "./SearchHeader";
import { SelectOption } from "@/components/SelectBox";
import { useEffect, useState } from "react";
import { CommonCode } from "@/features/common/commonCode";
import { fetchCodeList } from "@/features/code/code.api";
import { codeToSelectOption } from "@/util/CommonUtil";
import { PostRequest } from "@/features/post/post.type";

export type SelectOptions = {
  techStack: SelectOption[];
  recruitPosit: SelectOption[];
  progress: SelectOption[];
  recruit: SelectOption[];
};

export default function PostList() {
  /**
   * 게시글 목록을 조회하는 React Query 훅을 사용하여 데이터를 가져옵니다.
   */
  const { data: postList } = usePostListQuery();
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({
    techStack: [],
    recruitPosit: [],
    progress: [],
    recruit: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const codeList = await fetchCodeList([
        CommonCode.TECH_STACK,
        CommonCode.RECRUIT_POSIT_TYPE,
        CommonCode.PROGRESS_TYPE,
        CommonCode.RECRUIT_TYPE,
      ]);

      setSelectOptions({
        techStack: codeToSelectOption(codeList.TECH_STACK ?? []),
        recruitPosit: codeToSelectOption(
          codeList.RECRUIT_POSIT_TYPE_CD ?? [],
          true,
        ),
        progress: codeToSelectOption(codeList.PROGRESS_TYPE_CD ?? [], true),
        recruit: codeToSelectOption(codeList.RECRUIT_TYPE_CD ?? [], true),
      });
    };

    fetchData();
  }, []);

  const [search, setSearch] = useState<PostRequest>();

  const { data: post } = usePostListQuery(search);

  const handleSearch = (formData: PostRequest) => {
    setSearch(formData);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <SearchHeader selectOptions={selectOptions} onSearch={handleSearch} />
        <div className="grid grid-cols-4 gap-4 mt-16">
          {post?.map((item) => {
            return <Card key={item.postId} list={item} />;
          })}
        </div>
      </div>
    </>
  );
}
