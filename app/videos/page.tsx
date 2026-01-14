'use client'

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function VideosPage() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.common.videos}
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            {t.home.videosPageDesc || "Verified AI video gallery coming soon."}
          </p>
          <div className="mt-10">
            <Link
              href="/verify"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              {t.common.verify} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
