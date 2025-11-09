"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalyzeStore } from "@/lib/analyseStore";
import {
  Database,
  Activity,
  Play,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const { dataset, name, result, loading, error, analyzeDataset, clearResult } =
    useAnalyzeStore();

  useEffect(() => {
    if (!dataset) router.push("/dashboard/upload");
  }, [dataset, router]);

  if (!dataset) return null;

  const featureNames = ["AT", "V", "AP", "RH"];

  const renderValue = (key: string, val: any) => {
    if (val === null || val === undefined) return "-";

    if (key === "FEATURE_IMPORTANCES" && Array.isArray(val)) {
      const maxIndex = val.indexOf(Math.max(...val));
      return (
        <div className="space-y-3 mt-4">
          {val.map((v, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-300">{featureNames[i]}</span>
                <span
                  className={`font-semibold ${
                    i === maxIndex ? "text-amber-400" : "text-slate-400"
                  }`}
                >
                  {(v * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i === maxIndex
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                  style={{ width: `${v * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof val === "number") return val.toFixed(3);
    if (Array.isArray(val))
      return val.map((v) => v?.toFixed?.(3) ?? v).join(", ");
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return val;
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Data Analysis</h1>
            <p className="text-slate-400 text-sm">
              Run Gradient Boosting Regression on your dataset
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-emerald-400 font-medium">
                {loading ? "Processing" : "Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Dataset Preview */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Dataset Preview: {name}
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Loaded</span>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm border border-slate-800/50">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-center border-r border-slate-700/50 text-slate-300">
                    #
                  </th>
                  {["AT", "V", "AP", "RH", "PE"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-center text-slate-300 font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.slice(1, 7).map((row: any, i: number) => (
                  <tr
                    key={i}
                    className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-center border-r border-slate-700/50 text-slate-400 font-medium">
                      {i + 1}
                    </td>
                    {row.map((cell: any, j: number) => (
                      <td
                        key={j}
                        className="px-4 py-3 text-center text-slate-300"
                      >
                        {cell ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => analyzeDataset("regression")}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Gradient Boosting...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Gradient Boosting Regression
              </>
            )}
          </button>
          <button
            onClick={clearResult}
            className="px-6 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && !error && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(result)
                  .filter(([key]) => key !== "FEATURE_IMPORTANCES")
                  .map(([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-5 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {key.includes("R2") ? (
                          <Zap className="h-5 w-5 text-amber-400" />
                        ) : (
                          <BarChart3 className="h-5 w-5 text-blue-400" />
                        )}
                        <span className="uppercase text-sm text-slate-300 font-semibold tracking-wide">
                          {key.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-white font-mono text-center">
                        {renderValue(key, value)}
                      </p>
                    </motion.div>
                  ))}
              </div>

              {/* Feature Importance */}
              {result.FEATURE_IMPORTANCES && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-800/50 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">
                      Feature Importance
                    </h2>
                  </div>
                  <div className="p-6">
                    {renderValue("FEATURE_IMPORTANCES", result.FEATURE_IMPORTANCES)}
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => router.push("/dashboard/predict")}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  Proceed to Prediction
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl border border-red-500/50 bg-red-500/10 p-6 mt-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <h2 className="text-lg font-semibold text-red-400">
                  Analysis Failed
                </h2>
              </div>
              <p className="text-red-300 text-sm font-mono whitespace-pre-wrap">
                {typeof error === "string"
                  ? error
                  : JSON.stringify(error, null, 2)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
