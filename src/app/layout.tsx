import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthProvider";

// Jua: 둥글둥글 귀여운 폰트. Korean 글자는 시스템 고딕으로 자연스럽게 폴백됩니다.
const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "핑크 가계부 🎀",
  description: "귀엽고 깔끔한 핑크 가계부 — 입출금 내역과 통계를 한눈에",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
