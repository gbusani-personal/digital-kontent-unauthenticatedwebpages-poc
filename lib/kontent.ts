import { getKontentClient } from '../config/kontent';

// Types for Kontent.ai content
export interface HomePageContent {
  itemId?: string;
  itemCodename?: string;
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
  itemId?: string;
  itemCodename?: string;
  question: string;
  answer: string;
  order?: number;
}

export interface MRECTile {
  itemId?: string;
  title: string;
  imageUrl?: string;
  order?: number;
}

export interface FAQPage {
  itemId?: string;
  itemCodename?: string;
  title: string;
  urlSlug: string;
  logoUrl?: string;
  logoItemId?: string;
  bannerUrl?: string;
  contentSection?: string;
  contactPhone?: string;
  portalLoginUrl?: string;
  brandKey?: string;
}

export interface FAQContent {
  itemId?: string;
  itemCodename?: string;
  question: string;
  answer: string;
  order?: number;
  pageSlug?: string;
}

export interface LandingPageContent {
  itemId?: string;
  itemCodename?: string;
  title: string;
  urlSlug: string;
  logoUrl?: string;
  logoItemId?: string;
  brandPartnerItemId?: string;
  brandPartnerDetailsItemId?: string;
  brandDisclaimer?: string;
  brandKey?: string;
  bannerUrl?: string;
  contentSection?: string;
  formsSection?: string;
  privacyCollectionNotice?: string;
  mrecTiles?: MRECTile[];
  faqs?: FAQContent[];
  contactPhone?: string;
  portalLoginUrl?: string;
}

