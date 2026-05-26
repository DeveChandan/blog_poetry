"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Heart,
  Eye,
  Calendar,
  Tag,
  Feather,
  Sparkles,
  Bookmark,
  Share2,
  Printer,
  Moon,
  Sun,
  Palette,
  Type,
  Volume2,
  VolumeX,
  Clock,
  TrendingUp,
  Quote,
  CornerDownRight,
  MoreVertical,
  User,
  Globe,
  Mic,
  MicOff,
  Volume1,
  Volume,
  AlertCircle,
  CheckCircle,
  Languages
} from "lucide-react"
import CommentsSection from "@/components/comments-section"
import ReactionsBar from "@/components/reactions-bar"
import ReviewsSection from "@/components/reviews-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"

interface Poem {
  _id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  views: number
  likes?: number
  createdAt: string
  author?: string
  authorGender?: 'male' | 'female'
  readingTime?: number
  theme?: string
  language?: string
}

type ThemeType = 'classic' | 'nature' | 'love' | 'minimal' | 'professional' | 'romantic'
type FontType = 'serif' | 'sans' | 'mono' | 'poetic' | 'calligraphy' | 'traditional'
type SizeType = 'small' | 'medium' | 'large'
type VoiceType = 'male' | 'female'
type LanguageType = 'english' | 'hindi' | 'bengali'

interface UserPreferences {
  voiceType: VoiceType
  language: LanguageType
  readingSpeed: number
  autoPlay: boolean
}

interface AvailableVoice {
  name: string
  lang: string
  voice: SpeechSynthesisVoice
  gender: VoiceType
}

