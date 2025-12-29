"use client";
import React, { useEffect, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import { Save } from "lucide-react";
import api from "@/lib/api";
import TopBarActions from "../../../components/TopBarActions";

export default function CompanySettingsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } catch {
      setFormData({ name: "", email: "", phone: "" });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/api/auth/update-profile", formData);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const currentUser = JSON.parse(storedUser);
          localStorage.setItem("user", JSON.stringify({ ...currentUser, ...formData }));
        } catch {
          localStorage.setItem("user", JSON.stringify({ ...formData }));
        }
      }
      alert("Company profile updated.");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">Manage company profile information.</p>
          </div>
          <TopBarActions settingsPath="/company/settings" />
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Company Name</label>
              <input
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Official Email</label>
              <input
                readOnly
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-400"
                value={formData.email}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Contact Phone</label>
              <input
                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              />
            </div>
          </div>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </CompanyLayout>
  );
}
