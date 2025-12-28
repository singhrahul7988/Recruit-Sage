"use client";
import React, { useState, useEffect } from "react";
// 1. IMPORT THE NEW LAYOUT (Instead of Sidebar)
import CollegeLayout from "../../../components/CollegeLayout"; 
import {
  UserPlus,
  Upload,
  Download,
  Trash2,
  Search,
  Bell,
  Moon,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import api from "@/lib/api";
import * as XLSX from "xlsx";

export default function StudentDirectory() {
  const [activeMethod, setActiveMethod] = useState("manual");
  const [showPanel, setShowPanel] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", branch: "", cgpa: "", phone: "" });
  
  // BULK STATE
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // DATA STATE
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. FETCH STUDENTS
  const fetchStudents = async () => {
    try {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) {
            setErrorMsg("Session missing. Please log in again.");
            setLoading(false);
            return;
        }
        const user = JSON.parse(storedUser);
        const collegeId = user.role === "college" ? user._id : user.collegeId;
        if(!collegeId) {
            setErrorMsg("College link not found for this account.");
            setLoading(false);
            return;
        }

        const { data } = await api.get(`/api/auth/students/${collegeId}`);
        setStudents(data);
        setLoading(false);
    } catch (error) {
        setErrorMsg("Failed to load students. Please refresh.");
        console.error("Failed to load students");
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. DELETE
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to remove this student?")) return;
    try {
        await api.delete(`/api/auth/student/${id}`);
        fetchStudents();
    } catch (error) {
        alert("Delete failed");
    }
  };

  // 3. MANUAL ADD
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) {
            alert("Session missing. Please log in again.");
            return;
        }
        const user = JSON.parse(storedUser);
        const collegeId = user.role === "college" ? user._id : user.collegeId;
        if(!collegeId) {
            alert("College link not found for this account.");
            return;
        }

        await api.post("/api/auth/add-student", { ...formData, collegeId });
        alert(`Student added!`);
        setFormData({ name: "", email: "", branch: "", cgpa: "", phone: "" });
        fetchStudents();
    } catch (error: any) {
        alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  // 4. BULK UPLOAD
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) setBulkFile(e.target.files[0]);
  };

  const processBulkUpload = async () => {
    if(!bulkFile) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        if(jsonData.length === 0) { alert("File empty!"); setIsUploading(false); return; }

        try {
            const storedUser = localStorage.getItem("user");
            if(!storedUser) {
                alert("Session missing. Please log in again.");
                setIsUploading(false);
                return;
            }
            const user = JSON.parse(storedUser);
            const collegeId = user.role === "college" ? user._id : user.collegeId;
            if(!collegeId) {
                alert("College link not found for this account.");
                setIsUploading(false);
                return;
            }

            const res = await api.post("/api/auth/add-students-bulk", { students: jsonData, collegeId });
            alert(res.data.message);
            setBulkFile(null);
            fetchStudents();
        } catch (error: any) { alert("Upload Failed: " + error.message); } 
        finally { setIsUploading(false); }
    };
    reader.readAsBinaryString(bulkFile);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ name: "John Doe", email: "john@test.com", branch: "CSE", cgpa: 8.5, phone: "9876543210" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_template.xlsx");
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const eligibleCount = students.filter(s => parseFloat(s.cgpa || "0") >= 7).length;
  const activeCount = students.filter(s => !s.isFirstLogin).length;

  // --- THE NEW LAYOUT WRAPPER ---
  return (
    <CollegeLayout>
      <div className="px-8 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Students Directory</h1>
            <p className="text-sm text-slate-500">Manage student profiles and placement readiness.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Moon size={16} />
            </button>
            <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell size={16} />
            </button>
            <button
              onClick={() => { setShowPanel(true); setActiveMethod("manual"); }}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <UserPlus size={16} /> Add Student
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Total Students</div>
            <div className="text-2xl font-semibold text-slate-900">{totalStudents}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Eligible for Placement</div>
            <div className="text-2xl font-semibold text-slate-900">{eligibleCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-slate-500">Active Students</div>
            <div className="text-2xl font-semibold text-slate-900">{activeCount}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <button
              onClick={() => { setShowPanel(true); setActiveMethod("bulk"); }}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <Upload size={16} /> Bulk Upload
            </button>
            <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-slate-600">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {showPanel && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-800">Add Students</div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setActiveMethod("manual")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  activeMethod === "manual" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveMethod("bulk")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  activeMethod === "bulk" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Bulk Upload
              </button>
            </div>

            {activeMethod === "manual" ? (
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border border-slate-200 rounded-lg bg-slate-50"/>
                  <input required placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-3 border border-slate-200 rounded-lg bg-slate-50"/>
                  <input required placeholder="Branch" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="p-3 border border-slate-200 rounded-lg bg-slate-50"/>
                  <input required placeholder="CGPA" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} className="p-3 border border-slate-200 rounded-lg bg-slate-50"/>
                  <input required placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-3 border border-slate-200 rounded-lg bg-slate-50"/>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">Add Student</button>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <input type="file" onChange={handleFileChange} accept=".xlsx, .csv" className="text-sm text-slate-600"/>
                <button onClick={processBulkUpload} disabled={!bulkFile || isUploading} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">
                  {isUploading ? "Uploading..." : "Process File"}
                </button>
                <button onClick={downloadTemplate} className="text-sm text-blue-600">
                  Download Template
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search by name or email..."
                className="outline-none text-sm w-56 text-slate-600 bg-transparent"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
                Department: All <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
                CGPA {">"} 8.0 <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2">
                Status: Active <ChevronDown size={14} />
              </button>
              <button onClick={fetchStudents} className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="p-4">Student Profile</th>
                  <th className="p-4">Academic Info</th>
                  <th className="p-4">Skills</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading directory...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No students found.</td></tr>
                ) : (
                  filteredStudents.map((student) => {
                    const skills = (student.skills || "")
                      .split(",")
                      .map((skill: string) => skill.trim())
                      .filter(Boolean)
                      .slice(0, 3);
                    return (
                      <tr key={student._id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                              {(student.name || "S").split(" ").map((part: string) => part[0]).slice(0, 2).join("").toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">{student.name}</div>
                              <div className="text-xs text-slate-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-700">{student.branch || "N/A"}</div>
                          <div className="text-xs text-slate-500">CGPA: {student.cgpa || "N/A"}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {skills.length === 0 && <span className="text-xs text-slate-400">No skills</span>}
                            {skills.map((skill: string) => (
                              <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.isFirstLogin ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {student.isFirstLogin ? "Pending Activation" : "Active"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDelete(student._id)} className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 size={16}/>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
}
