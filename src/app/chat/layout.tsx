import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sala de Chat | Quick Talk!",
  description: "Sala de chat en tiempo real. Envía mensajes, reacciona y comunica con otros usuarios.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