const PLACEHOLDER_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;
const EMAIL_VALUE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const URL_VALUE_PATTERN = /^(https?:\/\/|www\.)[^\s]+$/i;
const BARE_DOMAIN_PATTERN = /^[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?$/i;
const ANCHOR_TAG_PATTERN = /<a\b([^>]*)>/gi;
const ATTRIBUTE_TARGET_PATTERN = /target\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i;
const ATTRIBUTE_REL_PATTERN = /rel\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i;

type BrandPartnerDetails = Record<string, unknown>;

const normalizePlaceholderKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const ensureAnchorAttributes = (attributes: string): string => {
  let updated = attributes.trim();

  if (ATTRIBUTE_TARGET_PATTERN.test(updated)) {
    updated = updated.replace(ATTRIBUTE_TARGET_PATTERN, 'target="_blank"');
  } else {
    updated = `${updated} target="_blank"`.trim();
  }

  if (ATTRIBUTE_REL_PATTERN.test(updated)) {
    updated = updated.replace(ATTRIBUTE_REL_PATTERN, (_match, value: string) => {
      const unquoted = value.replace(/^['"]|['"]$/g, '');
      const tokens = new Set(unquoted.split(/\s+/).filter(Boolean).map((token) => token.toLowerCase()));
      tokens.add('noopener');
      tokens.add('noreferrer');
      return `rel="${Array.from(tokens).join(' ')}"`;
    });
  } else {
    updated = `${updated} rel="noopener noreferrer"`.trim();
  }

  return updated;
};

const forceHyperlinksToOpenInNewWindow = (content: string): string =>
  content.replace(ANCHOR_TAG_PATTERN, (_match, attributes: string) => {
    const updatedAttributes = ensureAnchorAttributes(attributes || '');
    return `<a ${updatedAttributes}>`;
  });

const normalizeUrlInput = (value: string): string => {
  let normalized = value.trim();

  // Fix malformed protocol variants such as "http//", "http:/", and "http:example.com".
  if (/^https?\/\//i.test(normalized)) {
    normalized = normalized.replace(/^https?(?=\/\/)/i, (match) => `${match}:`);
  } else if (/^https?:\/(?!\/)/i.test(normalized)) {
    normalized = normalized.replace(/^https?:\/(?!\/)/i, (match) =>
      match.toLowerCase().startsWith('https') ? 'https://' : 'http://'
    );
  } else if (/^https?:(?!\/\/)/i.test(normalized)) {
    normalized = normalized.replace(/^https?:(?!\/\/)/i, (match) => `${match}//`);
  }

  return normalized;
};

const stripProtocolPrefix = (value: string): string =>
  value
    .replace(/^https?:\/\//i, '')
    .replace(/^https?\/\//i, '');

const hasProtocolPrefixBeforePlaceholder = (content: string, offset: number): boolean => {
  const context = content.slice(Math.max(0, offset - 32), offset).toLowerCase();
  return context.endsWith('http://') || context.endsWith('https://');
};

const toHrefValue = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (EMAIL_VALUE_PATTERN.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  const normalized = normalizeUrlInput(trimmed);

  if (URL_VALUE_PATTERN.test(normalized) || BARE_DOMAIN_PATTERN.test(normalized)) {
    return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
  }

  return normalized;
};

const isInsideHtmlTagAtOffset = (html: string, offset: number): boolean => {
  const lastOpenBracket = html.lastIndexOf('<', offset);
  const lastCloseBracket = html.lastIndexOf('>', offset);
  return lastOpenBracket > lastCloseBracket;
};

const toHyperlinkValue = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (EMAIL_VALUE_PATTERN.test(trimmed)) {
    const safeText = escapeHtml(trimmed);
    const safeHref = escapeHtml(`mailto:${trimmed}`);
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  }

  if (URL_VALUE_PATTERN.test(trimmed) || BARE_DOMAIN_PATTERN.test(trimmed)) {
    const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const safeText = escapeHtml(trimmed);
    const safeHref = escapeHtml(href);
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  }

  return value;
};

interface PlaceholderReplacementOptions {
  linkify?: boolean;
}

const stringifyPlaceholderValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => stringifyPlaceholderValue(entry))
      .filter((entry) => entry.trim().length > 0);
    return parts.join(', ');
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if (typeof objectValue.url === 'string') {
      return objectValue.url;
    }

    if (typeof objectValue.value === 'string') {
      return objectValue.value;
    }

    if (typeof objectValue.codename === 'string') {
      return objectValue.codename;
    }
  }

  return '';
};

export const replaceContentPlaceholders = (
  content: string | null | undefined,
  brandPartnerDetails?: BrandPartnerDetails | null,
  options: PlaceholderReplacementOptions = {}
): string => {
  if (typeof content !== 'string' || content.length === 0) {
    return '';
  }

  if (!brandPartnerDetails || typeof brandPartnerDetails !== 'object') {
    return content;
  }

  const normalizedDetailsLookup = new Map<string, unknown>();
  for (const [key, value] of Object.entries(brandPartnerDetails)) {
    normalizedDetailsLookup.set(normalizePlaceholderKey(key), value);
  }

  const contentWithReplacements = content.replace(
    PLACEHOLDER_PATTERN,
    (placeholder: string, rawElementName: string, offset: number) => {
    const elementName = rawElementName?.trim();
    if (!elementName) {
      return placeholder;
    }

    if (Object.prototype.hasOwnProperty.call(brandPartnerDetails, elementName)) {
      const resolvedValue = stringifyPlaceholderValue(brandPartnerDetails[elementName]);
      if (!options.linkify) {
        return resolvedValue;
      }

      if (isInsideHtmlTagAtOffset(content, offset)) {
        const hrefValue = toHrefValue(resolvedValue);
        const safeHrefValue = hasProtocolPrefixBeforePlaceholder(content, offset)
          ? stripProtocolPrefix(hrefValue)
          : hrefValue;
        return escapeHtml(safeHrefValue);
      }

      return toHyperlinkValue(resolvedValue);
    }

    const normalizedElementName = normalizePlaceholderKey(elementName);
    if (!normalizedDetailsLookup.has(normalizedElementName)) {
      return placeholder;
    }

    const resolvedValue = stringifyPlaceholderValue(normalizedDetailsLookup.get(normalizedElementName));
    if (!options.linkify) {
      return resolvedValue;
    }

    if (isInsideHtmlTagAtOffset(content, offset)) {
      const hrefValue = toHrefValue(resolvedValue);
      const safeHrefValue = hasProtocolPrefixBeforePlaceholder(content, offset)
        ? stripProtocolPrefix(hrefValue)
        : hrefValue;
      return escapeHtml(safeHrefValue);
    }

    return toHyperlinkValue(resolvedValue);
    }
  );

  return options.linkify ? forceHyperlinksToOpenInNewWindow(contentWithReplacements) : contentWithReplacements;
};

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
          itemId: linked?.system?.id,
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
        itemId: linked?.system?.id,
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
        itemId: linked?.system?.id,
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
        itemId: linked?.system?.id,
        question: linked.elements?.question?.value || '',
        answer: linked.elements?.answer?.value || '',
        order: linked.elements?.order?.value || 0,
        pageSlug:
          linked.elements?.page_slug?.value?.toString() || linked.elements?.url_slug?.value?.toString() || linked.system?.codename || '',
      } as FAQContent;
    })
    .filter((faq: FAQContent | null): faq is FAQContent => !!faq && !!faq.question && !!faq.answer);
};

