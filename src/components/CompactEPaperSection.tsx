"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Download,
  Search,
  Filter,
  Globe,
  ChevronLeft,
  ChevronRight,
  Eye,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EpaperEdition {
  id: string;
  date: string;
  language: 'en' | 'hi';
  pages: EpaperPage[];
  title: string;
  thumbnail: string;
}

interface EpaperPage {
  id: string;
  pageNumber: number;
  thumbnail: string;
  fullImage: string;
  title: string;
}

const CompactEPaperSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEdition, setSelectedEdition] = useState<EpaperEdition | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in production, fetch from API
  const mockEditions: EpaperEdition[] = [
    {
      id: '1',
      date: '2024-09-28',
      language: 'en',
      title: 'The Cliff News - English Edition',
      thumbnail: '/api/placeholder/300/400',
      pages: [
        {
          id: '1-1',
          pageNumber: 1,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'Front Page - Breaking News'
        },
        {
          id: '1-2',
          pageNumber: 2,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'National News'
        },
        {
          id: '1-3',
          pageNumber: 3,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'Sports & Entertainment'
        },
        {
          id: '1-4',
          pageNumber: 4,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'Business & Technology'
        }
      ]
    },
    {
      id: '2',
      date: '2024-09-28',
      language: 'hi',
      title: 'द क्लिफ न्यूज़ - हिंदी संस्करण',
      thumbnail: '/api/placeholder/300/400',
      pages: [
        {
          id: '2-1',
          pageNumber: 1,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'मुख्य समाचार'
        },
        {
          id: '2-2',
          pageNumber: 2,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'राष्ट्रीय समाचार'
        },
        {
          id: '2-3',
          pageNumber: 3,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'खेल और मनोरंजन'
        },
        {
          id: '2-4',
          pageNumber: 4,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'व्यापार और तकनीक'
        }
      ]
    },
    {
      id: '3',
      date: '2024-09-27',
      language: 'en',
      title: 'The Cliff News - English Edition',
      thumbnail: '/api/placeholder/300/400',
      pages: [
        {
          id: '3-1',
          pageNumber: 1,
          thumbnail: '/api/placeholder/300/400',
          fullImage: '/api/placeholder/800/1200',
          title: 'Yesterday\'s Headlines'
        }
      ]
    }
  ];

  const [editions, setEditions] = useState<EpaperEdition[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchEditions = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditions(mockEditions);
      setIsLoading(false);
    };

    fetchEditions();
  }, [selectedDate]);

  const filteredEditions = editions.filter(edition => {
    const matchesDate = edition.date === selectedDate;
    const matchesLanguage = selectedLanguage === 'all' || edition.language === selectedLanguage;
    const matchesSearch = edition.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesLanguage && matchesSearch;
  });

  const handlePageNavigation = (direction: 'prev' | 'next') => {
    if (!selectedEdition) return;

    if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (direction === 'next' && currentPageIndex < selectedEdition.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  if (selectedEdition) {
    const currentPage = selectedEdition.pages[currentPageIndex];

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEdition(null);
              setCurrentPageIndex(0);
            }}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to E-Paper Archive
          </Button>

          {/* Reader Header */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {selectedEdition.title}
                </h1>
                <p className="text-muted-foreground">
                  {new Date(selectedEdition.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageNavigation('prev')}
                  disabled={currentPageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground px-3">
                  Page {currentPageIndex + 1} of {selectedEdition.pages.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageNavigation('next')}
                  disabled={currentPageIndex === selectedEdition.pages.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Page Reader */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={currentPage.fullImage}
                alt={currentPage.title}
                className="w-full h-auto max-h-[80vh] object-contain bg-white"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom
              </Button>
            </div>

            <div className="p-4 border-t border-border">
              <h3 className="font-semibold text-foreground">{currentPage.title}</h3>
            </div>
          </div>

          {/* Page Thumbnails */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">All Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedEdition.pages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative cursor-pointer ${
                    currentPageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentPageIndex(index)}
                >
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={page.thumbnail}
                      alt={page.title}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground">
                        Page {page.pageNumber}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            E-Paper Archive
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse and read digital editions of The Cliff News. Access current and archived newspapers in English and Hindi.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Language
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedLanguage === 'all' ? 'All Languages' :
                     selectedLanguage === 'en' ? 'English' : 'हिंदी'}
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setSelectedLanguage('all')}>
                    All Languages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedLanguage('hi')}>
                    हिंदी
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search editions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-muted aspect-[3/4] w-full"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* E-Paper Grid */}
        {!isLoading && (
          <AnimatePresence>
            {filteredEditions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEditions.map((edition, index) => (
                  <motion.div
                    key={edition.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedEdition(edition)}
                  >
                    <div className="relative">
                      <img
                        src={edition.thumbnail}
                        alt={edition.title}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Read Now
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          edition.language === 'hi'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {edition.language === 'hi' ? 'हिंदी' : 'English'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        {edition.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(edition.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {edition.pages.length} pages
                        </span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No editions found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search for a different date.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CompactEPaperSection;