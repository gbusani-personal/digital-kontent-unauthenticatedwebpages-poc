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

export interface MRECTile {
  title: string;
  imageUrl?: string;
  order?: number;
}

export interface FAQPage {
  title: string;
  urlSlug: string;
  logoUrl?: string;
  bannerUrl?: string;
  contentSection?: string;
}

export interface FAQContent {
  question: string;
  answer: string;
  order?: number;
  pageSlug?: string;
}

export interface LandingPageContent {
  title: string;
  urlSlug: string;
  logoUrl?: string;
  bannerUrl?: string;
  contentSection?: string;
  formsSection?: string;
  mrecTiles?: MRECTile[];
  faqs?: FAQContent[];
}

const getAssetUrl = (element: any): string | undefined => {
  if (!element?.value) {
    return undefined;
  }

  const value = element.value;
  if (Array.isArray(value) && value.length > 0) {
    const asset = value[0];
    if (typeof asset === 'string') {
      return asset;
    }
    if (asset?.url) {
      return asset.url;
    }
    return asset?.download_url || asset?.file?.url;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    return value.url || value.download_url || value.file?.url;
  }

  return undefined;
};

const getLinkedMRECTiles = (element: any): MRECTile[] => {
  if (!element) {
    return [];
  }

  const linkedItems = Array.isArray(element.linkedItems) ? element.linkedItems : [];
  if (linkedItems.length > 0) {
    return linkedItems
      .map((linked: any) => {
        const imageElement = linked.elements?.image;
        return {
          title:
            linked.elements?.title?.value ||
            linked.elements?.headline?.value ||
            linked.name ||
            'MREC Tile',
          imageUrl: getAssetUrl(imageElement),
          order: linked.elements?.order?.value || 0,
        } as MRECTile;
      })
      .filter((tile: MRECTile | null): tile is MRECTile => !!tile && !!tile.imageUrl);
  }

  const values = Array.isArray(element.value) ? element.value : [element.value];

  const resolveItem = (entry: any): any => {
    if (!entry) {
      return null;
    }

    if (entry.elements) {
      return entry;
    }

    if (entry.item) {
      return resolveItem(entry.item);
    }

    if (entry.value && Array.isArray(entry.value) && entry.value.length > 0) {
      return resolveItem(entry.value[0]);
    }

    return null;
  };

  return values
    .map((entry: any) => {
      const linked = resolveItem(entry);
      if (!linked) {
        return null;
      }

      const imageElement = linked.elements?.image;
      return {
        title:
          linked.elements?.title?.value ||
          linked.elements?.headline?.value ||
          linked.name ||
          'MREC Tile',
        imageUrl: getAssetUrl(imageElement),
        order: linked.elements?.order?.value || 0,
      } as MRECTile;
    })
    .filter((tile: MRECTile | null): tile is MRECTile => !!tile && !!tile.imageUrl);
};

const getLinkedFAQs = (element: any): FAQContent[] => {
  if (!element) {
    return [];
  }

  const linkedItems = Array.isArray(element.linkedItems) ? element.linkedItems : [];
  if (linkedItems.length > 0) {
    return linkedItems
      .map((linked: any) => ({
        question: linked.elements?.question?.value || '',
        answer: linked.elements?.answer?.value || '',
        order: linked.elements?.order?.value || 0,
        pageSlug:
          linked.elements?.page_slug?.value?.toString() || linked.elements?.url_slug?.value?.toString() || linked.system?.codename || '',
      }))
      .filter((faq: FAQContent) => faq.question && faq.answer);
  }

  const values = Array.isArray(element.value) ? element.value : [element.value];

  const resolveItem = (entry: any): any => {
    if (!entry) {
      return null;
    }

    if (entry.elements) {
      return entry;
    }

    if (entry.item) {
      return resolveItem(entry.item);
    }

    if (entry.value && Array.isArray(entry.value) && entry.value.length > 0) {
      return resolveItem(entry.value[0]);
    }

    return null;
  };

  return values
    .map((entry: any) => {
      const linked = resolveItem(entry);
      if (!linked) {
        return null;
      }

      return {
        question: linked.elements?.question?.value || '',
        answer: linked.elements?.answer?.value || '',
        order: linked.elements?.order?.value || 0,
        pageSlug:
          linked.elements?.page_slug?.value?.toString() || linked.elements?.url_slug?.value?.toString() || linked.system?.codename || '',
      } as FAQContent;
    })
    .filter((faq: FAQContent | null): faq is FAQContent => !!faq && !!faq.question && !!faq.answer);
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

// Function to fetch a brand partner logo from Kontent.ai
async function getBrandPartnerLogo(contentType = 'brand_partner_root', fieldName = 'brand_partner_logo'): Promise<string | undefined> {
  try {
    const client = getKontentClient();

    const response = await client
      .items()
      .type(contentType)
      .limitParameter(1)
      .toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      return getAssetUrl(item.elements[fieldName]);
    }

    return undefined;
  } catch (error) {
    console.error(`Error fetching brand partner logo from Kontent.ai content type ${contentType}:`, error);
    return undefined;
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
      .depthParameter(3)
      .toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      const formsValue = item.elements.forms_section?.value || '';
      const brandLogo = await getBrandPartnerLogo('bupa_pet_insurance', 'brand_partner_logo');
      return {
        title: item.elements.title?.value || 'Landing Page',
        urlSlug: item.elements.url_slug?.value || normalizedSlug,
        logoUrl: brandLogo,
        bannerUrl: getAssetUrl(item.elements.banner),
        contentSection: item.elements.content_section?.value || '',
        formsSection: formsValue,
        mrecTiles: getLinkedMRECTiles(item.elements.mrec_tiles),
        faqs: getLinkedFAQs(item.elements.faq_s),
      };
    }

    // Fallback: load all landing pages and search by slug manually.
    const fallbackResponse = await client
      .items()
      .type('landing_page')
      .limitParameter(100)
      .depthParameter(3)
      .toPromise();

    const found = fallbackResponse.data.items.find((item: any) => {
      const pageSlug = item.elements.url_slug?.value?.toString().replace(/^\/+/, '') || '';
      return pageSlug === normalizedSlug || pageSlug === `/${normalizedSlug}` || item.system?.codename === normalizedSlug;
    });

    if (!found) {
      return null;
    }

    const brandLogo = await getBrandPartnerLogo('bupa_pet_insurance', 'brand_partner_logo');
    return {
      title: found.elements.title?.value || 'Landing Page',
      urlSlug: found.elements.url_slug?.value || normalizedSlug,
      logoUrl: brandLogo,
      bannerUrl: getAssetUrl(found.elements.banner),
      contentSection: found.elements.content_section?.value || '',
      formsSection: found.elements.forms_section?.value || found.elements.form_section?.value || '',
      mrecTiles: getLinkedMRECTiles(found.elements.mrec_tiles),
      faqs: getLinkedFAQs(found.elements.faq_s),
    };
  } catch (error) {
    console.error(`Error fetching landing page content for slug ${slug}:`, error);
    return null;
  }
}

