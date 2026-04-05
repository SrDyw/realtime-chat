import React from "react";

interface ChatTypingBubbleProps {
  users: string[];
}

export default function ChatTypingBubble({ users }: ChatTypingBubbleProps) {
  const namesText = users.length === 1
    ? `${users[0]}`
    : users.length === 2
    ? `${users[0]} y ${users[1]}`
    : `${users.length} personas`;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
        {namesText} {users.length === 1 ? "está" : "están"} escribiendo...
      </span>
      <div className="inline-flex items-center gap-1 rounded-2xl bg-white dark:bg-zinc-800 rounded-bl-md shadow-sm p-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="size-1.5 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
