import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pocketoffline",
  description: "PocketOffline is an offline-first Next.js app built to store and organize your code snippets",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}  antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
