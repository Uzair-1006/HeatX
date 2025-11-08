// app/page.tsx
'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Brain,
  Globe,
  TrendingUp,
  Users,
  ArrowRight,
  ChevronDown,
  ThermometerSun,
  Factory,
  Leaf,
  Gauge,
} from 'lucide-react';

const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const statsY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const ctaScale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1.05, 1]);

  return (
    <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
      {/* 🌌 HERO SECTION — Fullscreen, cinematic, immersive */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-bounce"></div>
        </div>

        {/* Floating Heat Particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60"
            animate={{
              y: [0, -100 - i * 10, 0],
              x: [0, Math.random() * 400 - 200, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}

        {/* Hero Content */}
        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          <FloatingCard delay={0.2}>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-500/30 mb-8">
              <ThermometerSun className="h-5 w-5 text-orange-400" />
              <span className="text-orange-300 font-medium">AI-Powered Waste Heat Recovery</span>
            </div>
          </FloatingCard>

          <FloatingCard delay={0.4}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Turn
              </span>
              <br />
              <span className="text-white">Industrial Heat</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Into Clean Power
              </span>
            </h1>
          </FloatingCard>

          <FloatingCard delay={0.6}>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              HeatX uses deep learning to predict, convert, and distribute wasted thermal energy — turning cost centers into profit engines.
            </p>
          </FloatingCard>

          <FloatingCard delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 active:scale-95 transition-all duration-300 px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-orange-500/40 gap-3">
                  <Zap className="h-5 w-5" />
                  Start Free Trial — No Card Needed
                </Button>
              </Link>
              <Link href="#how-it-works" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 group mt-4 sm:mt-0">
                  See How It Works
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </Link>
            </div>
          </FloatingCard>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* 📊 STATS BANNER — Floating metrics */}
      <motion.section
        style={{ y: statsY }}
        className="py-8 bg-gradient-to-r from-slate-900/50 to-black/50 backdrop-blur-sm border-t border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 text-center">
            {[
              { value: "42%", label: "Avg Efficiency Gain", icon: Gauge },
              { value: "2.1 TWh", label: "Energy Generated", icon: Zap },
              { value: "18mo", label: "Avg ROI Period", icon: TrendingUp },
              { value: "500+", label: "Sites Powered", icon: Factory },
            ].map((stat, i) => (
              <FloatingCard key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center">
                  <stat.icon className="h-8 w-8 text-orange-400 mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🧠 HOW IT WORKS — Step-by-step visual workflow */}
      <section id="how-it-works" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <FloatingCard>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                How HeatX Works
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                A seamless 4-step workflow to transform waste heat into revenue.
              </p>
            </div>
          </FloatingCard>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-3/4 h-0.5 bg-gradient-to-r from-orange-400 to-transparent z-0"></div>
            <div className="hidden md:block absolute top-16 left-2/4 right-2/4 h-0.5 bg-gradient-to-r from-orange-400 to-transparent z-0"></div>
            <div className="hidden md:block absolute top-16 left-3/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 z-0"></div>

            {[
              {
                step: 1,
                title: "Upload Heat Data",
                desc: "CSV, Excel, or live API — we handle it all.",
                icon: <Factory className="h-8 w-8 text-blue-400" />,
              },
              {
                step: 2,
                title: "AI Analysis",
                desc: "Run classification or regression to predict potential.",
                icon: <Brain className="h-8 w-8 text-purple-400" />,
              },
              {
                step: 3,
                title: "Predict Output",
                desc: "See estimated Mtoe/TWh generated under your conditions.",
                icon: <Zap className="h-8 w-8 text-yellow-400" />,
              },
              {
                step: 4,
                title: "Smart Allocation",
                desc: "Distribute energy by priority — livelihoods, industry, or govt.",
                icon: <Users className="h-8 w-8 text-green-400" />,
              },
            ].map((item, i) => (
              <FloatingCard key={i} delay={i * 0.2}>
                <div className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer group relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold text-orange-400 mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 WHY CHOOSE HEATX — Benefit cards with icons */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-6xl mx-auto">
          <FloatingCard>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Why HeatX?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                We don’t just analyze — we optimize, predict, and monetize your wasted thermal energy.
              </p>
            </div>
          </FloatingCard>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Driven Precision",
                desc: "Our models adapt to your facility’s unique thermal profile for maximum efficiency.",
                icon: Brain,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Carbon Negative Impact",
                desc: "Every MWh generated displaces fossil fuels — track your ESG impact in real-time.",
                icon: Leaf,
                gradient: "from-green-500 to-emerald-500",
              },
              {
                title: "Revenue Generation",
                desc: "Sell excess power back to the grid or allocate to high-value internal projects.",
                icon: TrendingUp,
                gradient: "from-orange-500 to-pink-500",
              },
            ].map((item, i) => (
              <FloatingCard key={i} delay={i * 0.2}>
                <div className="glass-panel p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform h-full group">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.gradient} mb-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* 🏆 SOCIAL PROOF — Logos + Testimonial */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <FloatingCard>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Industry Leaders</h2>
              <p className="text-gray-400 text-lg">From heavy manufacturing to energy utilities.</p>
            </div>
          </FloatingCard>

          {/* Logo Cloud */}
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-70 mb-20">
            {['Siemens', 'Shell', 'GE', 'BASF', 'Schneider', 'TotalEnergies'].map((logo, i) => (
              <FloatingCard key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="text-white font-black text-2xl md:text-3xl grayscale hover:grayscale-0 transition-all cursor-pointer"
                >
                  {logo}
                </motion.div>
              </FloatingCard>
            ))}
          </div>

          {/* Testimonial */}
          <FloatingCard delay={0.5}>
            <div className="glass-panel max-w-4xl mx-auto p-10 md:p-14 rounded-3xl border border-white/10 backdrop-blur-xl text-center">
              <div className="text-2xl md:text-3xl font-bold mb-6 text-white">
                “HeatX increased our thermal recovery efficiency by 42% — paying for itself in under 14 months.”
              </div>
              <div className="text-gray-400">
                — CTO, Global Steel Manufacturer
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* 🚀 FINAL CTA — Full-width immersive */}
      <motion.section
        style={{ scale: ctaScale }}
        className="py-32 px-6 bg-gradient-to-r from-orange-900 via-pink-900 to-purple-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FloatingCard>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Monetize Your Waste Heat?
            </h2>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join 500+ industrial sites generating clean power and revenue — risk-free for 30 days.
            </p>
          </FloatingCard>

          <FloatingCard delay={0.4}>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-white to-gray-300 text-black hover:scale-105 active:scale-95 transition-all duration-300 px-10 py-7 text-xl rounded-full shadow-2xl hover:shadow-white/30 gap-3">
                <Zap className="h-6 w-6" />
                Start Your Free Trial →
              </Button>
            </Link>
          </FloatingCard>

          <FloatingCard delay={0.6}>
            <p className="text-gray-400 mt-6 text-sm">No credit card required. Cancel anytime.</p>
          </FloatingCard>
        </div>
      </motion.section>
    </div>
  );
}