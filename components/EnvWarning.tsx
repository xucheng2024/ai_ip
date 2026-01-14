'use client'

import { useI18n } from '@/lib/i18n/context'

export default function EnvWarning() {
  const { t } = useI18n()
  
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-center text-sm text-red-800">
      {t.common.missingEnvVars}
    </div>
  )
}
