import { Card, CardContent } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';

interface SentimentGaugeProps {
  score: number;
  label: string;
}

export default function SentimentGauge({ score, label }: SentimentGaugeProps) {
  const getSentimentIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return <Smile className="h-8 w-8 text-emerald-400" />;
      case 'negative':
        return <Frown className="h-8 w-8 text-red-400" />;
      default:
        return <Meh className="h-8 w-8 text-amber-400" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-emerald-400';
    if (score < -0.1) return 'text-red-400';
    return 'text-amber-400';
  };

  const getGaugeAngle = (score: number) => {
    // Convert score from -1 to 1 range to 0 to 180 degrees
    return ((score + 1) / 2) * 180;
  };

  const angle = getGaugeAngle(score);

  return (
    <Card className="gradient-card border-border/20 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-16">
            {/* Gauge background */}
            <svg className="w-full h-full" viewBox="0 0 120 60">
              <path
                d="M 10 50 A 50 50 0 0 1 110 50"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              {/* Negative section */}
              <path
                d="M 10 50 A 50 50 0 0 1 60 10"
                stroke="hsl(var(--destructive))"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Positive section */}
              <path
                d="M 60 10 A 50 50 0 0 1 110 50"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Needle */}
              <line
                x1="60"
                y1="50"
                x2={60 + 35 * Math.cos((angle - 90) * (Math.PI / 180))}
                y2={50 + 35 * Math.sin((angle - 90) * (Math.PI / 180))}
                stroke={score > 0.1 ? 'hsl(var(--primary))' : score < -0.1 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'}
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Center dot */}
              <circle
                cx="60"
                cy="50"
                r="4"
                fill={score > 0.1 ? 'hsl(var(--primary))' : score < -0.1 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'}
              />
            </svg>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {getSentimentIcon(label)}
              <span className="text-lg font-bold capitalize">{label}</span>
            </div>
            <div className={`text-2xl font-bold ${getSentimentColor(score)}`}>
              {score.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Sentiment Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}