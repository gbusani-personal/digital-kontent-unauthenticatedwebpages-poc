'use client';

import { useId, useMemo, useState } from 'react';
import { ds, getBrandStyles, landingPageStyles } from '../lib/design-system';
import KontentEditable from './KontentEditable';

interface ExpandablePrivacyNoticeProps {
  itemId?: string;
  html: string;
  brandKey?: string;
  elementCodename?: string;
  learnMoreLabel?: string;
  collapseLabel?: string;
}

function splitAfterFirstParagraph(html: string) {
  const closingParagraphIndex = html.search(/<\/p\s*>/i);

  if (closingParagraphIndex === -1) {
    return {
      firstParagraphHtml: html,
      remainingHtml: '',
    };
  }

  const endOfFirstParagraph = closingParagraphIndex + html.match(/<\/p\s*>/i)![0].length;

  return {
    firstParagraphHtml: html.slice(0, endOfFirstParagraph),
    remainingHtml: html.slice(endOfFirstParagraph).trim(),
  };
}

export default function ExpandablePrivacyNotice({
  itemId,
  html,
  brandKey,
  elementCodename = 'privacy_collection_notice',
  learnMoreLabel = 'Learn more',
  collapseLabel = 'Show less',
}: ExpandablePrivacyNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const brandStyles = getBrandStyles(brandKey);

  const { firstParagraphHtml, remainingHtml } = useMemo(() => splitAfterFirstParagraph(html), [html]);
  const hasExpandableContent = remainingHtml.length > 0;

  const textStyle = {
    ...landingPageStyles.bodyText,
    ...brandStyles.bodyText,
  };

  return (
    <div style={textStyle}>
      <div className="privacy-disclosure-inline rich-text-content" style={{ marginBottom: 0 }}>
        <KontentEditable
          itemId={itemId}
          elementCodename={elementCodename}
          tag="div"
          html={firstParagraphHtml}
        />

        {hasExpandableContent && (
          <button
            type="button"
            className="learn-more-trigger inline-flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              ...landingPageStyles.faqQuestion,
              ...brandStyles.faqQuestion,
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <span>{isExpanded ? collapseLabel : learnMoreLabel}</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▼
            </span>
          </button>
        )}
      </div>

      {hasExpandableContent && (
        <div id={contentId} hidden={!isExpanded} style={{ marginTop: ds.spacing.md }}>
          <KontentEditable
            itemId={itemId}
            elementCodename={elementCodename}
            tag="div"
            className="rich-text-content"
            style={{ ...textStyle, marginBottom: 0 }}
            html={remainingHtml}
          />
        </div>
      )}
    </div>
  );
}
