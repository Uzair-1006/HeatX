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

const COLORS = ['#fb923c', '#82ca9d', '#8884d8'];

export default function MethodsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const AT = searchParams.get('AT');

  // Redirect if AT is missing
  useEffect(() => {
    if (!AT) {
      toast.error('⚠️ Temperature (AT) not provided! Redirecting...');
      router.push('/dashboard/predict');
    }
  }, [AT, router]);

  const bestMethod = methodData.find(m => m.recommended)!;
  const [selectedMethod, setSelectedMethod] = useState(bestMethod);

  const exportMethod = () => {
    const summary = `HEATX METHOD RECOMMENDATION\n\n` +
      `Recommended: ${selectedMethod.method}\n` +
      `Efficiency: ${selectedMethod.efficiency}%\n` +
      `Conditions: ${selectedMethod.conditions}\n` +
      `Temperature Range: ${selectedMethod.tempRange}\n` +
      `Cost Level: ${selectedMethod.cost}\n` +
      `Scalability: ${selectedMethod.scalability}\n\n` +
      `Pros:\n${selectedMethod.pros.map(p => `- ${p}`).join('\n')}\n\n` +
      `Cons:\n${selectedMethod.cons.map(c => `- ${c}`).join('\n')}\n\n` +
      `Generated: ${new Date().toLocaleString()}`;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatx-method-${selectedMethod.method.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`📥 ${selectedMethod.method} details downloaded`);
  };

  const handleProceed = () => {
    router.push('/dashboard/allocate');
  };

  // Block rendering until AT is present
  if (!AT) return null;

  return (
    <div className="min-h-screen overflow-y-auto space-y-8 px-6 py-12 bg-gradient-to-br from-white/5 via-white/10 to-white/5 text-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 px-4 py-2 rounded-full mb-4">
          <Lightbulb className="h-5 w-5 text-orange-400" />
          <span className="text-orange-500 font-medium">AI-Powered Method Recommendation</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Optimal Heat Conversion Method
        </h1>
        <p className="text-gray-600 mt-2">Based on your dataset’s temperature profile, cost constraints, and scalability needs.</p>
      </motion.div>

      {/* AI Recommendation Card */}
      <Card className="glass-panel border-white/10 overflow-hidden group relative bg-white/5">
        <div className="absolute top-0 left-0 w-2 bg-gradient-to-b from-orange-400 to-pink-400"></div>
        <CardHeader className="border-b border-white/10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-500">
                AI Recommended
              </Badge>
              <CardTitle className="text-2xl font-bold">{bestMethod.method}</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={exportMethod} className="gap-2">
              <Download className="h-4 w-4" /> Export Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Method Details */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-end gap-2 mb-6">
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-pink-400">
                  {bestMethod.efficiency}%
                </div>
                <div className="text-gray-500 mb-1">Efficiency</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="h-4 w-4 text-blue-400" />
                  <span>Optimal Temp: <strong>{bestMethod.tempRange}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-green-400" />
                  <span>Scalability: <strong>{bestMethod.scalability}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Cost Level: <strong>{bestMethod.cost}</strong></span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4" /> Why This Method?
                </h4>
                <p className="text-gray-500">{bestMethod.conditions}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-500 mb-2">Pros</h5>
                  <ul className="space-y-1 text-sm">
                    {bestMethod.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-500 mb-2">Cons</h5>
                  <ul className="space-y-1 text-sm">
                    {bestMethod.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500">×</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-6xl font-bold text-white animate-bounce">
                🧠
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card className="glass-panel border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Method Efficiency Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={methodData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                onClick={(data) => data && setSelectedMethod(methodData[data.activePayload[0].payload.index])}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis
                  dataKey="method"
                  stroke="#475569"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis unit="%" stroke="#475569" domain={[0, 50]} />
                <Tooltip
                  contentStyle={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#1e293b',
                  }}
                  formatter={(value) => [`${value}%`, 'Efficiency']}
                />
                <Bar
                  dataKey="efficiency"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                >
                  {methodData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.recommended ? '#fb923c' : COLORS[index % COLORS.length]}
                      stroke={entry.recommended ? '#fb923c' : '#cbd5e1'}
                      strokeWidth={entry.recommended ? 4 : 1}
                      className="cursor-pointer hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Selected:</strong> {selectedMethod.method} — Click any bar to view details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Proceed Button */}
      <div className="flex justify-center mt-8">
        <Button size="lg" className="gap-2" onClick={handleProceed}>
          <ArrowRight className="h-5 w-5" /> Proceed to Allocation
        </Button>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20" />
    </div>
  );
}
