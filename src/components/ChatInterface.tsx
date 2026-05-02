"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageBubble } from "./MessageBubble";
import { SearchIndicator } from "./SearchIndicator";
import { InputBar } from "./InputBar";
import { ParticlesBg } from "./ParticlesBg";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  isThinking?: boolean;
  isStreaming?: boolean;
  isSearching?: boolean;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceUrls, setSourceUrls] = useState<string[]>([]);
  const [checkpointId, setCheckpointId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSearching, scrollToBottom]);

  const handleNewChat = useCallback(() => {
    // Close any active SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setIsSearching(false);
    setSearchQuery("");
    setSourceUrls([]);
    setCheckpointId(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setSourceUrls([]); // Clear old sources

    // Add user message
    const userMsgId = Date.now().toString();
    const botMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: userMsg },
      { id: botMsgId, role: "bot", content: "", isThinking: true },
    ]);
    setIsLoading(true);

    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat_stream/${encodeURIComponent(userMsg)}`
      );
      if (checkpointId) {
        url.searchParams.append("checkpoint_id", checkpointId);
      }

      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "checkpoint") {
            setCheckpointId(data.checkpoint_id);
          } else if (data.type === "content") {
            const text = data.content;
            if (!text) return; // Ignore empty strings from tool call chunks
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? {
                      ...msg,
                      content: msg.content + text,
                      isThinking: false,
                      isStreaming: true,
                      isSearching: false,
                    }
                  : msg
              )
            );
          } else if (data.type === "search_start") {
            setIsSearching(true);
            setSearchQuery(data.query);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? { ...msg, isSearching: true }
                  : msg
              )
            );
          } else if (data.type === "search_results") {
            setIsSearching(false);
            setSearchQuery("");
            if (data.urls) {
              setSourceUrls(data.urls);
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? { ...msg, isSearching: false }
                  : msg
              )
            );
          } else if (data.type === "end") {
            setIsLoading(false);
            setIsSearching(false);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? { ...msg, isThinking: false, isStreaming: false, isSearching: false }
                  : msg
              )
            );
            eventSource.close();
            eventSourceRef.current = null;
          }
        } catch (err) {
          console.error("SSE parse error:", err);
        }
      };

      eventSource.onerror = () => {
        setIsLoading(false);
        setIsSearching(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, isThinking: false, isStreaming: false, isSearching: false }
              : msg
          )
        );
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsLoading(false);
    }
  }, [input, isLoading, checkpointId]);

  // Handle welcome screen template clicks
  const handleTemplateClick = useCallback(
    (message: string) => {
      setInput(message);
      // Use a timeout to let state update, then submit
      setTimeout(() => {
        setInput("");
        const userMsgId = Date.now().toString();
        const botMsgId = (Date.now() + 1).toString();

        setMessages([
          { id: userMsgId, role: "user", content: message },
          { id: botMsgId, role: "bot", content: "", isThinking: true },
        ]);
        setIsLoading(true);
        setSourceUrls([]);

        try {
          const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat_stream/${encodeURIComponent(message)}`
          );

          const eventSource = new EventSource(url.toString());
          eventSourceRef.current = eventSource;

          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);

              if (data.type === "checkpoint") {
                setCheckpointId(data.checkpoint_id);
              } else if (data.type === "content") {
                const text = data.content;
                if (!text) return; // Ignore empty strings

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, content: msg.content + text, isThinking: false, isStreaming: true, isSearching: false }
                      : msg
                  )
                );
              } else if (data.type === "search_start") {
                setIsSearching(true);
                setSearchQuery(data.query);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId ? { ...msg, isSearching: true } : msg
                  )
                );
              } else if (data.type === "search_results") {
                setIsSearching(false);
                setSearchQuery("");
                if (data.urls) setSourceUrls(data.urls);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId ? { ...msg, isSearching: false } : msg
                  )
                );
              } else if (data.type === "end") {
                setIsLoading(false);
                setIsSearching(false);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId
                      ? { ...msg, isThinking: false, isStreaming: false, isSearching: false }
                      : msg
                  )
                );
                eventSource.close();
                eventSourceRef.current = null;
              }
            } catch (err) {
              console.error("SSE parse error:", err);
            }
          };

          eventSource.onerror = () => {
            setIsLoading(false);
            setIsSearching(false);
            eventSource.close();
            eventSourceRef.current = null;
          };
        } catch (error) {
          console.error("Failed to connect:", error);
          setIsLoading(false);
        }
      }, 50);
    },
    []
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)] text-slate-50 relative">
      <ParticlesBg />

      <Header onNewChat={handleNewChat} />

      {/* Messages / Welcome */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {!hasMessages ? (
          <WelcomeScreen onSendMessage={handleTemplateClick} />
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isThinking={msg.isThinking}
                isStreaming={msg.isStreaming}
                isSearching={msg.isSearching}
              />
            ))}

            {/* Search Indicator */}
            <SearchIndicator
              isSearching={isSearching}
              searchQuery={searchQuery}
              sourceUrls={sourceUrls}
            />

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Input */}
      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
