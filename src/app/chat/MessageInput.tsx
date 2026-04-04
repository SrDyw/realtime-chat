"use client";

import { useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSend(inputValue.trim());
    setInputValue("");
  };

  return (
    <footer className="sticky bottom-0 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-gray-200 dark:border-zinc-700 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </footer>
  );
}
