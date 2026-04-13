import { getKontentClient } from '../config/kontent';

// Types for Kontent.ai content
export interface HomePageContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  features: Feature[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  order?: number;
}

export interface LandingPageContent {
  title: string;
  urlSlug: string;
  logoUrl?: string;
  bannerUrl?: string;
  contentSection?: string;
}

const getAssetUrl = (element: any): string | undefined => {
  if (!element?.value) {
    return undefined;
  }

  const value = element.value;
  if (Array.isArray(value) && value.length > 0) {
    const asset = value[0];
    return typeof asset === 'string' ? asset : asset?.url;
  }

  if (typeof value === 'string') {
    return value;
  }

  return undefined;
};

// Function to fetch home page content from Kontent.ai
export async function getHomePageContent(): Promise<HomePageContent | null> {
  try {
    const client = getKontentClient();

    // This is a placeholder - you'll need to replace with your actual content type codename
    const response = await client
      .items()
      .type('home_page') // Replace with your content type codename
      .toPromise();

    if (response.data.items.length === 0) {
      return null;
    }

    const item = response.data.items[0];

    // Map Kontent.ai fields to our interface
    // Adjust these field names based on your Kontent.ai content model
    return {
      title: item.elements.title?.value || 'SecureLife Insurance',
      subtitle: item.elements.subtitle?.value || 'Protecting Your Future',
      description: item.elements.description?.value || 'Comprehensive insurance solutions...',
      ctaText: item.elements.cta_text?.value || 'Get a Quote',
      features: item.elements.features?.value || [],
    };
  } catch (error) {
    console.error('Error fetching home page content from Kontent.ai:', error);
    return null;
  }
}

// Function to fetch FAQ content from Kontent.ai
export async function getFAQContent(): Promise<FAQItem[]> {
  try {
    const client = getKontentClient();

    const response = await client
      .items()
      .type('faq')
      .toPromise();

    // Map Kontent.ai FAQ items to our interface
    return response.data.items.map((item: any) => ({
      question: item.elements.question?.value || '',
      answer: item.elements.answer?.value || '',
      order: item.elements.order?.value || 0,
    }));
  } catch (error) {
    console.error('Error fetching FAQ content from Kontent.ai:', error);
    return [];
  }
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageContent | null> {
  const normalizedSlug = slug.replace(/^\/+/, '');
  const client = getKontentClient();

  try {
    const response = await client
      .items()
      .type('landing_page')
      .equalsFilter('elements.url_slug', normalizedSlug)
      .toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        title: item.elements.title?.value || 'Landing Page',
        urlSlug: item.elements.url_slug?.value || normalizedSlug,
        logoUrl: getAssetUrl(item.elements.brand_logo),
        bannerUrl: getAssetUrl(item.elements.banner),
        contentSection: item.elements.content_section?.value || '',
      };
    }

    // Fallback: load all landing pages and search by slug manually.
    const fallbackResponse = await client
      .items()
      .type('landing_page')
      .limitParameter(100)
      .toPromise();

    const found = fallbackResponse.data.items.find((item: any) => {
      const pageSlug = item.elements.url_slug?.value?.toString().replace(/^\/+/, '') || '';
      return pageSlug === normalizedSlug || pageSlug === `/${normalizedSlug}` || item.system?.codename === normalizedSlug;
    });

    if (!found) {
      return null;
    }

    return {
      title: found.elements.title?.value || 'Landing Page',
      urlSlug: found.elements.url_slug?.value || normalizedSlug,
      logoUrl: getAssetUrl(found.elements.brand_logo),
      bannerUrl: getAssetUrl(found.elements.banner),
      contentSection: found.elements.content_section?.value || '',
    };
  } catch (error) {
    console.error(`Error fetching landing page content for slug ${slug}:`, error);
    return null;
  }
}

// Generic function to fetch any content type
export async function getContentByType(contentType: string, limit = 10) {
  try {
    const client = getKontentClient();

    const response = await client
      .items()
      .type(contentType)
      .limitParameter(limit)
      .toPromise();

    return response.data.items;
  } catch (error) {
    console.error(`Error fetching ${contentType} content:`, error);
    return [];
  }
}