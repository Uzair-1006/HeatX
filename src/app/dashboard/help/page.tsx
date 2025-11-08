// app/help/page.tsx
'use client';

import { Search, MessageSquare, BookOpen, Video, Zap, Users, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const helpCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { q: "How do I upload my dataset?", path: "/help/upload" },
      { q: "What file formats are supported?", path: "/help/formats" },
      { q: "How to interpret AI results?", path: "/help/interpret" },
    ],
  },
  {
    title: "AI & Analysis",
    icon: Zap,
    items: [
      { q: "What’s the difference between Classification and Regression?", path: "/help/models" },
      { q: "How is efficiency calculated?", path: "/help/efficiency" },
      { q: "Can I train custom models?", path: "/help/custom" },
    ],
  },
  {
    title: "Energy Allocation",
    icon: Users,
    items: [
      { q: "How does priority weighting work?", path: "/help/priority" },
      { q: "Can I export allocation plans?", path: "/help/export" },
      { q: "What if my total isn’t 100%?", path: "/help/balance" },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');

  const filteredCategories = helpCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Help & Documentation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers, watch tutorials, or chat with our AI assistant.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search for help topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-6 text-lg bg-white/5 border-white/10"
            />
          </div>
        </div>

        {/* AI Assistant CTA */}
        <Card className="glass-panel border-white/10 mb-12">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full mb-4">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span className="text-purple-300 font-medium">AI Assistant Available</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Still can’t find what you need?</h3>
            <p className="text-gray-400 mb-6">Chat with our AI assistant for real-time help.</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform gap-2">
              <MessageSquare className="h-5 w-5" />
              Open AI Chat
            </Button>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Video className="h-6 w-6" />
            Video Tutorials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Uploading Your First Dataset", duration: "3:12" },
              { title: "Running AI Analysis", duration: "4:45" },
              { title: "Smart Energy Allocation", duration: "5:30" },
            ].map((video, i) => (
              <Card key={i} className="glass-panel border-white/10 group cursor-pointer hover:scale-105 transition-transform">
                <div className="aspect-video bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg flex items-center justify-center">
                  <div className="text-4xl">▶️</div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <category.icon className="h-6 w-6 text-blue-400" />
                {category.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, i) => (
                  <Link key={i} href={item.path}>
                    <Card className="glass-panel border-white/10 group cursor-pointer hover:scale-105 transition-transform h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium group-hover:text-blue-400 transition-colors">{item.q}</h3>
                          <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {search && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results for “{search}” — try another term.</p>
          </div>
        )}
      </div>
    </div>
  );
}