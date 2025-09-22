import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Upload, Download, History, Brain, BarChart3, MessageSquare, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WordCloudComponent from '@/components/WordCloud';
import SentimentChart from '@/components/SentimentChart';
import ChatHistory from '@/components/ChatHistory';

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

interface HistoryAnalysis {
  id: string;
  original_text: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchAnalyses();
  }, [user, navigate]);

  const fetchAnalyses = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('text_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analyses",
        variant: "destructive"
      });
    } else {
      setAnalyses(data || []);
    }
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      // Call our edge function for text analysis
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text }
      });

      if (error) throw error;

      // Save analysis to database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('text_analyses')
        .insert({
          user_id: user.id,
          original_text: text,
          summary: data.summary,
          sentiment_score: data.sentiment_score,
          sentiment_label: data.sentiment_label,
          word_cloud_data: data.word_cloud_data,
          analysis_data: data.analysis_data
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setCurrentAnalysis(savedAnalysis);
      fetchAnalyses();
      setText('');
      
      toast({
        title: "Analysis Complete!",
        description: "Your text has been analyzed successfully."
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt file only",
        variant: "destructive"
      });
      return;
    }

    setFileUploading(true);
    try {
      const fileText = await file.text();
      setText(fileText);
      
      toast({
        title: "File Uploaded",
        description: "Text file has been loaded successfully. Click 'Analyze Text' to proceed."
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to read the text file",
        variant: "destructive"
      });
    }
    setFileUploading(false);
    
    // Reset the input
    event.target.value = '';
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      navigate('/auth');
    }
  };

  const exportToCSV = () => {
    if (analyses.length === 0) {
      toast({
        title: "No Data",
        description: "No analyses to export",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      ['Date', 'Summary', 'Sentiment', 'Sentiment Score', 'Original Text'],
      ...analyses.map(analysis => [
        new Date(analysis.created_at).toLocaleDateString(),
        analysis.summary,
        analysis.sentiment_label,
        analysis.sentiment_score.toString(),
        analysis.original_text.replace(/"/g, '""')
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-analyses.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your analyses have been exported to CSV"
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                TextAnalyzer AI
              </h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="transition-smooth hover:shadow-glow"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="transition-smooth hover:shadow-glow"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Text Input */}
        <Card className="gradient-card border-border/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Analyze Your Text
            </CardTitle>
            <CardDescription>
              Enter your text below for comprehensive analysis including summary, sentiment, and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 bg-background/50 border-border transition-smooth focus:shadow-glow"
            />
            
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer transition-smooth hover:shadow-glow"
                >
                  <FileText className="h-4 w-4" />
                  {fileUploading ? "Uploading..." : "Upload .txt File"}
                </label>
              </div>
              
              <Button
                onClick={analyzeText}
                disabled={loading || !text.trim()}
                className="gradient-primary transition-smooth hover:shadow-glow flex-1"
              >
                {loading ? "Analyzing..." : "Analyze Text"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="wordcloud" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Word Cloud
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>Text Summary</CardTitle>
                <CardDescription>
                  Key points and main insights from your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentAnalysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/20">
                      <p className="text-foreground leading-relaxed">
                        {currentAnalysis.summary}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Analyzed on {new Date(currentAnalysis.created_at).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No analysis yet. Enter text above to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <SentimentChart analysis={currentAnalysis} />
          </TabsContent>

          <TabsContent value="wordcloud">
            <WordCloudComponent analysis={currentAnalysis} />
          </TabsContent>

          <TabsContent value="history">
            <ChatHistory analyses={analyses} onSelectAnalysis={(analysis) => setCurrentAnalysis(analysis)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}