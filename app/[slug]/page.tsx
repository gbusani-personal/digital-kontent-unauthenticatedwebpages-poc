import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { getLandingPageBySlug } from '../../lib/kontent';
import { landingPageStyles, getBrandStyles, ds } from '../../lib/design-system';
import KontentEditable from '../../components/KontentEditable';
import ContentBlockRenderer from '../../components/ContentBlockRenderer';
import ExpandablePrivacyNotice from '../../components/ExpandablePrivacyNotice';
import LandingPageHeader from '../../components/LandingPageHeader';
import BannerImage from '../../components/BannerImage';

interface LandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const isMakingAClaimLandingPage = (slug: string, title?: string): boolean =>
  /making[-_ ]?a[-_ ]?claim/i.test(slug) || /making[-_ ]?a[-_ ]?claim/i.test(title ?? '');

const normalizeWebsiteUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^https?\/\//i.test(trimmed)) {
    return trimmed.replace(/^https?(?=\/\/)/i, (match) => `${match}:`);
  }

  if (/^https?:\/(?!\/)/i.test(trimmed)) {
    return trimmed.replace(/^https?:\/(?!\/)/i, (match) =>
      match.toLowerCase().startsWith('https') ? 'https://' : 'http://'
    );
  }

  if (/^https?:(?!\/\/)/i.test(trimmed)) {
    return trimmed.replace(/^https?:(?!\/\/)/i, (match) => `${match}//`);
  }

  return `https://${trimmed}`;
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  const mrecTiles = page?.mrecTiles ?? [];
  const faqs = page?.faqs ?? [];
  const hasSidebarContent = mrecTiles.length > 0 || faqs.length > 0;
  const pageItemId = page?.itemId;
  const brandStyles = getBrandStyles(page?.brandKey);
  const isMakingAClaimPage = isMakingAClaimLandingPage(slug, page?.title);
  const trackClaimUrl = page?.portalLoginUrl ? normalizeWebsiteUrl(page.portalLoginUrl) : '';
  const showTrackClaimCta = isMakingAClaimPage && trackClaimUrl.length > 0;
  const bodyContentStyle = showTrackClaimCta
    ? { ...landingPageStyles.bodyText, ...brandStyles.bodyText }
    : { ...landingPageStyles.bodyText, ...brandStyles.bodyText, marginBottom: 0 };
  const pageStyle: CSSProperties & Record<'--content-heading-color', string> = {
    ...landingPageStyles.page,
    ...brandStyles.page,
    '--content-heading-color': String(brandStyles.contentHeading?.color ?? landingPageStyles.contentHeading.color),
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  if (!page) {
    return notFound();
  }

  return (
    <div style={pageStyle}>
      <LandingPageHeader
        title={page.title}
        logoUrl={page.logoUrl}
        logoItemId={page.logoItemId}
        brandPartnerDetailsItemId={page.brandPartnerDetailsItemId}
        brandKey={page.brandKey}
        phoneNumber={page.contactPhone}
        portalLoginUrl={page.portalLoginUrl}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8" style={{ ...landingPageStyles.layout, flex: 1 }}>
        <div className={`grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 ${hasSidebarContent ? 'lg:grid-cols-4' : ''}`}>
          {/* Main Content */}
          <div className={hasSidebarContent ? 'lg:col-span-3' : ''}>
            <div
              className="flex flex-col p-4 sm:p-6 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-3xl space-y-4 sm:space-y-6"
              style={{ ...landingPageStyles.card, ...brandStyles.card }}
              data-kontent-item-id={pageItemId}
            >
              {page.bannerUrl && (
                <div className="text-center mb-4 sm:mb-6">
                  <BannerImage
                    src={page.bannerUrl}
                    alt={`${page.title} banner`}
                    itemId={pageItemId}
                    elementCodename="banner"
                  />
                </div>
              )}
              <div className="text-center">
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="title"
                  tag="h1"
                  style={{ ...landingPageStyles.contentHeading, ...brandStyles.contentHeading }}
                >
                  {page.title}
                </KontentEditable>
              </div>

              {page.privacyCollectionNotice && (
                <ExpandablePrivacyNotice
                  itemId={pageItemId}
                  html={page.privacyCollectionNotice}
                  brandKey={page.brandKey}
                />
              )}

              {page.contentSection && (
                <ContentBlockRenderer
                  html={page.contentSection}
                  itemId={pageItemId}
                  elementCodename="content_section"
                  tag="div"
                  className="rich-text-content"
                  style={bodyContentStyle}
                />
              )}

              {page.formsSection && (
                <ContentBlockRenderer
                  html={page.formsSection}
                  itemId={pageItemId}
                  elementCodename="forms_section"
                  tag="div"
                  className="rich-text-content"
                  style={bodyContentStyle}
                />
              )}

              {showTrackClaimCta && (
                <div className="text-center mt-2 sm:mt-4">
                  <a
                    href={trackClaimUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: brandStyles.contentHeading?.color ?? '#0f172a',
                      color: '#ffffff',
                    }}
                    data-kontent-item-id={page.brandPartnerDetailsItemId}
                    data-kontent-element-codename="brand_partner_csp_url"
                  >
                    Track Your Claim
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* MREC Tiles and FAQ Sidebar */}
          {hasSidebarContent && (
            <div className="lg:col-span-1" style={{ display: 'grid', gridAutoRows: 'max-content', gap: ds.spacing.lg }}>
              {mrecTiles.length > 0 && (
                <div style={{ display: 'grid', gridAutoRows: 'max-content', gap: ds.spacing.md }}>
                  {mrecTiles.map((tile, index) => (
                    <div
                      key={index}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                      style={{ ...landingPageStyles.tileCard, ...brandStyles.tileCard }}
                      {...(tile.itemId ? { 'data-kontent-item-id': tile.itemId, 'data-kontent-element-codename': 'image' } : {})}
                    >
                      {tile.imageUrl && (
                        <img
                          src={tile.imageUrl}
                          alt={tile.title}
                          className="w-full h-full object-contain object-center"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {faqs.length > 0 && (
                <div style={{ ...landingPageStyles.faqCard, ...brandStyles.faqCard }}>
                  <h2 style={{ ...landingPageStyles.sectionTitle, ...brandStyles.sectionTitle }} className="mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group transition-colors"
                        style={{ ...landingPageStyles.faqItem, ...brandStyles.faqItem }}
                      >
                        <summary
                          className="flex cursor-pointer items-center justify-between"
                          style={{
                            ...landingPageStyles.faqQuestion,
                            ...brandStyles.faqQuestion,
                            transition: 'color 180ms ease-in-out',
                          }}
                        >
                          <KontentEditable
                            itemId={faq.itemId}
                            elementCodename="question"
                            tag="span"
                            style={landingPageStyles.faqQuestion}
                          >
                            {faq.question}
                          </KontentEditable>
                          <span className="ml-4 inline-block transform transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>
                        <div
                          className="mt-3 rich-text-content"
                          style={{ ...landingPageStyles.faqAnswer, ...brandStyles.bodyText }}
                        >
                          <KontentEditable
                            itemId={faq.itemId}
                            elementCodename="answer"
                            tag="div"
                            className="rich-text-content"
                            style={{ ...landingPageStyles.faqAnswer, ...brandStyles.bodyText }}
                            html={faq.answer}
                          />
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {page.brandDisclaimer && (
        <footer className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8" aria-label="Brand disclaimer">
          <div className="max-w-7xl mx-auto">
            <KontentEditable
              itemId={page.brandPartnerItemId}
              elementCodename="brand_disclaimer"
              tag="div"
              className="rich-text-content"
              style={{
                ...landingPageStyles.brandDisclaimer,
                ...brandStyles.brandDisclaimer,
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                paddingTop: ds.spacing.lg,
              }}
              html={page.brandDisclaimer}
            />
          </div>
        </footer>
      )}
    </div>
  );
}
