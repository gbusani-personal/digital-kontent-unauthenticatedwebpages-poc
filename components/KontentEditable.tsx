import type { ReactNode } from 'react';

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
