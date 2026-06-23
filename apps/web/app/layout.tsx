import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Inkling",
  description: "A calm workspace for thinking, writing, and chatting.",
  icons: {
    icon: "/inkling-icon.png",
    shortcut: "/inkling-icon.png",
    apple: "/inkling-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-canvas font-sans text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
