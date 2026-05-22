import type { Metadata } from "next";
import { SessionProvider } from "@/lib/session/session-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Worknoon Chat",
  description: "Real-time eCommerce chat for customers, agents, designers, and merchants."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
