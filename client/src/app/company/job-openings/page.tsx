"use client";
import React, { useEffect, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import {
  Search,
  Bell,
  Moon,
  ChevronDown,
  Filter,
  ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function JobOpenings() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const { data } = await api.get(`/api/jobs/company/${user._id}`);
        setJobs(data);
      } catch (error) {
        console.error("Failed to load job openings");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const activeJobs = jobs.filter((job) => job.status === "Open").length;
  const totalApplicants = jobs.length * 12 + 120;
  const closingSoon = jobs.filter((job) => {
    if (!job.deadline) return false;
    const days = (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  }).length;

  const quickStats = [
    { label: "Profile Views", value: "1,204", change: "+8%" },
    { label: "Application Rate", value: "14%", change: "+2%" },
  ];

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Job Openings</h1>
            <p className="text-sm text-slate-500">All jobs posted by your company.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input placeholder="Search positions..." className="outline-none text-sm w-48 text-slate-600" />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button
              onClick={() => router.push("/company/create-drive")}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Create Job <ArrowUpRight size={14} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Active Jobs</div>
            <div className="text-2xl font-semibold text-slate-900">{activeJobs}</div>
            <div className="text-xs text-emerald-500 mt-1">2 new this week</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Total Applicants</div>
            <div className="text-2xl font-semibold text-slate-900">{totalApplicants}</div>
            <div className="text-xs text-emerald-500 mt-1">+12% vs last month</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Closing Soon</div>
            <div className="text-2xl font-semibold text-slate-900">{closingSoon}</div>
            <div className="text-xs text-amber-500 mt-1">Require attention</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Avg. Time to Fill</div>
            <div className="text-2xl font-semibold text-slate-900">21d</div>
            <div className="text-xs text-emerald-500 mt-1">On track</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</div>
            <div className="space-y-4">
              {quickStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{stat.label}</span>
                    <span className="text-emerald-500">{stat.change}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{stat.value}</div>
                </div>
              ))}
            </div>
          </aside>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold text-slate-800">All Positions</div>
              <span className="text-xs text-slate-400">({jobs.length} total)</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
                  All Departments <ChevronDown size={14} />
                </button>
                <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
                  All Statuses <ChevronDown size={14} />
                </button>
                <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Job Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Applicants</th>
                    <th className="p-4">Posted Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading positions...</td></tr>
                  ) : jobs.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">No jobs posted yet.</td></tr>
                  ) : (
                    jobs.map((job, index) => (
                      <tr key={job._id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.location || "Remote"} - Full-time</div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {job.criteria?.branches?.[0] || "General"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{12 + index * 4}</td>
                        <td className="p-4 text-slate-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === "Open" ? "bg-emerald-50 text-emerald-600" :
                            job.status === "Interviewing" ? "bg-amber-50 text-amber-600" :
                            "bg-red-50 text-red-600"
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-slate-400">...</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
