"use client";
import React from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import { Search, Bell, Moon, ArrowUpRight, CalendarClock, Users, ClipboardCheck, Timer } from "lucide-react";

export default function CandidatesPage() {
  const stats = [
    { title: "Total Candidates", value: "1,248", change: "+12%", icon: Users, color: "blue" },
    { title: "Offer Acceptance", value: "86%", change: "Steady", icon: ClipboardCheck, color: "purple" },
    { title: "Avg. Time to Hire", value: "14d", change: "2 days faster", icon: Timer, color: "amber" },
  ];

  const pipeline = [
    {
      title: "Applied",
      count: 24,
      cards: [
        { name: "Rohan Das", meta: "BITS Pilani '24", tags: ["Java", "React"], time: "2h ago", badge: "New" },
        { name: "Kavya Sharma", meta: "IIT Delhi '23", tags: ["Python", "Django"], time: "5h ago" },
      ],
    },
    {
      title: "Screening",
      count: 8,
      cards: [
        { name: "Amit Patel", meta: "VIT Vellore '24", score: "85/100", label: "Assessment Score" },
        { name: "Priya Singh", meta: "SRM '24", note: "Strong portfolio in UI/UX. Coding round pending." },
      ],
    },
    {
      title: "Interview",
      count: 4,
      cards: [
        { name: "Arjun Reddy", meta: "IIT Hyderabad", meeting: "Technical Round 1", time: "Today, 4:00 PM - 5:00 PM" },
      ],
    },
  ];

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Candidates</h1>
            <p className="text-sm text-slate-500">Software Engineer II</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input placeholder="Search by name, tag..." className="outline-none text-sm w-48 text-slate-600" />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
              New Job <ArrowUpRight size={14} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-500">{stat.title}</div>
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                      stat.color === "purple" ? "bg-purple-50 text-purple-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      <stat.icon size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-emerald-500 mt-1">{stat.change} vs last month</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {pipeline.map((stage) => (
                <div key={stage.title} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {stage.title} <span className="text-xs text-slate-400 ml-2">{stage.count}</span>
                    </div>
                    <button className="text-xs text-slate-400">...</button>
                  </div>
                  <div className="space-y-4">
                    {stage.cards.map((card) => (
                      <div key={card.name} className="border border-slate-100 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{card.name}</div>
                            <div className="text-xs text-slate-500">{card.meta}</div>
                          </div>
                          {card.badge && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{card.badge}</span>
                          )}
                        </div>
                        {card.tags && (
                          <div className="flex gap-2 mt-3">
                            {card.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {card.score && (
                          <div className="mt-3 text-xs text-slate-500">
                            {card.label}: <span className="font-semibold text-slate-700">{card.score}</span>
                          </div>
                        )}
                        {card.note && (
                          <div className="mt-3 text-xs text-slate-500">{card.note}</div>
                        )}
                        {card.meeting && (
                          <div className="mt-3 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg inline-block">
                            {card.meeting}
                          </div>
                        )}
                        {card.time && (
                          <div className="mt-2 text-xs text-slate-500">{card.time}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 h-fit shadow-sm">
            <div className="text-xs uppercase text-slate-400 mb-3">Upcoming Event</div>
            <div className="text-lg font-semibold text-slate-900 mb-1">Campus Drive at MIT</div>
            <div className="text-xs text-slate-500 mb-4">Tomorrow, 10:00 AM</div>
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold">
              View Schedule <ArrowUpRight size={14} />
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <CalendarClock size={14} /> 2 interviews scheduled
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
