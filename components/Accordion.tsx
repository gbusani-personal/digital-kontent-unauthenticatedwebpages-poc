import React from 'react';

interface AccordionProps {
  title?: string;
  contentHtml?: string;
  className?: string;
}

const toPlainHeadingText = (value: string | undefined): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Reusable accordion for CMS-driven content blocks.
 *
 * Notes:
 * - Uses native <details>/<summary> so it is collapsed by default and keyboard accessible.
 * - Gracefully falls back to plain rich text when title/content is incomplete.
 */
export default function Accordion({ title, contentHtml, className }: AccordionProps) {
  const safeTitle = toPlainHeadingText(title);
  const safeContentHtml = typeof contentHtml === 'string' ? contentHtml.trim() : '';

  if (!safeTitle && !safeContentHtml) {
    return null;
  }

  if (!safeTitle) {
    return <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: safeContentHtml }} />;
  }

  if (!safeContentHtml) {
    return <p className="font-semibold text-slate-900">{safeTitle}</p>;
  }

  return (
    <details className={`group rounded-lg border border-slate-200 bg-white ${className || ''}`.trim()}>
      <summary className="list-none cursor-pointer px-4 py-3 font-semibold text-slate-900 leading-relaxed flex items-center justify-between gap-3">
        <span>{safeTitle}</span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="px-4 pb-4 rich-text-content" dangerouslySetInnerHTML={{ __html: safeContentHtml }} />
    </details>
  );
}
