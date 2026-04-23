"use client";

import { useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function InputBar({ value, onChange, onSubmit, isLoading }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !isLoading) {
          onSubmit();
        }
      }
    },
    [value, isLoading, onSubmit]
  );

  return (
    <div className="sticky bottom-0 z-40 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent pt-6 pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-2 shadow-2xl shadow-black/30 focus-within:border-purple-500/30 transition-colors duration-300">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Aaryx..."
            className="flex-1 max-h-40 min-h-[44px] bg-transparent resize-none border-0 px-3 py-2.5 text-[15px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            className="w-10 h-10 shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white disabled:opacity-30 disabled:hover:bg-purple-600 transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <Send className="w-4.5 h-4.5 ml-0.5" />
            )}
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-600 mt-3">
          Aaryx can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
