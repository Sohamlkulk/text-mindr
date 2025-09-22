import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import SentimentGauge from './SentimentGauge';
import SentimentBreakdown from './SentimentBreakdown';

interface Analysis {
  id: string;
  sentiment_score: number;
  sentiment_label: string;
  analysis_data: any;
}

interface SentimentChartProps {
  analysis: Analysis | null;
}

export default function SentimentChart({ analysis }: SentimentChartProps) {
  if (!analysis) {
    return (
      <Card className="gradient-card border-border/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sentiment Analysis
          </CardTitle>
          <CardDescription>
            Emotional tone and sentiment insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No sentiment data available. Analyze some text to see sentiment insights.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SentimentGauge 
        score={analysis.sentiment_score} 
        label={analysis.sentiment_label} 
      />
      <SentimentBreakdown analysis={analysis} />
    </div>
  );
}