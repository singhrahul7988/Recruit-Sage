"use client";
import React from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import { Search, Bell, Moon, ArrowUpRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function InterviewsPage() {
  const interviews = [
    { time: "09:30 AM", duration: "60 min", name: "Rohan Das", role: "Senior Frontend Engineer", status: "Live Now" },
    { time: "11:00 AM", duration: "45 min", name: "Kavya Sharma", role: "Product Designer", status: "Scheduled" },
    { time: "02:00 PM", duration: "30 min", name: "Amit Patel", role: "Backend Intern", status: "Confirmed" },
  ];

  const feedbackRequired = [
    { name: "Arjun Reddy", time: "Yesterday, 4:00 PM" },
    { name: "Priya Singh", time: "Oct 24, 11:00 AM" },
  ];

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Interview Schedule</h1>
            <span className="text-sm text-slate-400">October 2023</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Week 43</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input placeholder="Search candidate or job..." className="outline-none text-sm w-48 text-slate-600" />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
              Schedule Interview <ArrowUpRight size={14} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <div className="text-sm font-semibold text-slate-700">Today, October 26</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                  <ChevronLeft size={16} />
                </button>
                <button className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.name} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-slate-400 w-20">{interview.time}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{interview.name}</div>
                        <div className="text-xs text-slate-500">{interview.role}</div>
                        <div className="text-xs text-slate-400">{interview.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        interview.status === "Live Now" ? "bg-emerald-50 text-emerald-600" :
                        interview.status === "Scheduled" ? "bg-blue-50 text-blue-600" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {interview.status}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600">
                        Join Meeting
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-slate-800">October 2023</div>
                <div className="flex items-center gap-2">
                  <button className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
                {Array.from({ length: 31 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-7 w-7 rounded-full flex items-center justify-center mx-auto ${
                      index + 1 === 26 ? "bg-blue-600 text-white" : "text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-800 mb-3">Feedback Required</div>
              <div className="space-y-3">
                {feedbackRequired.map((item) => (
                  <div key={item.name} className="border border-slate-100 rounded-xl p-3">
                    <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                    <button className="mt-3 w-full px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold">
                      Submit Scorecard
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm">
              <div className="text-sm font-semibold mb-2">Schedule Sync</div>
              <p className="text-xs text-blue-100 mb-4">Review availability for next week interviews.</p>
              <button className="w-full bg-white text-blue-700 rounded-lg py-2 text-sm font-semibold">
                Check Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
