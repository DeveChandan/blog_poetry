"use client"

import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
    Bold, 
    Italic, 
    Underline, 
    List, 
    ListOrdered, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Text
} from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)

    // Synchronize content from parent state ONLY if editor is not focused
    // or if the content is completely different (e.g. when loading a blog for editing)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || "<p><br></p>"
            }
        }
    }, [value])

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const execCmd = (command: string, arg: string = "") => {
        document.execCommand(command, false, arg)
        handleInput()
        if (editorRef.current) {
            editorRef.current.focus()
        }
    }

    return (
        <div className="border border-input rounded-md overflow-hidden bg-popover text-popover-foreground flex flex-col focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            {/* Rich Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-muted/40 border-b border-input">
                {/* Inline Styles */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("bold")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("italic")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("underline")}
                    title="Underline"
                >
                    <Underline className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("formatBlock", "<h1>")}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("formatBlock", "<h2>")}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("formatBlock", "<h3>")}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("formatBlock", "<p>")}
                    title="Normal Paragraph"
                >
                    <Text className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("insertUnorderedList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("insertOrderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignments */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("justifyLeft")}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("justifyCenter")}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCmd("justifyRight")}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Clear Formatting */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => execCmd("removeFormat")}
                    title="Clear Formatting"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
            </div>

            {/* Editable Content Frame */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto outline-none blog-content bg-background text-foreground"
                data-placeholder={placeholder}
            />
        </div>
    )
}
