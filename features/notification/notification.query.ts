import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.api";
import { NotificationResponse } from "./notification.type";
import { ApiError } from "../common/types/common.type";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationQueryKeys.all, "list"] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
};

export const useNotificationsQuery = (enabled = true) =>
  useQuery<NotificationResponse[], ApiError>({
    queryKey: notificationQueryKeys.list(),
    queryFn: fetchNotifications,
    enabled,
  });

export const useUnreadNotificationCountQuery = (enabled = true) =>
  useQuery<number, ApiError>({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: fetchUnreadNotificationCount,
    enabled,
    refetchInterval: 60_000,
  });

export const useMarkNotificationAsReadMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: (_data, notificationId) => {
      qc.setQueryData<NotificationResponse[]>(
        notificationQueryKeys.list(),
        (notifications) =>
          notifications?.map((notification) => {
            const id = notification.notificationId ?? notification.id;

            if (id !== undefined && id === notificationId) {
              return { ...notification, isRead: true, read: true };
            }

            return notification;
          }),
      );
      qc.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      qc.setQueryData<NotificationResponse[]>(
        notificationQueryKeys.list(),
        (notifications) =>
          notifications?.map((notification) => ({
            ...notification,
            isRead: true,
            read: true,
          })),
      );
      qc.setQueryData(notificationQueryKeys.unreadCount(), 0);
      qc.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};
