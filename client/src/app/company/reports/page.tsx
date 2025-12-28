"use client";
import React from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import { BarChart3, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { title: "Hiring Funnel Summary", period: "Oct 2023", status: "Ready" },
    { title: "Offer Acceptance Report", period: "Sep 2023", status: "Ready" },
    { title: "Campus Drive Outcomes", period: "Q4 2023", status: "Draft" },
  ];

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
            <p className="text-sm text-slate-500">Download and review hiring analytics.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            Export Report <Download size={14} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Active Reports</div>
            <div className="text-2xl font-semibold text-slate-900">{reports.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Last Generated</div>
            <div className="text-2xl font-semibold text-slate-900">Oct 26</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Scheduled</div>
            <div className="text-2xl font-semibold text-slate-900">Weekly</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">
            Available Reports
          </div>
          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div key={report.title} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{report.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Calendar size={12} /> {report.period}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  report.status === "Ready" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
