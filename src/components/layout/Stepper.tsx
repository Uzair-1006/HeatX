// components/layout/Stepper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import * as React from "react";

const steps = [
  { name: 'Upload', path: '/dashboard/upload' },
  { name: 'Analyze', path: '/dashboard/analyze' },
  { name: 'Predict', path: '/dashboard/predict' },
  { name: 'Allocate', path: '/dashboard/allocate' },
];

export default function Stepper() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => pathname.startsWith(step.path)) + 1;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 px-8 py-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center relative z-10">
              <motion.div
                animate={{
                  scale: index + 1 <= currentStepIndex ? 1.2 : 1,
                  borderColor: index + 1 <= currentStepIndex ? '#fb923c' : '#334155',
                  backgroundColor: index + 1 <= currentStepIndex ? '#fb923c' : 'transparent',
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index + 1 <= currentStepIndex ? 'text-white' : 'text-gray-400'
                }`}
              >
                {index + 1}
              </motion.div>
              <div className="mt-2 text-xs text-gray-400">{step.name}</div>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: index + 2 <= currentStepIndex ? '#fb923c' : '#1e293b',
                }}
                className="h-1 w-16 mx-4 rounded-full"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}