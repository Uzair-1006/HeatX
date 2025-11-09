'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Info, Thermometer, Gauge, Zap, BarChart3, Download, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

// Dummy data for chart & cards
const methodData = [
  {
    method: 'Kalina Cycle',
    efficiency: 42.7,
    conditions: 'Best for medium-temp (250–400°C), variable heat sources',
    pros: ['High efficiency in mid-range temps', 'Flexible with mixed fluids', 'Lower maintenance'],
    cons: ['Complex setup', 'Higher initial cost'],
    recommended: true,
    tempRange: '250–400°C',
    cost: 'Medium',
    scalability: 'High',
  },
  {
    method: 'Steam Turbine',
    efficiency: 35.2,
    conditions: 'High-temp only (>450°C), stable steam supply',
    pros: ['Proven technology', 'High power output'],
    cons: ['Inefficient below 450°C', 'Water intensive', 'Slow ramp-up'],
    recommended: false,
    tempRange: '>450°C',
    cost: 'High',
    scalability: 'Medium',
  },
  {
    method: 'ORC Cycle',
    efficiency: 28.9,
    conditions: 'Low-temp (<250°C), remote or modular sites',
    pros: ['Works at low temps', 'Modular & portable', 'Low noise'],
    cons: ['Lower efficiency', 'Expensive working fluids'],
    recommended: false,
    tempRange: '<250°C',
    cost: 'Low-Medium',
    scalability: 'Very High',
  },
];

const COLORS = ['#fb923c', '#ec4899', '#6366f1'];

function MethodCard({ method, exportMethod }: any) {
  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-slate-800/70 rounded-3xl shadow-[0_0_25px_rgba(251,146,60,0.12)] overflow-hidden relative">
      <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-orange-500 via-pink-500 to-yellow-400 rounded-r"></div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 pt-8 pb-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-400 border-none font-semibold tracking-wide">
            AI Recommended
          </Badge>
          <CardTitle className="text-2xl font-bold text-white">{method.method}</CardTitle>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={exportMethod}
          className="gap-2 border border-slate-700/60 text-black-200 hover:text-orange-300 hover:border-orange-500 transition-all"
        >
          <Download className="h-4 w-4 text-black" />
          Export Details
        </Button>
      </CardHeader>

      <CardContent className="pt-8 pb-10 px-8 grid md:grid-cols-2 gap-10 items-center">
        {/* Info Section */}
        <div>
          <div className="flex items-end gap-2 mb-8">
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-pink-500 to-yellow-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.3)]">
              {method.efficiency}%
            </div>
            <div className="text-gray-400 mb-1 font-medium">Efficiency</div>
          </div>

          <div className="space-y-3 mb-8 text-gray-300">
            <div className="flex items-center gap-2 text-base">
              <Thermometer className="h-4 w-4 text-blue-400" />
              <span>
                Optimal Temp: <strong className="text-gray-100">{method.tempRange}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Gauge className="h-4 w-4 text-green-400" />
              <span>
                Scalability: <strong className="text-gray-100">{method.scalability}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>
                Cost Level: <strong className="text-gray-100">{method.cost}</strong>
              </span>
            </div>
          </div>

          <div className="mb-7 px-4 py-3 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl border border-slate-800/80 shadow-inner">
            <h4 className="font-semibold mb-2 flex items-center gap-1 text-orange-400">
              <Info className="h-4 w-4" /> Why This Method?
            </h4>
            <p className="text-gray-300">{method.conditions}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-green-400 mb-2">Pros</h5>
              <ul className="space-y-1 text-sm text-gray-300">
                {method.pros.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-red-400 mb-2">Cons</h5>
              <ul className="space-y-1 text-sm text-gray-300">
                {method.cons.map((con: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400">×</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MethodsChart({ selectedMethod, setSelectedMethod }: any) {
  return (
    <Card className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-lg rounded-3xl shadow-[0_0_25px_rgba(147,51,234,0.1)] hover:shadow-[0_0_35px_rgba(251,146,60,0.15)] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100 font-semibold">
          <BarChart3 className="h-5 w-5 text-pink-500" />
          Method Efficiency Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={methodData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              onClick={(data) =>
                data &&
                setSelectedMethod(methodData[data.activePayload[0].payload.index])
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="method"
                stroke="#9ca3af"
                angle={-28}
                textAnchor="end"
                height={80}
                interval={0}
                style={{ fontWeight: 600 }}
              />
              <YAxis unit="%" stroke="#9ca3af" domain={[0, 50]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#e2e8f0",
                  fontWeight: 500,
                }}
                formatter={(value) => [`${value}%`, "Efficiency"]}
              />
              <Bar dataKey="efficiency" radius={[12, 12, 0, 0]} isAnimationActive={true}>
                {methodData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.recommended ? "#fb923c" : COLORS[index % COLORS.length]}
                    stroke={entry.recommended ? "#fb923c" : "#64748b"}
                    strokeWidth={entry.recommended ? 3 : 1}
                    className="cursor-pointer hover:opacity-90 transition"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-pink-900/30 via-orange-900/20 to-yellow-900/20 border border-slate-800/80 shadow-inner">
          <p className="text-sm text-gray-300 text-center">
            <strong>Selected:</strong>{" "}
            <span className="text-orange-400 font-semibold">
              {selectedMethod.method}
            </span>{" "}
            — Click any bar to view details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MethodsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const AT = searchParams.get("AT");
  useEffect(() => {
    if (!AT) {
      toast.error("⚠️ Temperature (AT) not provided! Redirecting...");
      router.push("/dashboard/predict");
    }
  }, [AT, router]);

  const bestMethod = methodData.find((m) => m.recommended)!;
  const [selectedMethod, setSelectedMethod] = useState(bestMethod);

  const exportMethod = () => {
    const summary = `HEATX METHOD RECOMMENDATION\n\n` +
      `Recommended: ${selectedMethod.method}\n` +
      `Efficiency: ${selectedMethod.efficiency}%\n` +
      `Conditions: ${selectedMethod.conditions}\n` +
      `Temperature Range: ${selectedMethod.tempRange}\n` +
      `Cost Level: ${selectedMethod.cost}\n` +
      `Scalability: ${selectedMethod.scalability}\n\n` +
      `Pros:\n${selectedMethod.pros.map((p: string) => `- ${p}`).join("\n")}\n\n` +
      `Cons:\n${selectedMethod.cons.map((c: string) => `- ${c}`).join("\n")}\n\n` +
      `Generated: ${new Date().toLocaleString()}`;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heatx-method-${selectedMethod.method.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`📥 ${selectedMethod.method} details downloaded`);
  };

  if (!AT) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-black to-slate-900 px-4 py-10 overflow-auto text-gray-100">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-yellow-400/20 px-5 py-2 rounded-full shadow-inner mb-5 border border-slate-800/70">
            <Lightbulb className="h-5 w-5 text-orange-400" />
            <span className="text-orange-300 font-semibold text-base tracking-wide">
              AI-Powered Method Recommendation
            </span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.4)]">
            Optimal Heat Conversion Method
          </h1>
          <p className="text-gray-400 mt-3 text-lg font-medium">
            Tailored insights from your dataset’s thermal and cost profiles.
          </p>
        </motion.div>

        <MethodCard method={bestMethod} exportMethod={exportMethod} />
        <MethodsChart selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard/allocate")}
            className="gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-slate-950 font-bold shadow-lg px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            <ArrowRight className="h-5 w-5" />
            Proceed to Allocation
          </Button>
        </div>
      </div>
    </div>
  );
}
