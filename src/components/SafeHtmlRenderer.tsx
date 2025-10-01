"use client";

import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export function SafeHtmlRenderer({ html, className }: SafeHtmlRendererProps) {
  // Configure DOMPurify to allow safe HTML elements and attributes
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 'del',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id',
      'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  // Parse options to add custom styling
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        const { name, attribs } = domNode;

        // Add responsive image classes
        if (name === 'img') {
          return (
            <img
              {...attribs}
              className="w-full h-auto rounded-xl shadow-lg my-6 max-w-full"
              loading="lazy"
            />
          );
        }

        // Style headings with Times New Roman
        if (name === 'h1') {
          return (
            <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground font-times leading-tight" />
          );
        }

        if (name === 'h2') {
          return (
            <h2 className="text-2xl font-bold mb-4 mt-6 text-foreground font-times leading-tight" />
          );
        }

        if (name === 'h3') {
          return (
            <h3 className="text-xl font-bold mb-3 mt-5 text-foreground font-times leading-tight" />
          );
        }

        // Style paragraphs
        if (name === 'p') {
          return (
            <p className="mb-4 leading-relaxed text-foreground font-times text-lg" />
          );
        }

        // Style blockquotes
        if (name === 'blockquote') {
          return (
            <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground font-times text-lg" />
          );
        }

        // Style links
        if (name === 'a') {
          return (
            <a
              {...attribs}
              className="text-primary hover:text-primary/80 underline font-times"
              target={attribs?.target || '_blank'}
              rel={attribs?.rel || 'noopener noreferrer'}
            />
          );
        }

        // Style lists
        if (name === 'ul') {
          return (
            <ul className="list-disc pl-6 mb-4 space-y-2 font-times text-lg" />
          );
        }

        if (name === 'ol') {
          return (
            <ol className="list-decimal pl-6 mb-4 space-y-2 font-times text-lg" />
          );
        }

        if (name === 'li') {
          return (
            <li className="leading-relaxed font-times" />
          );
        }

        // Style strong/bold text
        if (name === 'strong' || name === 'b') {
          return (
            <strong className="font-bold font-times" />
          );
        }

        // Style emphasis/italic text
        if (name === 'em' || name === 'i') {
          return (
            <em className="italic font-times" />
          );
        }
      }
    }
  };

  // Parse the clean HTML with our custom options
  const parsedContent = parse(cleanHtml, options);

  return (
    <div className={cn(
      "prose prose-lg max-w-none dark:prose-invert font-times text-foreground",
      "prose-headings:font-times prose-headings:font-bold",
      "prose-p:font-times prose-p:text-lg prose-p:leading-relaxed",
      "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6",
      "prose-a:text-primary prose-a:font-times",
      "prose-blockquote:font-times prose-blockquote:italic",
      "prose-strong:font-times prose-em:font-times",
      "prose-ul:font-times prose-ol:font-times prose-li:font-times",
      className
    )}>
      {parsedContent}
    </div>
  );
}