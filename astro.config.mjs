import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://305fleet.com', // placeholder — Ian to confirm
  integrations: [
    sitemap({
      lastmod: new Date(),
      changefreq: 'weekly',
      filter: (page) => !page.includes('/brand-preview') && !page.includes('/motion-lab'),
      serialize(item) {
        const url = item.url;
        if (url === 'https://305fleet.com/') return { ...item, priority: 1.0 };
        if (url.includes('/privacy/') || url.includes('/terms/'))
          return { ...item, priority: 0.3 };
        if (url.includes('/vehicles/') && url.split('/').filter(Boolean).length > 1)
          return { ...item, priority: 0.8 };
        const pathParts = new URL(url).pathname.split('/').filter(Boolean);
        if (pathParts.length === 1) return { ...item, priority: 0.8 };
        return { ...item, priority: 0.6 };
      },
    }),
    mdx(),
  ],
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  image: { remotePatterns: [] },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@config': '/src/config',
        '@styles': '/src/styles',
      },
    },
  },
});