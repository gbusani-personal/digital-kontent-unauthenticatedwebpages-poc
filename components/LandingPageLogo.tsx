import { designTokens } from '../lib/design-tokens';

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
    <div
      {...wrapperAttributes}
      style={{
        marginBottom: designTokens.spacing['3xl'],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <img
        src={logoUrl}
        alt={`${title} logo`}
        style={{
          height: designTokens.sizing.logoHeight,
          maxWidth: '320px',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    </div>
  );
}
