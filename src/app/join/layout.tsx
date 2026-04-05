import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unirse al Chat | Quick Talk!",
  description: "Ingresa al chat en tiempo real con tus amigos. Crea o únete a salas de conversación.",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
