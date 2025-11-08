"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <- added for navigation
import { Card } from "@/components/ui/card";
import { Zap, Loader2, RefreshCw, TrendingUp, Cpu, ArrowRight } from "lucide-react"; // <- added ArrowRight
import { motion } from "framer-motion";

export default function PredictPage() {
  const router = useRouter(); // <- initialize router

  const [inputs, setInputs] = useState<Record<string, string>>({
    AT: "25",
    V: "50",
    AP: "101",
    RH: "40",
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    const payload = {
      AT: Number(inputs.AT) || 0,
      V: Number(inputs.V) || 0,
      AP: Number(inputs.AP) || 0,
      RH: Number(inputs.RH) || 0,
    };

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction failed:", err);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const resetInputs = () => {
    setInputs({ AT: "", V: "", AP: "", RH: "" });
    setPrediction(null);
  };

  // --- New function for proceeding to method suggestion ---
  const handleProceed = () => {
    if (!inputs.AT) return;
    router.push(`/dashboard/methods?AT=${inputs.AT}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
      <main className="flex-1 overflow-y-auto">
        {/* Main Prediction Section */}
        <section className="px-6 py-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl">
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-pink-600/15 to-violet-600/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 p-10 text-center">
                {/* Logo & Title */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="p-3 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500"
                  >
                    <Zap className="h-8 w-8 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                    PowerGen Predictor
                  </h1>
                </div>

                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Enter environmental parameters to predict power output using our advanced ML model.
                </p>

                {/* Input Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10"
                >
                  {(["AT", "V", "AP", "RH"] as const).map((feature) => (
                    <div key={feature} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200 uppercase tracking-wide">
                        {feature}
                      </label>
                      <input
                        type="text"
                        name={feature}
                        value={inputs[feature]}
                        onChange={handleChange}
                        placeholder="0"
                        inputMode="decimal"
                        pattern="[0-9]*(\.[0-9]+)?"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 text-center font-mono text-base border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 focus:outline-none transition-all duration-200 shadow-sm hover:bg-white/15"
                      />
                      <span className="block text-xs text-gray-400 mt-1">
                        {feature === "AT" && "Ambient Temp (°C)"}
                        {feature === "V" && "Exhaust Vacuum"}
                        {feature === "AP" && "Pressure (mbar)"}
                        {feature === "RH" && "Humidity (%)"}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePredict}
                    disabled={loading}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Predict Power Output
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={resetInputs}
                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-gray-200 font-semibold border border-gray-600 hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Reset
                  </motion.button>
                </div>

                {/* Prediction Result */}
                {prediction && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-500/30 p-8 shadow-2xl text-center space-y-5"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-200">Predicted Power Output</h2>
                        <div className="text-5xl font-extrabold mt-3 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                          {prediction.PE?.toFixed(2)} MW
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-6">
                        <div className="bg-white/10 rounded-lg px-4 py-3">
                          <div className="text-gray-300">Efficiency</div>
                          <div className="font-bold text-green-300">{prediction.efficiency?.toFixed(2)}%</div>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-3">
                          <div className="text-gray-300">Mtoe</div>
                          <div className="font-bold text-yellow-300">{prediction.mtoe?.toFixed(4)}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-3">
                          <div className="text-gray-300">TWh</div>
                          <div className="font-bold text-pink-300">{prediction.twh?.toFixed(4)}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mt-4">
                        Powered by Machine Learning • Model v1.2
                      </div>
                    </motion.div>

                    {/* --- Proceed Button --- */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceed}
                      className="mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                    >
                      <ArrowRight className="h-5 w-5" />
                      Proceed to Method Suggestion
                    </motion.button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Additional Content Below - Enables Scrolling */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-10 border border-gray-700 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <Cpu className="h-8 w-8 text-blue-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
                  About the Model
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                This predictor uses a trained machine learning model on the Combined Cycle Power Plant dataset to estimate net hourly electrical power output (PE) based on ambient temperature, vacuum, pressure, and humidity.
              </p>
              <p className="text-gray-400 text-sm">
                Accuracy: ~95% R² score | Built with Python, FastAPI, and XGBoost
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-violet-800/40 to-indigo-900/40 backdrop-blur-md rounded-3xl p-10 border border-violet-600/30 shadow-2xl text-center"
            >
              <TrendingUp className="h-12 w-12 text-violet-300 mx-auto mb-5" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Real-Time Insights
              </h2>
              <p className="text-gray-300">
                Optimize energy generation by forecasting output under varying conditions. Ideal for plant operators and energy analysts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-20" />
      </main>
    </div>
  );
}
