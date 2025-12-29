"use client";
import React, { useMemo, useState } from "react";
import CompanyLayout from "../../../components/CompanyLayout";
import { Search, ArrowUpRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import TopBarActions from "../../../components/TopBarActions";

type Interview = {
  id: string;
  time: string;
  duration: string;
  name: string;
  role: string;
  status: string;
};

type FeedbackItem = {
  id: string;
  name: string;
  time: string;
};

export default function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    time: "",
    duration: "30 min",
    status: "Scheduled",
  });

  const [interviews, setInterviews] = useState<Interview[]>([
    { id: "int-1", time: "09:30 AM", duration: "60 min", name: "Rohan Das", role: "Senior Frontend Engineer", status: "Live Now" },
    { id: "int-2", time: "11:00 AM", duration: "45 min", name: "Kavya Sharma", role: "Product Designer", status: "Scheduled" },
    { id: "int-3", time: "02:00 PM", duration: "30 min", name: "Amit Patel", role: "Backend Intern", status: "Confirmed" },
  ]);

  const [feedbackRequired, setFeedbackRequired] = useState<FeedbackItem[]>([
    { id: "fb-1", name: "Arjun Reddy", time: "Yesterday, 4:00 PM" },
    { id: "fb-2", name: "Priya Singh", time: "Oct 24, 11:00 AM" },
  ]);

  const filteredInterviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return interviews;
    return interviews.filter((interview) => {
      return (
        interview.name.toLowerCase().includes(term) ||
        interview.role.toLowerCase().includes(term)
      );
    });
  }, [interviews, searchTerm]);

  const filteredFeedback = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return feedbackRequired;
    return feedbackRequired.filter((item) => item.name.toLowerCase().includes(term));
  }, [feedbackRequired, searchTerm]);

  const handlePrevDay = () => {
    setScheduleDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  };

  const handleNextDay = () => {
    setScheduleDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  };

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleAddInterview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.time.trim()) {
      alert("Please fill in candidate, role, and time.");
      return;
    }
    setInterviews((prev) => [
      ...prev,
      {
        id: `int-${Date.now()}`,
        name: formData.name.trim(),
        role: formData.role.trim(),
        time: formData.time.trim(),
        duration: formData.duration,
        status: formData.status,
      },
    ]);
    setFormData({ name: "", role: "", time: "", duration: "30 min", status: "Scheduled" });
    setShowForm(false);
  };

  const handleJoinMeeting = () => {
    window.open("https://meet.google.com", "_blank", "noopener,noreferrer");
  };

  const handleSubmitScorecard = (id: string) => {
    setFeedbackRequired((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCalendarSync = () => {
    window.open("https://calendar.google.com", "_blank", "noopener,noreferrer");
  };

  const monthLabel = calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const scheduleLabel = scheduleDate.toLocaleString("en-US", { month: "long", day: "numeric" });

  return (
    <CompanyLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Interview Schedule</h1>
            <span className="text-sm text-slate-400">October 2023</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Week 43</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search candidate or job..."
                className="outline-none text-sm w-48 text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <TopBarActions settingsPath="/company/settings" />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Schedule Interview <ArrowUpRight size={14} />
            </button>
          </div>
        </header>

        {showForm && (
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-800">Schedule New Interview</div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-slate-500"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleAddInterview} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                placeholder="Candidate name"
                className="p-3 border border-slate-200 rounded-lg text-sm"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
              <input
                placeholder="Role"
                className="p-3 border border-slate-200 rounded-lg text-sm"
                value={formData.role}
                onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              />
              <input
                placeholder="Time (e.g. 03:00 PM)"
                className="p-3 border border-slate-200 rounded-lg text-sm"
                value={formData.time}
                onChange={(event) => setFormData({ ...formData, time: event.target.value })}
              />
              <select
                className="p-3 border border-slate-200 rounded-lg text-sm bg-white"
                value={formData.duration}
                onChange={(event) => setFormData({ ...formData, duration: event.target.value })}
              >
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
              </select>
              <select
                className="p-3 border border-slate-200 rounded-lg text-sm bg-white"
                value={formData.status}
                onChange={(event) => setFormData({ ...formData, status: event.target.value })}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Live Now">Live Now</option>
              </select>
              <div className="md:col-span-3 flex items-center gap-3">
                <button className="bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-semibold">
                  Add Interview
                </button>
                <span className="text-xs text-slate-500">Interview will be added to today's list.</span>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-500" />
                <div className="text-sm font-semibold text-slate-700">Today, {scheduleLabel}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-slate-400 w-20">{interview.time}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{interview.name}</div>
                        <div className="text-xs text-slate-500">{interview.role}</div>
                        <div className="text-xs text-slate-400">{interview.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        interview.status === "Live Now" ? "bg-emerald-50 text-emerald-600" :
                        interview.status === "Scheduled" ? "bg-blue-50 text-blue-600" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {interview.status}
                      </span>
                      <button
                        type="button"
                        onClick={handleJoinMeeting}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600"
                      >
                        Join Meeting
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-slate-800">{monthLabel}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div key={`${day}-${index}`}>{day}</div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-7 w-7 rounded-full flex items-center justify-center mx-auto ${
                      index + 1 === scheduleDate.getDate() &&
                      calendarMonth.getMonth() === scheduleDate.getMonth() &&
                      calendarMonth.getFullYear() === scheduleDate.getFullYear()
                        ? "bg-blue-600 text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-800 mb-3">Feedback Required</div>
              <div className="space-y-3">
                {filteredFeedback.length === 0 ? (
                  <div className="text-xs text-slate-500">All scorecards are up to date.</div>
                ) : (
                  filteredFeedback.map((item) => (
                    <div key={item.id} className="border border-slate-100 rounded-xl p-3">
                      <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.time}</div>
                      <button
                        type="button"
                        onClick={() => handleSubmitScorecard(item.id)}
                        className="mt-3 w-full px-3 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold"
                      >
                        Submit Scorecard
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm">
              <div className="text-sm font-semibold mb-2">Schedule Sync</div>
              <p className="text-xs text-blue-100 mb-4">Review availability for next week interviews.</p>
              <button
                type="button"
                onClick={handleCalendarSync}
                className="w-full bg-white text-blue-700 rounded-lg py-2 text-sm font-semibold"
              >
                Check Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
