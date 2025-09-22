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

    // Enhanced word analysis
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

    // Enhanced sentiment analysis with more comprehensive word lists
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'awesome', 'perfect', 
      'happy', 'joy', 'beautiful', 'success', 'brilliant', 'outstanding', 'superb', 'delightful', 'impressive',
      'premium', 'striking', 'bright', 'vivid', 'solid', 'smooth', 'win', 'sharp', 'fast', 'quick', 'durable'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'sad', 'angry', 'fail', 'problem', 
      'difficult', 'pain', 'wrong', 'error', 'ugly', 'disappointing', 'poor', 'slow', 'lacks', 
      'limitations', 'limited', 'missing', 'broken', 'issues', 'concerns', 'weakness'
    ];

    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = words.length;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });

    // Calculate more nuanced sentiment score
    let sentimentScore = 0;
    let sentimentLabel = 'neutral';

    if (totalWords > 0) {
      const positiveRatio = positiveScore / totalWords;
      const negativeRatio = negativeScore / totalWords;
      
      sentimentScore = (positiveRatio - negativeRatio) * 2; // Scale between -2 and 2
      sentimentScore = Math.max(-1, Math.min(1, sentimentScore)); // Clamp to -1, 1
      
      if (sentimentScore > 0.15) sentimentLabel = 'positive';
      else if (sentimentScore < -0.15) sentimentLabel = 'negative';
      else sentimentLabel = 'neutral';
    }

    // Enhanced text summarization - extract key insights
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15);
    let summary = "";
    
    if (sentences.length <= 2) {
      summary = text.trim().substring(0, 200) + (text.length > 200 ? '...' : '');
    } else if (sentences.length <= 3) {
      summary = sentences.slice(0, 2).join('. ') + '.';
    } else {
      // Score sentences based on keyword density and sentiment words
      const scoredSentences = sentences.map((sentence, index) => {
        let score = 0;
        const sentenceWords = sentence.toLowerCase().split(/\s+/);
        
        // Boost important sentences
        if (index === 0) score += 3; // First sentence importance
        if (index === sentences.length - 1) score += 2; // Last sentence importance
        
        // Score based on keyword frequency and sentiment
        sentenceWords.forEach(word => {
          if (wordFreq[word] && wordFreq[word] > 1) score += wordFreq[word];
          if (positiveWords.includes(word) || negativeWords.includes(word)) score += 3;
        });
        
        // Penalize very short or very long sentences
        if (sentenceWords.length < 5) score -= 2;
        if (sentenceWords.length > 30) score -= 1;
        
        return { sentence: sentence.trim(), score, index };
      });
      
      // Get top 2-3 sentences, maintaining original order
      const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .sort((a, b) => a.index - b.index)
        .map(s => s.sentence);
      
      summary = topSentences.join('. ') + '.';
      
      // Ensure summary isn't too long
      if (summary.length > 300) {
        summary = topSentences.slice(0, 2).join('. ') + '.';
      }
    }

    const analysisData = {
      summary: summary || "Key insights from the analyzed text.",
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
      word_cloud_data: {
        words: sortedWords
      },
      analysis_data: {
        word_count: words.length,
        sentence_count: sentences.length,
        positive_words_found: positiveScore,
        negative_words_found: negativeScore,
        sentiment_distribution: {
          positive: positiveScore > 0 ? (positiveScore / (positiveScore + negativeScore + 1)) : 0.33,
          negative: negativeScore > 0 ? (negativeScore / (positiveScore + negativeScore + 1)) : 0.33,
          neutral: 1 - ((positiveScore + negativeScore) / (positiveScore + negativeScore + 1))
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