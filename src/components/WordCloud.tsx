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
          <div className="flex flex-wrap gap-2 justify-center items-center p-6 min-h-64">
            {words.map((word: { text: string; frequency: number }, index: number) => {
              const size = Math.max(12, Math.min(32, word.frequency * 4));
              const opacity = Math.max(0.4, Math.min(1, word.frequency / 10));
              
              return (
                <span
                  key={index}
                  className="transition-smooth hover:scale-110 cursor-default"
                  style={{
                    fontSize: `${size}px`,
                    opacity,
                    color: index % 3 === 0 
                      ? 'hsl(var(--primary))' 
                      : index % 3 === 1 
                      ? 'hsl(var(--accent))' 
                      : 'hsl(var(--foreground))'
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