// @ts-nocheck
// Pages Function middleware
// - Redirects www.305fleet.com → 305fleet.com (preserving path + query)
// - Handles /book/* temporary 302 redirects to Turo listings
// - Injects X-Robots-Tag: noindex on all non-production branches

const BOOK_REDIRECTS: Record<string, string> = {
  '/book/q3': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/audi/q3/3291762',
  '/book/highlander': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/toyota/highlander-hybrid/2852521',
  '/book/q4': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/audi/q4-e-tron/3419762',
  '/book/escalade': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/cadillac/escalade-esv/2991725',
  '/book/outlander': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/mitsubishi/outlander-plug-in-hybrid/3207788',
  '/book/xc90': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/volvo/xc90-plug-in-hybrid/2945829',
  '/book/glc': 'https://turo.com/us/en/suv-rental/united-states/pembroke-pines-fl/mercedes-benz/glc-class/3529622',
};

export const onRequest = async (context: any) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Redirect www → apex, preserving the full path and query string
  if (url.hostname === 'www.305fleet.com') {
    const target = new URL(url.pathname + url.search, 'https://305fleet.com');
    return Response.redirect(target.href, 301);
  }

  // Handle /book/* temporary 302 redirects to Turo listings
  // Will change to Wheelbase when direct booking launches
  const bookTarget = BOOK_REDIRECTS[url.pathname];
  if (bookTarget) {
    return Response.redirect(bookTarget, 302);
  }

  const response = await next();

  // env.CF_PAGES_BRANCH is injected by Cloudflare at deploy time
  // On local dev, this won't be set — no-index is not applied locally
  const branch = env.CF_PAGES_BRANCH;

  // Only apply noindex to non-production branches
  if (branch && branch !== 'main') {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('X-Environment', `preview-${branch}`);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};