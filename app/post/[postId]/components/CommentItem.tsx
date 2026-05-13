"use client";

import { useState } from "react";
import { Comment } from "@/features/comment/comment.type";
import CommentInput from "./CommentInput";
import { Trash2, CornerDownRight } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onDeleteComment: (commentId: number) => Promise<void>;
  onAddReply: (parentId: number, content: string) => Promise<void>;
}

// 날짜 포맷 (REG_DT: Oracle DATE → ISO 문자열 또는 타임스탬프)
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// 아바타
function Avatar({
  name,
  profileImageUrl,
  size = "md",
}: {
  name: string;
  profileImageUrl?: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";

  if (profileImageUrl) {
    const src = profileImageUrl.startsWith("http")
      ? profileImageUrl
      : `${BASE_URL}${profileImageUrl}`;

    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-orange-100 text-orange-500 font-bold flex items-center justify-center shrink-0`}
    >
      {name[0]}
    </div>
  );
}

// 대댓글 아이템 (Comment 타입 재사용, parentId !== null)
function ReplyItem({
  reply,
  onDelete,
}: {
  reply: Comment;
  onDelete: () => Promise<void>;
}) {
  return (
    <div className="flex gap-2.5">
      <CornerDownRight size={14} className="text-neutral-300 mt-1 shrink-0" />
      <Avatar name={reply.userName} profileImageUrl={reply.profileImageUrl} size="sm" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-800">{reply.userName}</span>
            <span className="text-xs text-neutral-400">{formatDate(reply.regDt)}</span>
          </div>
          {reply.isOwner && (
            <button
              type="button"
              onClick={onDelete}
              className="text-neutral-300 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{reply.content}</p>
      </div>
    </div>
  );
}

export default function CommentItem({
  comment,
  postId,
  onDeleteComment,
  onAddReply,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleAddReply = async (content: string) => {
    await onAddReply(comment.commentId, content);
    setShowReplyInput(false);
  };

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-neutral-100 last:border-none">
      {/* 댓글 본문 */}
      <div className="flex gap-3">
        <Avatar name={comment.userName} profileImageUrl={comment.profileImageUrl} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-800">{comment.userName}</span>
              <span className="text-xs text-neutral-400">{formatDate(comment.regDt)}</span>
            </div>
            {comment.isOwner && (
              <button
                type="button"
                onClick={() => onDeleteComment(comment.commentId)}
                className="text-neutral-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{comment.content}</p>

          {/* 답글 달기 버튼 */}
          <button
            type="button"
            onClick={() => setShowReplyInput((v) => !v)}
            className="mt-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 transition-colors"
          >
            {showReplyInput ? "취소" : "답글 달기"}
          </button>
        </div>
      </div>

      {/* 대댓글 목록 (children: Comment[], parentId !== null) */}
      {comment.children && comment.children.length > 0 && (
        <div className="flex flex-col gap-3 pl-12">
          {comment.children.map((reply) => (
            <ReplyItem
              key={reply.commentId}
              reply={reply}
              onDelete={() => onDeleteComment(reply.commentId)}
            />
          ))}
        </div>
      )}

      {/* 대댓글 입력창 */}
      {showReplyInput && (
        <CommentInput
          placeholder="답글을 입력해주세요."
          buttonLabel="답글 등록"
          onSubmit={handleAddReply}
          onCancel={() => setShowReplyInput(false)}
          isReply
        />
      )}
    </div>
  );
}
