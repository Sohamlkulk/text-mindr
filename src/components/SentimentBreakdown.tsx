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
  positive: 'hsl(var(--primary))',
  negative: 'hsl(var(--destructive))',
  neutral: 'hsl(var(--muted-foreground))'
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
          Emotional Landscape
        </CardTitle>
        <CardDescription>
          The emotional tone woven through your words
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Creative word analysis grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Positive words */}
          <div className="relative p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
            <div className="absolute top-2 right-2 text-green-600/20 text-3xl">😊</div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{positive_words_found}</div>
              <div className="text-sm font-medium text-green-700">Uplifting Words</div>
              <div className="text-xs text-green-600/70">Bringing positive energy</div>
            </div>
          </div>
          
          {/* Negative words */}
          <div className="relative p-4 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/50">
            <div className="absolute top-2 right-2 text-red-600/20 text-3xl">😔</div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">{negative_words_found}</div>
              <div className="text-sm font-medium text-red-700">Challenging Words</div>
              <div className="text-xs text-red-600/70">Areas of concern</div>
            </div>
          </div>
          
          {/* Neutral/Total analysis */}
          <div className="relative p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="absolute top-2 right-2 text-blue-600/20 text-3xl">📊</div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">{neutralWords}</div>
              <div className="text-sm font-medium text-blue-700">Neutral Words</div>
              <div className="text-xs text-blue-600/70">Objective content</div>
            </div>
          </div>
        </div>
        
        {/* Creative donut chart */}
        <div className="relative">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [`${value} words`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{word_count}</div>
              <div className="text-xs text-muted-foreground">Total Words</div>
            </div>
          </div>
        </div>
        
        {/* Summary stats bar */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Sentences</div>
            <div className="text-lg font-bold text-foreground">{sentence_count}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Avg. Length</div>
            <div className="text-lg font-bold text-foreground">{Math.round(word_count / sentence_count)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Sentiment Ratio</div>
            <div className="text-lg font-bold text-foreground">
              {positive_words_found}:{negative_words_found}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}