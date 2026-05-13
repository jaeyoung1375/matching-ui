"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/features/comment/comment.type";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "@/features/comment/comment.api";
import { useAuth } from "@/app/context/AuthContext";
import { useAlertStore } from "@/store/alertStore";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const setAlert = useAlertStore((state) => state.setAlert);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 댓글 전체 건수 (루트 + 대댓글)
  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.children?.length ?? 0),
    0,
  );

  // 댓글 목록 불러오기
  const loadComments = async () => {
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch {
      // 로드 실패 시 빈 배열 유지
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // 댓글 작성 (parentId = null)
  const handleAddComment = async (content: string) => {
    if (!user) {
      setAlert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }
    try {
      await createComment(postId, { content, parentId: null });
      await loadComments();
    } catch {
      setAlert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 댓글/대댓글 삭제 (USE_YN = 'N' 처리)
  const handleDeleteComment = async (commentId: number) => {
    setAlert("댓글을 삭제하시겠습니까?", async () => {
      try {
        await deleteComment(postId, commentId);
        await loadComments();
      } catch {
        setAlert("댓글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  // 대댓글 작성 (parentId = 부모 commentId)
  const handleAddReply = async (parentId: number, content: string) => {
    if (!user) {
      setAlert("로그인 후 답글을 작성할 수 있습니다.");
      return;
    }
    try {
      await createComment(postId, { content, parentId });
      await loadComments();
    } catch {
      setAlert("답글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-neutral-200/70 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-neutral-700" />
        <h2 className="text-[16px] font-bold text-neutral-900">
          댓글{" "}
          <span className="text-orange-400 font-extrabold">{totalCount}</span>
        </h2>
      </div>

      {/* 댓글 입력 */}
      {user ? (
        <div className="mb-5">
          <CommentInput
            placeholder="댓글을 입력해주세요."
            onSubmit={handleAddComment}
          />
        </div>
      ) : (
        <div className="mb-5 rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm text-neutral-400 text-center">
          로그인 후 댓글을 작성할 수 있습니다.
        </div>
      )}

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="py-6 text-center text-sm text-neutral-400">
          댓글을 불러오는 중...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-neutral-400">
          첫 번째 댓글을 남겨보세요!
        </div>
      ) : (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              postId={postId}
              onDeleteComment={handleDeleteComment}
              onAddReply={handleAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
