"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeDialog } from "./ThemeDialog";
import { useChat } from "./useChat";
import { useTheme } from "../hooks/useTheme";

function ChatContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username") || "Anonimo";
  const room = searchParams.get("room") || "general";
  
  const { messages, isConnected, userCount, sendMessage } = useChat(username, room);
  const { darkMode, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-gray-800 dark:text-white">Chat {room}</h1>
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userCount} usuario{userCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    setShowThemeDialog(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Cambiar tema
                </button>
                <button
                  onClick={() => {
                    router.push("/join");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Salir del chat
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No hay mensajes aún</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">¡Sé el primero en enviar uno!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    msg.isSystem
                      ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-center w-full max-w-full"
                      : msg.isOwn
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.isSystem ? (
                    <p className="text-sm text-center">{msg.text}</p>
                  ) : (
                    <>
                      {!msg.isOwn && (
                        <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
                          {msg.user}
                        </p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-violet-200" : "text-gray-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-gray-200 dark:border-zinc-700 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
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
      <ThemeDialog isOpen={showThemeDialog} onClose={() => setShowThemeDialog(false)} darkMode={darkMode} onThemeChange={toggleTheme} />
    </div>
  );
}

export default function ChatContent() {
  const { mounted } = useTheme();
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }
  
  return <ChatContentInner />;
}
