"use client";

import { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Flame,
  Zap,
  Gauge,
  Leaf,
  Cpu,
  Factory,
  AlertCircle,
  Bot,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function HeatXDashboard() {
  const [heatData, setHeatData] = useState<number[]>([85, 90, 92, 88, 94, 97]);
  const [efficiencyData, setEfficiencyData] = useState<number[]>([70, 73, 75, 78, 80]);
  const [powerOutput, setPowerOutput] = useState<number[]>([12, 14, 15, 13, 16, 17]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeatData((prev) => [...prev.slice(1), Math.random() * 20 + 80]);
      setEfficiencyData((prev) => [...prev.slice(1), Math.random() * 10 + 70]);
      setPowerOutput((prev) => [...prev.slice(1), Math.random() * 8 + 12]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heatChart = {
    labels: ["-25s", "-20s", "-15s", "-10s", "-5s", "Now"],
    datasets: [
      {
        label: "Heat Captured (°C)",
        data: heatData,
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const efficiencyChart = {
    labels: ["Cycle 1", "Cycle 2", "Cycle 3", "Cycle 4", "Cycle 5"],
    datasets: [
      {
        label: "Conversion Efficiency (%)",
        data: efficiencyData,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const powerPrediction = {
    labels: ["T-5", "T-4", "T-3", "T-2", "T-1", "Now"],
    datasets: [
      {
        label: "Power Output (kWh)",
        data: powerOutput,
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const resourceChart = {
    labels: ["Heat Recovery", "Storage", "Distribution", "Loss"],
    datasets: [
      {
        label: "Energy Allocation",
        data: [45, 30, 20, 5],
        backgroundColor: [
          "rgba(16,185,129,0.7)",
          "rgba(59,130,246,0.7)",
          "rgba(245,158,11,0.7)",
          "rgba(239,68,68,0.7)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#CBD5E1" } },
    },
    scales: {
      x: { ticks: { color: "#94A3B8" }, grid: { color: "#1E293B" } },
      y: { ticks: { color: "#94A3B8" }, grid: { color: "#1E293B" } },
    },
  };

  return (
    <div className="flex-1 overflow-y-auto h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 sticky top-0 bg-slate-950/80 backdrop-blur-md pb-3 z-20">
          <h1 className="text-3xl font-bold text-white mb-1">HeatX AI Dashboard</h1>
          <p className="text-gray-400 text-sm">Real-time heat energy capture and conversion analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Heat Captured",
              value: "94.2°C",
              icon: <Flame className="h-6 w-6 text-orange-400" />,
              gradient: "from-orange-500/40 to-yellow-500/20",
            },
            {
              label: "Power Output",
              value: "16.4 kWh",
              icon: <Zap className="h-6 w-6 text-emerald-400" />,
              gradient: "from-emerald-500/40 to-cyan-500/20",
            },
            {
              label: "Efficiency",
              value: "82.7%",
              icon: <Gauge className="h-6 w-6 text-blue-400" />,
              gradient: "from-blue-500/40 to-purple-500/20",
            },
            {
              label: "CO₂ Reduced",
              value: "12.3 kg",
              icon: <Leaf className="h-6 w-6 text-green-400" />,
              gradient: "from-green-500/40 to-emerald-500/20",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl bg-gradient-to-br ${card.gradient} border border-white/10 backdrop-blur-lg shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                {card.icon}
                <p className="text-sm text-gray-400">{card.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="p-6 bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Heat Capture Trend</h3>
            <div className="h-60">
              <Line data={heatChart} options={chartOptions} />
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Conversion Efficiency by Cycle
            </h3>
            <div className="h-60">
              <Bar data={efficiencyChart} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="p-6 bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Predicted Power Output</h3>
            <div className="h-60">
              <Line data={powerPrediction} options={chartOptions} />
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Resource Allocation</h3>
            <div className="h-60 flex items-center justify-center">
              <Pie
                data={resourceChart}
                options={{
                  plugins: { legend: { labels: { color: "#CBD5E1" } } },
                }}
              />
            </div>
          </div>

          {/* System Health */}
          <div className="p-6 bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-xl flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-300">Heat Source</span>
                </div>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Conversion Unit</span>
                </div>
                <span className="text-blue-400 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300">AI Advisor</span>
                </div>
                <span className="text-yellow-400 font-semibold">Optimizing</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Anomalies</span>
                </div>
                <span className="text-gray-400">None</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 mb-4 text-sm text-gray-500">
          ⚡ Powered by HeatX AI • Real-time Efficiency • Sustainable Future
        </div>
      </div>
    </div>
  );
}