const isContentBlockLinkedItem = (linked: any): boolean => {
  const typeCodename =
    linked?.system?.type ||
    linked?.system?.type?.codename ||
    linked?.system?.typeCodename ||
    linked?.system?.contentType?.codename ||
    linked?.system?.content_type?.codename ||
    linked?.type;

  if (typeof typeCodename === 'string' && typeCodename.toLowerCase() === 'content_block') {
    return true;
  }

  if (typeof linked?.system?.codename === 'string' && /content[_-]?block/i.test(linked.system.codename)) {
    return true;
  }

  return Boolean(linked?.elements?.body || linked?.elements?.content || linked?.elements?.rich_text);
};

const hasMeaningfulRichText = (value: string): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const normalized = value
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();

  if (!normalized) {
    return false;
  }

  if (/<(img|iframe|video|audio|object|embed|svg|table|ul|ol|li|hr|blockquote)\b/i.test(normalized)) {
    return true;
  }

  const textOnly = normalized.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return textOnly.length > 0;
};

const normalizeRichTextHtml = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return hasMeaningfulRichText(value) ? value : '';
};

const getContentBlockRichText = (linked: any): string | undefined => {
  const elements = linked?.elements;
  if (!elements || typeof elements !== 'object') {
    return undefined;
  }

  const preferredKeys = ['body', 'content', 'rich_text_content', 'rich_text', 'main_content', 'text'];

  for (const key of preferredKeys) {
    const value = elements[key]?.value;
    const normalizedValue = normalizeRichTextHtml(value);
    if (normalizedValue) {
      return normalizedValue;
    }
  }

  // Prefer fields that look like HTML-rich text output from Kontent.
  for (const element of Object.values(elements) as Array<any>) {
    const value = element?.value;
    const normalizedValue = normalizeRichTextHtml(value);
    if (normalizedValue && /<[^>]+>/.test(normalizedValue)) {
      return normalizedValue;
    }
  }

  // Last fallback: first non-empty string field.
  for (const element of Object.values(elements) as Array<any>) {
    const value = element?.value;
    const normalizedValue = normalizeRichTextHtml(value);
    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return undefined;
};

interface ContentBlockEntry {
  id?: string;
  codename?: string;
  html: string;
}

const getContentBlockEntries = (element: any): ContentBlockEntry[] => {
  if (!element) {
    return [];
  }

  const toEntry = (linked: any): ContentBlockEntry | undefined => {
    if (!isContentBlockLinkedItem(linked)) {
      return undefined;
    }

    const html = getContentBlockRichText(linked);
    if (!html || html.trim().length === 0) {
      return undefined;
    }

    return {
      id: linked?.system?.id,
      codename: linked?.system?.codename,
      html,
    };
  };

  const fromLinkedItems = (Array.isArray(element.linkedItems) ? element.linkedItems : [])
    .map((linked: any) => toEntry(linked))
    .filter((entry: ContentBlockEntry | undefined): entry is ContentBlockEntry => Boolean(entry));

  if (fromLinkedItems.length > 0) {
    return fromLinkedItems;
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
    .map((entry: any) => toEntry(resolveItem(entry)))
    .filter((entry: ContentBlockEntry | undefined): entry is ContentBlockEntry => Boolean(entry));
};

const getContentBlockBodies = (element: any): string[] => {
  return getContentBlockEntries(element).map((entry) => entry.html);
};

const mergeRichTextWithContentBlocks = (rawHtml: string, entries: ContentBlockEntry[]): string => {
  if (entries.length === 0) {
    return rawHtml;
  }

  const injectedById = new Set<string>();
  const injectedByCodename = new Set<string>();

  const replacedHtml = rawHtml.replace(/<object\b[^>]*>\s*<\/object>/gi, (objectTag: string) => {
    const codenameMatch = objectTag.match(/data-codename="([^"]+)"/i);
    const idMatch = objectTag.match(/data-id="([^"]+)"/i);

    const matchedEntry = entries.find((entry) => {
      const codenameMatches = codenameMatch && entry.codename
        ? entry.codename.toLowerCase() === codenameMatch[1].toLowerCase()
        : false;

      const idMatches = idMatch && entry.id
        ? entry.id.toLowerCase() === idMatch[1].toLowerCase()
        : false;

      return codenameMatches || idMatches;
    });

    if (!matchedEntry) {
      return objectTag;
    }

    if (matchedEntry.id) {
      injectedById.add(matchedEntry.id.toLowerCase());
    }
    if (matchedEntry.codename) {
      injectedByCodename.add(matchedEntry.codename.toLowerCase());
    }

    return matchedEntry.html;
  });

  const missingBodies = entries
    .filter((entry) => {
      const idPresent = entry.id ? injectedById.has(entry.id.toLowerCase()) : false;
      const codenamePresent = entry.codename ? injectedByCodename.has(entry.codename.toLowerCase()) : false;
      return !idPresent && !codenamePresent;
    })
    .map((entry) => entry.html)
    .filter((html) => !replacedHtml.includes(html));

  return [replacedHtml, ...missingBodies].filter((part) => part.trim().length > 0).join('');
};

