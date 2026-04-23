"use client";

import { OrbAvatar } from "./OrbAvatar";
import { Search, Code, Lightbulb, Globe } from "lucide-react";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const usageTemplates = [
  {
    icon: Search,
    title: "Search the web",
    description: "Real-time web search powered by Tavily",
    example: "What are the latest developments in AI?",
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/10 hover:border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Code,
    title: "Write & explain code",
    description: "Generate, debug, or explain code snippets",
    example: "Write a Python function to merge two sorted lists",
    color: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/10 hover:border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    description: "Creative thinking and problem solving",
    example: "Help me plan a microservices architecture",
    color: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/10 hover:border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Globe,
    title: "Research topics",
    description: "In-depth analysis with web sources",
    example: "Compare React, Vue, and Svelte in 2026",
    color: "from-purple-500/10 to-pink-500/10",
    borderColor: "border-purple-500/10 hover:border-purple-500/20",
    iconColor: "text-purple-400",
  },
];

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-12">
      {/* Orb + Greeting */}
      <div className="flex flex-col items-center gap-5 mb-10" style={{ animation: "fade-in-up 0.6s ease-out" }}>
        <OrbAvatar size="xl" state="idle" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            Hey, I&apos;m <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">Aaryx</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-md">
            Harshal&apos;s personal AI assistant. I can search the web, write code, and help you think through problems.
          </p>
        </div>
      </div>

      {/* Usage Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full" style={{ animation: "fade-in-up 0.6s ease-out 0.15s both" }}>
        {usageTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.title}
              onClick={() => onSendMessage(template.example)}
              className={`group relative flex flex-col gap-2.5 p-4 rounded-xl bg-gradient-to-br ${template.color} border ${template.borderColor} text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center ${template.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{template.title}</p>
                  <p className="text-[11px] text-slate-500">{template.description}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors pl-[42px] italic">
                &ldquo;{template.example}&rdquo;
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
