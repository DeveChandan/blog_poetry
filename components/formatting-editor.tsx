import React, { useState, useRef } from 'react';
import ContentRenderer from './content-renderer';
import { Bold, Italic, Underline, Eye, Edit3, Heading1, Heading2, Quote } from 'lucide-react';
import { Button } from './ui/button';

interface FormattingEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function FormattingEditor({
  value,
  onChange,
  placeholder = 'Type here...',
  className = '',
  minHeight = 'min-h-[200px]'
}: FormattingEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (formatType: 'bold' | 'italic' | 'underline' | 'h1' | 'h2' | 'quote') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let prefix = '';
    let suffix = '';

    switch (formatType) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        break;
      case 'underline':
        prefix = '__';
        suffix = '__';
        break;
      case 'h1':
        prefix = '# ';
        suffix = '';
        break;
      case 'h2':
        prefix = '## ';
        suffix = '';
        break;
      case 'quote':
        prefix = '> ';
        suffix = '';
        break;
      default:
        break;
    }

    const insertedText = selectedText || (formatType === 'bold' ? 'bold text' : formatType === 'italic' ? 'italic text' : formatType === 'underline' ? 'underline text' : 'text');
    const replacement = prefix + insertedText + suffix;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    onChange(newValue);

    // Focus and select the newly inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + insertedText.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 50);
  };

  return (
    <div className={`border border-border rounded-lg bg-card overflow-hidden flex flex-col ${className}`}>
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
          {activeTab === 'edit' && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => insertFormat('bold')}
                title="Bold (**text**)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => insertFormat('italic')}
                title="Italic (*text*)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => insertFormat('underline')}
                title="Underline (__text__)"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex border border-border rounded overflow-hidden">
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 relative">
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 bg-background text-foreground placeholder:text-muted-foreground/60 border-none outline-none resize-y focus:ring-0 ${minHeight}`}
          />
        ) : (
          <div className={`p-4 bg-background border-none overflow-y-auto prose dark:prose-invert max-w-none ${minHeight}`}>
            {value.trim() ? (
              <ContentRenderer content={value} />
            ) : (
              <p className="text-muted-foreground/60 italic text-sm">Nothing to preview</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
