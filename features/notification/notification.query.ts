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
    onMutate: async (notificationId) => {
      await qc.cancelQueries({ queryKey: notificationQueryKeys.all });

      const previousNotifications = qc.getQueryData<NotificationResponse[]>(
        notificationQueryKeys.list(),
      );
      const previousUnreadCount = qc.getQueryData<number>(
        notificationQueryKeys.unreadCount(),
      );

      qc.setQueryData<NotificationResponse[]>(
        notificationQueryKeys.list(),
        (notifications) =>
          notifications?.filter((notification) => {
            const id = notification.notificationId ?? notification.id;

            return id === undefined || id !== notificationId;
          }),
      );
      qc.setQueryData<number>(
        notificationQueryKeys.unreadCount(),
        (count) => Math.max((count ?? 1) - 1, 0),
      );

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_error, _notificationId, context) => {
      qc.setQueryData(
        notificationQueryKeys.list(),
        context?.previousNotifications,
      );
      qc.setQueryData(
        notificationQueryKeys.unreadCount(),
        context?.previousUnreadCount,
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationQueryKeys.all });

      const previousNotifications = qc.getQueryData<NotificationResponse[]>(
        notificationQueryKeys.list(),
      );
      const previousUnreadCount = qc.getQueryData<number>(
        notificationQueryKeys.unreadCount(),
      );

      qc.setQueryData<NotificationResponse[]>(notificationQueryKeys.list(), []);
      qc.setQueryData(notificationQueryKeys.unreadCount(), 0);

      return { previousNotifications, previousUnreadCount };
    },
    onError: (_error, _variables, context) => {
      qc.setQueryData(
        notificationQueryKeys.list(),
        context?.previousNotifications,
      );
      qc.setQueryData(
        notificationQueryKeys.unreadCount(),
        context?.previousUnreadCount,
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
    },
  });
};
