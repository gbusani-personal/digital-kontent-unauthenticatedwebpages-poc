interface LandingPageLogoProps {
  logoUrl?: string;
  title: string;
  logoItemId?: string;
  elementCodename?: string;
}

export default function LandingPageLogo({
  logoUrl,
  title,
  logoItemId,
  elementCodename = 'brand_partner_logo',
}: LandingPageLogoProps) {
  if (!logoUrl) {
    return null;
  }

  const wrapperAttributes = logoItemId
    ? {
        'data-kontent-item-id': logoItemId,
        'data-kontent-element-codename': elementCodename,
      }
    : {};

  return (
    <div className="mb-8" {...wrapperAttributes}>
      <img
        src={logoUrl}
        alt={`${title} logo`}
        className="h-16 object-contain"
      />
    </div>
  );
}
