import type { ReactNode } from 'react';

/**
 * KontentEditable
 *
 * Generic component for rendering Kontent.ai-managed content with edit mode integration.
 *
 * For rendering nested content_block items, use ContentBlockRenderer instead for:
 * - Better semantic clarity (indicates content from linked content_blocks)
 * - Optimized for rich text HTML rendering
 * - Specialized field extraction for content_block types
 *
 * @see ContentBlockRenderer - For rendering linked content_block items
 */
interface KontentEditableProps {
  itemId?: string;
  elementCodename: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  html?: string;
  children?: ReactNode;
}

export default function KontentEditable({
  itemId,
  elementCodename,
  tag = 'div',
  className,
  style,
  html,
  children,
}: KontentEditableProps) {
  const Tag = tag as any;
  const dataAttributes = itemId
    ? {
        'data-kontent-item-id': itemId,
        'data-kontent-element-codename': elementCodename,
      }
    : {};

  if (html) {
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
      {children}
    </Tag>
  );
}
