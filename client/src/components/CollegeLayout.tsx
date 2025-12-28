"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  BarChart3,
  PieChart,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  School
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CollegeLayout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Placement Lead");
  const [userEmail, setUserEmail] = useState("placement@college.edu");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "Placement Lead");
        setUserEmail(user.email || "placement@college.edu");
      } catch {
        setUserName("Placement Lead");
        setUserEmail("placement@college.edu");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const mainItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/college/dashboard" },
    { name: "Placements", icon: Briefcase, path: "/college/drives" },
    { name: "Students", icon: Users, path: "/college/students" },
    { name: "Companies", icon: Building2, path: "/college/partnerships" },
  ];

  const analyticsItems = [
    { name: "Reports", icon: BarChart3 },
    { name: "Statistics", icon: PieChart },
  ];

  const communicationItems = [
    { name: "Notices", icon: Bell },
    { name: "Team Talk", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 fixed left-0 top-0 h-screen z-50 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <School size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Recruit Sage</div>
            <div className="text-xs text-slate-500">Placement Cell</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-6">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main</div>
            <div className="space-y-1">
              {mainItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Analytics</div>
            <div className="space-y-1">
              {analyticsItems.map((item) => (
                <div
                  key={item.name}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Communication</div>
            <div className="space-y-1">
              {communicationItems.map((item) => (
                <div
                  key={item.name}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              {userName.split(" ").map((part: string) => part[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-700 truncate">{userName}</div>
              <div className="text-xs text-slate-400 truncate">{userEmail}</div>
            </div>
            <button onClick={() => router.push("/college/settings")} className="text-slate-400 hover:text-slate-600">
              <Settings size={16} />
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-72 relative">
        <div className="absolute top-4 right-6 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          College Dashboard
        </div>
        {children}
      </div>
    </div>
  );
}
