import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "求职申请管理系统",
  description: "基于 Next.js、Tailwind CSS、Prisma 和 MySQL 的工程骨架。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