const getContentBlockBodiesFromAnyElement = (elements: Record<string, any>): string[] => {
  if (!elements || typeof elements !== 'object') {
    return [];
  }

  const seen = new Set<string>();
  const results: string[] = [];

  for (const element of Object.values(elements)) {
    const bodies = getContentBlockBodies(element);
    for (const body of bodies) {
      const normalized = body.trim();
      if (!normalized || seen.has(normalized)) {
        continue;
      }

      seen.add(normalized);
      results.push(body);
    }
  }

  return results;
};

const getSectionHtml = (element: any): string => {
  if (!element) {
    return '';
  }

  const rawHtml = normalizeRichTextHtml(element.value);
  const contentBlockEntries = getContentBlockEntries(element);

  if (contentBlockEntries.length === 0) {
    return rawHtml;
  }

  return mergeRichTextWithContentBlocks(rawHtml, contentBlockEntries);
};

const getMergedContentStructureHtml = (elements: any): string => {
  if (!elements) {
    return '';
  }

  const prioritized = [
    getSectionHtml(elements.content_structure),
    getSectionHtml(elements.content_blocks),
    getSectionHtml(elements.sections),
    getSectionHtml(elements.page_sections),
  ].filter((value) => value.trim().length > 0);

  const fromAnyElement = getContentBlockBodiesFromAnyElement(elements);
  for (const body of fromAnyElement) {
    if (!prioritized.some((value) => value.trim() === body.trim())) {
      prioritized.push(body);
    }
  }

  return prioritized.join('');
};

const brandCollectionMappings: Record<string, string> = {
  'bupa': 'BUPA',
  'bupa pet insurance': 'BUPA',
  'bupa_pet_insurance': 'BUPA',
  'bupa-pet-insurance': 'BUPA',
  'bupa_pet_insurance_collection': 'BUPA',
  'bupa-pet-insurance-collection': 'BUPA',
  'hcf': 'HCF',
  'hcf pet insurance': 'HCF',
  'hcf_pet_insurance': 'HCF',
  'hcf-pet-insurance': 'HCF',
  'hcf_pet_insurance_collection': 'HCF',
  'hcf-pet-insurance-collection': 'HCF',
};

const normalizeCollectionName = (collectionName: string): string =>
  collectionName.trim().toLowerCase().replace(/[_\-\s]+/g, ' ');

function getBrandKeyFromCollection(collectionName?: string): string | undefined {
  if (!collectionName) {
    return undefined;
  }

  const normalized = normalizeCollectionName(collectionName);
  if (brandCollectionMappings[normalized]) {
    return brandCollectionMappings[normalized];
  }

  return Object.entries(brandCollectionMappings).find(([key]) => normalized.includes(key))?.[1];
}

function deriveBrandKey(collection?: string): string | undefined {
  if (!collection) {
    return undefined;
  }

  return getBrandKeyFromCollection(collection) ??
    (normalizeCollectionName(collection).includes('bupa') ? 'BUPA' : 
     normalizeCollectionName(collection).includes('hcf') ? 'HCF' : 
     undefined);
}

export { deriveBrandKey };

