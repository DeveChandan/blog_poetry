"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react"
import { translations, TranslationKey } from "./translations"

export type LanguageCode = "en" | "hi" | "ur" | "bn" | "es"

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
]

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (code: LanguageCode) => void
  translate: (text: string) => Promise<string>
  isTranslating: boolean
  translationCache: Map<string, string>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Shared client-side caches across renders to eliminate duplicate /api/translate calls
const globalTranslationCache = new Map<string, string>()
const inflightTranslations = new Map<string, Promise<string>>()

function isPureDevanagari(text: string): boolean {
  return /^[\u0900-\u097F\s\d.,!?।'"\-–—:;()•…]+$/.test(text)
}

function getCacheKey(text: string, lang: LanguageCode): string {
  return `${lang}:${text.length}:${text.slice(0, 80)}`
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find((l) => l.code === "hi") || SUPPORTED_LANGUAGES[0]
  )
  const [isTranslating, setIsTranslating] = useState(false)
  const activeCountRef = useRef(0)
  const langRef = useRef<LanguageCode>(currentLanguage.code)
  langRef.current = currentLanguage.code

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("preferredLanguage")
      if (savedLang) {
        const lang = SUPPORTED_LANGUAGES.find((l) => l.code === savedLang)
        if (lang) setCurrentLanguage(lang)
      }
    } catch {
      // Ignore storage access errors
    }
  }, [])

  const setLanguage = useCallback((code: LanguageCode) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code)
    if (lang) {
      setCurrentLanguage(lang)
      try {
        localStorage.setItem("preferredLanguage", code)
      } catch {
        // Ignore storage errors
      }
    }
  }, [])

  const translate = useCallback(async (text: string): Promise<string> => {
    if (!text || !text.trim()) return text

    const targetLang = langRef.current

    // Skip network request when text is already in target script
    if (targetLang === "en" && !/[\u0900-\u097F]/.test(text)) {
      return text
    }
    if (targetLang === "hi" && isPureDevanagari(text)) {
      return text
    }

    const cacheKey = getCacheKey(text, targetLang)

    if (globalTranslationCache.has(cacheKey)) {
      return globalTranslationCache.get(cacheKey)!
    }

    try {
      const stored = sessionStorage.getItem(`tr_${cacheKey}`)
      if (stored !== null) {
        globalTranslationCache.set(cacheKey, stored)
        return stored
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Deduplicate concurrent identical requests
    if (inflightTranslations.has(cacheKey)) {
      return inflightTranslations.get(cacheKey)!
    }

    const promise = (async () => {
      activeCountRef.current += 1
      if (activeCountRef.current === 1) setIsTranslating(true)

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang }),
        })

        if (!response.ok) throw new Error("Translation failed")

        const data = await response.json()
        const result = data.translatedText || text
        globalTranslationCache.set(cacheKey, result)
        try {
          sessionStorage.setItem(`tr_${cacheKey}`, result)
        } catch {
          // Ignore quota errors
        }
        return result
      } catch (error) {
        console.error("Translation error:", error)
        return text
      } finally {
        inflightTranslations.delete(cacheKey)
        activeCountRef.current = Math.max(0, activeCountRef.current - 1)
        if (activeCountRef.current === 0) setIsTranslating(false)
      }
    })()

    inflightTranslations.set(cacheKey, promise)
    return promise
  }, [])

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      translate,
      isTranslating,
      translationCache: globalTranslationCache,
    }),
    [currentLanguage, setLanguage, translate, isTranslating]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

export function useTranslations() {
  const { currentLanguage } = useLanguage()

  const t = useCallback(
    (key: TranslationKey): string => {
      const lang = currentLanguage.code as keyof typeof translations
      return translations[lang]?.[key] || translations.en[key] || key
    },
    [currentLanguage.code]
  )

  return { t, lang: currentLanguage.code, isRtl: currentLanguage.rtl }
}
