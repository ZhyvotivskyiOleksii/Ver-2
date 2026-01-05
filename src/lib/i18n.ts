import { translations } from '@/lib/translations';

type Dict = Record<string, string>;
const bundle = translations as Record<string, Dict>;
const localesList = Object.keys(bundle);
const fallbackLocale = (localesList.includes('ua') ? 'ua' : localesList[0]) || 'ua';

export function getTranslations(locale: string | string[] | undefined): Dict {
  const code = Array.isArray(locale) ? (locale[0] || fallbackLocale) : (locale || fallbackLocale);
  return bundle[code] || bundle[fallbackLocale] || {};
}

export const locales = localesList as Array<keyof typeof translations>;
export type Locale = (typeof locales)[number];