// Function to fetch home page content from Kontent.ai
export async function getHomePageContent(): Promise<HomePageContent | null> {
  try {
    const client = getKontentClient();

    // This is a placeholder - you'll need to replace with your actual content type codename
    const response = await client
      .items()
      .type('home_page')
      .collection('home_page_collection')
      .toPromise();

    if (response.data.items.length === 0) {
      return null;
    }

    const item = response.data.items[0];
      const privacyCollectionNoticeHtml = getSectionHtml(item.elements.privacy_collection_notice);

    // Map Kontent.ai fields to our interface
    // Adjust these field names based on your Kontent.ai content model
    return {
      itemId: item.system?.id,
      itemCodename: item.system?.codename,
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
      .collection('faq_collection')
      .type('faq')
      .toPromise();

    // Map Kontent.ai FAQ items to our interface
    return response.data.items.map((item: any) => ({
      itemId: item.system?.id,
      itemCodename: item.system?.codename,
      question: item.elements.question?.value || '',
      answer: item.elements.answer?.value || '',
      order: item.elements.order?.value || 0,
    }));
  } catch (error) {
    console.error('Error fetching FAQ content from Kontent.ai:', error);
    return [];
  }
}

// Function to fetch Brand Partner Root data from Kontent.ai
async function getBrandPartnerLogo(collection?: string): Promise<{ url?: string; itemId?: string } | undefined> {
  try {
    const client = getKontentClient();

    const query = client
      .items()
      .type('brand_partner_root')
      .limitParameter(1);

    if (collection) {
      query.collection(collection);
    }

    const response = await query.toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      console.log('Brand Partner Root item for logo:', JSON.stringify(item.elements, null, 2));
      return {
        url: getAssetUrl(item.elements.brand_partner_logo),
        itemId: item.system?.id,
      };
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching Brand Partner Logo from Kontent.ai:', error);
    return undefined;
  }
}

async function getBrandDisclaimer(collection?: string): Promise<{ text?: string; itemId?: string } | undefined> {
  try {
    const client = getKontentClient();

    const query = client
      .items()
      .type('brand_partner_root')
      .limitParameter(1);

    if (collection) {
      query.collection(collection);
    }

    const response = await query.toPromise();

    if (response.data.items.length > 0) {
      const item = response.data.items[0];
      console.log('Brand Partner Root item:', JSON.stringify(item.elements, null, 2));
      return {
        text: item.elements.brand_disclaimer?.value,
        itemId: item.system?.id,
      };
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching Brand Disclaimer from Kontent.ai:', error);
    return undefined;
  }
}

const getElementStringValue = (element: any): string | undefined => {
  if (!element) {
    return undefined;
  }

  const value = element.value;

  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];

    if (typeof first === 'string') {
      return first.trim() || undefined;
    }

    if (first && typeof first === 'object') {
      if (typeof first.url === 'string') {
        return first.url;
      }
      if (typeof first.value === 'string') {
        return first.value.trim() || undefined;
      }
    }
  }

  if (value && typeof value === 'object') {
    if (typeof value.url === 'string') {
      return value.url;
    }
    if (typeof value.value === 'string') {
      return value.value.trim() || undefined;
    }
  }

  return undefined;
};

const getElementPlaceholderValue = (element: any): unknown => {
  if (!element) {
    return undefined;
  }

  if (Object.prototype.hasOwnProperty.call(element, 'value')) {
    return element.value;
  }

  return undefined;
};

const extractBrandPartnerDetails = (elements: Record<string, any>): BrandPartnerDetails => {
  const details: BrandPartnerDetails = {};

  for (const [key, element] of Object.entries(elements || {})) {
    details[key] = getElementPlaceholderValue(element);
  }

  return details;
};

const extractFirstLinkedItem = (element: any): any | undefined => {
  if (!element) {
    return undefined;
  }

  if (Array.isArray(element.linkedItems) && element.linkedItems.length > 0) {
    return element.linkedItems[0];
  }

  const rawValue = element.value;
  if (!Array.isArray(rawValue) || rawValue.length === 0) {
    return undefined;
  }

  const first = rawValue[0];
  if (!first) {
    return undefined;
  }

  if (first.elements) {
    return first;
  }

  if (first.item?.elements) {
    return first.item;
  }

  return undefined;
};

