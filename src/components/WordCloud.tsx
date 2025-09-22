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
          <div className="flex flex-wrap gap-3 justify-center items-center p-8 min-h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
            {words.map((word: { text: string; frequency: number }, index: number) => {
              const size = Math.max(16, Math.min(40, word.frequency * 6));
              const opacity = Math.max(0.7, Math.min(1, word.frequency / 8));
              
              return (
                <span
                  key={index}
                  className="transition-smooth hover:scale-110 cursor-default font-semibold shadow-sm"
                  style={{
                    fontSize: `${size}px`,
                    opacity,
                    color: index % 4 === 0 
                      ? 'hsl(var(--primary))' 
                      : index % 4 === 1 
                      ? 'hsl(var(--accent))' 
                      : index % 4 === 2
                      ? 'hsl(263 70% 60%)'  // Brighter purple
                      : 'hsl(142 76% 50%)',  // Brighter green
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    filter: 'brightness(1.2) saturate(1.3)'
                  }}
                >
                  {word.text}
                </span>
              );
            })}
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