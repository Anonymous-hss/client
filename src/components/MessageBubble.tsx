"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OrbAvatar } from "./OrbAvatar";
import { User, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface MessageBubbleProps {
  role: "bot" | "user";
  content: string;
  isThinking?: boolean;
  isStreaming?: boolean;
  isSearching?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-slate-200 transition-all opacity-0 group-hover/code:opacity-100 cursor-pointer"
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function MessageBubble({ role, content, isThinking, isStreaming, isSearching }: MessageBubbleProps) {
  const isBot = role === "bot";

  const orbState = isThinking
    ? isSearching ? "searching" : "thinking"
    : isStreaming ? "streaming" : "idle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full border-b border-white/[0.04] last:border-b-0"
    >
      <div className="max-w-3xl mx-auto px-4 md:px-0 py-6 flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isBot ? (
            <OrbAvatar size="sm" state={orbState} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/15">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Name */}
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {isBot ? "Aaryx" : "You"}
          </p>

          {/* Body */}
          <div className="text-[15px] leading-relaxed text-slate-200">
            {isThinking && content.length === 0 ? (
              <div className="flex items-center gap-1.5 h-7">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            ) : isBot ? (
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-2 prose-headings:text-slate-100 prose-strong:text-slate-100 prose-code:text-purple-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-lg prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children, ...props }) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const codeText = String((children as any)?.props?.children || "");
                      return (
                        <div className="relative group/code">
                          <CopyButton text={codeText} />
                          <pre {...props}>{children}</pre>
                        </div>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{content}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
