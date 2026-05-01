import { permanentRedirect } from 'next/navigation';

interface LandingPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Permanent redirect (308) from the legacy flat URL structure to the new nested structure.
 * /landing/bupa-useful-documents → /landing/bupa/useful-documents
 *
 * Splits on the first hyphen to derive :category and :page, mirroring how
 * [category]/[page]/page.tsx reconstructs the Kontent.ai URL Slug.
 */
export default async function LandingPageLegacyRedirect({ params }: LandingPageProps) {
  const { category: slug } = await params;
  const hyphenIndex = slug.indexOf('-');

  if (hyphenIndex === -1) {
    permanentRedirect('/landing');
  }

  const category = slug.slice(0, hyphenIndex);
  const page = slug.slice(hyphenIndex + 1);

  permanentRedirect(`/landing/${category}/${page}`);
}
