"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

interface SearchIndicatorProps {
  isSearching: boolean;
  searchQuery: string;
  sourceUrls?: string[];
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function SearchIndicator({ isSearching, searchQuery, sourceUrls }: SearchIndicatorProps) {
  const hasResults = sourceUrls && sourceUrls.length > 0;

  return (
    <AnimatePresence mode="wait">
      {isSearching && (
        <motion.div
          key="searching"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="max-w-3xl mx-auto px-4 md:px-0"
        >
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-500/[0.06] border border-blue-500/10 text-blue-300">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Searching the web</p>
              <p className="text-[11px] text-blue-400/70 truncate">&ldquo;{searchQuery}&rdquo;</p>
            </div>
            {/* Animated progress shimmer */}
            <div className="w-20 h-1 rounded-full bg-blue-500/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
                style={{
                  animation: "shimmer 1.5s ease-in-out infinite",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {!isSearching && hasResults && (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-3xl mx-auto px-4 md:px-0"
        >
          <div className="py-3 px-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs font-medium text-emerald-300">
                Found {sourceUrls.length} source{sourceUrls.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sourceUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] transition-all"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {getDomain(url)}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
