import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '../../../lib/kontent';
import { landingPageStyles, getBrandStyles } from '../../../lib/design-system';
import KontentEditable from '../../../components/KontentEditable';
import LandingPageLogo from '../../../components/LandingPageLogo';

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
    <div style={{ ...landingPageStyles.page, ...brandStyles.page }}>
      <main className="max-w-7xl mx-auto" style={landingPageStyles.layout}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className="flex flex-col"
              style={{ ...landingPageStyles.card, ...brandStyles.card }}
              data-kontent-item-id={pageItemId}
            >
              <LandingPageLogo
                logoUrl={page.logoUrl}
                title={page.title}
                logoItemId={page.logoItemId}
              />

              {page.bannerUrl && (
                <div className="text-center">
                  <img
                    src={page.bannerUrl}
                    alt={`${page.title} banner`}
                    className="w-full max-w-4xl mx-auto shadow-sm object-cover"
                    style={{
                      maxHeight: landingPageStyles.bannerImage.maxHeight,
                      borderRadius: landingPageStyles.bannerImage.borderRadius,
                    }}
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

              {page.contentSection && (
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="content_section"
                  tag="div"
                  className="rich-text-content"
                  html={page.contentSection}
                  style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
                />
              )}

              {page.formsSection && (
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="forms_section"
                  tag="div"
                  className="rich-text-content"
                  html={page.formsSection}
                  style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
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
                    paddingTop: landingPageStyles.card.padding,
                    borderTopWidth: '1px',
                    borderTopStyle: 'solid',
                  }}
                  html={page.brandDisclaimer}
                />
              )}
            </div>
          </div>

          {/* MREC Tiles and FAQ Sidebar */}
          {(mrecTiles.length > 0 || faqs.length > 0) && (
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
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
                <div style={landingPageStyles.faqCard}>
                  <h2 style={{ ...landingPageStyles.sectionTitle, ...brandStyles.sectionTitle }} className="mb-4">
                    Frequently Asked Questions
                  </h2>
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
                            ...landingPageStyles.faqQuestion,                            ...brandStyles.faqQuestion,                            transition: 'color 180ms ease-in-out',
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
