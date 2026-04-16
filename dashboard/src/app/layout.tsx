import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedal-dashboard.vercel.app"),
  title: "PEDAL Kanban Dashboard",
  description: "Monitor PEDAL development cycle status and task progress in real-time.",
  keywords: ["PEDAL", "Kanban", "Dashboard", "AI Agent", "Workflow"],
  authors: [{ name: "PEDAL" }],
  openGraph: {
    title: "PEDAL Kanban Dashboard",
    description: "Real-time status monitor for PEDAL development cycle.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 634 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PEDAL Kanban Dashboard",
    description: "Real-time status monitor for PEDAL development cycle.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
