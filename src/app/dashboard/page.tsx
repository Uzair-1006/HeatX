"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  BatteryCharging,
  Gauge,
  Leaf,
  Brain,
  Factory,
  CircuitBoard,
  BarChart3,
  TrendingUp,
  Power,
  LineChart,
  Thermometer,
  Loader2,
  Cpu,
} from "lucide-react";

export default function HeatXDashboard() {
  const [currentHeat, setCurrentHeat] = useState(94.2);
  const [currentPower, setCurrentPower] = useState(16.4);
  const [currentEfficiency, setCurrentEfficiency] = useState(82.7);
  const [currentCO2, setCurrentCO2] = useState(12.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeat((prev) => prev + (Math.random() - 0.5) * 2);
      setCurrentPower((prev) => prev + (Math.random() - 0.5) * 0.5);
      setCurrentEfficiency((prev) =>
        Math.min(100, Math.max(70, prev + (Math.random() - 0.5)))
      );
      setCurrentCO2((prev) => prev + Math.random() * 0.2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Factory className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                HeatX Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Autonomous Energy & Carbon Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Body */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* KPI Section */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Thermal Energy",
              value: currentHeat.toFixed(1),
              unit: "°C",
              change: "+2.3%",
              icon: <Thermometer className="h-5 w-5" />,
              color: "from-orange-500 to-red-500",
            },
            {
              label: "Power Output",
              value: currentPower.toFixed(1),
              unit: "kWh",
              change: "+8.1%",
              icon: <Power className="h-5 w-5" />,
              color: "from-cyan-500 to-emerald-400",
            },
            {
              label: "Conversion Efficiency",
              value: currentEfficiency.toFixed(1),
              unit: "%",
              change: "+1.9%",
              icon: <Gauge className="h-5 w-5" />,
              color: "from-blue-500 to-violet-500",
            },
            {
              label: "CO₂ Reduction",
              value: currentCO2.toFixed(1),
              unit: "kg",
              change: "+5.7%",
              icon: <Leaf className="h-5 w-5" />,
              color: "from-green-500 to-emerald-500",
            },
          ].map((metric, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:scale-[1.02] transition-transform shadow-sm shadow-black/20`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2.5 rounded-lg bg-gradient-to-br ${metric.color} text-white`}
                >
                  {metric.icon}
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                  <TrendingUp className="h-3 w-3" /> {metric.change}
                </span>
              </div>
              <p className="text-xs uppercase text-slate-400">{metric.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <span className="text-sm text-slate-500">{metric.unit}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Heat Trend */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">
                  Heat Capture Trend
                </h3>
              </div>
              <span className="text-xs text-slate-500">Realtime</span>
            </div>
            <div className="space-y-3">
              {[70, 80, 90, 95, currentHeat].map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-slate-500 font-mono">
                    {i === 4 ? "Now" : `T-${(4 - i) * 5}s`}
                  </span>
                  <div className="flex-1 h-6 bg-slate-800/50 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${v}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {v.toFixed(1)}°C
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Histogram */}
          <div className="grid grid-cols-5 gap-3">
            {[70, 73, 75, 78, currentEfficiency].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full h-32 bg-slate-800/30 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000"
                    style={{ height: `${val}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400">C{i + 1}</span>
                <span className="text-xs font-semibold text-white">
                  {val.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Analytics */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Brain className="h-4 w-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-white">
                AI Optimization Insights
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>• Adaptive energy routing improved efficiency by 3.4%.</li>
              <li>• Optimal heat recovery time: 21.3s average.</li>
              <li>• Peak conversion zone maintained at 94°C.</li>
              <li>• Predictive model recalibration every 10 min.</li>
            </ul>
          </div>

          {/* System Health */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">
                System Health Status
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Heat Source", status: "Active", color: "emerald" },
                { label: "Conversion Unit", status: "Stable", color: "blue" },
                { label: "AI Model", status: "Running", color: "amber" },
                { label: "Anomalies", status: "None", color: "slate" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-slate-800/60 p-3 rounded-lg bg-slate-800/30"
                >
                  <span className="font-medium text-slate-300">{s.label}</span>
                  <span
                    className={`text-xs font-semibold text-${s.color}-400 bg-${s.color}-500/10 px-3 py-1 rounded-full`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CircuitBoard className="h-4 w-4 text-violet-400" />
              <h3 className="font-semibold text-sm text-white">
                Blockchain Ledger Summary
              </h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>• 3 Blocks mined today</li>
              <li>• 1 Mint, 1 Transfer, 1 Retire transaction</li>
              <li>• Verification: ✅ Ledger Integrity Passed</li>
              <li>• Active Nodes: 4 regional hubs</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800/60 text-xs text-slate-500 text-center">
          ⚡ Powered by HeatX AI • Decentralized Energy Optimization •
          Sustainable Future
        </footer>
      </main>
    </div>
  );
}
