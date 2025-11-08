import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";
import AIChatWidget from "@/components/AIChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HeatX — Turn Waste Heat into Power",
  description: "AI-powered industrial energy conversion platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col relative">
            {children}
            <Toaster position="top-right" />
            <AIChatWidget /> {/* 👈 Global AI Chat Button */}
          </div>
        </div>
      </body>
    </html>
  );
}
