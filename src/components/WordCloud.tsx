import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud } from 'lucide-react';

interface Analysis {
  id: string;
  word_cloud_data: any;
}

interface WordCloudProps {
  analysis: Analysis | null;
}

export default function WordCloudComponent({ analysis }: WordCloudProps) {
  const words = analysis?.word_cloud_data?.words || [];

  return (
    <Card className="gradient-card border-border/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Word Cloud
        </CardTitle>
        <CardDescription>
          Most frequent words from your text analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {words.length > 0 ? (
          <div className="relative p-8 min-h-64 bg-gradient-to-br from-primary/15 to-accent/15 rounded-lg overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-3 h-full relative">
              {words.map((word: { text: string; frequency: number }, index: number) => {
                const isKeyword = index < 5; // Top 5 words are keywords
                const size = Math.max(16, Math.min(48, word.frequency * 8));
                const opacity = Math.max(0.9, Math.min(1, word.frequency / 4));
                
                // Dynamic positioning for clustering
                const angle = (index * 137.5) % 360; // Golden angle for natural distribution
                const radius = Math.random() * 50 + 20;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                // Bright color palette
                const colors = [
                  'hsl(217 95% 70%)',  // Electric blue
                  'hsl(142 90% 60%)',  // Vibrant green
                  'hsl(263 90% 70%)',  // Bright purple
                  'hsl(25 100% 65%)',  // Vivid orange
                  'hsl(340 90% 65%)',  // Hot pink
                  'hsl(60 95% 60%)',   // Bright yellow
                  'hsl(180 90% 55%)',  // Cyan
                  'hsl(0 90% 65%)',    // Bright red
                ];
                
                return (
                  <span
                    key={index}
                    className={`absolute transition-all duration-500 hover:scale-125 cursor-default font-bold text-center leading-tight select-none ${
                      isKeyword ? 'drop-shadow-lg' : ''
                    }`}
                    style={{
                      fontSize: `${size}px`,
                      opacity,
                      color: colors[index % colors.length],
                      textShadow: isKeyword 
                        ? '0 4px 12px rgba(0,0,0,0.6), 0 0 20px currentColor' 
                        : '0 2px 8px rgba(0,0,0,0.4)',
                      filter: isKeyword 
                        ? 'brightness(1.4) saturate(1.6) contrast(1.2)' 
                        : 'brightness(1.3) saturate(1.4) contrast(1.1)',
                      transform: `translate(${x}px, ${y}px) rotate(${(Math.random() - 0.5) * 20}deg) ${
                        isKeyword ? 'scale(1.1)' : ''
                      }`,
                      fontWeight: isKeyword ? '800' : '700',
                      zIndex: isKeyword ? 10 : 1
                    }}
                  >
                    {word.text}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No word cloud data available. Analyze some text to see the word frequency visualization.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}