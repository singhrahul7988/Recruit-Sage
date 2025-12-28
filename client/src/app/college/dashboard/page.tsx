"use client";
import React from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import {
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Search,
  Bell,
  Moon,
  ChevronDown,
  ArrowUpRight,
  CalendarCheck,
  ClipboardList
} from "lucide-react";

export default function CollegeDashboard() {
  const stats = [
    { title: "Total Students", value: "842", change: "+12%", icon: Users, color: "blue" },
    { title: "Job Profiles", value: "156", change: "+4", icon: Briefcase, color: "green" },
    { title: "Total Offers", value: "328", change: "45%", icon: CheckCircle, color: "amber" },
    { title: "Placed Students", value: "294", change: "35%", icon: TrendingUp, color: "purple" },
  ];

  const analytics = [
    { label: "CSE", eligible: 120, placed: 95 },
    { label: "ECE", eligible: 98, placed: 72 },
    { label: "ME", eligible: 80, placed: 50 },
    { label: "CE", eligible: 70, placed: 38 },
    { label: "IT", eligible: 88, placed: 62 },
    { label: "EEE", eligible: 60, placed: 41 },
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
              />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-blue-600 font-semibold">
            Overview
          </div>
          <button className="text-sm text-slate-500 px-3 py-1.5 rounded-lg hover:bg-white">
            Trends
          </button>
          <button className="text-sm text-slate-500 px-3 py-1.5 rounded-lg hover:bg-white">
            Companies
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
              Class of 2024 <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
              All Departments <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm">
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Placement Analytics</h3>
                <p className="text-xs text-slate-500">Eligible vs placed students by department</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span> Eligible
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Placed
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 items-end h-48">
              {analytics.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="w-full flex items-end gap-1 h-32">
                    <div className="flex-1 bg-blue-500 rounded-t-md" style={{ height: `${item.eligible}px` }}></div>
                    <div className="flex-1 bg-emerald-500 rounded-t-md" style={{ height: `${item.placed}px` }}></div>
                  </div>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Salary Packages</h3>
            <div className="flex items-center gap-6">
              <div className="relative h-28 w-28 rounded-full border-8 border-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-slate-400">Avg</div>
                  <div className="text-lg font-semibold text-slate-900">8.5 L</div>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span> {"> 15 LPA"} <span className="ml-auto text-slate-700">12%</span>
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
              <button className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {upcomingDrives.map((drive) => (
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
              <button className="text-slate-400">
                <ClipboardList size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {actionItems.map((item) => (
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
