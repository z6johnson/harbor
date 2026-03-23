"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_HINTS = [
  "My team answers thousands of inquiries a year and we can't keep up.",
  "I want to use AI in my course but I'm not sure where to start.",
  "We're looking to add a chatbot to our department website.",
  "Our grant review process takes too long and we need to streamline it.",
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
      <header className="px-8 py-6 flex items-baseline justify-between shrink-0">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl font-bold tracking-tight">harbor</h1>
          <span className="label hidden sm:inline">AI SOLUTION INTAKE</span>
        </div>
        <span className="label">UC SAN DIEGO</span>
      </header>

      {/* Main area */}
      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-8">
        {!hasMessages ? (
          /* Empty state */
          <div className="flex-1 flex flex-col justify-center pb-32">
            <h2 className="display mb-6">
              Tell us what<br />you&apos;re working on.
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed max-w-sm mb-12">
              Describe a problem or an idea. We&apos;ll find the right path
              forward together.
            </p>

            {/* Input */}
            <div className="mb-10">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind?"
                rows={1}
                className="w-full resize-none border-b border-gray-300 bg-transparent px-0 py-3 text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-black transition-subtle"
                autoFocus
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-black text-white text-sm font-medium px-5 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-subtle"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Starter hints — tertiary actions, text-styled */}
            <div>
              <p className="label mb-4">Or start with one of these</p>
              <div className="flex flex-col gap-1">
                {STARTER_HINTS.map((hint) => (
                  <button
                    key={hint}
                    onClick={() => sendMessage(hint)}
                    className="text-left text-sm text-gray-500 py-2 hover:text-black transition-subtle"
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
            <div className="flex-1 py-10 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${i > 0 ? "mt-8" : ""} ${
                    msg.role === "user"
                      ? "pb-8 border-b border-gray-100"
                      : ""
                  }`}
                >
                  <p className="label mb-2">
                    {msg.role === "user" ? "YOU" : "HARBOR"}
                  </p>
                  <div
                    className={`text-[15px] leading-[1.7] whitespace-pre-wrap ${
                      msg.role === "assistant"
                        ? "text-black"
                        : "text-gray-600"
                    }`}
                  >
                    {msg.content}
                    {isLoading &&
                      i === messages.length - 1 &&
                      msg.role === "assistant" &&
                      msg.content === "" && (
                        <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse align-text-bottom" />
                      )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input pinned to bottom */}
            <div className="border-t border-gray-200 py-5 shrink-0">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Continue..."
                  rows={1}
                  className="flex-1 resize-none border-b border-gray-300 bg-transparent px-0 py-3 text-[15px] leading-relaxed placeholder:text-gray-400 focus:outline-none focus:border-black transition-subtle"
                  autoFocus
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-black text-white text-sm font-medium px-5 py-2.5 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-subtle shrink-0 mb-0.5"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 shrink-0">
        <p className="label text-center text-gray-400">
          UC San Diego · Office of Strategic Initiatives
        </p>
      </footer>
    </div>
  );
}
