// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  Brain,
  Zap,
  GitBranch,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Data', href: '/dashboard/upload', icon: Upload },
  { name: 'AI Analysis', href: '/dashboard/analyze', icon: Brain },
  { name: 'Predict Output', href: '/dashboard/predict', icon: Zap },
    { name: 'Best Method', href: '/dashboard/methods', icon: Settings },
  { name: 'Allocate Energy', href: '/dashboard/allocate', icon: GitBranch },

  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="w-64 bg-slate-900 border-r border-white/5 p-6 flex flex-col"
    >
      <div className="mb-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
          HeatX
        </h2>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 8 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto h-2 w-2 bg-orange-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400"></div>
          <div>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-500">Free Tier</div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}