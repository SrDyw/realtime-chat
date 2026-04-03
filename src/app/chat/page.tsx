"use client";

import { Suspense } from "react";
import ChatContent from "./ChatContent";

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
