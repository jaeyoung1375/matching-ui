import { Users, FileText, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "총 회원수",
    value: "1,284",
    desc: "전체 가입 회원",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "게시글 수",
    value: "3,412",
    desc: "등록된 게시글",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "스터디 그룹",
    value: "142",
    desc: "활성 스터디 그룹",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "이번달 신규 회원",
    value: "98",
    desc: "이번달 가입자",
    icon: TrendingUp,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">안녕하세요, 관리자님</h2>
        <p className="text-sm text-gray-500 mt-1">
          Teamo 스터디 커뮤니티 운영 현황입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, desc, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
