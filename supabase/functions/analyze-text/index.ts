import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }

    // Simple text analysis logic
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Get top words for word cloud
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 30)
      .map(([text, frequency]) => ({ text, frequency }));

    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'awesome', 'perfect', 'happy', 'joy', 'beautiful', 'success', 'brilliant'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'sad', 'angry', 'fail', 'problem', 'difficult', 'pain', 'wrong', 'error', 'ugly'];

    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });

    const totalSentimentWords = positiveScore + negativeScore;
    let sentimentScore = 0;
    let sentimentLabel = 'neutral';

    if (totalSentimentWords > 0) {
      sentimentScore = (positiveScore - negativeScore) / totalSentimentWords;
      if (sentimentScore > 0.1) sentimentLabel = 'positive';
      else if (sentimentScore < -0.1) sentimentLabel = 'negative';
    }

    // Create summary (first 2-3 sentences or key points)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const summary = sentences.slice(0, 3).join('. ').trim() + (sentences.length > 3 ? '...' : '');

    const analysisData = {
      summary: summary || "Brief analysis of the provided text.",
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
      word_cloud_data: {
        words: sortedWords
      },
      analysis_data: {
        word_count: words.length,
        sentence_count: sentences.length,
        sentiment_distribution: {
          positive: totalSentimentWords > 0 ? positiveScore / totalSentimentWords : 0.33,
          negative: totalSentimentWords > 0 ? negativeScore / totalSentimentWords : 0.33,
          neutral: totalSentimentWords > 0 ? (totalSentimentWords - positiveScore - negativeScore) / totalSentimentWords : 0.34
        }
      }
    };

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in analyze-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});