const extractLinkedItemCodenames = (element: any): string[] => {
  if (!element) {
    return [];
  }

  const codenames = new Set<string>();

  if (Array.isArray(element.linkedItems)) {
    for (const linked of element.linkedItems) {
      const codename = linked?.system?.codename || linked?.codename;
      if (typeof codename === 'string' && codename.trim()) {
        codenames.add(codename);
      }
    }
  }

  if (Array.isArray(element.value)) {
    for (const valueItem of element.value) {
      if (typeof valueItem === 'string' && valueItem.trim()) {
        codenames.add(valueItem);
        continue;
      }

      const codename =
        valueItem?.codename ||
        valueItem?.itemCodename ||
        valueItem?.system?.codename ||
        valueItem?.item?.system?.codename;

      if (typeof codename === 'string' && codename.trim()) {
        codenames.add(codename);
      }
    }
  }

  return Array.from(codenames);
};

const findValueByKeyPattern = (elements: Record<string, any>, patterns: RegExp[]): string | undefined => {
  for (const key of Object.keys(elements || {})) {
    if (!patterns.some((pattern) => pattern.test(key))) {
      continue;
    }

    const value = getElementStringValue(elements[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
};

const resolveBrandPartnerDetailsItem = (rootItem: any): any | undefined => {
  const rootElements = rootItem?.elements || {};

  if (rootElements.brand_partner_info) {
    const infoMatch = extractFirstLinkedItem(rootElements.brand_partner_info);
    if (infoMatch) {
      return infoMatch;
    }
  }

  if (rootElements.brand_partner_details) {
    const directMatch = extractFirstLinkedItem(rootElements.brand_partner_details);
    if (directMatch) {
      return directMatch;
    }
  }

  // Fallback for environments where the linked-item codename differs.
  for (const [key, element] of Object.entries(rootElements)) {
    if (!/detail/i.test(key)) {
      continue;
    }

    const linkedItem = extractFirstLinkedItem(element);
    if (linkedItem) {
      return linkedItem;
    }
  }

  return undefined;
};

const extractHeaderInfoFromElements = (elements: Record<string, any>) => {
  const phone =
    getElementStringValue(elements.brand_partner_phone) ||
    getElementStringValue(elements.phone_number) ||
    getElementStringValue(elements.phone) ||
    getElementStringValue(elements.contact_phone) ||
    getElementStringValue(elements.customer_service_phone) ||
    getElementStringValue(elements.support_phone_number) ||
    findValueByKeyPattern(elements, [/phone/i, /contact/i, /support/i]);

  const portalLoginUrl =
    getElementStringValue(elements.brand_partner_csp_url) ||
    getElementStringValue(elements.portal_login_url) ||
    getElementStringValue(elements.portal_url) ||
    getElementStringValue(elements.login_url) ||
    getElementStringValue(elements.login_link) ||
    getElementStringValue(elements.member_login_url) ||
    findValueByKeyPattern(elements, [/portal/i, /login/i, /member.*url/i]);

  return {
    phone,
    portalLoginUrl,
  };
};

async function getBrandPartnerHeaderInfo(collection?: string): Promise<{ phone?: string; portalLoginUrl?: string; itemId?: string; details: BrandPartnerDetails } | undefined> {
  try {
    const client = getKontentClient();

    const query = client
      .items()
      .type('brand_partner_root')
      .depthParameter(2)
      .limitParameter(1);

    if (collection) {
      query.collection(collection);
    }

    const response = await query.toPromise();

    if (response.data.items.length === 0) {
      return undefined;
    }

    const rootItem = response.data.items[0];
    const rootElements = rootItem.elements || {};
    const linkedDetailsElement = rootElements.brand_partner_info || rootElements.brand_partner_details;
    const linkedDetailCodenames = extractLinkedItemCodenames(linkedDetailsElement);

    let detailsItem = resolveBrandPartnerDetailsItem(rootItem);

    // Fallback for cases where linked items are not hydrated on the root response.
    if (!detailsItem) {
      const detailsQuery = client
        .items()
        .type('brand_partner_details')
        .limitParameter(50);

      if (collection) {
        detailsQuery.collection(collection);
      }

      const detailsResponse = await detailsQuery.toPromise();

      if (detailsResponse.data.items.length > 0) {
        if (linkedDetailCodenames.length > 0) {
          detailsItem = detailsResponse.data.items.find((candidate: any) =>
            linkedDetailCodenames.includes(candidate?.system?.codename)
          );
        }

        if (!detailsItem) {
          detailsItem = detailsResponse.data.items.find((candidate: any) => {
            const info = extractHeaderInfoFromElements(candidate?.elements || {});
            return Boolean(info.phone || info.portalLoginUrl);
          }) || detailsResponse.data.items[0];
        }
      }
    }

    const detailsInfo = extractHeaderInfoFromElements(detailsItem?.elements || {});
    const rootInfo = extractHeaderInfoFromElements(rootElements);

    return {
      phone: detailsInfo.phone || rootInfo.phone,
      portalLoginUrl: detailsInfo.portalLoginUrl || rootInfo.portalLoginUrl,
      itemId: detailsItem?.system?.id,
      details: {
        ...extractBrandPartnerDetails(rootElements),
        ...extractBrandPartnerDetails(detailsItem?.elements || {}),
      },
    };
  } catch (error) {
    console.error('Error fetching Brand Partner Details from Kontent.ai:', error);
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
      const mergedStructuredContent = getMergedContentStructureHtml(item.elements);
      const contentSectionHtml = getSectionHtml(item.elements.content_section) || mergedStructuredContent;
      const formsSectionHtml = getSectionHtml(item.elements.forms_section) || getSectionHtml(item.elements.form_section);
      const privacyCollectionNoticeHtml = getSectionHtml(item.elements.privacy_collection_notice);
      
      const collection = item.system?.collection;
      const brandLogo = await getBrandPartnerLogo(collection);
      const brandDisclaimer = await getBrandDisclaimer(collection);
      const brandKey = deriveBrandKey(collection);
      const brandHeaderInfo = await getBrandPartnerHeaderInfo(collection);
      const detailsLookup = brandHeaderInfo?.details;
      
      return {
        itemId: item.system?.id,
        itemCodename: item.system?.codename,
        title: replaceContentPlaceholders(item.elements.title?.value || 'Landing Page', detailsLookup),
        urlSlug: item.elements.url_slug?.value || normalizedSlug,
        logoUrl: brandLogo?.url,
        logoItemId: brandLogo?.itemId,
        brandPartnerItemId: brandLogo?.itemId,
        brandPartnerDetailsItemId: brandHeaderInfo?.itemId,
        brandDisclaimer: replaceContentPlaceholders(brandDisclaimer?.text, detailsLookup, { linkify: true }),
        contactPhone: replaceContentPlaceholders(brandHeaderInfo?.phone, detailsLookup),
        portalLoginUrl: replaceContentPlaceholders(brandHeaderInfo?.portalLoginUrl, detailsLookup),
        brandKey,
        bannerUrl: getAssetUrl(item.elements.banner),
        contentSection: replaceContentPlaceholders(contentSectionHtml, detailsLookup, { linkify: true }),
        formsSection: replaceContentPlaceholders(formsSectionHtml, detailsLookup, { linkify: true }),
        privacyCollectionNotice: replaceContentPlaceholders(privacyCollectionNoticeHtml, detailsLookup, { linkify: true }),
        mrecTiles: getLinkedMRECTiles(item.elements.mrec_tiles),
        faqs: getLinkedFAQs(item.elements.faq_s).map((faq) => ({
          ...faq,
          question: replaceContentPlaceholders(faq.question, detailsLookup),
          answer: replaceContentPlaceholders(faq.answer, detailsLookup, { linkify: true }),
        })),
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

    const collection = found.system?.collection;
    const brandLogo = await getBrandPartnerLogo(collection);
    const brandDisclaimer = await getBrandDisclaimer(collection);
    const brandHeaderInfo = await getBrandPartnerHeaderInfo(collection);
    const brandKey = deriveBrandKey(collection);
    const detailsLookup = brandHeaderInfo?.details;
    const mergedStructuredContent = getMergedContentStructureHtml(found.elements);
    const contentSectionHtml = getSectionHtml(found.elements.content_section) || mergedStructuredContent;
    const formsSectionHtml = getSectionHtml(found.elements.forms_section) || getSectionHtml(found.elements.form_section);
    const privacyCollectionNoticeHtml = getSectionHtml(found.elements.privacy_collection_notice);
    return {
      itemId: found.system?.id,
      itemCodename: found.system?.codename,
      title: replaceContentPlaceholders(found.elements.title?.value || 'Landing Page', detailsLookup),
      urlSlug: found.elements.url_slug?.value || normalizedSlug,
      logoUrl: brandLogo?.url,
      logoItemId: brandLogo?.itemId,
      brandPartnerItemId: brandLogo?.itemId,
      brandPartnerDetailsItemId: brandHeaderInfo?.itemId,
      brandDisclaimer: replaceContentPlaceholders(brandDisclaimer?.text, detailsLookup, { linkify: true }),
      contactPhone: replaceContentPlaceholders(brandHeaderInfo?.phone, detailsLookup),
      portalLoginUrl: replaceContentPlaceholders(brandHeaderInfo?.portalLoginUrl, detailsLookup),
      brandKey,
      bannerUrl: getAssetUrl(found.elements.banner),
      contentSection: replaceContentPlaceholders(contentSectionHtml, detailsLookup, { linkify: true }),
      formsSection: replaceContentPlaceholders(formsSectionHtml, detailsLookup, { linkify: true }),
      privacyCollectionNotice: replaceContentPlaceholders(privacyCollectionNoticeHtml, detailsLookup, { linkify: true }),
      mrecTiles: getLinkedMRECTiles(found.elements.mrec_tiles),
      faqs: getLinkedFAQs(found.elements.faq_s).map((faq) => ({
        ...faq,
        question: replaceContentPlaceholders(faq.question, detailsLookup),
        answer: replaceContentPlaceholders(faq.answer, detailsLookup, { linkify: true }),
      })),
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
      .collection('mrec_tiles_collection')
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
      const collection = item.system?.collection;
      const brandLogo = await getBrandPartnerLogo(collection);
      const brandKey = deriveBrandKey(collection);
      const brandHeaderInfo = await getBrandPartnerHeaderInfo(collection);
      const detailsLookup = brandHeaderInfo?.details;
      const mergedStructuredContent = getMergedContentStructureHtml(item.elements);
      const contentSectionHtml = getSectionHtml(item.elements.content_section) || mergedStructuredContent;
      return {
        itemId: item.system?.id,
        itemCodename: item.system?.codename,
        title: replaceContentPlaceholders(item.elements.title?.value || 'FAQ Page', detailsLookup),
        urlSlug: item.elements.url_slug?.value || normalizedSlug,
        logoUrl: brandLogo?.url,
        logoItemId: brandLogo?.itemId,
        bannerUrl: getAssetUrl(item.elements.banner),
        contentSection: replaceContentPlaceholders(contentSectionHtml, detailsLookup, { linkify: true }),
        contactPhone: replaceContentPlaceholders(brandHeaderInfo?.phone, detailsLookup),
        portalLoginUrl: replaceContentPlaceholders(brandHeaderInfo?.portalLoginUrl, detailsLookup),
        brandKey,
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

    const collection = found.system?.collection;
    const brandLogo = await getBrandPartnerLogo(collection);
    const brandHeaderInfo = await getBrandPartnerHeaderInfo(collection);
    const brandKey = deriveBrandKey(collection);
    const detailsLookup = brandHeaderInfo?.details;
    const mergedStructuredContent = getMergedContentStructureHtml(found.elements);
    const contentSectionHtml = getSectionHtml(found.elements.content_section) || mergedStructuredContent;
    return {
      itemId: found.system?.id,
      itemCodename: found.system?.codename,
      title: replaceContentPlaceholders(found.elements.title?.value || 'FAQ Page', detailsLookup),
      urlSlug: found.elements.url_slug?.value || normalizedSlug,
      logoUrl: brandLogo?.url,
      logoItemId: brandLogo?.itemId,
      bannerUrl: getAssetUrl(found.elements.banner),
      contentSection: replaceContentPlaceholders(contentSectionHtml, detailsLookup, { linkify: true }),
      contactPhone: replaceContentPlaceholders(brandHeaderInfo?.phone, detailsLookup),
      portalLoginUrl: replaceContentPlaceholders(brandHeaderInfo?.portalLoginUrl, detailsLookup),
      brandKey,
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
      .collection('faq_collection')
      .toPromise();

    const faqs = response.data.items.map((item: any) => {
      const rawPageSlug = item.elements.page_slug?.value?.toString() || item.elements.url_slug?.value?.toString() || '';
      const itemSlug = (rawPageSlug || item.system?.codename || '')
        .replace(/^\/+/, '')
        .toLowerCase();

      return {
        itemId: item.system?.id,
        itemCodename: item.system?.codename,
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