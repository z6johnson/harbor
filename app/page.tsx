"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_HINTS = [
  "Automate repetitive inquiries",
  "AI in my course",
  "Department chatbot",
  "Streamline grant reviews",
  "Research data pipeline",
  "Student advising assistant",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [input]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...nextMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages([
                  ...nextMessages,
                  { role: "assistant", content: assistantContent },
                ]);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again, or reach out to the AI strategy team directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-14 px-6 sm:px-12 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-baseline gap-3">
          <span className="text-[15px] font-bold tracking-tight">harbor</span>
          <span className="label hidden sm:inline">AI Solution Intake</span>
        </div>
        <span className="label">UC San Diego</span>
      </header>

      {/* Main area */}
      <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-6 sm:px-12">
        {!hasMessages ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center pb-24">
            <div className="w-full max-w-xl text-center">
              <h2 className="display mb-4">
                What are you<br />working on?
              </h2>

              <p className="text-[15px] text-gray-500 leading-relaxed mb-10">
                Describe a problem or an idea — we&apos;ll find the right path forward together.
              </p>

              {/* Input zone */}
              <div className="mb-8 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What's on your mind?"
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 pr-16 text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-subtle"
                  autoFocus
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white rounded-lg p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-gray-800 transition-subtle"
                  aria-label="Send"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13V9L7 8L3 7V3L14 8L3 13Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              {/* Starter hint chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {STARTER_HINTS.map((hint) => (
                  <button
                    key={hint}
                    onClick={() => sendMessage(hint)}
                    className="text-[13px] text-gray-500 border border-gray-200 rounded-full px-4 py-2 hover:border-gray-400 hover:text-black transition-subtle"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation view */
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="py-12">
                {messages.map((msg, i) => (
                  <div key={i} className={i > 0 ? "mt-10" : ""}>
                    <p className="label mb-3">
                      {msg.role === "user" ? "YOU" : "HARBOR"}
                    </p>
                    <div
                      className={`text-[15px] leading-[1.75] whitespace-pre-wrap ${
                        msg.role === "assistant"
                          ? "accent-left text-black"
                          : "text-gray-600"
                      }`}
                    >
                      {msg.content}
                      {isLoading &&
                        i === messages.length - 1 &&
                        msg.role === "assistant" &&
                        msg.content === "" && (
                          <span className="inline-block w-[2px] h-[18px] bg-black animate-caret align-text-bottom" />
                        )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t border-gray-200 py-5 shrink-0">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Continue..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-subtle"
                  autoFocus
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-black text-white rounded-lg p-3 disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-gray-800 transition-subtle shrink-0"
                  aria-label="Send"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13V9L7 8L3 7V3L14 8L3 13Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      {!hasMessages && (
        <footer className="h-12 px-6 sm:px-12 flex items-center justify-center shrink-0">
          <p className="label text-gray-400">
            UC San Diego · Office of Strategic Initiatives
          </p>
        </footer>
      )}
    </div>
  );
}
