import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/request';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    '/',
    '/(hi|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
};