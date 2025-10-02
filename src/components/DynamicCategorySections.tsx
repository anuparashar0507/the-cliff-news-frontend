import { getCategories, getNewsByCategory } from '@/lib/api';
import EnhancedCategorySection from './EnhancedCategorySection';

interface DynamicCategorySectionsProps {
  language: 'ENGLISH' | 'HINDI';
  excludeCategories?: string[];
}

const DynamicCategorySections = async ({
  language,
  excludeCategories = []
}: DynamicCategorySectionsProps) => {
  // Fetch all active categories
  const categoriesData = await getCategories();
  const categories = categoriesData?.categories || [];

  // Filter out excluded categories
  const filteredCategories = categories.filter(
    category => !excludeCategories.includes(category.slug)
  );

  // Fetch articles for each category in parallel
  const categoryArticles = await Promise.all(
    filteredCategories.map(async (category: any) => {
      const articlesData = await getNewsByCategory(category.slug, 1, 6, language);
      return {
        category,
        articles: articlesData?.articles || []
      };
    })
  );

  // Filter out categories with no articles
  const categoriesWithArticles = categoryArticles.filter(
    ({ articles }) => articles.length > 0
  );

  return (
    <div className="space-y-0">
      {categoriesWithArticles.map(({ category, articles }, index) => {
        // Alternate between different layouts and backgrounds for visual variety
        const layouts = ['grid', 'featured', 'hero'] as const;
        const backgrounds = ['default', 'muted', 'accent'] as const;

        const layout = layouts[index % layouts.length];
        const backgroundColor = backgrounds[index % backgrounds.length];

        return (
          <EnhancedCategorySection
            key={category.id}
            title={category.name}
            articles={articles}
            layout={layout}
            backgroundColor={backgroundColor}
            categorySlug={category.slug}
            maxArticles={6}
          />
        );
      })}
    </div>
  );
};

export default DynamicCategorySections;