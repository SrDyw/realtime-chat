"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeDialog } from "./ThemeDialog";
import { Dropdown } from "./Dropdown";
import { useTheme } from "../hooks/useTheme";

interface User {
  id: string;
  name: string;
}

interface ChatHeaderProps {
  room: string;
  isConnected: boolean;
  users: User[];
}

export function ChatHeader({ room, isConnected, users }: ChatHeaderProps) {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  const usersDisplay = (() => {
    if (users.length === 0) return "1 usuario";
    if (users.length === 1) return `1 usuario (${users[0].name})`;
    if (users.length === 2) return `2 usuarios (${users[0].name} y ${users[1].name})`;
    return `${users.length} usuarios (${users[0].name}, ${users[1].name} y más)`;
  })();

  const usersDropdownContent = users.map((user) => ({
    label: user.name,
    icon: <div className="w-2 h-2 rounded-full bg-green-500" />,
    onClick: () => {},
  }));

  const menuDropdownContent = [
    {
      label: "Cambiar tema",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      onClick: () => setShowThemeDialog(true),
    },
    {
      label: "Salir del chat",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: () => router.push("/join"),
    },
  ];

  return (
    <>
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
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              <Dropdown
                trigger={
                  <p className="text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    {usersDisplay}
                  </p>
                }
                content={usersDropdownContent}
                align="left"
              />
            </div>
          </div>

          <Dropdown
            trigger={
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            }
            content={menuDropdownContent}
            align="right"
          />
        </div>
      </header>

      <ThemeDialog
        isOpen={showThemeDialog}
        onClose={() => setShowThemeDialog(false)}
        darkMode={darkMode}
        onThemeChange={toggleTheme}
      />
    </>
  );
}
