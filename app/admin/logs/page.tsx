"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  FileClock,
  MonitorCog,
  RotateCcw,
  Search,
  ServerCog,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { useAdminLogListQuery } from "@/features/admin-log/admin-log.query";
import type { AdminLog, AdminLogType } from "@/features/admin-log/admin-log.type";

const PAGE_SIZE = 20;

const LOG_TABS: {
  type: AdminLogType;
  label: string;
  desc: string;
  icon: typeof ServerCog;
}[] = [
  {
    type: "BE",
    label: "BE 로그",
    desc: "백엔드 API 요청, 처리 상태, 서버 실행 로그",
    icon: ServerCog,
  },
  {
    type: "FE",
    label: "FE 로그",
    desc: "프론트 오류, 화면 렌더링, 브라우저 실행 로그",
    icon: MonitorCog,
  },
];

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isPageResponse(data: unknown): data is {
  content: AdminLog[];
  totalElements: number;
  totalPages: number;
} {
  return !!data && typeof data === "object" && "content" in data;
}

function getDetailValue(detailContent: string | undefined, key: string) {
  if (!detailContent) return undefined;

  return detailContent
    .split("\n")
    .find((line) => line.startsWith(`${key}=`))
    ?.slice(key.length + 1);
}

function getLogId(log: AdminLog) {
  return log.logId ?? log.id ?? "-";
}

function getActor(log: AdminLog) {
  return log.actorName ?? log.userName ?? log.adminName ?? "-";
}

function getActorMeta(log: AdminLog) {
  const id = log.actorId ?? log.userId ?? log.adminId;
  const email = log.actorEmail ?? log.email;

  return [id ? `ID ${id}` : null, email].filter(Boolean).join(" / ") || "-";
}

function getAction(log: AdminLog) {
  return log.action ?? log.actionCd ?? log.eventType ?? "-";
}

function getPath(log: AdminLog) {
  const method = log.method ?? getDetailValue(log.detailContent, "method");
  const uri = log.uri ?? log.requestUri ?? getDetailValue(log.detailContent, "uri");

  if (!method && !uri) return "-";
  return `${method ?? ""} ${uri ?? ""}`.trim();
}

function getTarget(log: AdminLog) {
  return log.target ?? log.targetId ?? log.logTypeCd ?? "-";
}

function isSelectedLogType(log: AdminLog, selectedType: AdminLogType) {
  return !log.logTypeCd || log.logTypeCd === selectedType;
}

function getIp(log: AdminLog) {
  return log.ip ?? log.ipAddress ?? "-";
}

function getMessage(log: AdminLog) {
  return log.message ?? log.detail ?? log.detailContent ?? "-";
}

function getCreatedAt(log: AdminLog) {
  return log.createdAt ?? log.createdDt ?? log.regDt ?? "-";
}

export default function AdminLogsPage() {
  const today = useMemo(() => formatDate(new Date()), []);
  const [logType, setLogType] = useState<AdminLogType>("BE");
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [dateInput, setDateInput] = useState({
    startDate: today,
    endDate: today,
  });
  const [filters, setFilters] = useState<{
    keyword?: string;
    startDate?: string;
    endDate?: string;
  }>({
    startDate: today,
    endDate: today,
  });

  const queryParams = useMemo(
    () => ({
      logType,
      page: page - 1,
      size: PAGE_SIZE,
      ...filters,
    }),
    [filters, logType, page],
  );

  const { data, isLoading, isFetching } = useAdminLogListQuery(queryParams);
  const rawLogs = Array.isArray(data) ? data : data?.content ?? [];
  const logs = rawLogs.filter((log) => isSelectedLogType(log, logType));
  const totalElements =
    isPageResponse(data) && logs.length === rawLogs.length
      ? data.totalElements
      : logs.length;
  const totalPages = isPageResponse(data)
    ? Math.max(data.totalPages, 1)
    : Math.max(logs.length === PAGE_SIZE ? page + 1 : page, 1);
  const activeTab = LOG_TABS.find((tab) => tab.type === logType) ?? LOG_TABS[0];

  const handleSearch = () => {
    setFilters({
      keyword: keywordInput.trim() || undefined,
      startDate: dateInput.startDate || undefined,
      endDate: dateInput.endDate || undefined,
    });
    setPage(1);
  };

  const handleReset = () => {
    setKeywordInput("");
    setDateInput({ startDate: today, endDate: today });
    setFilters({ startDate: today, endDate: today });
    setPage(1);
  };

  const handleTabChange = (nextType: AdminLogType) => {
    setLogType(nextType);
    setPage(1);
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileClock className="w-5 h-5 text-admin-primary" />
            <h2 className="text-xl font-bold text-gray-900">로그 관리</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            BE 로그와 FE 로그를 분류해서 조회합니다.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-right">
          <p className="text-xs text-gray-400">조회 결과</p>
          <p className="text-sm font-semibold text-gray-800">
            {totalElements.toLocaleString()}건
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LOG_TABS.map(({ type, label, desc, icon: Icon }) => {
          const selected = type === logType;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleTabChange(type)}
              className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-admin-primary ring-2 ring-blue-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? "bg-admin-soft text-admin-primary" : "bg-gray-50 text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">{label}</span>
                <span className="mt-0.5 block text-xs text-gray-500">{desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[240px] flex-1">
            <Input
              label="검색어"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              placeholder="사용자, 액션, 메시지, URI 검색"
              leftIcon={<Search className="h-4 w-4" />}
              className="!h-10 !rounded-lg !bg-white !py-0 focus:!border-admin-primary"
            />
          </div>
          <div className="w-[170px]">
            <Input
              label="시작일"
              type="date"
              value={dateInput.startDate}
              onChange={(event) =>
                setDateInput((prev) => ({ ...prev, startDate: event.target.value }))
              }
              leftIcon={<CalendarDays className="h-4 w-4" />}
              className="!h-10 !rounded-lg !bg-white !py-0 focus:!border-admin-primary"
            />
          </div>
          <div className="w-[170px]">
            <Input
              label="종료일"
              type="date"
              value={dateInput.endDate}
              onChange={(event) =>
                setDateInput((prev) => ({ ...prev, endDate: event.target.value }))
              }
              leftIcon={<CalendarDays className="h-4 w-4" />}
              className="!h-10 !rounded-lg !bg-white !py-0 focus:!border-admin-primary"
            />
          </div>
          <Button
            type="button"
            size="md"
            onClick={handleSearch}
            className="!h-10 !bg-admin-primary hover:!bg-admin-primary-hover"
          >
            검색
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
            className="!h-10 !bg-gray-100 !text-gray-700 hover:!bg-gray-200"
          >
            초기화
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{activeTab.label}</h3>
            <p className="text-xs text-gray-400">
              {isFetching ? "목록을 갱신하는 중입니다." : activeTab.desc}
            </p>
          </div>
        </div>

        <div className="h-[calc(100%-57px)] overflow-auto">
          <table className="w-full min-w-[1120px] text-sm">
            <thead className="sticky top-0 border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  로그 ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  수행자
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  액션
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  구분
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  요청
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  메시지
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  발생일시
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    로그를 불러오는 중입니다.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    조회된 로그가 없습니다.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={`${getLogId(log)}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {getLogId(log)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{getActor(log)}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{getActorMeta(log)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {getAction(log)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getTarget(log)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {getPath(log)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {getIp(log)}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3 text-gray-600">
                      {getMessage(log)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {getCreatedAt(log)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shrink-0 rounded-lg border border-gray-100 bg-white px-4 py-3">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
