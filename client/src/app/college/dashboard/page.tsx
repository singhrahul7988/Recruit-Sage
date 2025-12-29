"use client";
import React, { useState } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import {
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Search,
  ChevronDown,
  ArrowUpRight,
  CalendarCheck,
  ClipboardList
} from "lucide-react";
import { useRouter } from "next/navigation";
import TopBarActions from "../../../components/TopBarActions";

export default function CollegeDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");

  const stats = [
    { title: "Total Students", value: "842", change: "+12%", icon: Users, color: "blue" },
    { title: "Job Profiles", value: "156", change: "+4", icon: Briefcase, color: "green" },
    { title: "Total Offers", value: "328", change: "45%", icon: CheckCircle, color: "amber" },
    { title: "Placed Students", value: "294", change: "35%", icon: TrendingUp, color: "purple" },
  ];

  const analytics = [
    { label: "CSE", eligible: 150, placed: 110 },
    { label: "ECE", eligible: 120, placed: 100 },
    { label: "ME", eligible: 100, placed: 40 },
    { label: "CE", eligible: 80, placed: 28 },
    { label: "IT", eligible: 108, placed: 85 },
    { label: "EEE", eligible: 90, placed: 48 },
    { label: "CHEM", eligible: 60, placed: 20 },
  ];

  const upcomingDrives = [
    { company: "Google", role: "SDE I", date: "Oct 24", status: "Open" },
    { company: "Amazon", role: "Cloud Associate", date: "Oct 26", status: "Review" },
    { company: "Microsoft", role: "Data Analyst", date: "Oct 28", status: "Scheduled" },
  ];

  const actionItems = [
    { title: "Resume submission deadline", detail: "Google drives resume list due by 5 PM.", tag: "2 left" },
    { title: "Pre-placement talk: Cisco", detail: "Mandatory for all CS students.", tag: "Today" },
  ];

  const chartMax = 160;
  const chartHeight = 220;
  const chartLabelHeight = 24;
  const chartTicks = [160, 140, 120, 100, 80, 60, 40, 20, 0];
  const scaleValue = (value: number) => (value / chartMax) * chartHeight;

  const term = searchTerm.trim().toLowerCase();
  const filteredDrives = upcomingDrives.filter((drive) => {
    if (!term) return true;
    return `${drive.company} ${drive.role}`.toLowerCase().includes(term);
  });

  const filteredActions = actionItems.filter((item) => {
    if (!term) return true;
    return `${item.title} ${item.detail}`.toLowerCase().includes(term);
  });

  const handleExport = () => {
    const header = ["Company", "Role", "Date", "Status"];
    const rows = upcomingDrives.map((drive) => [drive.company, drive.role, drive.date, drive.status]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college_overview.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Placement Overview</h1>
            <p className="text-sm text-slate-500">Welcome back, here is what is happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search..."
                className="outline-none text-sm w-40 text-slate-600"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/college/settings" />
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "Overview" ? "bg-white border-slate-200 text-blue-600 font-semibold" : "text-slate-500 hover:bg-white border-transparent"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("Trends")}
            className={`text-sm px-3 py-1.5 rounded-lg hover:bg-white ${
              activeTab === "Trends" ? "text-blue-600 font-semibold" : "text-slate-500"
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab("Companies")}
            className={`text-sm px-3 py-1.5 rounded-lg hover:bg-white ${
              activeTab === "Companies" ? "text-blue-600 font-semibold" : "text-slate-500"
            }`}
          >
            Companies
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
              Class of 2024 <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
              All Departments <ChevronDown size={14} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm"
            >
              Export
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-500">{stat.title}</div>
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                  stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                  stat.color === "green" ? "bg-emerald-50 text-emerald-600" :
                  stat.color === "amber" ? "bg-amber-50 text-amber-600" :
                  "bg-purple-50 text-purple-600"
                }`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
              <div className="text-xs text-emerald-500 mt-1">{stat.change} vs last year</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Placement Analytics</h3>
                <p className="text-xs text-slate-500">Comparison of eligible vs placed students across departments.</p>
              </div>
              <div className="flex items-center gap-4 text-xs bg-white border border-slate-200 rounded-full px-4 py-2">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]"></span> 
                  <span className="text-slate-600">Eligible</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]"></span> 
                  <span className="text-slate-600">Placed</span>
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[40px_1fr] gap-6">
              <div className="flex flex-col justify-between text-[11px] text-slate-400" style={{ height: `${chartHeight}px` }}>
                {chartTicks.map((value) => (
                  <div key={value} className="text-right">{value}</div>
                ))}
              </div>
              <div>
                <div className="relative" style={{ height: `${chartHeight}px` }}>
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {chartTicks.map((value) => (
                      <div key={value} className="border-b border-slate-200"></div>
                    ))}
                  </div>
                  <div className="relative flex items-end gap-4 px-1 h-full">
                    {analytics.map((item) => (
                      <div key={item.label} className="flex items-end justify-center flex-1">
                        <div className="flex items-end justify-center gap-4 w-full">
                          <div
                            className="w-4 rounded-t-sm bg-[#2563EB]"
                            style={{ height: `${scaleValue(item.eligible)}px` }}
                          ></div>
                          <div
                            className="w-4 rounded-t-sm bg-[#10B981]"
                            style={{ height: `${scaleValue(item.placed)}px` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 border-t border-slate-200"></div>
                <div className="mt-2 flex items-center gap-4 px-1" style={{ height: `${chartLabelHeight}px` }}>
                  {analytics.map((item) => (
                    <span key={item.label} className="flex-1 text-center text-xs text-slate-500">
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Salary Packages</h3>
            <p className="text-xs text-slate-500 mt-1">Distribution by LPA</p>

            <div className="mt-6 flex flex-col items-center">
              <div className="relative h-36 w-36 rounded-full border-[10px] border-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[10px] border-blue-500 border-t-emerald-400 border-r-blue-400"></div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Avg</div>
                  <div className="text-lg font-semibold text-slate-900">8.5 L</div>
                </div>
              </div>

              <div className="mt-6 w-full space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span> &gt; 15 LPA <span className="ml-auto text-slate-700">12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400"></span> 10 - 15 LPA <span className="ml-auto text-slate-700">28%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span> 5 - 10 LPA <span className="ml-auto text-slate-700">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Upcoming Campus Drives</h3>
                <p className="text-xs text-slate-500">Next 7 days schedule</p>
              </div>
              <button
                onClick={() => router.push("/college/drives")}
                className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {filteredDrives.map((drive) => (
                <div key={drive.company} className="flex items-center justify-between text-sm border border-slate-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                      {drive.company[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{drive.company}</div>
                      <div className="text-xs text-slate-500">{drive.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">{drive.date}</div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    drive.status === "Open" ? "bg-emerald-50 text-emerald-600" :
                    drive.status === "Review" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    {drive.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Action Items</h3>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-slate-400"
                aria-label="Clear search filters"
                title="Clear search filters"
              >
                <ClipboardList size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {filteredActions.map((item) => (
                <div key={item.title} className="border border-slate-100 rounded-lg px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CalendarCheck size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                      <span className="inline-flex mt-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
}
