import type { Metadata, Viewport } from "next";
import { SessionProvider } from "@/lib/session/session-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Worknoon Chat",
  description: "Real-time eCommerce chat for customers, agents, designers, and merchants."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
