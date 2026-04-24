import { ds, getBrandStyles, landingPageStyles } from '../lib/design-system';
import LandingPageLogo from './LandingPageLogo';

interface LandingPageHeaderProps {
  title: string;
  logoUrl?: string;
  logoItemId?: string;
  brandPartnerDetailsItemId?: string;
  brandKey?: string;
  phoneNumber?: string;
  portalLoginUrl?: string;
}

const formatTelHref = (value: string) => `tel:${value.replace(/[^+\d]/g, '')}`;

const normalizeWebsiteUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export default function LandingPageHeader({
  title,
  logoUrl,
  logoItemId,
  brandPartnerDetailsItemId,
  brandKey,
  phoneNumber,
  portalLoginUrl,
}: LandingPageHeaderProps) {
  const brandStyles = getBrandStyles(brandKey);
  const displayPhone = phoneNumber?.trim() || '';
  const cmsWebsiteUrl = portalLoginUrl ? normalizeWebsiteUrl(portalLoginUrl) : '';
  const headerBackgroundColor = brandStyles.page?.backgroundColor ?? landingPageStyles.page.backgroundColor;
  const topSectionTextColor = brandStyles.contentHeading?.color ?? landingPageStyles.contentHeading.color;

  return (
    <header
      className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4"
      style={{
        backgroundColor: headerBackgroundColor,
      }}
      aria-label="Landing page header"
    >
      <div
        className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between"
        style={{
          ...landingPageStyles.card,
          ...brandStyles.card,
          borderRadius: ds.radius.xl,
          padding: ds.spacing.md,
          boxShadow: 'none',
        }}
      >
        <LandingPageLogo
          logoUrl={logoUrl}
          title={title}
          logoItemId={logoItemId}
          align="left"
          compact={true}
        />

        <div className="flex flex-nowrap items-center gap-3 sm:gap-4 md:justify-end">
          {displayPhone && (
            <a
              href={formatTelHref(displayPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                ...landingPageStyles.faqQuestion,
                ...brandStyles.faqQuestion,
                fontSize: ds.typography.size.lg,
                textDecoration: 'none',
                color: topSectionTextColor,
              }}
              aria-label={`Call ${displayPhone}`}
              data-kontent-item-id={brandPartnerDetailsItemId}
              data-kontent-element-codename="brand_partner_phone"
            >
              <span aria-hidden="true" style={{ fontSize: ds.typography.size.xl, lineHeight: 1 }}>☎</span>
              <span className="whitespace-nowrap">{displayPhone}</span>
            </a>
          )}

          {cmsWebsiteUrl && (
            <a
              href={cmsWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                ...landingPageStyles.faqQuestion,
                ...brandStyles.faqQuestion,
                fontSize: ds.typography.size.lg,
                textDecoration: 'none',
                color: topSectionTextColor,
              }}
              aria-label="Portal Login"
              data-kontent-item-id={brandPartnerDetailsItemId}
              data-kontent-element-codename="brand_partner_csp_url"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M20 21C20 17.6863 17.3137 15 14 15H10C6.68629 15 4 17.6863 4 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span className="whitespace-nowrap">Portal Login</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
