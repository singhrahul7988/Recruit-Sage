"use client";
import React, { useMemo, useState } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import {
  Search,
  Plus,
  Eye,
  Clock,
  Paperclip,
  Pencil,
  Trash2,
  Calendar
} from "lucide-react";
import TopBarActions from "../../../components/TopBarActions";

type NoticeStatus = "Sent" | "Draft" | "Scheduled";

const initialNotices = [
  {
    id: "notice-1",
    title: "Resume Submission Deadline Extension - Google",
    body:
      "Due to technical issues reported on the portal, we are extending the deadline for resume submission for the Google recruitment drive by 4 hours.",
    tags: ["Urgent", "Students"],
    status: "Sent" as NoticeStatus,
    views: 1200,
    time: "2h ago",
    accent: "border-red-500",
    attachment: null,
  },
  {
    id: "notice-2",
    title: "Pre-Placement Talk Schedule Updated",
    body:
      "The schedule for next week's pre-placement talks has been finalized. Companies including Microsoft, Cisco, and Adobe will be presenting.",
    tags: ["Info", "All Depts"],
    status: "Sent" as NoticeStatus,
    views: 856,
    time: "Yesterday",
    accent: "border-blue-500",
    attachment: "Schedule_v2.pdf",
  },
  {
    id: "notice-3",
    title: "Coding Assessment Platform Link Active",
    body:
      "The link for the Amazon coding assessment is now active. Please ensure you have a stable internet connection and webcam access before starting.",
    tags: ["Reminder", "CSE & IT"],
    status: "Sent" as NoticeStatus,
    views: 420,
    time: "2 days ago",
    accent: "border-amber-400",
    attachment: "https://assessment.amazon.example",
  },
  {
    id: "notice-4",
    title: "Invitation for Campus Drive Phase 2",
    body:
      "Dear recruiting partners, we are pleased to announce the dates for Phase 2 of our campus placement season. We invite you to join.",
    tags: ["Draft", "Companies"],
    status: "Draft" as NoticeStatus,
    views: 0,
    time: "Last edited 10m ago",
    accent: "border-slate-300",
    attachment: null,
  },
  {
    id: "notice-5",
    title: "Interview Prep Workshop",
    body:
      "An interview prep workshop will be conducted for final year students. The session includes mock interviews and resume reviews.",
    tags: ["Scheduled", "All Students"],
    status: "Scheduled" as NoticeStatus,
    views: 0,
    time: "Oct 25, 10:00 AM",
    accent: "border-emerald-400",
    attachment: null,
  },
];

export default function CollegeNoticesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState(initialNotices);
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    audience: "Students",
    status: "Sent",
    priority: "Info",
  });

  const filteredNotices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return notices.filter((notice) => {
      const matchesSearch =
        !term ||
        notice.title.toLowerCase().includes(term) ||
        notice.body.toLowerCase().includes(term);

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Sent" && notice.status === "Sent") ||
        (activeTab === "Drafts" && notice.status === "Draft") ||
        (activeTab === "Scheduled" && notice.status === "Scheduled");

      return matchesSearch && matchesTab;
    });
  }, [activeTab, notices, searchTerm]);

  const scheduledItems = notices.filter((notice) => notice.status === "Scheduled");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      alert("Please add a title and message.");
      return;
    }

    const payload = {
      id: editingId || `notice-${Date.now()}`,
      title: formData.title.trim(),
      body: formData.body.trim(),
      tags: [formData.priority, formData.audience],
      status: formData.status as NoticeStatus,
      views: 0,
      time: editingId ? "Updated just now" : "Just now",
      accent:
        formData.priority === "Urgent"
          ? "border-red-500"
          : formData.priority === "Reminder"
          ? "border-amber-400"
          : "border-blue-500",
      attachment: null,
    };

    setNotices((prev) => {
      if (editingId) {
        return prev.map((notice) => (notice.id === editingId ? payload : notice));
      }
      return [payload, ...prev];
    });

    setShowComposer(false);
    setEditingId(null);
    setFormData({ title: "", body: "", audience: "Students", status: "Sent", priority: "Info" });
  };

  const handleEdit = (notice: typeof initialNotices[number]) => {
    const [priorityTag, audienceTag] = notice.tags || [];
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      body: notice.body,
      audience: audienceTag || "Students",
      status: notice.status,
      priority: priorityTag || "Info",
    });
    setShowComposer(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this notice?")) return;
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
  };

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Notices & Announcements</h1>
            <p className="text-sm text-slate-500">Share updates with students and partners.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search notices..."
                className="outline-none text-sm w-44 text-slate-600"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/college/settings" />
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-2 py-1 text-sm text-slate-500">
            {["All", "Sent", "Drafts", "Scheduled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", body: "", audience: "Students", status: "Sent", priority: "Info" });
              setShowComposer((prev) => !prev);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Plus size={16} /> Create Notice
          </button>
        </div>

        {showComposer && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-800">
                {editingId ? "Edit Notice" : "Create Notice"}
              </div>
              <button onClick={() => setShowComposer(false)} className="text-xs text-slate-500">
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                placeholder="Notice title"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              />
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg text-sm min-h-[110px]"
                placeholder="Write the announcement..."
                value={formData.body}
                onChange={(event) => setFormData({ ...formData, body: event.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white"
                  value={formData.audience}
                  onChange={(event) => setFormData({ ...formData, audience: event.target.value })}
                >
                  <option>Students</option>
                  <option>All Students</option>
                  <option>Companies</option>
                  <option>All Depts</option>
                </select>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white"
                  value={formData.status}
                  onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                >
                  <option>Sent</option>
                  <option>Draft</option>
                  <option>Scheduled</option>
                </select>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white"
                  value={formData.priority}
                  onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                >
                  <option>Info</option>
                  <option>Urgent</option>
                  <option>Reminder</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold w-fit">
                {editingId ? "Update Notice" : "Publish Notice"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-l-4 ${notice.accent}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      {notice.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{notice.title}</div>
                    <p className="text-xs text-slate-500 mt-2">{notice.body}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 space-y-1">
                    <div className="inline-flex items-center gap-1">
                      <Eye size={12} /> {notice.views}
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <Clock size={12} /> {notice.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {notice.attachment && (
                      <span className="inline-flex items-center gap-2 text-blue-600">
                        <Paperclip size={12} /> {notice.attachment}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(notice)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(notice.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredNotices.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                No notices match your filters.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-400 uppercase">Engagement (Last 7 Days)</div>
              <div className="text-2xl font-semibold text-slate-900 mt-3">94%</div>
              <div className="text-xs text-emerald-500 mt-1">+2.4% open rate</div>
              <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[94%] bg-emerald-500"></div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Daily Views</span>
                <span className="text-slate-900 font-semibold">1,245</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-slate-800">Scheduled</div>
                <button className="text-xs text-blue-600 font-semibold">View Calendar</button>
              </div>
              <div className="space-y-3">
                {scheduledItems.length === 0 ? (
                  <div className="text-xs text-slate-400">No scheduled notices.</div>
                ) : (
                  scheduledItems.map((notice) => (
                    <div key={notice.id} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{notice.title}</div>
                        <div className="text-xs text-slate-500">{notice.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-800 mb-4">Distribution Channels</div>
              <div className="space-y-3 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Email Newsletter</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile Push</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Alert</span>
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Slack Integration</span>
                  <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                </div>
              </div>
              <button className="mt-4 w-full border border-slate-200 rounded-lg py-2 text-xs font-semibold text-blue-600">
                Manage Integrations
              </button>
            </div>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
}
