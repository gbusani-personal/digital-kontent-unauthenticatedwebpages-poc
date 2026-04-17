import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '../../lib/kontent';
import { landingPageStyles, getBrandStyles, ds } from '../../lib/design-system';
import KontentEditable from '../../components/KontentEditable';
import ExpandablePrivacyNotice from '../../components/ExpandablePrivacyNotice';
import LandingPageLogo from '../../components/LandingPageLogo';
import BannerImage from '../../components/BannerImage';

interface LandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  const mrecTiles = page?.mrecTiles ?? [];
  const faqs = page?.faqs ?? [];
  const pageItemId = page?.itemId;
  const brandStyles = getBrandStyles(page?.brandKey);

  if (!page) {
    return notFound();
  }

  return (
    <div style={{ ...landingPageStyles.page, ...brandStyles.page, minHeight: '100vh' }}>
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8" style={landingPageStyles.layout}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className="flex flex-col p-4 sm:p-6 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-3xl space-y-4 sm:space-y-6"
              style={{ ...landingPageStyles.card, ...brandStyles.card }}
              data-kontent-item-id={pageItemId}
            >
              <LandingPageLogo
                logoUrl={page.logoUrl}
                title={page.title}
                logoItemId={page.logoItemId}
              />
              {page.bannerUrl && (
                <div className="text-center mb-4 sm:mb-6">
                  <BannerImage
                    src={page.bannerUrl}
                    alt={`${page.title} banner`}
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
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="content_section"
                  tag="div"
                  className="rich-text-content"
                  style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
                  html={page.contentSection}
                />
              )}

              {page.formsSection && (
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="forms_section"
                  tag="div"
                  className="rich-text-content"
                  style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
                  html={page.formsSection}
                />
              )}

              {page.brandDisclaimer && (
                <KontentEditable
                  itemId={page.brandPartnerItemId}
                  elementCodename="brand_disclaimer"
                  tag="div"
                  className="rich-text-content"
                  style={{
                    ...landingPageStyles.brandDisclaimer,
                    ...brandStyles.brandDisclaimer,
                  }}
                  html={page.brandDisclaimer}
                />
              )}
            </div>
          </div>

          {/* MREC Tiles and FAQ Sidebar */}
          {(mrecTiles.length > 0 || faqs.length > 0) && (
            <div className="lg:col-span-1" style={{ display: 'grid', gridAutoRows: 'max-content', gap: ds.spacing.lg }}>
              <div style={{ display: 'grid', gridAutoRows: 'max-content', gap: ds.spacing.md }}>
                {mrecTiles.map((tile, index) => (
                  <div
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ ...landingPageStyles.tileCard, ...brandStyles.tileCard }}
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
                          {faq.question}
                          <span className="ml-4 inline-block transform transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>
                        <div
                          className="mt-3 rich-text-content"
                          style={{ ...landingPageStyles.faqAnswer, ...brandStyles.bodyText }}
                        >
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                <KontentEditable
                                                  itemId={faq.itemId}
                                                  elementCodename="answer"
                                                  tag="div"
                                                  className="mt-3 rich-text-content"
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
    </div>
  );
}
