"use client";
import React, { useEffect, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import {
  Search,
  Calendar,
  GraduationCap,
  Users,
  Briefcase,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import TopBarActions from "../../../components/TopBarActions";

export default function CampusDrivesPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [partnerColleges, setPartnerColleges] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<any | null>(null);

  const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return { error: "Session missing. Please log in again." };
    }
    try {
      const user = JSON.parse(storedUser);
      return { user };
    } catch {
      return { error: "Session data is corrupted. Please log in again." };
    }
  };

  const normalizeId = (value: any) => String(value?._id ?? value ?? "");

  const extractPartnerColleges = (items: any[], userId: string) => {
    const active = items.filter((item) => item.status === "Active");
    const colleges = active
      .map((item) => {
        const requesterId = normalizeId(item.requesterId);
        const recipientId = normalizeId(item.recipientId);
        const other = requesterId === userId ? item.recipientId : item.requesterId;
        return other;
      })
      .filter((item) => item && item.role === "college");
    return Array.from(new Map(colleges.map((college) => [normalizeId(college), college])).values());
  };

  const loadData = async () => {
    try {
      const { user, error } = getStoredUser();
      if (!user) {
        setErrorMsg(error || "Session missing. Please log in again.");
        setLoading(false);
        return;
      }
      if (!user._id) {
        setErrorMsg("User session is incomplete. Please log in again.");
        setLoading(false);
        return;
      }
      const userId = user._id;

      const results = await Promise.allSettled([
        api.get(`/api/network/requests/${userId}`),
        api.get(`/api/jobs/company/${userId}`)
      ]);

      if (results[0].status === "fulfilled") {
        const requestData = results[0].value.data || [];
        setRequests(requestData);
        setPartnerColleges(extractPartnerColleges(requestData, String(userId)));
      } else {
        setRequests([]);
        setPartnerColleges([]);
        setActionMessage("Unable to load partner campuses. Try again.");
      }

      if (results[1].status === "fulfilled") {
        setDrives(results[1].value.data || []);
      } else {
        setDrives([]);
      }
    } catch (error) {
      console.error("Failed to load campus drives");
      setErrorMsg("Failed to load campus drives. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetails = (college: any) => {
    setSelectedCollege(college);
  };

  const pendingRequests = requests.filter(
    (r) => r.status === "Pending" && r.requesterId?.role === "college"
  );

  const openDrives = drives.filter((drive) => drive.status === "Open").length;
  const closingSoon = drives.filter((drive) => {
    if (!drive.deadline) return false;
    const days = (new Date(drive.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  }).length;

  const filteredColleges = partnerColleges.filter((college) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      college?.name?.toLowerCase().includes(term) ||
      college?.email?.toLowerCase().includes(term)
    );
  });

  const getCollegeDrives = (collegeId: string) =>
    drives.filter((drive) => String(drive.collegeId) === String(collegeId));

  const handleCreateDrive = (collegeId?: string) => {
    const query = collegeId ? `?collegeId=${encodeURIComponent(String(collegeId))}` : "";
    router.push(`/company/create-drive${query}`);
  };

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
              <input
                placeholder="Search connected campuses..."
                className="outline-none text-sm w-52 text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/company/settings" showSettings={false} />
            <button
              onClick={() => handleCreateDrive()}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Register New Drive
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
            <div className="flex items-center justify-between mb-2">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{openDrives} open</span>
            </div>
            <div className="text-xs text-slate-500">Published Drives</div>
            <div className="text-2xl font-semibold text-slate-900">{drives.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <GraduationCap size={18} className="text-blue-500" />
              <span className="text-xs text-slate-400">Connected</span>
            </div>
            <div className="text-xs text-slate-500">Active Campuses</div>
            <div className="text-2xl font-semibold text-slate-900">{partnerColleges.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users size={18} className="text-blue-500" />
              <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded-full">Closing soon</span>
            </div>
            <div className="text-xs text-slate-500">Deadlines (7 days)</div>
            <div className="text-2xl font-semibold text-slate-900">{closingSoon}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Briefcase size={18} className="text-blue-500" />
              <span className="text-xs text-slate-400">Current cycle</span>
            </div>
            <div className="text-xs text-slate-500">Open Drives</div>
            <div className="text-2xl font-semibold text-slate-900">{openDrives}</div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-800">Active Partner Campuses</div>
                <div className="text-xs text-slate-500">Send drives only to connected colleges</div>
              </div>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-xs text-blue-600 font-semibold"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">College / Institute</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Drives</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading campuses...</td></tr>
                  ) : filteredColleges.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No active partner campuses yet. Connect in Campus Network.
                      </td>
                    </tr>
                  ) : (
                    filteredColleges.map((college: any) => {
                      const collegeDrives = getCollegeDrives(college._id);
                      return (
                        <tr key={college._id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{college.name}</div>
                            <div className="text-xs text-slate-500">{college.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">
                            {collegeDrives.length > 0 ? `${collegeDrives.length} drives` : "No drives yet"}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenDetails(college)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <ChevronRight size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCreateDrive(college._id)}
                                className="text-blue-600 text-xs font-semibold"
                              >
                                Create Drive
                              </button>
                            </div>
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
              <div className="text-sm font-semibold text-slate-800 mb-3">Handshake Requests</div>
              {pendingRequests.length === 0 ? (
                <div className="text-xs text-slate-500">No pending handshake requests.</div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.slice(0, 2).map((req: any) => {
                    const college = req.requesterId.role === "college" ? req.requesterId : req.recipientId;
                    return (
                      <div key={req._id} className="border border-slate-100 rounded-xl p-3">
                        <div className="text-sm font-semibold text-slate-800">{college.name}</div>
                        <div className="text-xs text-slate-500">Pending approval in Campus Network.</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                onClick={() => router.push("/company/campus-network")}
                className="mt-4 w-full border border-slate-200 rounded-lg py-2 text-sm text-slate-600 font-semibold"
              >
                Review in Campus Network
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
              <div className="text-xs uppercase text-slate-300">Quick Action</div>
              <div className="text-lg font-semibold mt-1">Publish a new drive</div>
              <div className="text-xs text-slate-300 mt-2">Select a connected campus to start hiring.</div>
              <button
                type="button"
                onClick={() => handleCreateDrive()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-slate-900 rounded-lg py-2 text-sm font-semibold"
              >
                Create Drive <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {selectedCollege && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500">Campus details</div>
                  <div className="text-lg font-semibold text-slate-800">{selectedCollege.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCollege(null)}
                  className="text-xs text-slate-500"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="font-semibold text-slate-700">{selectedCollege.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <div className="font-semibold text-slate-700">Active</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Location</div>
                  <div className="font-semibold text-slate-700">{selectedCollege.location || "Not specified"}</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleCreateDrive(selectedCollege._id)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  Create Drive
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCollege(null)}
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
