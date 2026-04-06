"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "./useChat";
import { MessageInputProps, UserPresence } from "@/types/types";
import { flushSync } from "react-dom";
import CloseIcon from "../components/icons/CloseIcon";

interface ReplyMessage {
  id: string;
  user: string;
  text: string;
}


export function MessageInput({
  onSend,
  onTyping,
  replyMessage,
  onCancelReply,
  users,
}: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [usersShow, setUsersShow] = useState<boolean>(false);

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
    <footer className="sticky flex flex-col justify-start bottom-0 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-gray-200 dark:border-zinc-700">
      {replyMessage && (
        <div className="max-w-4xl mx-auto px-4 pt-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-t-xl">
            <div className="flex-shrink-0">
              <svg
                className="w-4 h-4 text-violet-600 dark:text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                Respondiendo a {replyMessage.user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {replyMessage.text}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <CloseIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
              
            </button>
          </div>
        </div>
      )}
      {usersShow && (
        <div className="w-full p-4 max-w-4xl mx-auto">
          <ul className="border-1 border-gray-200 dark:border-zinc-600 w-full rounded-2xl p-4">
            {users.length == 0 && <p>No hay nadie en el chat</p>}
            {users.map((x) => (
              <li
                className="dark:hover:bg-[#ffffff10] hover:bg-[#00000010] cursor-pointer transition-all p-1 rounded-2xl"
                key={x.userId}
                onClick={(e) => {
                  setInputValue((prev) => prev + x.userName);
                  inputRef.current?.focus();
                  setUsersShow(false);
                }}
              >
                @{x.userName}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto flex gap-3 p-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onKeyDown={(e) => {
            if (e.code == "Backspace" && inputValue.length > 0) {
              setUsersShow(false);
            }
            if (e.key == "@") {
              setUsersShow(true);
            }
            if (e.key == " ") {
              setUsersShow(false);
            }
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleTyping();
          }}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="p-3 size-12 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
        >
          <svg
            className="w-5 h-5 rotate-45"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </footer>
  );
}
