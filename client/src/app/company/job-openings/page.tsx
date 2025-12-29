"use client";
import React, { useEffect, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import {
  Search,
  ChevronDown,
  Filter,
  ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import TopBarActions from "../../../components/TopBarActions";

type Job = {
  _id: string;
  title: string;
  location?: string;
  status?: string;
  deadline?: string;
  createdAt?: string;
  criteria?: {
    branches?: string[];
  };
};

export default function JobOpenings() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setErrorMsg("Session missing. Please log in again.");
          setLoading(false);
          return;
        }
        let user;
        try {
          user = JSON.parse(storedUser);
        } catch {
          setErrorMsg("Session data is corrupted. Please log in again.");
          setLoading(false);
          return;
        }
        const { data } = await api.get(`/api/jobs/company/${user._id}`);
        setJobs(data);
      } catch (error) {
        console.error("Failed to load job openings");
        setErrorMsg("Failed to load job openings. Please refresh.");
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

  const departments = Array.from(
    new Set(
      jobs
        .flatMap((job) => job?.criteria?.branches || [])
        .map((branch: string) => branch || "General")
    )
  );

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      job?.title?.toLowerCase().includes(term) ||
      job?.location?.toLowerCase().includes(term);

    const departmentValue = job?.criteria?.branches?.[0] || "General";
    const matchesDepartment = departmentFilter === "All" || departmentValue === departmentFilter;
    const matchesStatus = statusFilter === "All" || job?.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleCopyJobId = async (jobId: string) => {
    try {
      await navigator.clipboard.writeText(jobId);
      setActionMessage("Job ID copied to clipboard.");
    } catch {
      setActionMessage("Unable to copy job ID.");
    }
    setOpenMenuId(null);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setOpenMenuId(null);
  };

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
              <input
                placeholder="Search positions..."
                className="outline-none text-sm w-48 text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/company/settings" />
            <button
              onClick={() => router.push("/company/create-drive")}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Create Job <ArrowUpRight size={14} />
            </button>
          </div>
        </header>

        {actionMessage && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {actionMessage}
          </div>
        )}

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

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

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
                <div className="relative">
                  <select
                    className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Active</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setDepartmentFilter("All");
                    setStatusFilter("All");
                  }}
                  className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
                >
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
                  ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">No jobs posted yet.</td></tr>
                  ) : (
                    filteredJobs.map((job, index) => (
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
                        <td className="p-4 text-right">
                          <div className="relative inline-flex justify-end">
                            <button
                              type="button"
                              onClick={() => setOpenMenuId(openMenuId === job._id ? null : job._id)}
                              className="text-slate-400 hover:text-slate-600"
                              aria-label="Open job actions"
                            >
                              ...
                            </button>
                            {openMenuId === job._id && (
                              <div className="absolute right-0 top-7 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-20 text-left">
                                <button
                                  type="button"
                                  onClick={() => handleViewDetails(job)}
                                  className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  View details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyJobId(job._id)}
                                  className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  Copy job ID
                                </button>
                                <button
                                  type="button"
                                  onClick={() => router.push("/company/candidates")}
                                  className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  View candidates
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500">Job details</div>
                  <div className="text-lg font-semibold text-slate-800">{selectedJob.title}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="text-xs text-slate-500"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs text-slate-400">Location</div>
                  <div className="font-semibold text-slate-700">{selectedJob.location || "Remote"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <div className="font-semibold text-slate-700">{selectedJob.status || "Open"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Departments</div>
                  <div className="font-semibold text-slate-700">
                    {selectedJob.criteria?.branches?.join(", ") || "General"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Deadline</div>
                  <div className="font-semibold text-slate-700">
                    {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}
