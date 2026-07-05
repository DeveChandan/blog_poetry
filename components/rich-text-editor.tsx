import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Edit3, Trash } from 'lucide-react';
import { Button } from './ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing or paste rich text from MS Word...',
  className = '',
  minHeight = 'min-h-[300px]'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    setHtmlValue(value);
  }, []);

  // Update content externally if changed (but not while typing)
  useEffect(() => {
    if (!isHtmlMode && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    setHtmlValue(value);
  }, [value, isHtmlMode]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const currentHtml = e.currentTarget.innerHTML;
    setHtmlValue(currentHtml);
    onChange(currentHtml);
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setHtmlValue(newVal);
    onChange(newVal);
  };

  const execCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      setHtmlValue(currentHtml);
      onChange(currentHtml);
      editorRef.current.focus();
    }
  };

  return (
    <div className={`border border-border rounded-lg bg-card overflow-hidden flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
          {!isHtmlMode ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('bold')}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('italic')}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('underline')}
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </Button>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('insertUnorderedList')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('insertOrderedList')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('justifyLeft')}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('justifyCenter')}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('justifyRight')}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => execCommand('removeFormat')}
                title="Clear Formatting"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground font-mono px-2">HTML Source Editor</span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-border rounded overflow-hidden">
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${
              !isHtmlMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setIsHtmlMode(false)}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Visual
          </button>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${
              isHtmlMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setIsHtmlMode(true)}
          >
            <Code className="h-3.5 w-3.5" />
            HTML
          </button>
        </div>
      </div>

      {/* Editor Space */}
      <div className="flex-1 relative bg-background">
        <div
          ref={editorRef}
          contentEditable={!isHtmlMode}
          onInput={handleInput}
          placeholder={placeholder}
          className={`w-full p-4 outline-none focus:ring-0 overflow-y-auto font-serif prose dark:prose-invert max-w-none ${minHeight} ${
            isHtmlMode ? 'hidden' : 'block'
          }`}
          style={{ minHeight: '300px' }}
        />
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          className={`w-full p-4 bg-background text-foreground font-mono text-sm border-none outline-none resize-y focus:ring-0 ${minHeight} ${
            isHtmlMode ? 'block' : 'hidden'
          }`}
          style={{ minHeight: '300px' }}
          placeholder="Paste or write HTML here..."
        />
      </div>
      {/* Help message */}
      <div className="px-3 py-1 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
        Tip: You can copy and paste directly from MS Word or Google Docs, retaining all formatting, spacing, lists, and alignment.
      </div>
    </div>
  );
}

export default RichTextEditor;
