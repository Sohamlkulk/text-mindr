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
          <div className="relative p-8 min-h-64 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-2 h-full">
              {words.map((word: { text: string; frequency: number }, index: number) => {
                const isKeyword = index < 5; // Top 5 words are keywords
                const size = Math.max(14, Math.min(28, word.frequency * 6));
                
                // Simple, clean color palette
                const colors = [
                  'hsl(var(--primary))',
                  'hsl(var(--secondary))',
                  'hsl(var(--accent))',
                  'hsl(var(--muted-foreground))',
                  'hsl(var(--foreground))',
                ];
                
                return (
                  <span
                    key={index}
                    className={`transition-all duration-300 hover:scale-110 cursor-default font-medium text-center leading-tight select-none ${
                      isKeyword ? 'font-bold' : 'font-normal'
                    }`}
                    style={{
                      fontSize: `${size}px`,
                      color: colors[index % colors.length],
                      opacity: isKeyword ? 0.9 : 0.7,
                      margin: '2px 4px'
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