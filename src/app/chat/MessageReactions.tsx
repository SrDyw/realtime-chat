"use client";

import { useState, ReactNode } from "react";
import { EmojiPickerDialog, EmojiGrid } from "./EmojiPickerDialog";

interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

interface MessageReactionsProps {
  children: ReactNode;
  isOwn?: boolean;
  reactions?: Reaction[];
  currentUserName: string;
  onReact: (emoji: string) => void;
  onShowDetails?: () => void;
  onReply?: () => void;
}

export function MessageReactions({ children, isOwn = false, reactions = [], currentUserName, onReact, onShowDetails, onReply }: MessageReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleReaction = (emoji: string) => {
    setIsPickerOpen(false);
    onReact(emoji);
  };

  const groupedReactions = reactions.reduce((acc, r) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = [];
    }
    acc[r.emoji].push(r);
    return acc;
  }, {} as Record<string, Reaction[]>);

  return (
    <div className="relative w-full">
      <div>
        {children}
        
        {reactions.length > 0 && (
          <div className={`mt-1 ${isOwn ? "flex justify-end" : "flex justify-start"}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails?.();
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors ${isOwn ? "order-1" : ""}`}
            >
              {Object.entries(groupedReactions).map(([emoji, users]) => (
                <span key={emoji} className="relative group">
                  <span className="text-sm">{emoji}</span>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {users.map(u => u.userName).join(", ")}
                  </span>
                </span>
              ))}
            </button>
          </div>
        )}
      </div>
      
      <div className={`mt-1 flex items-center gap-2 ${isOwn ? "justify-end mr-1" : "justify-start ml-1"}`}>
        {onReply && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReply();
            }}
            className="text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPickerOpen(true);
          }}
          className="text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <EmojiPickerDialog
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleReaction}
      >
        <EmojiGrid onSelect={handleReaction} />
      </EmojiPickerDialog>
    </div>
  );
}
