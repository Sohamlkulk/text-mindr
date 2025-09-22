import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Zap, Star, CloudRain } from 'lucide-react';

interface SentimentGaugeProps {
  score: number;
  label: string;
}

export default function SentimentGauge({ score, label }: SentimentGaugeProps) {
  const getSentimentVisualization = (label: string, score: number) => {
    const intensity = Math.abs(score);
    
    switch (label.toLowerCase()) {
      case 'positive':
        return {
          icon: <Heart className="h-12 w-12 text-rose-400 animate-pulse" />,
          emoji: '😊',
          bgGradient: 'from-rose-100 to-pink-50',
          description: intensity > 0.5 ? 'Absolutely Wonderful!' : 'Pretty Good Vibes',
          particles: ['✨', '🌟', '💖', '🎉']
        };
      case 'negative':
        return {
          icon: <CloudRain className="h-12 w-12 text-blue-400" />,
          emoji: '😔',
          bgGradient: 'from-blue-100 to-slate-50',
          description: intensity > 0.5 ? 'Quite Challenging' : 'A Bit Rough',
          particles: ['💧', '🌧️', '⛈️', '🌫️']
        };
      default:
        return {
          icon: <Brain className="h-12 w-12 text-amber-400" />,
          emoji: '😐',
          bgGradient: 'from-amber-100 to-yellow-50',
          description: 'Perfectly Balanced',
          particles: ['⚖️', '🤔', '📊', '🎯']
        };
    }
  };

  const visualization = getSentimentVisualization(label, score);
  
  // Creative score bar
  const scorePercentage = ((score + 1) / 2) * 100;

  return (
    <Card className="relative overflow-hidden gradient-card border-border/20 shadow-card">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {visualization.particles.map((particle, index) => (
          <div
            key={index}
            className="absolute text-lg opacity-20 animate-bounce"
            style={{
              left: `${20 + index * 20}%`,
              top: `${10 + (index % 2) * 30}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${2 + index * 0.5}s`
            }}
          >
            {particle}
          </div>
        ))}
      </div>
      
      <CardContent className="p-8 relative z-10">
        <div className="text-center space-y-6">
          {/* Creative header with emoji and icon */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{visualization.emoji}</span>
            {visualization.icon}
          </div>
          
          {/* Creative score visualization */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold capitalize text-foreground">
              {label} Sentiment
            </h3>
            <p className="text-muted-foreground font-medium">
              {visualization.description}
            </p>
          </div>
          
          {/* Creative score bar */}
          <div className="space-y-2">
            <div className="relative h-6 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-1000 ease-out"
                style={{ width: `${scorePercentage}%` }}
              />
              <div 
                className="absolute top-1/2 w-3 h-3 bg-white border-2 border-foreground rounded-full transform -translate-y-1/2 shadow-md transition-all duration-1000"
                style={{ left: `calc(${scorePercentage}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Negative</span>
              <span className="font-bold text-lg text-foreground">
                {score.toFixed(2)}
              </span>
              <span>Very Positive</span>
            </div>
          </div>
          
          {/* Creative meter with stars */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const threshold = (star - 3) * 0.4; // -0.8, -0.4, 0, 0.4, 0.8
              const isActive = score > threshold;
              return (
                <Star
                  key={star}
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}