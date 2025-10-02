"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ArrowRight, Sparkles } from 'lucide-react';

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  prediction: string;
  luckNumber: number;
  luckColor: string;
  compatibility: string;
  mood: 'excellent' | 'good' | 'average' | 'challenging';
}

const zodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    prediction: 'Today brings new opportunities in career. Your leadership skills will shine bright. Avoid impulsive decisions in financial matters.',
    luckNumber: 7,
    luckColor: 'Red',
    compatibility: 'Leo',
    mood: 'excellent'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    prediction: 'A stable day ahead with focus on family relationships. Your patience will be rewarded. Good time for investments.',
    luckNumber: 3,
    luckColor: 'Green',
    compatibility: 'Virgo',
    mood: 'good'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    prediction: 'Communication is key today. Network with new people. Unexpected news may come your way. Stay flexible.',
    luckNumber: 12,
    luckColor: 'Yellow',
    compatibility: 'Aquarius',
    mood: 'good'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    prediction: 'Focus on emotional well-being today. Family matters need attention. Your intuition guides you correctly.',
    luckNumber: 9,
    luckColor: 'Silver',
    compatibility: 'Scorpio',
    mood: 'average'
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    prediction: 'Your charismatic energy attracts success today. Creative projects flourish. Romance is in the air.',
    luckNumber: 5,
    luckColor: 'Gold',
    compatibility: 'Sagittarius',
    mood: 'excellent'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    prediction: 'Attention to detail pays off. Health requires focus. Organize your priorities for better productivity.',
    luckNumber: 6,
    luckColor: 'Navy Blue',
    compatibility: 'Capricorn',
    mood: 'good'
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    prediction: 'Balance is key in all relationships today. Artistic endeavors bring joy. Avoid conflict and seek harmony.',
    luckNumber: 8,
    luckColor: 'Pink',
    compatibility: 'Gemini',
    mood: 'good'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    prediction: 'Deep transformation begins today. Trust your instincts. Hidden opportunities reveal themselves.',
    luckNumber: 11,
    luckColor: 'Maroon',
    compatibility: 'Pisces',
    mood: 'challenging'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    prediction: 'Adventure calls and you must answer. Learning opportunities abound. Long-distance connections prove beneficial.',
    luckNumber: 4,
    luckColor: 'Purple',
    compatibility: 'Aries',
    mood: 'excellent'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    prediction: 'Hard work gets recognition today. Business ventures look promising. Stay grounded in your approach.',
    luckNumber: 10,
    luckColor: 'Brown',
    compatibility: 'Taurus',
    mood: 'good'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    prediction: 'Innovation and technology bring success. Friends play important role. Think outside the box.',
    luckNumber: 2,
    luckColor: 'Turquoise',
    compatibility: 'Libra',
    mood: 'good'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    prediction: 'Spiritual insights guide your day. Creative expression flows naturally. Dreams hold important messages.',
    luckNumber: 1,
    luckColor: 'Sea Green',
    compatibility: 'Cancer',
    mood: 'average'
  }
];

const HoroscopeSection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [showAll, setShowAll] = useState(false);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'challenging': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const displayedSigns = showAll ? zodiacSigns : zodiacSigns.slice(0, 6);

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
            <h2 className="text-3xl font-bold text-foreground">
              Daily Horoscope
            </h2>
            <Sparkles className="h-8 w-8 text-purple-600 ml-2" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what the stars have in store for you today. Get personalized insights and guidance for your zodiac sign.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {selectedSign ? (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setSelectedSign(null)}
              className="mb-6"
            >
              ← Back to All Signs
            </Button>

            <Card className="overflow-hidden shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedSign.symbol}</div>
                    <div>
                      <CardTitle className="text-2xl">{selectedSign.name}</CardTitle>
                      <p className="text-purple-100">{selectedSign.dates}</p>
                    </div>
                  </div>
                  <Badge className={getMoodColor(selectedSign.mood)}>
                    {selectedSign.mood.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4 text-foreground">Today&apos;s Prediction</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {selectedSign.prediction}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Lucky Number</h4>
                      <div className="text-3xl font-bold text-primary">{selectedSign.luckNumber}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Lucky Color</h4>
                      <div className="text-lg font-medium text-primary">{selectedSign.luckColor}</div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-foreground">Best Match</h4>
                      <div className="text-lg font-medium text-primary">{selectedSign.compatibility}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSigns.map((sign) => (
                <Card
                  key={sign.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-purple-200 dark:hover:border-purple-700"
                  onClick={() => setSelectedSign(sign)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform">
                          {sign.symbol}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{sign.name}</h3>
                          <p className="text-sm text-muted-foreground">{sign.dates}</p>
                        </div>
                      </div>
                      <Badge className={getMoodColor(sign.mood)}>
                        {sign.mood}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {sign.prediction}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-foreground font-medium">{sign.luckNumber}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {sign.luckColor}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!showAll && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3"
                >
                  View All Zodiac Signs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HoroscopeSection;