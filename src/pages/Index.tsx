import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BarChart3, Cloud, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 opacity-20">
          <Brain className="h-24 w-24 text-primary animate-pulse" />
        </div>
        <div className="absolute top-40 right-32 opacity-20">
          <BarChart3 className="h-16 w-16 text-accent animate-pulse delay-1000" />
        </div>
        <div className="absolute bottom-32 left-32 opacity-20">
          <Cloud className="h-20 w-20 text-primary animate-pulse delay-500" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <Sparkles className="h-18 w-18 text-accent animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="h-16 w-16 text-primary" />
              <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                TextAnalyzer AI
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your text into powerful insights with advanced AI analysis, sentiment detection, 
              and beautiful visualizations
            </p>
            
            <div className="flex gap-4 justify-center mb-12">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="gradient-primary transition-smooth hover:shadow-glow text-lg px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="transition-smooth hover:shadow-glow text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Text Analysis Features</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Everything you need to understand and visualize your text data
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-card border-border/20 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Smart Summarization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get concise 2-3 line summaries highlighting key points from any text
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/20 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Understand emotional tone with detailed sentiment scoring and insights
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/20 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center">
                <Cloud className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Word Clouds</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Visualize word frequency with beautiful, interactive word clouds
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="gradient-card border-border/20 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Chat History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Track all your analyses with searchable history and CSV export
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
