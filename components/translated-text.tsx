"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'

interface TranslatedTextProps {
    children: string
    className?: string
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
}

// Component that automatically translates text based on global language selection
export function TranslatedText({
    children,
    className = '',
    as: Component = 'span'
}: TranslatedTextProps) {
    const { currentLanguage, translate, isTranslating } = useLanguage()
    const [translatedText, setTranslatedText] = useState(children)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true

        const doTranslate = async () => {
            if (currentLanguage.code === 'en') {
                setTranslatedText(children)
                return
            }

            setLoading(true)
            try {
                const result = await translate(children)
                if (isMounted) {
                    setTranslatedText(result)
                }
            } catch (error) {
                console.error('Translation error:', error)
                if (isMounted) {
                    setTranslatedText(children)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        doTranslate()

        return () => {
            isMounted = false
        }
    }, [children, currentLanguage.code, translate])

    const rtlClass = currentLanguage.rtl ? 'text-right' : ''
    const loadingClass = loading ? 'opacity-70' : ''

    return (
        <Component
            className={`${className} ${rtlClass} ${loadingClass}`}
            dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
        >
            {translatedText}
        </Component>
    )
}

// Hook to translate text imperatively
export function useTranslatedText(text: string) {
    const { currentLanguage, translate } = useLanguage()
    const [translatedText, setTranslatedText] = useState(text)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true

        const doTranslate = async () => {
            if (currentLanguage.code === 'en') {
                setTranslatedText(text)
                return
            }

            setLoading(true)
            try {
                const result = await translate(text)
                if (isMounted) {
                    setTranslatedText(result)
                }
            } catch (error) {
                if (isMounted) {
                    setTranslatedText(text)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        doTranslate()

        return () => {
            isMounted = false
        }
    }, [text, currentLanguage.code, translate])

    return { translatedText, loading, isRtl: currentLanguage.rtl }
}
