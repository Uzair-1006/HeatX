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
import { Sun, Factory, Building2, Users, Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const icons = {
  Livelihoods: <Sun className="h-5 w-5" />,
  Industries: <Factory className="h-5 w-5" />,
  "Govt Projects": <Building2 className="h-5 w-5" />,
};

const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

const sliderConfigs = (
  livelihoods: number,
  industries: number,
  govt: number,
  setLivelihoods: (v: number) => void,
  setIndustries: (v: number) => void,
  setGovt: (v: number) => void
) => [
  {
    label: "Livelihoods",
    icon: icons.Livelihoods,
    color: COLORS[0],
    value: livelihoods,
    setValue: setLivelihoods,
  },
  {
    label: "Industries",
    icon: icons.Industries,
    color: COLORS[1],
    value: industries,
    setValue: setIndustries,
  },
  {
    label: "Govt Projects",
    icon: icons["Govt Projects"],
    color: COLORS[2],
    value: govt,
    setValue: setGovt,
  },
];

export default function AllocatePage() {
  const router = useRouter();
  const [livelihoods, setLivelihoods] = useState(40);
  const [industries, setIndustries] = useState(35);
  const [govt, setGovt] = useState(25);

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

  const configs = sliderConfigs(
    livelihoods,
    industries,
    govt,
    setLivelihoods,
    setIndustries,
    setGovt
  );

  const data = configs.map((item) => ({
    name: item.label,
    value: normalized[
      item.label === "Livelihoods"
        ? "livelihoods"
        : item.label === "Industries"
        ? "industries"
        : "govt"
    ],
    color: item.color,
  }));

  const exportBill = () => {
    toast.success("Allocation bill downloaded");
  };

  const handleAllocate = () => {
    exportBill();
    router.push("/dashboard");
  };

  const isOverAllocated = total > 100;
  const isUnderAllocated = total < 100;

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-green-400 rounded-full font-medium text-sm mb-4">
            <Zap className="h-4 w-4" />
            AI-Powered Energy Allocation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Distribute Energy Intelligently
          </h1>
          <p className="text-black-400 text-lg max-w-2xl mx-auto">
            Smart energy management across critical sectors — optimized for sustainability and impact.
          </p>
        </motion.div>

        {/* STATUS */}
        {total !== 100 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-3 px-5 rounded-xl border ${
              isOverAllocated
                ? "bg-white-900/30 border-red-700 text-red-300"
                : "bg-white-900/30 border-amber-700 text-amber-300"
            }`}
          >
            <span className="font-mono tracking-wide">
              {total}% allocated —{" "}
              {isOverAllocated ? "Reduce by" : "Add"}{" "}
              {Math.abs(100 - total)}% to balance.
            </span>
          </motion.div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* SLIDERS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="rounded-2xl border border-black/10 bg-black/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/20 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10">
              <CardHeader className="pb-6 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-xlq">
                  <Users className="h-5 w-5 text-emerald-400" />
                  Sector Allocation
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-8 space-y-8">
                {configs.map((item, i) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white"
                          style={{
                            backgroundColor: `${item.color}30`,
                            border: `1px solid ${item.color}40`,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span className="font-medium flex items-center gap-2 text-gray-100">
                          {item.icon}
                          {item.label}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-mono bg-gray-800/60 border-gray-700 text-gray-200 px-3 py-1"
                      >
                        {item.value}%
                      </Badge>
                    </div>
                    <Slider
                      value={[item.value]}
                      onValueChange={(vals) => item.setValue(vals[0])}
                      max={100}
                      step={1}
                      className="transition-all [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-lg hover:[&_[role=slider]]:scale-110"
                    />
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-10 flex justify-end">
                <Button
                  onClick={handleAllocate}
                  disabled={total !== 100}
                  className={`px-8 py-3 font-semibold rounded-xl text-base transition-all ${
                    total === 100
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-emerald-500/30"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Finalize Allocation
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/20 hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader className="pb-6 border-b border-white/10">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Distribution Overview
                </CardTitle>
              </CardHeader>

              <CardContent className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => [`${value}%`, "Allocation"]}
                      contentStyle={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(55, 65, 81, 0.6)",
                        borderRadius: "10px",
                        color: "white",
                        padding: "8px 12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        paddingTop: "16px",
                        color: "#9CA3AF",
                        fontSize: "14px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
