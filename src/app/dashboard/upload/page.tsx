"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  Database,
  Zap,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAnalyzeStore } from "@/lib/analyseStore"; // Zustand store

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const setDataset = useAnalyzeStore((state) => state.setDataset);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview([]);
    setError(null);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview([]);
      setError(null);
    }
  };

  // Upload file to backend
  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const backendURL = "http://127.0.0.1:8000/api/upload";
      const response = await axios.post(backendURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.preview) setPreview(response.data.preview);
      if (response.data?.dataset) setDataset(response.data.dataset);

      if (!response.data?.preview && !response.data?.dataset)
        setError("No data returned from server.");
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err?.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Tailwind-safe color mapping
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400",
    violet: "bg-violet-500/20 text-violet-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dataset Upload</h1>
          <p className="text-slate-400">
            Upload your industrial data for AI-powered analysis and insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Upload Dataset
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {/* Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/30"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                      <FileSpreadsheet className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {dragActive
                        ? "Drop your file here"
                        : "Drag & drop your file"}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Supports CSV, XLSX files up to 50MB
                    </p>
                    <button className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                      Browse Files
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* File Info */}
                {file && (
                  <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-emerald-400">
                            {file.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {(file.size / 1024).toFixed(1)} KB • Ready to upload
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <X className="h-5 w-5 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={uploadFile}
                  disabled={!file || loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    "Upload & Process"
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Preview Table */}
            {preview.length > 0 && (
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-violet-400" />
                      <h2 className="text-lg font-semibold text-white">
                        Data Preview
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      First {preview.length - 1} rows
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-slate-400 mb-4">
                    Preview of your uploaded dataset. Scroll to explore columns
                    and rows.
                  </p>
                  <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-slate-800/50">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800/50 sticky top-0 z-10">
                        <tr>
                          {preview[0]?.map((header, i) => (
                            <th
                              key={i}
                              className="px-4 py-3 text-left font-semibold text-slate-300 whitespace-nowrap"
                            >
                              {header || `Col ${i + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.slice(1).map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-4 py-3 text-slate-300 whitespace-nowrap"
                              >
                                {cell || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => router.push("/dashboard/analyze")}
                    className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Proceed to Analysis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Upload Guide */}
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <h3 className="text-lg font-semibold text-white">Upload Guide</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    step: "1",
                    title: "Prepare Your Data",
                    desc: "Ensure your CSV/Excel file has clear column headers",
                    color: "blue",
                  },
                  {
                    step: "2",
                    title: "Upload File",
                    desc: "Drag & drop or click to select your dataset",
                    color: "violet",
                  },
                  {
                    step: "3",
                    title: "Preview & Verify",
                    desc: "Check the data preview to ensure accuracy",
                    color: "emerald",
                  },
                  {
                    step: "4",
                    title: "Start Analysis",
                    desc: "Proceed to get AI-powered insights",
                    color: "amber",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[item.color]}`}
                    >
                      <span className="text-sm font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-blue-500/10 to-violet-500/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Quick Stats
                    </h3>
                    <p className="text-xs text-slate-400">
                      Platform performance
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Uploads Today", value: "247", icon: <TrendingUp className="h-4 w-4" /> },
                    { label: "Avg Processing", value: "2.3s", icon: <Zap className="h-4 w-4" /> },
                    { label: "Success Rate", value: "99.8%", icon: <Check className="h-4 w-4" /> },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-blue-400">{stat.icon}</div>
                        <span className="text-sm text-slate-300">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
