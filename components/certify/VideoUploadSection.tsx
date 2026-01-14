'use client'

import { useRef } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { isCompressionSupported, getEstimatedSize, type CompressionOptions } from '@/lib/utils/video-compress'

interface VideoUploadSectionProps {
  file: File | null
  isDragging: boolean
  enableCompression: boolean
  compressionQuality: CompressionOptions['quality']
  compressing: boolean
  compressionProgress: number
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onRemoveFile: () => void
  onToggleCompression: () => void
  onCompressionQualityChange: (quality: CompressionOptions['quality']) => void
}

export default function VideoUploadSection({
  file,
  isDragging,
  enableCompression,
  compressionQuality,
  compressing,
  compressionProgress,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
  onToggleCompression,
}: VideoUploadSectionProps) {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {t.certify.videoFile} <span className="text-red-500">*</span>
      </label>
      <div className="mt-2">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 shadow-inner'
              : 'border-gray-300/80 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
        >
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={onFileChange}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {file ? (
                <span className="block">{t.certify.changeVideoFile}</span>
              ) : (
                <span className="block">{t.certify.uploadOrDragDrop}</span>
              )}
            </label>
            <p className="mt-1 text-xs text-gray-500">{t.certify.fileFormats}</p>
          </div>
        </div>
        {file && (
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    {enableCompression && isCompressionSupported() && (
                      <p className="text-xs text-green-600 mt-1">
                        {t.certify.estimatedAfterCompression}: {(getEstimatedSize(file.size, compressionQuality) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onRemoveFile()
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  {t.certify.remove}
                </button>
              </div>
            </div>
            
            {isCompressionSupported() && enableCompression && (
              <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{t.certify.losslessCompressionEnabled}</span>
                    <p className="text-xs text-gray-600 mt-0.5">{t.certify.losslessCompressionDesc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleCompression}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {t.certify.disableCompression}
                  </button>
                </div>
              </div>
            )}
            
            {isCompressionSupported() && !enableCompression && (
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="enableCompression"
                    checked={enableCompression}
                    onChange={(e) => onToggleCompression()}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="enableCompression" className="ml-3 flex-1">
                    <span className="text-sm font-medium text-gray-900">{t.certify.enableCompression}</span>
                    <p className="text-xs text-gray-600 mt-1">{t.certify.enableCompressionDesc}</p>
                  </label>
                </div>
              </div>
            )}
            
            {compressing && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t.certify.compressingVideo}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${compressionProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
