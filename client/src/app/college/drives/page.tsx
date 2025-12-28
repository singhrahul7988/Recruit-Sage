"use client";
import React, { useState, useEffect } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import { Search, ChevronDown, Bell, Moon, MoreHorizontal } from "lucide-react";
import api from "@/lib/api";

export default function PlacementCalendar() {
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) return;
        const user = JSON.parse(storedUser);
        const collegeId = user.role === 'college' ? user._id : user.collegeId;

        const { data } = await api.get(`/api/jobs/feed/${collegeId}`);
        setDrives(data);
      } catch (error) {
        console.error("Error loading drives");
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const ctcValues = drives
    .map((drive) => parseFloat(String(drive.ctc || "").replace(/[^0-9.]/g, "")))
    .filter((value) => !Number.isNaN(value));
  const avgCtc = ctcValues.length ? (ctcValues.reduce((sum, val) => sum + val, 0) / ctcValues.length).toFixed(1) : "0";
  const maxCtc = ctcValues.length ? Math.max(...ctcValues).toFixed(1) : "0";
  const pendingOffers = drives.filter((drive) => drive.status !== "Open").length;

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">All Placements</h1>
            <p className="text-sm text-slate-500">Class of 2024</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Live Season
            </span>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search by student, company, or role..."
              className="outline-none text-sm w-64 text-slate-600"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            All Statuses <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            All Departments <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            CTC Range <ChevronDown size={14} />
          </button>
          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Add Record
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Total Drives</div>
            <div className="text-2xl font-semibold text-slate-900">{drives.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Avg. Package</div>
            <div className="text-2xl font-semibold text-slate-900">Rs {avgCtc} L</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Highest Package</div>
            <div className="text-2xl font-semibold text-slate-900">Rs {maxCtc} L</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Pending Offers</div>
            <div className="text-2xl font-semibold text-slate-900">{pendingOffers}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 text-xs text-slate-500">
            <span>Student Details</span>
            <span>Showing 1-10 of {drives.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-4">Company & Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">CTC (LPA)</th>
                  <th className="p-4">Offer Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading records...</td></tr>
                ) : drives.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No placements yet.</td></tr>
                ) : (
                  drives.map((drive) => (
                    <tr key={drive._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{drive.companyId?.name || "Company"}</div>
                        <div className="text-xs text-slate-500">{drive.title}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {drive.criteria?.branches?.[0] || "All"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{drive.ctc || "N/A"}</td>
                      <td className="p-4 text-slate-500">
                        {drive.deadline ? new Date(drive.deadline).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          drive.status === "Open" ? "bg-emerald-50 text-emerald-600" :
                          drive.status === "Interviewing" ? "bg-amber-50 text-amber-600" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
}
