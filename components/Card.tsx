export type PostCardProps = {
  type: string; // 프로젝트
  status: string; // 따끈따끈 새 글
  deadline: string; // 마감일
  title: string;
  position: string; // 마케터
  thumbnail?: string;
  author: string;
  views: number;
  comments: number;
};

type Props = {
  data: PostCardProps;
};

export default function Card({ data }: Props) {
  data = {
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
    <div className="w-[260px] rounded-2xl border p-4 bg-white shadow-sm hover:shadow-md transition">
      {/* 상단 뱃지 */}
      <div className="flex gap-2 mb-2">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          📁 {data.type}
        </span>

        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
          {data.status}
        </span>
      </div>

      {/* 마감일 */}
      <div className="text-xs text-gray-400 mb-2">마감일 | {data.deadline}</div>

      {/* 제목 */}
      <div className="font-semibold text-sm mb-3 line-clamp-2">
        {data.title}
      </div>

      {/* 포지션 */}
      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
        {data.position}
      </span>

      {/* 썸네일 */}
      <div className="my-4">
        {data.thumbnail && (
          <img src={data.thumbnail} className="w-10 h-10 rounded-full" />
        )}
      </div>

      <hr />

      {/* 하단 */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span>{data.author}</span>
        </div>

        <div className="flex gap-3">
          <span>👁 {data.views}</span>
          <span>💬 {data.comments}</span>
        </div>
      </div>
    </div>
  );
}
