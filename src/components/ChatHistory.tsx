import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Analysis {
  id: string;
  original_text: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  word_cloud_data: any;
  analysis_data: any;
  created_at: string;
}

interface ChatHistoryProps {
  analyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
}

export default function ChatHistory({ analyses, onSelectAnalysis }: ChatHistoryProps) {
  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'positive':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'negative':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  return (
    <Card className="gradient-card border-border/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Analysis History
        </CardTitle>
        <CardDescription>
          Your previous text analyses and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analyses.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border/20 hover:bg-muted/50 transition-smooth cursor-pointer"
                  onClick={() => onSelectAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="font-medium">Analysis #{analysis.id.slice(0, 8)}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getSentimentColor(analysis.sentiment_label)}
                    >
                      {analysis.sentiment_label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-primary">Summary:</span>
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {analysis.summary}
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium text-primary">Original Text:</span>
                      <p className="text-muted-foreground mt-1 line-clamp-1">
                        {analysis.original_text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span className={`font-medium ${
                        analysis.sentiment_score > 0 ? 'text-green-500' : 
                        analysis.sentiment_score < 0 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {analysis.sentiment_score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No analysis history yet. Start analyzing text to build your history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}