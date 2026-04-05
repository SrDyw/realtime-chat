"use client";

import { useState, useEffect, useRef } from "react";

interface ReplyMessage {
  id: string;
  user: string;
  text: string;
}

interface MessageInputProps {
  onSend: (text: string, replyTo?: ReplyMessage) => void;
  onTyping: (isTyping: boolean) => void;
  replyMessage?: ReplyMessage;
  onCancelReply?: () => void;
}

export function MessageInput({ onSend, onTyping, replyMessage, onCancelReply }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        onTyping(false);
      }
    };
  }, [onTyping]);

  useEffect(() => {
    if (replyMessage) {
      inputRef.current?.focus();
    }
  }, [replyMessage]);

  const handleTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping(false);
    }
    
    onSend(inputValue.trim(), replyMessage);
    setInputValue("");
    onCancelReply?.();
  };

  return (
    <footer className="sticky bottom-0 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-gray-200 dark:border-zinc-700">
      {replyMessage && (
        <div className="max-w-4xl mx-auto px-4 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-t-xl">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                Respondiendo a {replyMessage.user}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {replyMessage.text}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3 p-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleTyping();
          }}
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
