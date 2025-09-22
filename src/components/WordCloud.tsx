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
          <div className="relative p-8 min-h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-2 h-full">
              {[0, 1, 2, 3].map(cluster => (
                <div key={cluster} className="flex flex-col items-center justify-center gap-1">
                  {words
                    .filter((_, index) => index % 4 === cluster)
                    .slice(0, Math.ceil(words.length / 4))
                    .map((word: { text: string; frequency: number }, index: number) => {
                      const size = Math.max(14, Math.min(32, word.frequency * 5));
                      const opacity = Math.max(0.8, Math.min(1, word.frequency / 6));
                      
                      return (
                        <span
                          key={`${cluster}-${index}`}
                          className="transition-all duration-300 hover:scale-125 cursor-default font-bold text-center leading-tight"
                          style={{
                            fontSize: `${size}px`,
                            opacity,
                            color: cluster === 0 
                              ? 'hsl(217 91% 65%)'  // Bright blue
                              : cluster === 1 
                              ? 'hsl(142 86% 55%)'  // Bright green
                              : cluster === 2
                              ? 'hsl(263 85% 65%)'  // Bright purple  
                              : 'hsl(25 95% 60%)',  // Bright orange
                            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                            filter: 'brightness(1.3) saturate(1.4) contrast(1.1)',
                            transform: `rotate(${(Math.random() - 0.5) * 15}deg)`
                          }}
                        >
                          {word.text}
                        </span>
                      );
                    })}
                </div>
              ))}
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