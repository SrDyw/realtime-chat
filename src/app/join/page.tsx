"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../hooks/useTheme";
import { Dropdown } from "../chat/Dropdown";
import { ThemeDialog } from "../chat/ThemeDialog";

interface JoinData {
  username: string;
  room: string;
}

function JoinPageInner() {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Por favor ingresa un nombre de usuario");
      return;
    }
    
    const joinData: JoinData = {
      username: username.trim(),
      room: room.trim() || "general",
    };

    const params = new URLSearchParams({
      room: joinData.room.replaceAll(' ', '-'),
    });
    localStorage.setItem("quickchat_username", joinData.username);
    router.push(`/chat?${params.toString()}`);
  };

  const settingsMenu = [
    {
      label: "Cambiar tema",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      onClick: () => setShowThemeDialog(true),
    },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-4 right-4 z-50">
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          }
          content={settingsMenu}
          align="right"
        />
      </div>

      <div className="absolute size-full opacity-5 top-0 left-0 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-950 dark:fuchsia-950"></div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-3xl border border-white/50 dark:border-zinc-700/50 shadow-2xl shadow-purple-500/20 dark:shadow-purple-900/30 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-purple-500/30 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Unirse al Chat</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Ingresa tus datos para comenzar</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de usuario
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
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sala (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="general"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
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
              Unirse al Chat
            </button>
          </form>
        </div>

          <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-6">
            Chat en tiempo real
          </p>
        </div>
      </div>

      <ThemeDialog
        isOpen={showThemeDialog}
        onClose={() => setShowThemeDialog(false)}
        darkMode={darkMode}
        onThemeChange={toggleTheme}
      />
    </div>
  );
}

export default function JoinPage() {
  const { mounted } = useTheme();
  
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }
  
  return <JoinPageInner />;
}
