import Banner from "@/components/Banner";
import PostList from "./post/PostList";
import { CommonCode } from "@/features/common/commonCode";
import { fetchCodeList } from "@/features/code/code.api";
import { codeToSelectOption } from "@/util/CommonUtil";

export default function Home() {
  return (
    <>
      <Banner
        list={[
          {
            image:
              "https://hola-post-image.s3.ap-northeast-2.amazonaws.com/ad/hola-event_2024-08-12_22-03-40.png",
            link: "https://google.com",
          },
          {
            image:
              "https://hola-post-image.s3.ap-northeast-2.amazonaws.com/ad/hola-event_2024-04-29_10-51-50.png",
            link: "https://naver.com",
          },
        ]}
      />
      <PostList />
    </>
  );
}
