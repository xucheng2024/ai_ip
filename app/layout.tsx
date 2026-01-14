import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NavbarSafe from "@/components/NavbarSafe";
import I18nClientWrapper from "@/components/I18nClientWrapper";
import EnvWarning from "@/components/EnvWarning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIVerify - AI Video Originality Certification",
  description: "Prove when it was created. Prove who created it.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if environment variables are set
  const hasEnvVars = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nClientWrapper>
          {hasEnvVars ? <Navbar /> : <NavbarSafe user={null} />}
          {!hasEnvVars && <EnvWarning />}
          {children}
        </I18nClientWrapper>
      </body>
    </html>
  );
}
