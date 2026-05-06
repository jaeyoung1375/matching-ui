// 예외처리 타입
export type ApiError = {
  code: string;
  message: string;
  data: unknown;
};

// 페이징 타입

export type PageResponse<T> = {
  data: T[];
  pageSize: number;
  pages: number;
  pageNum: number;
  total: number;
  startRow: number;
};
