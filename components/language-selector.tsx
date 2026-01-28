"use client"

import { useState } from "react"
import { Languages, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/language-context"

export default function LanguageSelector() {
    const { currentLanguage, setLanguage, isTranslating } = useLanguage()
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 h-9 px-3"
                    disabled={isTranslating}
                >
                    <span className="text-base">{currentLanguage.flag}</span>
                    <span className="hidden sm:inline text-sm">{currentLanguage.code.toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => {
                            setLanguage(lang.code as LanguageCode)
                            setOpen(false)
                        }}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{lang.flag}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{lang.name}</span>
                                <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                            </div>
                        </div>
                        {currentLanguage.code === lang.code && (
                            <Check className="h-4 w-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
