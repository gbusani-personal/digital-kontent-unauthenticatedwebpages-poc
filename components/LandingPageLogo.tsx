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
    <div className="flex justify-center mb-8" {...wrapperAttributes}>
      <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 shadow-sm max-w-[240px] w-full flex items-center justify-center">
        <img
          src={logoUrl}
          alt={`${title} logo`}
          className="h-16 object-contain"
        />
      </div>
    </div>
  );
}
