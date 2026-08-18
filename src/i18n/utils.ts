import { translations } from './translations';
import type { Language } from '../types';

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'it';
}

export function useTranslations(lang: Language) {
  return function t(key: string) {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // fallback to key
      }
    }
    return value as string;
  }
}

export function getRelativeLocaleUrl(lang: Language, path: string = ''): string {
  // If default lang 'it', no prefix. If 'en', prefix with '/en'.
  const prefix = lang === 'en' ? '/en' : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return prefix || '/';
  }
  return `${prefix}${cleanPath}`;
}
