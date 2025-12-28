"use client";
import React, { useEffect, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import {
  Search,
  Bell,
  Calendar,
  GraduationCap,
  Users,
  Briefcase,
  ChevronRight
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CampusDrivesPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if(!storedUser) return;
      const userId = JSON.parse(storedUser)._id;

      const [collegesRes, requestsRes] = await Promise.all([
        api.get("/api/network/search-colleges"),
        api.get(`/api/network/requests/${userId}`)
      ]);
      setColleges(collegesRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Failed to load campus drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatus = (collegeId: string) => {
    const req = requests.find((r) => r.recipientId._id === collegeId || r.requesterId._id === collegeId);
    return req ? req.status : null;
  };

  const handleConnect = async (collegeId: string) => {
    try {
      const storedUser = localStorage.getItem("user");
      if(!storedUser) return;
      const requesterId = JSON.parse(storedUser)._id;
      await api.post("/api/network/connect", { requesterId, recipientId: collegeId });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to connect");
    }
  };

  const activePartners = requests.filter((r) => r.status === "Active");
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  const upcomingDrives = activePartners.length || 0;
  const participatingColleges = activePartners.length || 0;
  const registeredStudents = participatingColleges * 120 + 3450;
  const offersRolledOut = participatingColleges * 5 + 142;

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Campus Drives</h1>
            <span className="text-sm text-slate-400">Overview</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">All Regions</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input placeholder="Search colleges, drives..." className="outline-none text-sm w-52 text-slate-600" />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
            <button
              onClick={() => router.push("/company/create-drive")}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Register New Drive
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+2 this week</span>
            </div>
            <div className="text-xs text-slate-500">Upcoming Drives</div>
            <div className="text-2xl font-semibold text-slate-900">{upcomingDrives}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap size={18} className="text-blue-500" />
              <span className="text-xs text-slate-400">This quarter</span>
            </div>
            <div className="text-xs text-slate-500">Participating Colleges</div>
            <div className="text-2xl font-semibold text-slate-900">{participatingColleges}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users size={18} className="text-blue-500" />
              <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">85% qualified</span>
            </div>
            <div className="text-xs text-slate-500">Registered Students</div>
            <div className="text-2xl font-semibold text-slate-900">{registeredStudents}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Briefcase size={18} className="text-blue-500" />
              <span className="text-xs text-slate-400">Current cycle</span>
            </div>
            <div className="text-xs text-slate-500">Offers Rolled Out</div>
            <div className="text-2xl font-semibold text-slate-900">{offersRolledOut}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-800">Upcoming Campus Drives</div>
                <div className="text-xs text-slate-500">Manage scheduled events for this quarter</div>
              </div>
              <button className="text-xs text-blue-600 font-semibold">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">College / Institute</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Registrations</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading drives...</td></tr>
                  ) : colleges.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No colleges found.</td></tr>
                  ) : (
                    colleges.map((college: any, index: number) => {
                      const status = getStatus(college._id);
                      const label =
                        status === "Active" ? "Confirmed" :
                        status === "Pending" ? "Pending Approval" :
                        "Draft";
                      const color =
                        status === "Active" ? "bg-emerald-50 text-emerald-600" :
                        status === "Pending" ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-600";
                      return (
                        <tr key={college._id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{college.name}</div>
                            <div className="text-xs text-slate-500">{college.email}</div>
                          </td>
                          <td className="p-4 text-slate-500">
                            {index % 2 === 0 ? "Oct 24, 2023" : "Nov 02, 2023"}
                            <div className="text-xs text-slate-400">{index % 2 === 0 ? "10:00 AM - 4:00 PM" : "09:00 AM - 5:00 PM"}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
                              {label}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">{status === "Active" ? 200 + index * 15 : "-"}</td>
                          <td className="p-4 text-right">
                            {status ? (
                              <button className="text-slate-400 hover:text-slate-600">
                                <ChevronRight size={16} />
                              </button>
                            ) : (
                              <button onClick={() => handleConnect(college._id)} className="text-blue-600 text-xs font-semibold">
                                Connect
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-800 mb-3">Pending Actions</div>
              {pendingRequests.length === 0 ? (
                <div className="text-xs text-slate-500">No pending actions.</div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.slice(0, 2).map((req: any) => {
                    const college = req.requesterId.role === "college" ? req.requesterId : req.recipientId;
                    return (
                      <div key={req._id} className="border border-slate-100 rounded-xl p-3">
                        <div className="text-sm font-semibold text-slate-800">Confirm slot: {college.name}</div>
                        <div className="text-xs text-slate-500">Awaiting confirmation. Deadline today 5 PM.</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button className="mt-4 w-full border border-slate-200 rounded-lg py-2 text-sm text-slate-600 font-semibold">
                View All Tasks
              </button>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm">
              <div className="text-xs uppercase text-blue-100">Live Now</div>
              <div className="text-lg font-semibold mt-1">Pre-Placement Talk</div>
              <div className="text-xs text-blue-100 mt-2">184 students are currently attending.</div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
