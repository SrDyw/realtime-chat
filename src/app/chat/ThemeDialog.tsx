"use client";

import { useState, useEffect, useRef } from "react";

export function ThemeDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("theme");
      setDarkMode(stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const toggleTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-full max-w-sm mx-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Configuración</h2>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tema</p>
          <div className="flex gap-3">
            <button
              onClick={() => toggleTheme(false)}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                !darkMode
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-gray-100 dark:bg-zinc-700 mb-2"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Claro</p>
            </button>
            <button
              onClick={() => toggleTheme(true)}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                darkMode
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
              }`}
            >
              <div className="w-full h-8 rounded-lg bg-zinc-800 mb-2"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Oscuro</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
