import React from 'react';
import type { CSSProperties } from 'react';

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

  // Build data attributes for Kontent.ai edit mode integration
  const dataAttributes = itemId && elementCodename
    ? {
        'data-kontent-item-id': itemId,
        'data-kontent-element-codename': elementCodename,
      }
    : {};

  if (!html || html.trim().length === 0) {
    return null;
  }

  return (
    <Tag
      className={className}
      style={style}
      {...dataAttributes}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