// Function to fetch MREC tiles from Kontent.ai
export async function getMRECTiles(): Promise<MRECTile[]> {
  try {
    const client = getKontentClient();

    const response = await client
      .items()
      .type('mrec_tiles')
      .toPromise();

    // Sort by order field if available
    const tiles = response.data.items.map((item: any) => ({
      title: item.elements.title?.value || 'MREC Tile',
      imageUrl: getAssetUrl(item.elements.image),
      order: item.elements.order?.value || 0,
    }));

    return tiles.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error fetching MREC tiles from Kontent.ai:', error);
    return [];
  }
}

// Function to fetch FAQ page by slug
export async function getFAQPageBySlug(slug: string): Promise<FAQPage | null> {
  const normalizedSlug = slug.replace(/^\/+/, '');
  const client = getKontentClient();

  try {
    const response = await client
      .items()
      .type('faq_page')
      .equalsFilter('elements.url_slug', normalizedSlug)
      .toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      const brandLogo = await getBrandPartnerLogo();
      return {
        title: item.elements.title?.value || 'FAQ Page',
        urlSlug: item.elements.url_slug?.value || normalizedSlug,
        logoUrl: brandLogo,
        bannerUrl: getAssetUrl(item.elements.banner),
        contentSection: item.elements.content_section?.value || '',
      };
    }

    // Fallback: load all FAQ pages and search by slug manually
    const fallbackResponse = await client
      .items()
      .type('faq_page')
      .limitParameter(100)
      .toPromise();

    const found = fallbackResponse.data.items.find((item: any) => {
      const pageSlug = item.elements.url_slug?.value?.toString().replace(/^\/+/, '') || '';
      return pageSlug === normalizedSlug || pageSlug === `/${normalizedSlug}` || item.system?.codename === normalizedSlug;
    });

    if (!found) {
      return null;
    }

    const brandLogo = await getBrandPartnerLogo();
    return {
      title: found.elements.title?.value || 'FAQ Page',
      urlSlug: found.elements.url_slug?.value || normalizedSlug,
      logoUrl: brandLogo,
      bannerUrl: getAssetUrl(found.elements.banner),
      contentSection: found.elements.content_section?.value || '',
    };
  } catch (error) {
    console.error(`Error fetching FAQ page content for slug ${slug}:`, error);
    return null;
  }
}

// Function to fetch FAQs from faq content type by page slug
export async function getFAQsBySlug(slug: string): Promise<FAQContent[]> {
  const normalizedSlug = slug.replace(/^\/+/, '').toLowerCase();
  const client = getKontentClient();

  try {
    const response = await client
      .items()
      .type('faq')
      .toPromise();

    const faqs = response.data.items.map((item: any) => {
      const rawPageSlug = item.elements.page_slug?.value?.toString() || item.elements.url_slug?.value?.toString() || '';
      const itemSlug = (rawPageSlug || item.system?.codename || '')
        .replace(/^\/+/, '')
        .toLowerCase();

      return {
        question: item.elements.question?.value || '',
        answer: item.elements.answer?.value || '',
        order: item.elements.order?.value || 0,
        pageSlug: itemSlug,
      };
    });

    const sortedFaqs = faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    const matchingFaqs = sortedFaqs.filter((faq) => faq.pageSlug === normalizedSlug);

    return matchingFaqs;
  } catch (error) {
    console.error('Error fetching FAQs from faq content type:', error);
    return [];
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