"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  type: "bot" | "user";
  isThinking?: boolean;
}

export function Avatar({ type, isThinking }: AvatarProps) {
  if (type === "user") {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
        <User className="w-5 h-5 text-white" />
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <motion.div
        animate={isThinking ? {
          y: [0, -5, 0],
        } : {
          y: [0, -2, 0],
        }}
        transition={{
          duration: isThinking ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 relative",
          isThinking 
            ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/30" 
            : "bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-teal-500/30"
        )}
      >
        <Bot className="w-5 h-5 text-white" />
      </motion.div>

      {/* Pulse effect when thinking */}
      {isThinking && (
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 bg-purple-500 rounded-full z-0"
        />
      )}
    </div>
  );
}
