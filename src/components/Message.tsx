"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "bot" | "user";
  content: string;
  isThinking?: boolean;
}

export function Message({ role, content, isThinking }: MessageProps) {
  const isBot = role === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 p-4 md:p-6 rounded-2xl max-w-4xl mx-auto",
        isBot ? "bg-white/5 border border-white/10" : ""
      )}
    >
      <Avatar type={role} isThinking={isThinking} />
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-200">
            {isBot ? "AI Assistant" : "You"}
          </span>
        </div>
        
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 max-w-none text-slate-300">
          {isThinking && content.length === 0 ? (
            <div className="flex gap-1 items-center h-6">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
