import React from 'react';

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function parseFormatting(text: string): React.ReactNode {
  if (!text) return '';

  // Normalize formatting markers:
  // - **bold** or <b>bold</b> or <strong>bold</strong> -> <b>bold</b>
  // - *italic* or <i>italic</i> or <em>italic</em> -> <i>italic</i>
  // - __underline__ or <u>underline</u> -> <u>underline</u>
  let normalized = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/<strong>(.*?)<\/strong>/g, '<b>$1</b>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/<em>(.*?)<\/em>/g, '<i>$1</i>')
    // Support standard tags
    .replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
    .replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
    .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');

  // Tokenize using regex to split matching tags
  const regex = /(<b>.*?<\/b>|<i>.*?<\/i>|<u>.*?<\/u>)/g;
  const parts = normalized.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('<b>') && part.endsWith('</b>')) {
          const inner = part.slice(3, -4);
          return <strong key={index} className="font-bold text-foreground">{inner}</strong>;
        }
        if (part.startsWith('<i>') && part.endsWith('</i>')) {
          const inner = part.slice(3, -4);
          return <em key={index} className="italic">{inner}</em>;
        }
        if (part.startsWith('<u>') && part.endsWith('</u>')) {
          const inner = part.slice(3, -4);
          return <u key={index} className="underline">{inner}</u>;
        }
        return part;
      })}
    </>
  );
}

export default function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  if (!content) return null;

  // Check if content contains HTML tags (starts with tags, contains p/br/span/strong/em/ul/ol/div/etc)
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div 
        className={`prose dark:prose-invert max-w-none font-serif leading-relaxed text-muted-foreground ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Fallback to plain text split for legacy/markdown-like strings
  const lines = content.split('\n');

  return (
    <div className={`space-y-4 font-serif text-muted-foreground ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          return <div key={index} className="h-4" />;
        }
        return (
          <p key={index} className="leading-relaxed">
            {parseFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}
