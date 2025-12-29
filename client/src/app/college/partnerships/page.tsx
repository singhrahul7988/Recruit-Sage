"use client";
import React, { useState, useEffect } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import { Search, ChevronDown, Mail, Phone } from "lucide-react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import TopBarActions from "../../../components/TopBarActions";

export default function CompanyRequests() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("pending");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  // 1. FETCH REQUESTS
  const fetchRequests = async () => {
    try {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) return;
        const user = JSON.parse(storedUser);
        const collegeId = user.role === "college" ? user._id : user.collegeId;

        const { data } = await api.get(`/api/network/requests/${collegeId}`);
        setRequests(data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching network");
        setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  useEffect(() => {
    const companyParam = searchParams.get("company");
    if (companyParam && !searchTerm) {
      setSearchTerm(companyParam);
    }
  }, [searchParams, searchTerm]);

  useEffect(() => {
    if (!showAddPanel) return;
    const loadCompanies = async () => {
      try {
        setCompanyLoading(true);
        const { data } = await api.get("/api/network/search-companies");
        setCompanies(data || []);
      } catch (error) {
        setActionMessage("Failed to load companies.");
      } finally {
        setCompanyLoading(false);
      }
    };
    loadCompanies();
  }, [showAddPanel]);

  // 2. HANDLE ACCEPT / REJECT
  const handleRespond = async (id: string, status: 'Active' | 'Rejected') => {
    try {
      await api.put("/api/network/respond", { partnershipId: id, status });
      setActionMessage(status === "Active" ? "Request accepted." : "Request declined.");
      fetchRequests(); // Refresh list
    } catch (error) {
      setActionMessage("Action failed. Please try again.");
    }
  };

  // Filter lists
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activePartners = requests.filter(r => r.status === 'Active');
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setStatusFilter(tab === "active" ? "Active" : "Pending");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "Active") setActiveTab("active");
    if (value === "Pending") setActiveTab("pending");
  };

  const filteredRequests = requests.filter((req) => {
    const statusMatch = statusFilter === "All" ? true : req.status === statusFilter;
    const company = req.requesterId.role === 'company' ? req.requesterId : req.recipientId;
    const sector = company?.sector || "Unspecified";
    const tier = company?.tier || "Unspecified";

    const matchesSector = sectorFilter === "All" || sector === sectorFilter;
    const matchesTier = tierFilter === "All" || tier === tierFilter;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      company?.name?.toLowerCase().includes(term) ||
      company?.email?.toLowerCase().includes(term);

    return statusMatch && matchesSector && matchesTier && matchesSearch;
  });

  const displayedCompanies = filteredRequests;

  const sectors = Array.from(
    new Set(
      requests.map((req) => {
        const company = req.requesterId.role === 'company' ? req.requesterId : req.recipientId;
        return company?.sector || "Unspecified";
      })
    )
  );

  const tiers = Array.from(
    new Set(
      requests.map((req) => {
        const company = req.requesterId.role === 'company' ? req.requesterId : req.recipientId;
        return company?.tier || "Unspecified";
      })
    )
  );

  const getRequestStatus = (companyId: string) => {
    const req = requests.find((item) =>
      String(item.requesterId?._id) === companyId || String(item.recipientId?._id) === companyId
    );
    return req?.status || null;
  };

  const handleSendRequest = async (companyId: string) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setActionMessage("Session missing. Please log in again.");
        return;
      }
      const user = JSON.parse(storedUser);
      const collegeId = user.role === "college" ? user._id : user.collegeId;
      if (!collegeId) {
        setActionMessage("College profile not found.");
        return;
      }

      await api.post("/api/network/connect", { requesterId: collegeId, recipientId: companyId });
      setActionMessage("Partnership request sent.");
      fetchRequests();
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || "Failed to send request.");
    }
  };

  const handleViewProfile = (company: any) => {
    setSelectedCompany(company);
  };

  const handleManageDrive = (company: any) => {
    if (!company?.name) {
      setActionMessage("Company details are unavailable.");
      return;
    }
    router.push(`/college/drives?company=${encodeURIComponent(company.name)}`);
  };

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Companies Overview</h1>
            <p className="text-sm text-slate-500">Monitor partnerships and recruiting activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search companies..."
                className="outline-none text-sm w-44 text-slate-600"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/college/settings" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Active Companies</div>
            <div className="text-2xl font-semibold text-slate-900">{activePartners.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Pending Invites</div>
            <div className="text-2xl font-semibold text-slate-900">{pendingRequests.length}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Active Drives</div>
            <div className="text-2xl font-semibold text-slate-900">0</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Avg. CTC Offer</div>
            <div className="text-2xl font-semibold text-slate-900">Rs 0 L</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={(event) => setSectorFilter(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
            >
              <option value="All">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => handleStatusFilterChange(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Status: Pending</option>
              <option value="Active">Status: Active</option>
              <option value="Rejected">Status: Rejected</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
          </div>
          <div className="relative">
            <select
              value={tierFilter}
              onChange={(event) => setTierFilter(event.target.value)}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 pr-7 bg-white"
            >
              <option value="All">Tier: All</option>
              {tiers.map((tier) => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
          </div>
          <button
            onClick={() => setShowAddPanel((prev) => !prev)}
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Add Company
          </button>
        </div>

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {actionMessage}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => handleTabChange("active")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === "active" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleTabChange("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === "pending" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            Pending
          </button>
        </div>

        {showAddPanel && (
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-800">Invite Companies</div>
              <button
                type="button"
                onClick={() => setShowAddPanel(false)}
                className="text-xs text-slate-500"
              >
                Close
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search companies to invite..."
                className="outline-none text-sm w-full text-slate-600 bg-transparent"
                value={companySearch}
                onChange={(event) => setCompanySearch(event.target.value)}
              />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {companyLoading ? (
                <div className="text-xs text-slate-500">Loading companies...</div>
              ) : (
                companies
                  .filter((company) => {
                    const term = companySearch.trim().toLowerCase();
                    if (!term) return true;
                    return (
                      company?.name?.toLowerCase().includes(term) ||
                      company?.email?.toLowerCase().includes(term)
                    );
                  })
                  .map((company) => {
                    const status = getRequestStatus(company._id);
                    return (
                      <div key={company._id} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{company.name}</div>
                          <div className="text-xs text-slate-500">{company.email}</div>
                        </div>
                        {status ? (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            status === "Active" ? "bg-emerald-50 text-emerald-600" :
                            status === "Pending" ? "bg-amber-50 text-amber-600" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {status}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendRequest(company._id)}
                            className="text-sm text-blue-600 font-semibold"
                          >
                            Send Invite
                          </button>
                        )}
                      </div>
                    );
                  })
              )}
              {!companyLoading && companies.length === 0 && (
                <div className="text-xs text-slate-400">No companies found.</div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayedCompanies.map((req) => {
            const company = req.requesterId.role === 'company' ? req.requesterId : req.recipientId;
            return (
              <div key={req._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-semibold text-slate-700">
                    {company.name?.[0] || "C"}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold text-slate-800">{company.name}</div>
                    <div className="text-xs text-slate-500">{company.email}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="inline-flex items-center gap-1"><Mail size={12} /> Email</span>
                      <span className="inline-flex items-center gap-1"><Phone size={12} /> Contact</span>
                    </div>
                  </div>
                  <div className="min-w-[180px]">
                    <div className="text-xs text-slate-500">Hiring Status</div>
                    <span className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {req.status === "Active" ? "Active" : "Pending Review"}
                    </span>
                  </div>
                  <div className="min-w-[200px] text-sm text-slate-600">
                    <div className="text-xs text-slate-500">Total Hires</div>
                    <div className="font-semibold text-slate-800">0 Students</div>
                  </div>
                  <div className="min-w-[200px] text-sm text-slate-600">
                    <div className="text-xs text-slate-500">Avg Package</div>
                    <div className="font-semibold text-slate-800">0 LPA</div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    {req.status === "Pending" ? (
                      <>
                        <button onClick={() => handleRespond(req._id, 'Active')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold">
                          Accept
                        </button>
                        <button onClick={() => handleRespond(req._id, 'Rejected')} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold">
                          Decline
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewProfile(company)}
                          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManageDrive(company)}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                        >
                          Manage Drive
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayedCompanies.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
              No matching companies found.
            </div>
          )}
        </div>

        {selectedCompany && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500">Company profile</div>
                  <div className="text-lg font-semibold text-slate-800">{selectedCompany.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="text-xs text-slate-500"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="font-semibold text-slate-700">{selectedCompany.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Sector</div>
                  <div className="font-semibold text-slate-700">{selectedCompany.sector || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Tier</div>
                  <div className="font-semibold text-slate-700">{selectedCompany.tier || "Not specified"}</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleManageDrive(selectedCompany)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  View drives
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
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
