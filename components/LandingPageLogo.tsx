interface LandingPageLogoProps {
  logoUrl?: string;
  title: string;
}

const DEFAULT_LANDING_PAGE_LOGO =
  'https://assets-us-01.kc-usercontent.com/b60e4cc3-4a64-000b-07be-5654b1d7f4e3/9b41b0fe-4760-4282-93b9-1853558a0ff1/Bupa_Logo.jpg';

export default function LandingPageLogo({ logoUrl, title }: LandingPageLogoProps) {
  const finalLogoUrl = logoUrl || DEFAULT_LANDING_PAGE_LOGO;

  return (
    <div className="flex justify-center mb-8">
      <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200 shadow-sm max-w-[240px] w-full flex items-center justify-center">
        <img
          src={finalLogoUrl}
          alt={`${title} logo`}
          className="h-16 object-contain"
        />
      </div>
    </div>
  );
}
