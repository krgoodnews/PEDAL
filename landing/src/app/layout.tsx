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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedal.vercel.app"),
  title: "PEDAL — AI Agent 개발 워크플로",
  description:
    "Plan → Engineering → Do → Analyze → Learn. AI Agent를 위한 구조화된 개발 워크플로. 크로스 리뷰, Wiki SSOT, Severity Scoring으로 품질을 보장합니다.",
  keywords: ["PEDAL", "AI Agent", "개발 워크플로", "Cursor", "Gemini", "LLM"],
  authors: [{ name: "PEDAL" }],
  openGraph: {
    title: "PEDAL — AI Agent 개발 워크플로",
    description: "Plan → Engineering → Do → Analyze → Learn. AI Agent를 위한 구조화된 개발 워크플로.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 634 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PEDAL — AI Agent 개발 워크플로",
    description: "Plan → Engineering → Do → Analyze → Learn.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
