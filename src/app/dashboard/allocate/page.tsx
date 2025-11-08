"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Sun, Factory, Building2, Users, Download, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Icons for sectors
const icons = {
  Livelihoods: <Sun className="h-5 w-5" />,
  Industries: <Factory className="h-5 w-5" />,
  "Govt Projects": <Building2 className="h-5 w-5" />,
};

const COLORS = ["#00C49F", "#0088FE", "#FFBB28"];

export default function AllocatePage() {
  const router = useRouter();
  const [livelihoods, setLivelihoods] = useState(40);
  const [industries, setIndustries] = useState(35);
  const [govt, setGovt] = useState(25);

  const total = livelihoods + industries + govt;
  const normalized = useMemo(() => {
    if (total === 100) return { livelihoods, industries, govt };
    return {
      livelihoods: Math.round((livelihoods / total) * 100),
      industries: Math.round((industries / total) * 100),
      govt: Math.round((govt / total) * 100),
    };
  }, [livelihoods, industries, govt]);

  const data = [
    { name: "Livelihoods", value: normalized.livelihoods, icon: icons.Livelihoods, color: COLORS[0] },
    { name: "Industries", value: normalized.industries, icon: icons.Industries, color: COLORS[1] },
    { name: "Govt Projects", value: normalized.govt, icon: icons["Govt Projects"], color: COLORS[2] },
  ];

  // Export Allocation Bill
  const exportBill = () => {
    const summary = `
╔══════════════════════════════════════════════╗
             HEATX ENERGY ALLOCATION
                 OFFICIAL STATEMENT
╚══════════════════════════════════════════════╝

Date & Time : ${new Date().toLocaleString()}
Platform    : HeatX AI v2.1

------------------------------------------------
| SECTOR          | ALLOCATED ENERGY (%)      |
------------------------------------------------
| Livelihoods     | ${normalized.livelihoods.toString().padStart(3, " ")}%                  |
| Industries      | ${normalized.industries.toString().padStart(3, " ")}%                  |
| Govt Projects   | ${normalized.govt.toString().padStart(3, " ")}%                  |
------------------------------------------------

Total Allocation : ${normalized.livelihoods + normalized.industries + normalized.govt}%
Status           : ✅ Allocation finalized successfully

------------------------------------------------
This document certifies that HEATX has allocated
energy as per the above distribution to respective
sectors intelligently and effectively.

Thank you for trusting HEATX AI.
`;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heatx-allocation-bill.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("📥 Allocation bill downloaded");
  };

  // Allocate Button: Export & Redirect
  const handleAllocate = () => {
    exportBill();
    router.push("/dashboard"); // Redirect to dashboard
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-4 py-2 rounded-full mb-2">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">
            Smart Allocation Engine
          </span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Distribute Energy Intelligently
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Allocation Sliders */}
        <Card className="glass-panel col-span-1 lg:col-span-2 border-white/10 overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4 flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Sector Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {[
              { label: "Livelihoods", value: livelihoods, setValue: setLivelihoods, color: "from-green-400 to-emerald-400", icon: icons.Livelihoods },
              { label: "Industries", value: industries, setValue: setIndustries, color: "from-blue-400 to-cyan-400", icon: icons.Industries },
              { label: "Govt Projects", value: govt, setValue: setGovt, color: "from-yellow-400 to-orange-400", icon: icons["Govt Projects"] },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-xs`}>
                      {i + 1}
                    </div>
                    <label className="font-medium flex items-center gap-2">
                      {item.icon}{item.label}
                    </label>
                  </div>
                  <Badge variant="secondary" className="bg-white/10">{item.value}%</Badge>
                </div>
                <Slider value={[item.value]} onValueChange={(vals) => item.setValue(vals[0])} max={100} step={1} />
              </motion.div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4 flex justify-end gap-2">
            <Button onClick={handleAllocate} className="bg-green-500 hover:bg-green-600 gap-2">
              <Check className="h-4 w-4" /> Allocate
            </Button>
          </CardFooter>
        </Card>

        {/* Pie Chart */}
        <Card className="glass-panel border-white/10 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" /> Distribution Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value}%`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
