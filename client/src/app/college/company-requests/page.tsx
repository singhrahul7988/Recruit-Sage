"use client";
import React, { useEffect, useMemo, useState } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import {
  Search,
  Building2,
  MapPin,
  ChevronDown
} from "lucide-react";
import api from "@/lib/api";
import TopBarActions from "../../../components/TopBarActions";

type Partnership = {
  _id: string;
  status: "Pending" | "Active" | "Rejected";
  requesterId: { _id: string; name: string; email: string; role: string };
  recipientId: { _id: string; name: string; email: string; role: string };
};

type Company = {
  _id: string;
  name: string;
  email: string;
};

export default function CollegeCompanyRequestsPage() {
  const [activeTab, setActiveTab] = useState("Incoming Requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<Partnership[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);
  const [sectorFilter, setSectorFilter] = useState("All Sectors");
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [discoverResults, setDiscoverResults] = useState<Company[] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const getStoredCollegeId = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return { error: "Session missing. Please log in again." };
    }
    try {
      const user = JSON.parse(storedUser);
      const collegeId = user.role === "college" ? user._id : user.collegeId;
      if (!collegeId) {
        return { error: "College link not found for this account." };
      }
      return { collegeId };
    } catch {
      return { error: "Session data is corrupted. Please log in again." };
    }
  };

  const loadRequests = async () => {
    try {
      const { collegeId, error } = getStoredCollegeId();
      if (!collegeId) {
        setErrorMsg(error || "Session missing. Please log in again.");
        setLoading(false);
        return;
      }
      const { data } = await api.get(`/api/network/requests/${collegeId}`);
      setRequests(data || []);
    } catch (error) {
      setErrorMsg("Failed to load company requests. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

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

  useEffect(() => {
    loadCompanies();
  }, []);

  const incomingRequests = requests.filter(
    (req) => req.status === "Pending" && req.requesterId?.role === "company"
  );
  const sentInvites = requests.filter(
    (req) => req.status === "Pending" && req.requesterId?.role === "college"
  );
  const pastConnections = requests.filter((req) => req.status === "Active");

  const getCompany = (req: Partnership) =>
    req.requesterId?.role === "company" ? req.requesterId : req.recipientId;

  const visibleRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list =
      activeTab === "Incoming Requests"
        ? incomingRequests
        : activeTab === "Sent Invites"
        ? sentInvites
        : pastConnections;
    if (!term) return list;
    return list.filter((req) => {
      const company = getCompany(req);
      return (
        company?.name?.toLowerCase().includes(term) ||
        company?.email?.toLowerCase().includes(term)
      );
    });
  }, [activeTab, incomingRequests, pastConnections, searchTerm, sentInvites]);

  const handleRespond = async (partnershipId: string, status: "Active" | "Rejected") => {
    try {
      await api.put("/api/network/respond", { partnershipId, status });
      setActionMessage(status === "Active" ? "Request accepted." : "Request declined.");
      loadRequests();
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || "Action failed.");
    }
  };

  const getStatus = (companyId: string) => {
    const req = requests.find(
      (item) => item.requesterId?._id === companyId || item.recipientId?._id === companyId
    );
    return req ? req.status : null;
  };

  const handleInviteCompany = async (companyId: string) => {
    try {
      const { collegeId, error } = getStoredCollegeId();
      if (!collegeId) {
        setActionMessage(error || "Session missing. Please log in again.");
        return;
      }
      await api.post("/api/network/connect", { requesterId: collegeId, recipientId: companyId });
      setActionMessage("Invite sent to company.");
      loadRequests();
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || "Failed to send invite.");
    }
  };

  const filterCompanies = (list: Company[]) => {
    const term = companySearch.trim().toLowerCase();
    return list.filter((company: any) => {
      const matchesTerm =
        !term ||
        company.name.toLowerCase().includes(term) ||
        company.email.toLowerCase().includes(term);
      const companySector = company.sector || "All Sectors";
      const matchesSector =
        sectorFilter === "All Sectors" || companySector === sectorFilter;
      return matchesTerm && matchesSector;
    });
  };

  const handleFindMatches = () => {
    const matches = filterCompanies(companies);
    setDiscoverResults(matches);
    setShowAllRecommended(true);
    setActionMessage(matches.length ? "Matches updated based on filters." : "No matches found for the selected filters.");
  };

  const handleViewProfile = (company?: Company) => {
    if (!company) {
      setActionMessage("Company details are unavailable.");
      return;
    }
    setSelectedCompany(company);
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("company-requests-updated", { detail: incomingRequests.length })
    );
  }, [incomingRequests.length]);

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Company Requests</h1>
            <p className="text-sm text-slate-500">Review hiring drive partnership requests.</p>
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

        {actionMessage && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {actionMessage}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">New Requests</div>
            <div className="text-2xl font-semibold text-slate-900">{incomingRequests.length}</div>
            {incomingRequests.length > 0 ? (
              <div className="text-xs text-emerald-500 mt-1">+{incomingRequests.length} pending</div>
            ) : (
              <div className="text-xs text-slate-400 mt-1">No new requests</div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Partner Companies</div>
            <div className="text-2xl font-semibold text-slate-900">{pastConnections.length}</div>
            <div className="text-xs text-slate-400 mt-1">Active recruiters this season</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {["Incoming Requests", "Sent Invites", "Past Connections"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-500">Loading requests...</div>
            ) : visibleRequests.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                No matching requests found.
              </div>
            ) : (
              visibleRequests.map((req) => {
                const company = getCompany(req);
                return (
                  <div key={req._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{company?.name || "Company"}</div>
                            <div className="text-xs text-slate-500">{company?.email}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                              <MapPin size={12} /> Bangalore, Karnataka
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">Received 2h ago</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs text-slate-500 mt-4">
                        <div>
                          <div className="text-[11px] uppercase text-slate-400">Roles</div>
                          <div className="font-semibold text-slate-700">SDE, DevOps</div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase text-slate-400">Avg Package</div>
                          <div className="font-semibold text-slate-700">18 LPA</div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase text-slate-400">Openings</div>
                          <div className="font-semibold text-slate-700">25+</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-4">
                        We are scaling our engineering team and looking for top-tier talent across CS departments.
                      </p>
                      <div className="flex items-center gap-3 mt-5">
                        {activeTab === "Incoming Requests" ? (
                          <>
                            <button
                              onClick={() => handleRespond(req._id, "Active")}
                              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespond(req._id, "Rejected")}
                              className="flex-1 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleViewProfile(company)}
                            className="flex-1 border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            View Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-800 mb-4">Discover Companies</div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-slate-500">Sector</label>
                  <div className="relative mt-2">
                    <select
                      value={sectorFilter}
                      onChange={(event) => setSectorFilter(event.target.value)}
                      className="appearance-none w-full border border-slate-200 rounded-lg px-3 py-2 pr-7 text-sm text-slate-600 bg-white"
                    >
                      <option>All Sectors</option>
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Consulting</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Search</label>
                  <input
                    value={companySearch}
                    onChange={(event) => setCompanySearch(event.target.value)}
                    placeholder="Find companies..."
                    className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFindMatches}
                  className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-semibold"
                >
                  Find Matches
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-slate-800">Recommended</div>
                <button
                  type="button"
                  onClick={() => setShowAllRecommended(true)}
                  className="text-xs text-blue-600 font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {companyLoading ? (
                  <div className="text-xs text-slate-400">Loading companies...</div>
                ) : companies.length === 0 ? (
                  <div className="text-xs text-slate-400">No companies available.</div>
                ) : (
                  (discoverResults || filterCompanies(companies))
                    .slice(0, showAllRecommended ? undefined : 5)
                    .map((company) => {
                      const status = getStatus(company._id);
                      return (
                        <div key={company._id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                              {company.name.slice(0, 1)}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{company.name}</div>
                              <div className="text-xs text-slate-500">{company.email}</div>
                            </div>
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
                              onClick={() => handleInviteCompany(company._id)}
                              className="text-xs text-blue-600 font-semibold"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
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
                  <div className="font-semibold text-slate-700">{(selectedCompany as any).sector || "Not specified"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Location</div>
                  <div className="font-semibold text-slate-700">{(selectedCompany as any).location || "Not specified"}</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold"
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
