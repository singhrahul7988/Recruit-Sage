"use client";
import React, { useState } from "react";
import CollegeLayout from "../../../components/CollegeLayout";
import { MessageSquare } from "lucide-react";
import TopBarActions from "../../../components/TopBarActions";

export default function TeamTalkPage() {
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestAccess = () => {
    setRequestSent(true);
  };

  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Team Talk</h1>
            <p className="text-sm text-slate-500">Coordinate with the placement team in one place.</p>
          </div>
          <TopBarActions settingsPath="/college/settings" />
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <MessageSquare size={20} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Team messaging is coming soon</h2>
          <p className="text-sm text-slate-500 mt-2">
            We are setting up live discussions, announcements, and shared notes for your placement team.
          </p>
          <button
            type="button"
            onClick={handleRequestAccess}
            className="mt-6 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
          >
            {requestSent ? "Request Sent" : "Request Early Access"}
          </button>
          {requestSent && (
            <p className="text-xs text-emerald-600 mt-3">
              Request logged. We will notify the placement team once Team Talk is ready.
            </p>
          )}
        </div>
      </div>
    </CollegeLayout>
  );
}
