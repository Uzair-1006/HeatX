"use client";

import { useState, useEffect } from "react";
import { Upload, Brain, Zap, Lightbulb, Share2 } from "lucide-react";

export default function DashboardHome() {
  const [visibleSteps, setVisibleSteps] = useState([]);

  const steps = [
    {
      title: "Upload Dataset",
      desc: "Start by uploading your thermal power plant data (CSV or Excel). The dataset should include historical energy output, fuel usage, and operational metrics.",
      info: "Tip: Ensure the dataset is clean and complete to get the most accurate analysis.",
      color: "from-blue-500 to-cyan-500",
      icon: Upload,
      delay: 0.1,
    },
    {
      title: "Run AI Analysis",
      desc: "Our model analyzes patterns using regression and classification techniques to understand power generation trends and efficiency.",
      info: "Insight: This step helps identify bottlenecks and potential optimizations in energy production.",
      color: "from-purple-500 to-pink-500",
      icon: Brain,
      delay: 0.2,
    },
    {
      title: "Predict Output",
      desc: "Get predicted net power output in MW, TWh, and efficiency metrics for the upcoming cycles based on your data.",
      info: "Note: Predictions help in planning energy distribution, avoiding overloads, and maximizing efficiency.",
      color: "from-orange-500 to-red-500",
      icon: Zap,
      delay: 0.3,
    },
    {
      title: "Choose Best Method",
      desc: "AI recommends the optimal energy generation cycle based on predicted results and operational constraints.",
      info: "Suggestion: Follow the AI's recommendations to balance cost, efficiency, and sustainability.",
      color: "from-yellow-500 to-orange-500",
      icon: Lightbulb,
      delay: 0.4,
    },
    {
      title: "Allocate Energy",
      desc: "Distribute generated power across grids, storage, or regions according to priorities and projected demand.",
      info: "Pro Tip: Allocation ensures energy reaches sectors that need it most while maintaining grid stability.",
      color: "from-green-500 to-emerald-500",
      icon: Share2,
      delay: 0.5,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.stepIndex);
            setVisibleSteps(prev => [...prev, stepIndex]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll('[data-step-index]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-600">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Your Energy Story Unfolds
        </h1>
        <p className="mt-4 text-gray-700 text-lg leading-relaxed">
          Step by step, understand how your data transforms into actionable insights for sustainable energy.
        </p>
      </div>

      {/* Steps Container */}
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-8 sm:space-y-12 pb-12">
            {steps.map((step, index) => (
              <section
                key={index}
                data-step-index={index}
                className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 border border-gray-200 rounded-2xl shadow-md bg-gray-50 transition-all duration-600 ${
                  visibleSteps.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${step.delay}s`
                }}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                >
                  <step.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">{step.desc}</p>
                  <p className="text-gray-500 text-xs sm:text-sm md:text-base italic">{step.info}</p>
                </div>

                {/* Step Number */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-bold text-sm sm:text-lg shadow-md">
                  {index + 1}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Content Sections for Better Scrolling */}
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Why Choose Our Platform Section */}
          <section className="py-12 sm:py-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Advanced AI technology meets practical energy solutions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  State-of-the-art machine learning algorithms analyze your energy data with 95%+ accuracy.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-8 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Real-time</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Get instant predictions and recommendations for immediate operational decisions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Discover optimization opportunities and efficiency improvements automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Key Benefits Section */}
          <section className="py-12 sm:py-16 bg-gray-50 rounded-3xl">
            <div className="px-6 sm:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
                Transform Your Energy Operations
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Reduce Operational Costs</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Optimize fuel consumption and maintenance schedules based on predictive analytics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Improve Efficiency</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Increase power output while minimizing resource waste through intelligent recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhance Sustainability</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Balance energy production with environmental impact for long-term sustainability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Prediction Accuracy</span>
                      <span className="font-semibold text-green-600">95.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Speed</span>
                      <span className="font-semibold text-blue-600">&lt; 2 seconds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Energy Saved</span>
                      <span className="font-semibold text-purple-600">12-18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cost Reduction</span>
                      <span className="font-semibold text-orange-600">15-25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 sm:mt-12 py-6 sm:py-8 bg-gray-50">
        <p className="text-gray-500 text-xs sm:text-sm">
          Powered by AI • Real-time predictions • Sustainable energy planning
        </p>
      </div>

      {/* Bottom Spacer */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
}