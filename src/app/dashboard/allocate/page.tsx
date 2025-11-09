"use client";
import { useState, useMemo } from "react";
import {
  Sun,
  Factory,
  Building2,
  Check,
  Zap,
  TrendingUp,
  AlertCircle,
  Download,
  BarChart3,
} from "lucide-react";

export default function AllocatePage() {
  const [livelihoods, setLivelihoods] = useState(40);
  const [industries, setIndustries] = useState(35);
  const [govt, setGovt] = useState(25);
  const [toast, setToast] = useState<string | null>(null);

  const total = livelihoods + industries + govt;

  const normalized = useMemo(() => {
    if (total === 100) return { livelihoods, industries, govt };
    const sum = total;
    return {
      livelihoods: Math.round((livelihoods / sum) * 100),
      industries: Math.round((industries / sum) * 100),
      govt: Math.round((govt / sum) * 100),
    };
  }, [livelihoods, industries, govt]);

  const configs = [
    {
      label: "Livelihoods",
      key: "livelihoods",
      icon: <Sun className="h-5 w-5 text-emerald-400" />,
      color: "#10B981",
      value: livelihoods,
      setValue: setLivelihoods,
      description: "Rural & community energy access",
    },
    {
      label: "Industries",
      key: "industries",
      icon: <Factory className="h-5 w-5 text-blue-400" />,
      color: "#3B82F6",
      value: industries,
      setValue: setIndustries,
      description: "Manufacturing & production facilities",
    },
    {
      label: "Govt Projects",
      key: "govt",
      icon: <Building2 className="h-5 w-5 text-amber-400" />,
      color: "#F59E0B",
      value: govt,
      setValue: setGovt,
      description: "Public infrastructure & services",
    },
  ];

  const isOverAllocated = total > 100;
  const isUnderAllocated = total < 100;
  const isBalanced = total === 100;

  const handleSliderChange = (index: number, value: number) => {
    configs[index].setValue(value);
  };

  const handleAllocate = () => {
    console.log("✅ Finalized Allocation:", normalized);
    setToast("✅ Allocation finalized successfully!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    const csv = [
      ["Sector", "Percentage"],
      ["Livelihoods", normalized.livelihoods],
      ["Industries", normalized.industries],
      ["Govt Projects", normalized.govt],
      ["Total", 100],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "energy_allocation_report.csv";
    link.click();

    setToast("📄 Exported Allocation Report!");
    setTimeout(() => setToast(null), 3000);
  };

  const chartData = configs.map((item) => ({
    ...item,
    percentage: normalized[item.key],
  }));

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              AI-Powered Distribution
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Energy Allocation System
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Intelligently distribute energy across sectors for sustainability
            and efficiency.
          </p>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-5 right-5 bg-slate-800/90 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-fade-in-up">
            {toast}
          </div>
        )}

        {/* Status Banner */}
        <div>
          {isBalanced ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3">
              <Check className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">
                Perfect Balance: 100% Allocated
              </span>
            </div>
          ) : (
            <div
              className={`p-4 rounded-xl border flex items-center justify-center gap-3 ${
                isOverAllocated
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <AlertCircle
                className={`h-5 w-5 ${
                  isOverAllocated ? "text-red-400" : "text-amber-400"
                }`}
              />
              <span
                className={`font-medium font-mono ${
                  isOverAllocated ? "text-red-400" : "text-amber-400"
                }`}
              >
                {total}% Allocated —{" "}
                {isOverAllocated ? "Reduce" : "Add"} {Math.abs(100 - total)}% to
                balance
              </span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sector Allocation */}
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-slate-800/50 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">
                  Sector Allocation
                </h2>
              </div>
              <div className="p-6 space-y-8">
                {configs.map((item, i) => (
                  <div key={item.label} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: item.color + "22",
                            border: `1px solid ${item.color}55`,
                          }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {item.label}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">
                          {item.value}
                        </span>
                        <span className="text-sm text-slate-400">%</span>
                      </div>
                    </div>

                    {/* Custom Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.value}
                      onChange={(e) =>
                        handleSliderChange(i, parseInt(e.target.value))
                      }
                      className="w-full h-3 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${item.value}%, rgb(30,41,59) ${item.value}%, rgb(30,41,59) 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                className="flex-1 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button
                onClick={handleAllocate}
                disabled={!isBalanced}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  isBalanced
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Check className="h-4 w-4" />
                Finalize Allocation
              </button>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Distribution Overview
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {chartData.reduce(
                    (acc, item, i) => {
                      const offset = acc.offset;
                      const percent = item.percentage / 100;
                      const circumference = 2 * Math.PI * 35;
                      const strokeDasharray = `${percent * circumference} ${circumference}`;
                      acc.elements.push(
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-offset * circumference}
                          className="transition-all duration-500"
                        />
                      );
                      acc.offset += percent;
                      return acc;
                    },
                    { elements: [], offset: 0 }
                  ).elements}
                  <circle cx="50" cy="50" r="29" fill="rgb(15,23,42)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white">{total}</div>
                  <div className="text-xs text-slate-400">Total %</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
