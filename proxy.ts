import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old flat landing-page URLs to the new /:category/:page structure.
  // Handles both /landing/<slug> and /<slug> single-segment patterns.
  // e.g. /landing/bupa-useful-documents → /bupa/useful-documents
  const match = pathname.match(/^(?:\/landing)?\/([^/]+-[^/]+)$/);
  if (match) {
    const slug = match[1];
    const firstHyphen = slug.indexOf('-');
    const category = slug.slice(0, firstHyphen);
    const page = slug.slice(firstHyphen + 1);
    const url = request.nextUrl.clone();
    url.pathname = `/${category}/${page}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  // Match /landing/<anything> and /<single-segment> paths
  matcher: ['/landing/:path*', '/:slug([^/]+)'],
};
