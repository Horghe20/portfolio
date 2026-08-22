// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://giorgiodicristofalo.com',
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
  integrations: [sitemap({
    filter: (page) => !page.includes('/vcard')
  }), icon()],

  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    }
  }
});