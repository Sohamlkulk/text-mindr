import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smile, Frown, Meh, TrendingUp } from 'lucide-react';

interface Analysis {
  id: string;
  sentiment_score: number;
  sentiment_label: string;
  analysis_data: any;
}

interface SentimentChartProps {
  analysis: Analysis | null;
}

const COLORS = {
  positive: 'hsl(var(--accent))',
  negative: 'hsl(var(--destructive))',
  neutral: 'hsl(var(--muted-foreground))'
};

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

  const sentimentData = [
    {
      name: 'Sentiment Score',
      value: analysis.sentiment_score,
      color: analysis.sentiment_score > 0 ? COLORS.positive : analysis.sentiment_score < 0 ? COLORS.negative : COLORS.neutral
    }
  ];

  const getSentimentIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'negative':
        return <Frown className="h-6 w-6 text-red-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-500';
    if (score < -0.1) return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <Card className="gradient-card border-border/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Sentiment Analysis
        </CardTitle>
        <CardDescription>
          Emotional tone and sentiment insights from your text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sentiment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-muted/50 rounded-lg border border-border/20">
            <div className="flex items-center justify-center gap-3 mb-2">
              {getSentimentIcon(analysis.sentiment_label)}
              <span className="text-2xl font-bold capitalize">
                {analysis.sentiment_label}
              </span>
            </div>
            <p className="text-muted-foreground">Overall Sentiment</p>
          </div>
          
          <div className="text-center p-6 bg-muted/50 rounded-lg border border-border/20">
            <div className={`text-3xl font-bold ${getSentimentColor(analysis.sentiment_score)}`}>
              {analysis.sentiment_score.toFixed(2)}
            </div>
            <p className="text-muted-foreground">Sentiment Score</p>
            <p className="text-xs text-muted-foreground mt-1">
              (-1.0 to +1.0 range)
            </p>
          </div>
        </div>

        {/* Sentiment Score Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[-1, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Bar 
                dataKey="value" 
                fill={analysis.sentiment_score > 0 ? COLORS.positive : analysis.sentiment_score < 0 ? COLORS.negative : COLORS.neutral}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        {analysis.analysis_data?.sentiment_distribution && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Sentiment Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(analysis.analysis_data.sentiment_distribution).map(([key, value]: [string, any]) => (
                <div key={key} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold capitalize">{key}</div>
                  <div className="text-sm text-muted-foreground">{(value * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}