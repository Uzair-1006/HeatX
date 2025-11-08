"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi there! I’m HeatX Assistant. I can help you with energy allocation, conversion predictions, and system performance insights.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestions = [
    "How can I improve conversion efficiency?",
    "Show me today’s energy prediction.",
    "What’s the optimal heat recovery setting?",
    "Explain ESG score improvement.",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;
    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://your-backend-url.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "🤖 No response received." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Couldn't connect to the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "🧹 Chat cleared! How can I assist you next?",
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-14 md:bottom-10 md:right-16 z-50 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 p-4 rounded-full shadow-xl text-white chat-pulse"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 right-14 md:right-16 z-50 w-[95vw] sm:w-[420px] md:w-[480px] h-[600px] bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-800/50 border-b border-white/10">
              <span className="font-semibold text-white text-sm">
                HeatX AI Assistant
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-red-400 transition"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages (Fixed size, scrollable) */}
            <div className="flex-1 p-5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] text-m leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-gray-400 text-sm animate-pulse">
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-white/10 bg-gray-800/40">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-gray-700/60 hover:bg-gray-600/60 text-gray-200 px-3 py-1.5 rounded-full transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center border-t border-white/10 bg-gray-800/40"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-gray-200 text-sm px-4 py-3 outline-none placeholder-gray-500"
                placeholder="Ask about energy efficiency..."
              />
              <button
                type="submit"
                className="p-3 text-emerald-400 hover:text-emerald-300 transition disabled:opacity-50"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
