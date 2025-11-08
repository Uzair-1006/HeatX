"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalyzeStore } from "@/lib/analyseStore";

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
        <table className="table-auto w-full border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-200">
              {featureNames.map((feature, i) => (
                <th key={i} className="border px-2 py-1">
                  {feature}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {val.map((v: number, i: number) => (
                <td
                  key={i}
                  className={`border px-2 py-1 text-center ${
                    i === maxIndex ? "bg-yellow-300 font-bold" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{v.toFixed(3)}</span>
                    <div className="w-full h-2 bg-gray-300 rounded mt-1">
                      <div
                        className={`h-2 rounded ${
                          i === maxIndex ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${v * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      );
    }

    if (Array.isArray(val))
      return val.map((v) => (v === null ? "-" : v.toFixed?.(3) ?? v)).join(", ");
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    if (typeof val === "number") return val.toFixed(3);
    return val;
  };

  return (
    <div className="space-y-6 p-4 pb-8 overflow-auto max-h-screen">
      {/* Dataset Preview */}
      <Card className="glass-panel border-white/10 overflow-auto max-h-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Dataset Preview: {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  {/* 👇 Added S.No column */}
                  <th className="px-2 py-1 border border-gray-400">S.No</th>
                  {["AT", "V", "AP", "RH", "PE"].map((header) => (
                    <th key={header} className="px-2 py-1 border border-gray-400">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 👇 Increased slice to 7 (showing 6 rows instead of 5) */}
                {dataset.slice(1, 7).map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/5 transition-colors text-sm"
                  >
                    {/* 👇 Serial number column */}
                    <td className="px-2 py-1 border border-gray-400 text-center font-medium">
                      {i + 1}
                    </td>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-2 py-1 border border-gray-400 text-center"
                      >
                        {cell ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analyze / Clear Buttons */}
      <div className="flex gap-4">
        <Button
          className="ml-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-transform"
          onClick={() => analyzeDataset("regression")}
          disabled={loading}
        >
          {loading
            ? "Running Gradient Boosting..."
            : "Run Gradient Boosting Regression"}
        </Button>
        <Button variant="ghost" onClick={clearResult}>
          Clear Result
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && !error && (
          <motion.div
            key="results-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            {Object.entries(result).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className="glass-panel border-white/10 p-4 h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      {key.replaceAll("_", " ").toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-lg font-mono text-center">
                    {renderValue(key, value)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="glass-panel border-red-500/50 bg-red-500/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-red-500 text-lg font-semibold">
                  Analysis Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-400 whitespace-pre-wrap font-mono">
                  {typeof error === "string"
                    ? error
                    : JSON.stringify(error, null, 2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proceed Button */}
      {result && !error && (
        <div className="flex justify-end mt-6">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            onClick={() => router.push("/dashboard/predict")}
          >
            Proceed to Prediction
          </Button>
        </div>
      )}
    </div>
  );
}
