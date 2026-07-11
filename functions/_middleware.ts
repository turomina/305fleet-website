// @ts-nocheck
// Pages Function middleware
// - Redirects www.305fleet.com → 305fleet.com (preserving path + query)
// - Injects X-Robots-Tag: noindex on all non-production branches

export const onRequest = async (context: any) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Redirect www → apex, preserving the full path and query string
  if (url.hostname === 'www.305fleet.com') {
    const target = new URL(url.pathname + url.search, 'https://305fleet.com');
    return Response.redirect(target.href, 301);
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