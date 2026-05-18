import { NextRequest, NextResponse } from 'next/server'

// Translation API endpoint
export async function POST(request: NextRequest) {
    try {
        const { text, targetLang } = await request.json()

        if (!text || !targetLang) {
            return NextResponse.json(
                { error: 'Missing required fields: text and targetLang' },
                { status: 400 }
            )
        }

        // If target is English, check for Devanagari to transliterate to Hinglish
        if (targetLang === 'en') {
            if (/[\u0900-\u097F]/.test(text)) {
                const { transliterateDevanagari } = await import("@/lib/transliterate");
                return NextResponse.json({ 
                    translatedText: transliterateDevanagari(text),
                    detectedLanguage: 'hi'
                })
            }
            return NextResponse.json({ translatedText: text })
        }

        // Use Google Translate via public endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`

        try {
            const response = await fetch(url)
            const data = await response.json()

            // Extract translated text from response
            let translatedText = ''
            if (data && data[0]) {
                for (const sentence of data[0]) {
                    if (sentence[0]) {
                        translatedText += sentence[0]
                    }
                }
            }

            if (translatedText) {
                return NextResponse.json({
                    translatedText,
                    detectedLanguage: data[2] || 'unknown'
                })
            } else {
                throw new Error('No translation returned')
            }
        } catch (translateError) {
            console.error('Translation API error:', translateError)
            // Return original text with error info
            return NextResponse.json({
                translatedText: text,
                error: 'Translation service temporarily unavailable',
                fallback: true
            })
        }

    } catch (error) {
        console.error('Translation endpoint error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
