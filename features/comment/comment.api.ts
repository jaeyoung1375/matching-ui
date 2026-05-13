import { get, post, deleteData } from "@/util/AxiosUtil";
import { Comment, CreateCommentRequest } from "./comment.type";

export const fetchComments = (postId: number) =>
  get<Comment[]>(`/api/v1/public/posts/${postId}/comments`);

export const createComment = (postId: number, data: CreateCommentRequest) =>
  post<Comment>(`/api/v1/posts/${postId}/comments`, data);

export const deleteComment = (postId: number, commentId: number) =>
  deleteData<void>(`/api/v1/posts/${postId}/comments/${commentId}`);
