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
          <div className="relative p-8 min-h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
            <div className="relative h-full w-full">
              {words.map((word: { text: string; frequency: number }, index: number) => {
                const isKeyword = index < 5; // Top 5 words are keywords
                const size = Math.max(24, Math.min(48, word.frequency * 10)); // Larger font sizes
                
                // More spread out positioning
                const randomX = Math.random() * 90 + 5; // 5-95% for wider spread
                const randomY = Math.random() * 90 + 5;
                const randomRotation = Math.random() * 20 - 10; // -10 to 10 degrees
                
                // Vibrant color palette matching the reference
                const colors = [
                  '#00ff88', // bright green
                  '#00aaff', // bright blue  
                  '#ff6b6b', // bright red
                  '#ffd93d', // bright yellow
                  '#9b59b6', // purple
                  '#e74c3c', // red
                  '#3498db', // blue
                  '#2ecc71', // green
                  '#f39c12', // orange
                  '#e67e22', // dark orange
                ];
                
                return (
                  <span
                    key={index}
                    className={`absolute transition-all duration-300 hover:scale-110 cursor-default leading-tight select-none whitespace-nowrap ${
                      isKeyword ? 'font-bold z-20' : 'font-semibold z-10'
                    }`}
                    style={{
                      fontSize: `${size}px`,
                      color: colors[index % colors.length],
                      opacity: isKeyword ? 1 : 0.85,
                      left: `${randomX}%`,
                      top: `${randomY}%`,
                      transform: `translate(-50%, -50%) rotate(${randomRotation}deg)`,
                      textShadow: '0 0 10px rgba(0,0,0,0.3)'
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