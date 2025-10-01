'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InshortCard from '@/components/InshortCard';
import { useInshorts } from '@/hooks';
import { Inshort } from '@/services';

const InshortsClient = () => {
  const { data: inshortsData, isLoading, error } = useInshorts({
    limit: 20,
  });

  const inshorts = (inshortsData?.inshorts as Inshort[]) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="headline-large text-foreground mb-4">Unable to Load Quick Reads</h1>
          <p className="body-large text-muted-foreground">
            Please try again later.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="headline-xl text-foreground mb-4">Quick Reads</h1>
            <p className="body-large text-muted-foreground">
              Stay informed with the latest news in 60 words or less
            </p>
          </div>
        </div>
      </section>

      {/* Inshorts Feed */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {inshorts.map((inshort) => (
              <InshortCard key={inshort.id} inshort={inshort} />
            ))}
            
            {inshorts.length === 0 && (
              <div className="text-center py-12">
                <p className="body-large text-muted-foreground">
                  No quick reads available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InshortsClient;