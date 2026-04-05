"use client";

import { useState, useEffect } from "react";

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
  room: string;
  savedUsername?: string | null;
}

export function UsernamePrompt({ onSubmit, room, savedUsername }: UsernamePromptProps) {
  const [username, setUsername] = useState(savedUsername || "");
  const [isEditing, setIsEditing] = useState(!savedUsername);
  const [error, setError] = useState("");

  useEffect(() => {
    if (savedUsername) {
      setUsername(savedUsername);
      setIsEditing(false);
    }
  }, [savedUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Por favor ingresa un nombre de usuario");
      return;
    }
    localStorage.setItem("quickchat_username", username.trim());
    onSubmit(username.trim());
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-3xl border border-white/50 dark:border-zinc-700/50 shadow-2xl shadow-purple-500/20 dark:shadow-purple-900/30 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-purple-500/30 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Unirse a {room}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {isEditing ? "Ingresa tu nombre para comenzar" : "Confirma tu nombre"}
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="Ej: Maria, Juan, etc."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Unirse
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-300 mb-2">¿Continuar como</p>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{username}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">en la sala {room}?</p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Unirse al chat
              </button>

              <button
                onClick={handleEdit}
                className="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 font-medium transition-all"
              >
                Usar otro nombre
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-6">
          QuickChat - Chat en tiempo real
        </p>
      </div>
    </div>
  );
}
