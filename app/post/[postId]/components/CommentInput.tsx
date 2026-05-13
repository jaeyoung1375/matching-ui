"use client";

import { useState } from "react";

interface CommentInputProps {
  placeholder?: string;
  buttonLabel?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  isReply?: boolean;
}

export default function CommentInput({
  placeholder = "댓글을 입력해주세요.",
  buttonLabel = "등록",
  onSubmit,
  onCancel,
  isReply = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 ${isReply ? "pl-10 mt-2" : ""}`}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={isReply ? 2 : 3}
        className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none focus:border-orange-400 transition-colors"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-8 px-4 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="h-8 px-4 rounded-lg text-sm font-semibold bg-orange-400 text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "등록 중..." : buttonLabel}
        </button>
      </div>
    </div>
  );
}
