import React from 'react';
import type { CSSProperties } from 'react';
import Accordion from './Accordion';

const ACCORDION_MARKER_PATTERN = /<!--KONTENT_ACCORDION:([\s\S]*?)-->/g;

interface AccordionMarkerPayload {
  heading: string;
  contentHtml: string;
}

type RichTextSegment =
  | { kind: 'html'; html: string }
  | { kind: 'accordion'; payload: AccordionMarkerPayload };

interface ContentBlockRendererProps {
  /**
   * The HTML content to render from a content_block item or rich text field.
   * Typically extracted from a content_block's body field via CMS data layer.
   */
  html: string;
  
  /**
   * Optional CSS classes to apply to the container
   */
  className?: string;
  
  /**
   * Optional inline styles to apply to the container
   */
  style?: CSSProperties;
  
  /**
   * Optional Kontent.ai item ID for edit mode integration
   */
  itemId?: string;
  
  /**
   * Optional element codename for edit mode integration
   */
  elementCodename?: string;
  
  /**
   * HTML tag to wrap the content (default: 'div')
   */
  tag?: keyof React.JSX.IntrinsicElements;
}

/**
 * ContentBlockRenderer
 *
 * Renders rich text HTML content from nested content_block items in the CMS.
 *
 * Usage:
 * ```tsx
 * // Extract content from CMS via data layer
 * const page = await getLandingPageBySlug('my-page');
 *
 * // Render extracted content with styling
 * <ContentBlockRenderer
 *   html={page.contentSection}
 *   itemId={page.itemId}
 *   elementCodename="content_section"
 *   style={landingPageStyles.bodyText}
 *   className="rich-text-content"
 * />
 * ```
 *
 * How it works:
 * 1. CMS data layer (lib/kontent.ts) extracts HTML from content_block items
 * 2. When a landing_page links to content_block items via a rich text field,
 *    the extraction functions (getSectionHtml, getContentBlockBodies) combine them
 * 3. This component renders the merged HTML with consistent styling
 * 4. Kontent.ai edit mode integration is available when itemId is provided
 */
export default function ContentBlockRenderer({
  html,
  className,
  style,
  itemId,
  elementCodename,
  tag = 'div',
}: ContentBlockRendererProps) {
  const Tag = tag as any;

  const hasMeaningfulHtml = (value: string): boolean => {
    const normalized = value
      .replace(/<!--([\s\S]*?)-->/g, '')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/\u00a0/g, ' ')
      .trim();

    if (!normalized) {
      return false;
    }

    if (/<(img|iframe|video|audio|object|embed|svg|table|ul|ol|li|hr|blockquote)\b/i.test(normalized)) {
      return true;
    }

    return normalized.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length > 0;
  };

  const decodeAccordionMarkerPayload = (encodedPayload: string): AccordionMarkerPayload | null => {
    try {
      const decoded = decodeURIComponent(encodedPayload);
      const parsed = JSON.parse(decoded) as { heading?: unknown; contentHtml?: unknown };

      const heading = typeof parsed.heading === 'string' ? parsed.heading.trim() : '';
      const contentHtml = typeof parsed.contentHtml === 'string' ? parsed.contentHtml : '';

      if (!heading && !contentHtml) {
        return null;
      }

      return {
        heading,
        contentHtml,
      };
    } catch {
      return null;
    }
  };

  const parseRichTextSegments = (value: string): RichTextSegment[] => {
    const segments: RichTextSegment[] = [];
    ACCORDION_MARKER_PATTERN.lastIndex = 0;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = ACCORDION_MARKER_PATTERN.exec(value)) !== null) {
      const markerIndex = match.index;
      const markerText = match[0];
      const encodedPayload = match[1] || '';

      if (markerIndex > cursor) {
        segments.push({ kind: 'html', html: value.slice(cursor, markerIndex) });
      }

      const payload = decodeAccordionMarkerPayload(encodedPayload);
      if (payload) {
        segments.push({ kind: 'accordion', payload });
      } else {
        // Fallback: keep marker text so bad payloads do not crash rendering.
        segments.push({ kind: 'html', html: markerText });
      }

      cursor = markerIndex + markerText.length;
    }

    if (cursor < value.length) {
      segments.push({ kind: 'html', html: value.slice(cursor) });
    }

    if (segments.length === 0) {
      return [{ kind: 'html', html: value }];
    }

    return segments;
  };

  // Build data attributes for Kontent.ai edit mode integration
  const dataAttributes = itemId && elementCodename
    ? {
        'data-kontent-item-id': itemId,
        'data-kontent-element-codename': elementCodename,
      }
    : {};

  if (!html || !hasMeaningfulHtml(html)) {
    return null;
  }

  const segments = parseRichTextSegments(html);
  const hasAccordionSegment = segments.some((segment) => segment.kind === 'accordion');

  if (!hasAccordionSegment) {
    return (
      <Tag
        className={className}
        style={style}
        {...dataAttributes}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Tag className={className} style={style} {...dataAttributes}>
      {segments.map((segment, index) => {
        if (segment.kind === 'accordion') {
          return (
            <Accordion
              key={`accordion-${index}`}
              title={segment.payload.heading}
              contentHtml={segment.payload.contentHtml}
              className="my-4"
            />
          );
        }

        if (!hasMeaningfulHtml(segment.html)) {
          return null;
        }

        return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: segment.html }} />;
      })}
    </Tag>
  );
}
