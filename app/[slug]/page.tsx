import { notFound } from 'next/navigation';
import { getLandingPageBySlug } from '../../lib/kontent';

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
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 mb-3">Landing Page</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">{page.title}</h1>
            <p className="mt-4 text-lg text-slate-600">This landing page is powered from Kontent.ai and resolved by your URL slug.</p>
          </div>

          <div className="space-y-6 text-slate-700">
            <p className="text-base leading-8">Use this page to show special offers, customer stories, or campaign content from your landing page content type.</p>
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Page slug</p>
              <p className="mt-2 text-lg text-slate-900">{page.urlSlug}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
