"use client";
import React, { useState, useEffect } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import TopBarActions from "../../../components/TopBarActions";

export default function PlacementCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [ctcFilter, setCtcFilter] = useState("All");
  const [actionMessage, setActionMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);

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

  useEffect(() => {
    const company = searchParams.get("company");
    if (company && !searchTerm) {
      setSearchTerm(company);
    }
  }, [searchParams, searchTerm]);

  const ctcValues = drives
    .map((drive) => parseFloat(String(drive.ctc || "").replace(/[^0-9.]/g, "")))
    .filter((value) => !Number.isNaN(value));
  const avgCtc = ctcValues.length ? (ctcValues.reduce((sum, val) => sum + val, 0) / ctcValues.length).toFixed(1) : "0";
  const maxCtc = ctcValues.length ? Math.max(...ctcValues).toFixed(1) : "0";
  const pendingOffers = drives.filter((drive) => drive.status !== "Open").length;

  const departments = Array.from(
    new Set(
      drives
        .flatMap((drive) => drive?.criteria?.branches || [])
        .map((branch: string) => branch || "All")
    )
  );

  const parseCtc = (value: any) => {
    const numeric = parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
    return Number.isNaN(numeric) ? null : numeric;
  };

  const filteredDrives = drives.filter((drive) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      drive?.title?.toLowerCase().includes(term) ||
      drive?.companyId?.name?.toLowerCase().includes(term);

    const matchesStatus = statusFilter === "All" || drive?.status === statusFilter;

    const departmentValue = drive?.criteria?.branches?.[0] || "All";
    const matchesDepartment = departmentFilter === "All" || departmentValue === departmentFilter;

    const ctcValue = parseCtc(drive?.ctc);
    const matchesCtc =
      ctcFilter === "All" ||
      (ctcFilter === "0-5 LPA" && ctcValue !== null && ctcValue <= 5) ||
      (ctcFilter === "5-10 LPA" && ctcValue !== null && ctcValue > 5 && ctcValue <= 10) ||
      (ctcFilter === "10-20 LPA" && ctcValue !== null && ctcValue > 10 && ctcValue <= 20) ||
      (ctcFilter === "20+ LPA" && ctcValue !== null && ctcValue > 20);

    return matchesSearch && matchesStatus && matchesDepartment && matchesCtc;
  });

  const handleCopyDriveId = async (driveId: string) => {
    try {
      await navigator.clipboard.writeText(driveId);
      setActionMessage("Drive ID copied to clipboard.");
    } catch {
      setActionMessage("Unable to copy drive ID.");
    }
    setOpenMenuId(null);
  };

  const handleViewDetails = (drive: any) => {
    setSelectedDrive(drive);
    setOpenMenuId(null);
  };

  const handleOpenCompany = (drive: any) => {
    const companyName = drive?.companyId?.name;
    if (!companyName) {
      setActionMessage("Company details are missing for this drive.");
      return;
    }
    router.push(`/college/partnerships?company=${encodeURIComponent(companyName)}`);
    setOpenMenuId(null);
  };

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
            <TopBarActions settingsPath="/college/settings" />
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search by student, company, or role..."
              className="outline-none text-sm w-64 text-slate-600"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
          </div>
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
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
              value={ctcFilter}
              onChange={(event) => setCtcFilter(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
            >
              <option value="All">CTC Range</option>
              <option value="0-5 LPA">0-5 LPA</option>
              <option value="5-10 LPA">5-10 LPA</option>
              <option value="10-20 LPA">10-20 LPA</option>
              <option value="20+ LPA">20+ LPA</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
          </div>
          <button
            onClick={() => setActionMessage("Placement records are created when partner companies publish drives.")}
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Add Record
          </button>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {actionMessage}
          </div>
        )}

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
            <span>Showing {Math.min(filteredDrives.length, 10)} of {filteredDrives.length} records</span>
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
                ) : filteredDrives.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No placements yet.</td></tr>
                ) : (
                  filteredDrives.map((drive) => (
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
                        <div className="relative inline-flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(openMenuId === drive._id ? null : drive._id)}
                            className="text-slate-400 hover:text-slate-600"
                            aria-label="Open drive actions"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenuId === drive._id && (
                            <div className="absolute right-0 top-7 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-20 text-left">
                              <button
                                type="button"
                                onClick={() => handleViewDetails(drive)}
                                className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                View details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenCompany(drive)}
                                className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                View company
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyDriveId(drive._id)}
                                className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                Copy drive ID
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

        {selectedDrive && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500">Drive details</div>
                  <div className="text-lg font-semibold text-slate-800">
                    {selectedDrive.companyId?.name || "Company"} - {selectedDrive.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDrive(null)}
                  className="text-xs text-slate-500"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <div className="text-xs text-slate-400">CTC</div>
                  <div className="font-semibold text-slate-700">{selectedDrive.ctc || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Status</div>
                  <div className="font-semibold text-slate-700">{selectedDrive.status}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Deadline</div>
                  <div className="font-semibold text-slate-700">
                    {selectedDrive.deadline ? new Date(selectedDrive.deadline).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Departments</div>
                  <div className="font-semibold text-slate-700">
                    {selectedDrive.criteria?.branches?.join(", ") || "All"}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenCompany(selectedDrive)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  View company
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDrive(null)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CollegeLayout>
  );
}
