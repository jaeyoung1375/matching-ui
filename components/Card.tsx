import { PostResponseDto } from "@/features/post/post.type";
import { formatDate } from "@/util/dateUtil";
import Image from "next/image";

export type PostCardProps = {
  list: PostResponseDto;
};

export default function Card({ list }: PostCardProps) {
  const data = {
    type: "프로젝트",
    status: "따끈따끈 새 글",
    deadline: "2026.04.30",
    title: "순환 패션 플랫폼 LEAFIT — 팀원 모집",
    position: "마케터",
    thumbnail: "/flutter.png",
    author: "pukaworks",
    views: 3,
    comments: 0,
  };

  return (
    <div className="w-65 rounded-2xl border p-4 bg-white shadow-sm hover:shadow-md transition">
      {/* 상단 뱃지 */}
      <div className="flex gap-2 mb-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          📁 {list.recruitTypeNm} {/* 프로젝트/스터디 */}
        </span>

        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
          {data.status}
        </span>
      </div>

      {/* 마감일 */}
      <div className="text-xs text-gray-400 mb-2">
        마감일 | {formatDate(list.recruitEndDate)}
      </div>

      {/* 제목 */}
      <div className="font-semibold text-sm mb-3 line-clamp-2">
        {list.title}
      </div>

      {/* 포지션 */}
      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
        {list.recruitPositTypeNm}
      </span>

      {/* 썸네일 */}
      <div className="my-4 flex gap-2">
        {list.techStack?.split(",").map((item) => (
          <div
            key={item}
            className="relative w-8 h-8 border-2 border-white rounded-full"
          >
            <Image
              src={`https://skillicons.dev/icons?i=${item.toLowerCase()}`}
              alt={""}
              fill
              className="rounded-full object-cover gap-2"
              unoptimized
            />
          </div>
        ))}
      </div>

      <hr />

      {/* 하단 */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span>{list.userId}</span>
        </div>

        <div className="flex gap-3">
          <span>👁 {list.viewCnt}</span>
          <span>💬 {data.comments}</span>
        </div>
      </div>
    </div>
  );
}
