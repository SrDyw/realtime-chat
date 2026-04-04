"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

type DropdownContent = DropdownItem | "separator";

interface DropdownProps {
  trigger: ReactNode;
  content: DropdownContent[];
  align?: "left" | "right";
}

export function Dropdown({ trigger, content, align = "right" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-2 w-56 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 py-2 z-50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {content.map((item, index) => {
            if (item === "separator") {
              return <div key={`separator-${index}`} className="border-t border-gray-200 dark:border-zinc-700 my-1" />;
            }
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                }`}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
