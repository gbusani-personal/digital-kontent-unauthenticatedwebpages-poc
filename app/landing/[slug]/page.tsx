import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '../../../lib/kontent';
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

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-10">
              <LandingPageLogo logoUrl={page.logoUrl} title={page.title} />
              {page.bannerUrl && (
                <div className="mb-8 text-center">
                  <img
                    src={page.bannerUrl}
                    alt={`${page.title} banner`}
                    className="w-full max-w-4xl mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              <div className="mb-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{page.title}</h1>
              </div>

              {page.contentSection && (
                <div className="mb-8 rich-text-content">
                  <div dangerouslySetInnerHTML={{ __html: page.contentSection }} />
                </div>
              )}
            </div>
          </div>

          {/* MREC Tiles and FAQ Sidebar */}
          {(mrecTiles.length > 0 || faqs.length > 0) && (
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                {mrecTiles.map((tile, index) => (
                  <div key={index} className="rounded-lg bg-white shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {tile.imageUrl && (
                      <img
                        src={tile.imageUrl}
                        alt={tile.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              {faqs.length > 0 && (
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 group hover:border-blue-300 transition-colors"
                      >
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {faq.question}
                          <span className="ml-4 inline-block transform transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>
                        <div className="mt-3 rich-text-content text-slate-700 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
