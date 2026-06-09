"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@/features/notification/notification.query";
import { NotificationResponse } from "@/features/notification/notification.type";

const getNotificationId = (notification: NotificationResponse) =>
  notification.notificationId ?? notification.id;

const getNotificationRead = (notification: NotificationResponse) =>
  notification.isRead ?? notification.read ?? false;

const getNotificationMessage = (notification: NotificationResponse) =>
  notification.content ?? notification.message ?? notification.title ?? "새 알림이 도착했습니다.";

const getNotificationTitle = (notification: NotificationResponse) =>
  notification.title ?? notification.type ?? "알림";

const getNotificationUrl = (notification: NotificationResponse) =>
  notification.linkUrl ?? notification.url;

const formatNotificationTime = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function NotificationDropdown() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const unreadCountQuery = useUnreadNotificationCountQuery();
  const notificationsQuery = useNotificationsQuery(open);
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();

  const unreadCount = unreadCountQuery.data ?? 0;
  const notifications = (notificationsQuery.data ?? []).filter(
    (notification) => !getNotificationRead(notification),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: NotificationResponse) => {
    const notificationId = getNotificationId(notification);
    const linkUrl = getNotificationUrl(notification);

    if (notificationId !== undefined && !getNotificationRead(notification)) {
      await markAsReadMutation.mutateAsync(notificationId);
    }

    if (linkUrl) {
      setOpen(false);
      router.push(linkUrl);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="알림"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 hover:bg-neutral-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-teamo px-1 text-[10px] font-bold leading-4 text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
          <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4">
            <h2 className="text-sm font-semibold text-neutral-900">알림</h2>
            <button
              type="button"
              disabled={
                notifications.length === 0 || markAllAsReadMutation.isPending
              }
              onClick={() => markAllAsReadMutation.mutate()}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />
              모두 읽음
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notificationsQuery.isLoading && (
              <div className="flex h-32 items-center justify-center text-neutral-500">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            {notificationsQuery.isError && (
              <div className="px-4 py-8 text-center text-sm text-neutral-500">
                알림을 불러오지 못했습니다.
              </div>
            )}

            {!notificationsQuery.isLoading &&
              !notificationsQuery.isError &&
              notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-500">
                  도착한 알림이 없습니다.
                </div>
              )}

            {!notificationsQuery.isLoading &&
              !notificationsQuery.isError &&
              notifications.map((notification) => {
                const notificationId = getNotificationId(notification);
                const isRead = getNotificationRead(notification);
                const createdAt = formatNotificationTime(notification.createdAt);

                return (
                  <button
                    key={notificationId ?? `${notification.title}-${notification.createdAt}`}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className="flex w-full gap-3 border-b border-neutral-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-neutral-50"
                  >
                    <span className="mt-1 flex h-2 w-2 shrink-0 items-center justify-center">
                      {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-teamo" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-neutral-900">
                        {getNotificationTitle(notification)}
                      </span>
                      <span className="mt-1 block line-clamp-2 text-sm leading-5 text-neutral-600">
                        {getNotificationMessage(notification)}
                      </span>
                      {createdAt && (
                        <span className="mt-1 block text-xs text-neutral-400">
                          {createdAt}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

