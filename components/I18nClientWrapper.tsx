'use client'

import { I18nProvider, useI18n } from '@/lib/i18n/context'
import { ReactNode, useEffect } from 'react'

function LanguageSetter({ children }: { children: ReactNode }) {
  const { language } = useI18n()
  
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return <>{children}</>
}

export default function I18nClientWrapper({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSetter>{children}</LanguageSetter>
    </I18nProvider>
  )
}