import { notFound } from 'next/navigation';
import { getFAQPageBySlug, getMRECTiles, getFAQsBySlug } from '../../../lib/kontent';
import KontentEditable from '../../../components/KontentEditable';
import LandingPageLogo from '../../../components/LandingPageLogo';
import { landingPageStyles } from '../../../lib/design-system';
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

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-10" data-kontent-item-id={pageItemId}>
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
              <div className="mb-8 text-center">
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="title"
                  tag="h1"
                  className="text-4xl sm:text-5xl font-bold text-slate-900"
                >
                  {page.title}
                </KontentEditable>
              </div>

              {page.contentSection && (
                <KontentEditable
                  itemId={pageItemId}
                  elementCodename="content_section"
                  tag="div"
                  className="mb-8 rich-text-content"
                  html={page.contentSection}
                />
              )}

              {/* FAQs Section */}
              {faqs.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 group hover:border-blue-300 transition-colors"
                      >
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                      <KontentEditable
                        itemId={faq.itemId}
                        elementCodename="question"
                        tag="span"
                        className="text-slate-900"
                      >
                        {faq.question}
                      </KontentEditable>
                      <span className="ml-4 inline-block transform transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 rich-text-content text-slate-700 leading-relaxed">
                      <KontentEditable
                        itemId={faq.itemId}
                        elementCodename="answer"
                        tag="div"
                        html={faq.answer}
                                          <KontentEditable
                                            itemId={faq.itemId}
                                            elementCodename="answer"
                                            tag="div"
                                            className="mt-4 rich-text-content"
                                            html={faq.answer}
                                          />
                      />
                    </div>
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
                  <div key={index} className="rounded-lg bg-white shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow aspect-square">
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
