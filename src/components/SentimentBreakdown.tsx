import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Analysis {
  analysis_data: {
    positive_words_found: number;
    negative_words_found: number;
    word_count: number;
    sentence_count: number;
  };
}

interface SentimentBreakdownProps {
  analysis: Analysis;
}

const COLORS = {
  positive: 'hsl(142 86% 55%)',
  negative: 'hsl(0 84% 60%)',
  neutral: 'hsl(213 27% 84%)'
};

export default function SentimentBreakdown({ analysis }: SentimentBreakdownProps) {
  const { positive_words_found, negative_words_found, word_count, sentence_count } = analysis.analysis_data;
  
  const neutralWords = word_count - positive_words_found - negative_words_found;
  
  const data = [
    { name: 'Positive', value: positive_words_found, color: COLORS.positive },
    { name: 'Negative', value: negative_words_found, color: COLORS.negative },
    { name: 'Neutral', value: neutralWords, color: COLORS.neutral }
  ].filter(item => item.value > 0);

  return (
    <Card className="gradient-card border-border/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Word Analysis
        </CardTitle>
        <CardDescription>
          Breakdown of sentiment-bearing words
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-emerald-400">{positive_words_found}</div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-red-400">{negative_words_found}</div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-primary">{word_count}</div>
            <div className="text-sm text-muted-foreground">Total Words</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-accent">{sentence_count}</div>
            <div className="text-sm text-muted-foreground">Sentences</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}