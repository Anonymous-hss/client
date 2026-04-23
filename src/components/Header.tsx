"use client";

import { RotateCcw } from "lucide-react";
import { OrbAvatar } from "./OrbAvatar";

interface HeaderProps {
  onNewChat: () => void;
  isOnline?: boolean;
}

export function Header({ onNewChat, isOnline = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <OrbAvatar size="sm" state="idle" />
        <div>
          <h1 className="font-semibold text-[15px] tracking-tight text-slate-100">Aaryx</h1>
          <p className="text-[11px] text-slate-500 -mt-0.5">Harshal&apos;s AI Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          New Chat
        </button>
        <div className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </header>
  );
}
