import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '../../lib/kontent';
import LandingPageLogo from '../../components/LandingPageLogo';

interface LandingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-16">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
}
