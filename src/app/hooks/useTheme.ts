"use client";

import { useEffect, useState, useRef } from "react";

export function useTheme() {
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setDarkMode(getThemeSnapshot());
    
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (mountedRef.current) {
        setDarkMode(getThemeSnapshot());
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  return { mounted, darkMode, toggleTheme };
}

function getThemeSnapshot() {
  const stored = localStorage.getItem("theme");
  return stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
}
