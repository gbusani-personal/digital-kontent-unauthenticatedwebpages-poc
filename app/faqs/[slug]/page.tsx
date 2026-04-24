import { notFound } from 'next/navigation';
import { getFAQPageBySlug, getMRECTiles, getFAQsBySlug } from '../../../lib/kontent';
import KontentEditable from '../../../components/KontentEditable';
import ContentBlockRenderer from '../../../components/ContentBlockRenderer';
import LandingPageLogo from '../../../components/LandingPageLogo';
import { landingPageStyles, getBrandStyles, ds } from '../../../lib/design-system';
import BannerImage from '../../../components/BannerImage';

interface FAQPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { slug } = await params;
  const page = await getFAQPageBySlug(slug);
  const mrecTiles = await getMRECTiles();
  const faqs = await getFAQsBySlug(slug);
  const pageItemId = page?.itemId;
  const brandStyles = getBrandStyles(page?.brandKey);

  if (!page) {
    return notFound();
  }

  return (
    <div
      style={{
        ...landingPageStyles.page,
        ...brandStyles.page,
        '--content-heading-color': brandStyles.contentHeading?.color ?? landingPageStyles.contentHeading.color,
        minHeight: '100vh',
      }}
      className="py-16"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={landingPageStyles.layout}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl p-10"
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
                    itemId={pageItemId}
                    elementCodename="banner"
                  />
                </div>
              )}
              <div className="mb-8 text-center">
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="title"
                  tag="h1"
                  style={{ ...landingPageStyles.contentHeading, ...brandStyles.contentHeading }}
                >
                  {page.title}
                </KontentEditable>
              </div>

              {page.contentSection && (
                <ContentBlockRenderer
                  html={page.contentSection}
                  itemId={pageItemId}
                  elementCodename="content_section"
                  tag="div"
                  className="mb-8 rich-text-content"
                  style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
                />
              )}

              {/* FAQs Section */}
              {faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6" style={{ ...landingPageStyles.sectionTitle, ...brandStyles.sectionTitle }}>
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="rounded-lg p-4 group transition-colors"
                        style={{ ...landingPageStyles.faqItem, ...brandStyles.faqItem }}
                      >
                        <summary
                          className="flex cursor-pointer items-center justify-between transition-colors"
                          style={{ ...landingPageStyles.faqQuestion, ...brandStyles.faqQuestion }}
                        >
                      <KontentEditable
                        itemId={faq.itemId}
                        elementCodename="question"
                        tag="span"
                        style={{ ...landingPageStyles.faqQuestion, ...brandStyles.faqQuestion }}
                      >
                        {faq.question}
                      </KontentEditable>
                      <span className="ml-4 inline-block transform transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <KontentEditable
                      itemId={faq.itemId}
                      elementCodename="answer"
                      tag="div"
                      className="mt-4 rich-text-content"
                      style={{ ...landingPageStyles.faqAnswer, ...brandStyles.bodyText }}
                      html={faq.answer}
                    />
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MREC Tiles Sidebar */}
          {mrecTiles.length > 0 && (
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {mrecTiles.map((tile, index) => (
                  <div
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow aspect-square"
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
