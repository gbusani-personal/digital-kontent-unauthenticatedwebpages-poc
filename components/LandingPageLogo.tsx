interface LandingPageLogoProps {
  logoUrl?: string;
  title: string;
}

export default function LandingPageLogo({ logoUrl, title }: LandingPageLogoProps) {
  if (!logoUrl) {
    return null;
  }

  return (
    <div className="flex justify-center mb-8">
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
