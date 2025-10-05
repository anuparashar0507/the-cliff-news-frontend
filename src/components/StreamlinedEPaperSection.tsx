"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import EPaperThumbnail from "./EPaperThumbnail";
import { epapersApi, EPaper } from "@/services";

const EPaperViewerModal = dynamic(() => import("./EPaperViewerModal"), {
  ssr: false,
});

interface EPaperDisplay {
  language: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  date: Date;
  title: string;
}

const StreamlinedEPaperSection = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<EPaperDisplay | null>(null);
  const [mounted, setMounted] = useState(false);
  const [englishPaper, setEnglishPaper] = useState<EPaperDisplay | null>(null);
  const [hindiPaper, setHindiPaper] = useState<EPaperDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const fetchEPapers = async () => {
      try {
        setError(null);

        // Fetch English e-paper
        const englishResponse = await epapersApi.getTodayEPaper('english');
        if (englishResponse.data) {
          setEnglishPaper({
            language: "English",
            pdfUrl: englishResponse.data.pdfUrl,
            thumbnailUrl: englishResponse.data.thumbnailUrl,
            date: new Date(englishResponse.data.date),
            title: englishResponse.data.title,
          });
        }

        // Fetch Hindi e-paper
        const hindiResponse = await epapersApi.getTodayEPaper('hindi');
        if (hindiResponse.data) {
          setHindiPaper({
            language: "हिंदी",
            pdfUrl: hindiResponse.data.pdfUrl,
            thumbnailUrl: hindiResponse.data.thumbnailUrl,
            date: new Date(hindiResponse.data.date),
            title: hindiResponse.data.title,
          });
        }
      } catch (err: any) {
        console.error("Error fetching e-papers:", err);
        setError("Unable to load today's e-papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEPapers();
  }, []);

  const handleEPaperClick = (paper: EPaperDisplay) => {
    setSelectedPaper(paper);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedPaper(null);
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || (!englishPaper && !hindiPaper)) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {error || "No e-papers available"}
            </h3>
            <p className="text-muted-foreground mb-6">
              Please check back later or visit our archive page.
            </p>
            <a
              href="/en/epaper"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Archive
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>

          {/* E-Paper Thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* English Edition */}
            {englishPaper && (
              <div className="flex flex-col items-center group cursor-pointer">
                {/* Edition Info - Above Thumbnail */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    English Edition
                  </h3>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <p className="text-sm">
                      {mounted
                        ? englishPaper.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Thumbnail - No background, clean shadow */}
                <div
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => handleEPaperClick(englishPaper)}
                >
                  {englishPaper.thumbnailUrl ? (
                    <img
                      src={englishPaper.thumbnailUrl}
                      alt="English E-Paper First Page"
                      className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  ) : (
                    <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                      <EPaperThumbnail
                        pdfUrl={englishPaper.pdfUrl}
                        width={420}
                        height={594}
                        className=""
                        alt="English E-Paper First Page"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hindi Edition */}
            {hindiPaper && (
              <div className="flex flex-col items-center group cursor-pointer">
                {/* Edition Info - Above Thumbnail */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    हिंदी संस्करण
                  </h3>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <p className="text-sm">
                      {mounted
                        ? hindiPaper.date.toLocaleDateString("hi-IN", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Thumbnail - No background, clean shadow */}
                <div
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => handleEPaperClick(hindiPaper)}
                >
                  {hindiPaper.thumbnailUrl ? (
                    <img
                      src={hindiPaper.thumbnailUrl}
                      alt="Hindi E-Paper First Page"
                      className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  ) : (
                    <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                      <EPaperThumbnail
                        pdfUrl={hindiPaper.pdfUrl}
                        width={420}
                        height={594}
                        className=""
                        alt="Hindi E-Paper First Page"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {selectedPaper && (
        <EPaperViewerModal
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          pdfUrl={selectedPaper.pdfUrl}
          title={selectedPaper.title}
        />
      )}
    </>
  );
};

export default StreamlinedEPaperSection;
