"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type LanguageCode = 'en' | 'hi' | 'ur' | 'bn' | 'es'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
]

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (code: LanguageCode) => void
  translate: (text: string) => Promise<string>
  isTranslating: boolean
  translationCache: Map<string, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find(l => l.code === 'hi') || SUPPORTED_LANGUAGES[0]
  )
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage')
    if (savedLang) {
      const lang = SUPPORTED_LANGUAGES.find(l => l.code === savedLang)
      if (lang) setCurrentLanguage(lang)
    }
  }, [])

  const setLanguage = (code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code)
    if (lang) {
      setCurrentLanguage(lang)
      localStorage.setItem('preferredLanguage', code)
    }
  }

  const translate = async (text: string): Promise<string> => {
    if (currentLanguage.code === 'en') {
      if (!/[\u0900-\u097F]/.test(text)) {
        return text
      }
    }

    const cacheKey = `${text.slice(0, 50)}_${currentLanguage.code}`
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }

    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: currentLanguage.code }),
      })

      if (!response.ok) throw new Error('Translation failed')

      const data = await response.json()
      translationCache.set(cacheKey, data.translatedText)
      return data.translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      translate,
      isTranslating,
      translationCache
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Hook for using static translations
import { translations, TranslationKey } from './translations'

export function useTranslations() {
  const { currentLanguage } = useLanguage()

  const t = (key: TranslationKey): string => {
    const lang = currentLanguage.code as keyof typeof translations
    return translations[lang]?.[key] || translations.en[key] || key
  }

  return { t, lang: currentLanguage.code, isRtl: currentLanguage.rtl }
}
