import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NavbarSafe from "@/components/NavbarSafe";

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
        {hasEnvVars ? <Navbar /> : <NavbarSafe user={null} />}
        {!hasEnvVars && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-center text-sm text-red-800">
            ⚠️ Missing environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
