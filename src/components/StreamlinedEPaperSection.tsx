"use client";

import React, { useState } from "react";
import { ArrowRight, Calendar, Download, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface EPaperEdition {
  id: string;
  title: string;
  language: string;
  date: string;
  thumbnail: string;
  downloadUrl: string;
  pageCount: number;
  size: string;
  isToday: boolean;
  featured?: boolean;
}

interface StreamlinedEPaperSectionProps {
  showViewAll?: boolean;
  maxEditions?: number;
}

const mockEPaperEditions: EPaperEdition[] = [
  {
    id: "1",
    title: "The Cliff News - English Edition",
    language: "English",
    date: "2024-09-28",
    thumbnail: "/api/placeholder/300/400",
    downloadUrl: "/papers/cliff-news-english-2024-09-28.pdf",
    pageCount: 24,
    size: "8.5 MB",
    isToday: true,
    featured: true,
  },
  {
    id: "2",
    title: "The Cliff News - Hindi Edition",
    language: "हिंदी",
    date: "2024-09-28",
    thumbnail: "/api/placeholder/300/400",
    downloadUrl: "/papers/cliff-news-hindi-2024-09-28.pdf",
    pageCount: 20,
    size: "7.2 MB",
    isToday: true,
    featured: true,
  },
  {
    id: "3",
    title: "The Cliff News - English Edition",
    language: "English",
    date: "2024-09-27",
    thumbnail: "/api/placeholder/300/400",
    downloadUrl: "/papers/cliff-news-english-2024-09-27.pdf",
    pageCount: 22,
    size: "7.8 MB",
    isToday: false,
  },
  {
    id: "4",
    title: "The Cliff News - Hindi Edition",
    language: "हिंदी",
    date: "2024-09-27",
    thumbnail: "/api/placeholder/300/400",
    downloadUrl: "/papers/cliff-news-hindi-2024-09-27.pdf",
    pageCount: 18,
    size: "6.9 MB",
    isToday: false,
  },
];

const StreamlinedEPaperSection: React.FC<StreamlinedEPaperSectionProps> = ({
  showViewAll = true,
  maxEditions = 4,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const filteredEditions = mockEPaperEditions.filter((edition) => {
    if (selectedLanguage === "all") return true;
    return edition.language.toLowerCase() === selectedLanguage.toLowerCase();
  });

  const displayedEditions = filteredEditions.slice(0, maxEditions);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-foreground">
              Today&apos;s Digital E-Paper
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Read the complete newspaper in digital format. Available in multiple
            languages with easy download options.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Language Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-background rounded-lg p-1 shadow-md border">
            <Button
              variant={selectedLanguage === "all" ? "default" : "ghost"}
              onClick={() => setSelectedLanguage("all")}
              className="px-6"
            >
              All Languages
            </Button>
            <Button
              variant={selectedLanguage === "english" ? "default" : "ghost"}
              onClick={() => setSelectedLanguage("english")}
              className="px-6"
            >
              English
            </Button>
            <Button
              variant={selectedLanguage === "हिंदी" ? "default" : "ghost"}
              onClick={() => setSelectedLanguage("हिंदी")}
              className="px-6"
            >
              हिंदी
            </Button>
          </div>
        </div>

        {/* Featured Today's Editions */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            📰 Today&apos;s Edition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {displayedEditions
              .filter((edition) => edition.isToday)
              .map((edition) => (
                <Card
                  key={edition.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-blue-200 dark:hover:border-blue-700"
                >
                  <div className="relative">
                    <img
                      src={edition.thumbnail}
                      alt={edition.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {edition.isToday && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Star className="h-3 w-3 mr-1" />
                          Today
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">{edition.language}</Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3 text-foreground">
                      {edition.title}
                    </h4>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(edition.date)}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {edition.pageCount} pages
                        </div>
                      </div>
                      <span className="font-medium">{edition.size}</span>
                    </div>

                    <div className="space-y-3">
                      <Link href={`/epaper/${edition.id}`} className="block">
                        <Button
                          className="w-full group"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Read Online
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(edition.downloadUrl, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Previous Editions */}
        {displayedEditions.filter((edition) => !edition.isToday).length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              📚 Previous Editions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedEditions
                .filter((edition) => !edition.isToday)
                .map((edition) => (
                  <Card
                    key={edition.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative">
                      <img
                        src={edition.thumbnail}
                        alt={edition.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs">
                          {edition.language}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h4 className="font-semibold text-base mb-2 line-clamp-2 text-foreground">
                        {edition.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{formatDate(edition.date)}</span>
                        <span>{edition.pageCount} pages</span>
                      </div>

                      <div className="space-y-2">
                        <Link href={`/epaper/${edition.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-3 w-3 mr-1" />
                            Read
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(edition.downloadUrl, "_blank")}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <Link href="/epaper">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              >
                View All E-Paper Editions
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default StreamlinedEPaperSection;