export default function PoemDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [theme, setTheme] = useState<ThemeType>('classic')
  const [font, setFont] = useState<FontType>('serif')
  const [fontSize, setFontSize] = useState<SizeType>('medium')

  // Translation states
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [currentTranslateLang, setCurrentTranslateLang] = useState<string | null>(null)

  const [isReading, setIsReading] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<AvailableVoice[]>([])
  const [voiceWarning, setVoiceWarning] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState<AvailableVoice | null>(null)
  const [isVoiceSupported, setIsVoiceSupported] = useState(true)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    voiceType: 'female',
    language: 'english',
    readingSpeed: 1.0,
    autoPlay: false
  })

  // Translation function
  const handleTranslate = async (targetLang: string) => {
    if (!poem) return

    // If clicking same language, toggle back to original
    if (currentTranslateLang === targetLang) {
      setTranslatedContent(null)
      setTranslatedTitle(null)
      setCurrentTranslateLang(null)
      toast.info('Showing original content')
      return
    }

    setIsTranslating(true)
    try {
      // Translate title
      const titleRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: poem.title, targetLang })
      })
      const titleData = await titleRes.json()

      // Translate content
      const contentRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: poem.content, targetLang })
      })
      const contentData = await contentRes.json()

      if (contentData.translatedText && titleData.translatedText) {
        setTranslatedContent(contentData.translatedText)
        setTranslatedTitle(titleData.translatedText)
        setCurrentTranslateLang(targetLang)
        const langName = targetLang === 'hi' ? 'Hindi' : targetLang === 'ur' ? 'Urdu' : 'Bengali'
        toast.success(`Translated to ${langName}`)
      } else {
        throw new Error('Translation failed')
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast.error('Translation failed. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  // Auto-translate when navbar language changes
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    if (!poem) return

    if (currentLanguage.code === 'en') {
      // If the original poem is in Devanagari (Hindi), translate/transliterate it to English/Hinglish
      if (/[\u0900-\u097F]/.test(poem.content)) {
        handleTranslate('en')
      } else {
        // Reset to original
        setTranslatedContent(null)
        setTranslatedTitle(null)
        setCurrentTranslateLang(null)
      }
    } else {
      // Auto-translate to selected navbar language
      handleTranslate(currentLanguage.code)
    }
  }, [currentLanguage.code, poem?._id])

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsVoiceSupported(false)
      setVoiceWarning('Text-to-speech is not supported in your browser')
      return
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()

      if (voices.length === 0) {
        setVoiceWarning('No voices available. Please check your browser settings.')
        return
      }

      // Map available voices with proper language detection
      const mappedVoices: AvailableVoice[] = voices.map(voice => {
        // Detect gender from voice name
        const voiceName = voice.name.toLowerCase()
        const gender: VoiceType = voiceName.includes('female') ||
          voiceName.includes('woman') ||
          voiceName.includes('girl') ? 'female' : 'male'

        // Detect language
        let language: LanguageType = 'english'
        if (voice.lang.startsWith('hi')) {
          language = 'hindi'
        } else if (voice.lang.startsWith('bn')) {
          language = 'bengali'
        } else if (voice.lang.startsWith('en')) {
          language = 'english'
        }

        return {
          name: voice.name,
          lang: voice.lang,
          voice: voice,
          gender: gender
        }
      })

      setAvailableVoices(mappedVoices)

      // Find best matching voice for current preferences
      findBestVoice(mappedVoices, userPreferences)
    }

    // Load voices initially
    loadVoices()

    // Set up voice change listener
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  // Find best voice when preferences change
  useEffect(() => {
    if (availableVoices.length > 0) {
      findBestVoice(availableVoices, userPreferences)
    }
  }, [userPreferences, availableVoices])

  const findBestVoice = (voices: AvailableVoice[], prefs: UserPreferences) => {
    // Try to find exact match
    let bestVoice = voices.find(v =>
      v.gender === prefs.voiceType &&
      (prefs.language === 'hindi' && v.lang.startsWith('hi')) ||
      (prefs.language === 'bengali' && v.lang.startsWith('bn')) ||
      (prefs.language === 'english' && v.lang.startsWith('en'))
    )

    // If no exact match, try same gender with any language
    if (!bestVoice) {
      bestVoice = voices.find(v => v.gender === prefs.voiceType)
    }

    // If still no match, use any voice
    if (!bestVoice && voices.length > 0) {
      bestVoice = voices[0]
    }

    setSelectedVoice(bestVoice || null)

    // Set warning if no appropriate voice found
    if (!bestVoice) {
      setVoiceWarning(`No ${prefs.voiceType} voice available for ${prefs.language}. Using default voice.`)
    } else {
      setVoiceWarning('')
    }
  }

  const fetchPoem = async () => {
    try {
      const res = await fetch(`/api/poems/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPoem(data)

        const bookmarked = localStorage.getItem(`bookmark_${id}`)
        setIsBookmarked(!!bookmarked)

        const savedPrefs = localStorage.getItem('poemPreferences')
        if (savedPrefs) {
          setUserPreferences(JSON.parse(savedPrefs))
        }
      }
    } catch (error) {
      console.error("Failed to fetch poem:", error)
      toast.error("Could not load poem")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoem()
  }, [id])

  useEffect(() => {
    localStorage.setItem('poemPreferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  const handleBookmark = () => {
    if (!poem) return
    if (isBookmarked) {
      localStorage.removeItem(`bookmark_${id}`)
      toast.info("Removed from bookmarks")
    } else {
      localStorage.setItem(`bookmark_${id}`, "true")
      toast.success("Added to bookmarks")
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poem?.title,
        text: poem?.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleTextToSpeech = () => {
    if (!poem) return

    if (isReading) {
      speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    if (!selectedVoice) {
      toast.error("No voice available for selected language")
      return
    }

    // Check if selected voice matches preferred language
    const voiceLang = selectedVoice.lang.startsWith('hi') ? 'hindi' :
      selectedVoice.lang.startsWith('bn') ? 'bengali' : 'english'

    if (voiceLang !== userPreferences.language) {
      toast.warning(`Using ${voiceLang} voice for ${userPreferences.language} text`)
    }

    const utterance = new SpeechSynthesisUtterance(poem.content)
    utterance.voice = selectedVoice.voice
    utterance.rate = userPreferences.readingSpeed
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Set appropriate language for pronunciation
    if (userPreferences.language === 'hindi') {
      utterance.lang = 'hi-IN'
    } else if (userPreferences.language === 'bengali') {
      utterance.lang = 'bn-IN'
    } else {
      utterance.lang = 'en-US'
    }

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => setIsReading(false)
    utterance.onerror = (e) => {
      setIsReading(false)
      console.error("Speech synthesis error:", e)
      toast.error("Failed to read poem. Please try a different language or voice.")
    }

    speechSynthesis.speak(utterance)
    toast.info(`Reading with ${selectedVoice.gender} voice...`)
  }

  // Function to test available voices
  const testVoice = (voice: AvailableVoice) => {
    if (!isVoiceSupported) return

    const testText = userPreferences.language === 'hindi' ? 'नमस्ते' :
      userPreferences.language === 'bengali' ? 'হ্যালো' :
        'Hello'

    const utterance = new SpeechSynthesisUtterance(testText)
    utterance.voice = voice.voice
    utterance.rate = 1.0
    utterance.onend = () => toast.success(`Voice ${voice.name} is working!`)
    utterance.onerror = () => toast.error(`Voice ${voice.name} failed to play`)

    speechSynthesis.speak(utterance)
  }

  const getThemeClasses = () => {
    const baseClasses = "min-h-screen transition-all duration-500"

    switch (theme) {
      case 'nature':
        return `${baseClasses} bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30`
      case 'love':
        return `${baseClasses} bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/30`
      case 'minimal':
        return `${baseClasses} bg-white dark:bg-gray-900`
      case 'professional':
        return `${baseClasses} bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30`
      case 'romantic':
        return `${baseClasses} bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30`
      default: // classic
        return `${baseClasses} bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30`
    }
  }

  const getFontClasses = () => {
    switch (font) {
      case 'sans':
        return "font-sans"
      case 'mono':
        return "font-mono"
      case 'poetic':
        return "font-serif italic tracking-wider"
      case 'calligraphy':
        return "font-serif italic tracking-widest"
      case 'traditional':
        return "font-serif font-medium"
      default: // serif
        return "font-serif"
    }
  }

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return "text-base"
      case 'large':
        return "text-2xl"
      default: // medium
        return "text-lg"
    }
  }

  const updateUserPreference = (key: keyof UserPreferences, value: any) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto"
        >
          <Feather className="w-full h-full text-primary/60" />
        </motion.div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Unfolding verses...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Discovering the rhythm of words</p>
        </div>
      </div>
    </div>
  )

  if (!poem) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 max-w-md px-4">
        <Feather className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-700" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Poem Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The verses you seek have vanished into the ether.</p>
        </div>
        <Button onClick={() => window.location.href = '/poems'}>
          Browse Poems
        </Button>
      </div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      <div className={getThemeClasses()}>
        {/* Poem Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mb-12"
          >
            {/* Poem Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {poem.language ? `${poem.language.toUpperCase()} POEM` : 'FEATURED POEM'}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {translatedTitle || poem.title}
              </h1>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  {poem.language && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {poem.language}
                    </span>
                  )}
                  {poem.theme && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {poem.theme}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Poem Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`relative ${getFontClasses()} ${getFontSizeClass()} leading-relaxed tracking-wide`}
            >
              {/* Decorative Quote Marks */}
              <Quote className="absolute -left-8 top-0 w-8 h-8 text-gray-300 dark:text-gray-700 opacity-50" />
              <Quote className="absolute -right-8 bottom-0 w-8 h-8 text-gray-300 dark:text-gray-700 opacity-50 rotate-180" />

              {/* Content Lines */}
              <div className={`relative pl-8 md:pl-12 ${currentTranslateLang === 'ur' ? 'text-right' : ''}`} dir={currentTranslateLang === 'ur' ? 'rtl' : 'ltr'}>
                {(translatedContent || poem.content).split('\n').map((line, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`mb-4 ${line.trim() === '' ? 'h-6' : ''}`}
                  >
                    {line.trim() === '' ? (
                      <span className="block h-4"></span>
                    ) : (
                      <>
                        {index % 2 === 0 && !translatedContent && (
                          <CornerDownRight className="inline w-4 h-4 mr-3 text-primary/50" />
                        )}
                        {line}
                      </>
                    )}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Stats and Tags */}
            <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {poem.tags?.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Badge
                      variant="outline"
                      className="px-4 py-1.5 text-sm rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3 mr-2" />
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">
                    {(poem.views || 0).toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">
                    {(poem.likes || 0).toLocaleString()} likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {poem.readingTime || 2} min read
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {new Date(poem.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {userPreferences.autoPlay && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Volume1 className="w-4 h-4" />
                    <span className="font-medium">Auto-Play</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <Button
                variant="default"
                className="gap-2"
                onClick={() => toast.success("Liked this poem!")}
              >
                <Heart className="w-4 h-4" />
                Like Poem
              </Button>
              <Button
                variant={isReading ? "destructive" : "outline"}
                className="gap-2"
                onClick={handleTextToSpeech}
                disabled={!isVoiceSupported}
              >
                {isReading ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop Reading
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Listen ({userPreferences.voiceType} - {userPreferences.language})
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => toast.success("Added to your collection!")}
              >
                <Bookmark className="w-4 h-4" />
                Save to Collection
              </Button>
            </div>
          </motion.article>

          {/* Separator */}
          <Separator className="my-8" />

          {/* Interactive Sections */}
          <div className="space-y-8">
            {/* Reactions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reader Reactions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share your emotional response</p>
                </div>
              </div>
              <ReactionsBar contentId={id} contentType="poem" />
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Poem Reviews</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">What readers are saying</p>
                </div>
              </div>
              <ReviewsSection contentId={id} contentType="poem" />
            </motion.section>

            {/* Comments */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Feather className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Discussion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join the conversation</p>
                </div>
              </div>
              <CommentsSection contentId={id} contentType="poem" />
            </motion.section>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "Poetry is when an emotion has found its thought and the thought has found words." – Robert Frost
              </p>
              {!isVoiceSupported && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  <p>💡 Tip: Use Chrome or Edge browser for Hindi/Bengali voice support</p>
                  <p>Enable text-to-speech in your browser settings for regional languages</p>
                </div>
              )}
            </div>
          </motion.footer>
        </div>

      </div>
    </AnimatePresence>
  )
}
