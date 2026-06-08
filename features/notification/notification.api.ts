import { get, patch } from "@/util/AxiosUtil";
import { NotificationResponse } from "./notification.type";

export const fetchNotifications = () =>
  get<NotificationResponse[]>("/api/v1/notifications");

export const fetchUnreadNotificationCount = () =>
  get<number>("/api/v1/notifications/unread-count");

export const markNotificationAsRead = (notificationId: number) =>
  patch<void>(`/api/v1/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
  patch<void>("/api/v1/notifications/read-all");

