"use client";
import React, { useState, useEffect } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import { Building2, Clock, Search, Bell, Moon, ChevronDown, Mail, Phone } from "lucide-react";
import api from "@/lib/api";

export default function CompanyRequests() {
  const [activeTab, setActiveTab] = useState("pending");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 2. HANDLE ACCEPT / REJECT
  const handleRespond = async (id: string, status: 'Active' | 'Rejected') => {
    try {
        await api.put("/api/network/respond", { partnershipId: id, status });
        alert(`Request ${status}!`);
        fetchRequests(); // Refresh list
    } catch (error) {
        alert("Action failed");
    }
  };

  // Filter lists
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activePartners = requests.filter(r => r.status === 'Active');
  const displayedCompanies = activeTab === "pending" ? pendingRequests : activePartners;

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
              <input placeholder="Search companies..." className="outline-none text-sm w-44 text-slate-600" />
            </div>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
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
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            All Sectors <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            Status <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
            Tier <ChevronDown size={14} />
          </button>
          <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Add Company
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === "active" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === "pending" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            Pending
          </button>
        </div>

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
                        <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold">
                          View Profile
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
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
              No {activeTab} companies found.
            </div>
          )}
        </div>
      </div>
    </CollegeLayout>
  );
}
