"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  read?: boolean;
};

type TopBarActionsProps = {
  settingsPath: string;
  notifications?: NotificationItem[];
  showSettings?: boolean;
  showNotifications?: boolean;
};

const defaultNotifications: NotificationItem[] = [
  {
    id: "notice-1",
    title: "New request received",
    detail: "A partner sent a new drive request.",
    time: "2h ago",
  },
  {
    id: "notice-2",
    title: "Report ready",
    detail: "Placement summary report finished generating.",
    time: "Yesterday",
  },
  {
    id: "notice-3",
    title: "Upcoming deadline",
    detail: "Interview slot confirmations due today.",
    time: "Today",
  },
];

export default function TopBarActions({
  settingsPath,
  notifications = defaultNotifications,
  showSettings = true,
  showNotifications = true,
}: TopBarActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(notifications);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-3">
      {showSettings && (
        <button
          type="button"
          onClick={() => router.push(settingsPath)}
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
          aria-label="Open appearance settings"
          title="Appearance settings"
        >
          <Moon size={16} />
        </button>
      )}
      {showNotifications && (
        <>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-slate-200 bg-white shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div className="text-sm font-semibold text-slate-800">Notifications</div>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-blue-600 font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="px-4 py-6 text-xs text-slate-500 text-center">
                    No new notifications.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`px-4 py-3 border-b border-slate-100 ${
                        item.read ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.detail}</div>
                      <div className="text-[11px] text-slate-400 mt-2">{item.time}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 text-right">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs text-slate-500 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
