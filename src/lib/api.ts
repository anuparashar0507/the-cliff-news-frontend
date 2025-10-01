// Simple server-side API fetcher for Next.js
import { Article } from '@/services/articles';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Simple fetch with error handling
async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// Server-side data fetchers (for SEO)
export async function getArticles(limit = 10, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);
  return await fetchAPI<{ articles: Article[] }>(`/articles?${params.toString()}`);
}

export async function getTopStories(limit = 4, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);
  return await fetchAPI<{ topStories: Article[] }>(`/articles/top-stories?${params.toString()}`);
}

export async function getBreakingNews(limit = 3, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);
  return await fetchAPI<{ breakingNews: Article[] }>(`/articles/breaking?${params.toString()}`);
}

export async function getQuickReads(limit = 5, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);
  return await fetchAPI<{ quickReads: any[] }>(`/articles/quick-reads?${params.toString()}`);
}

export async function getHighlights(limit = 6) {
  return await fetchAPI<{ highlights: any[] }>(`/highlights?limit=${limit}`);
}

export async function getArticleBySlug(slug: string) {
  return await fetchAPI<{ article: Article }>(`/articles/slug/${slug}`);
}

export async function getYouTubeShorts(limit = 10) {
  return await fetchAPI<{ shorts: any[] }>(`/youtube/shorts?limit=${limit}`);
}