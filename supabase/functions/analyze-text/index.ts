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

    // Enhanced text summarization - extract key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    let summary = "";
    
    if (sentences.length <= 3) {
      summary = text.trim();
    } else {
      // Get first sentence, middle important sentence, and last sentence
      const firstSentence = sentences[0].trim();
      const lastSentence = sentences[sentences.length - 1].trim();
      
      // Find sentence with most important words
      let bestSentence = sentences[1];
      let maxScore = 0;
      
      for (let i = 1; i < sentences.length - 1; i++) {
        const sentence = sentences[i];
        let score = 0;
        
        // Score based on positive/negative words and high-frequency words
        words.forEach(word => {
          if (sentence.toLowerCase().includes(word)) {
            if (positiveWords.includes(word) || negativeWords.includes(word)) score += 2;
            if (wordFreq[word] > 1) score += 1;
          }
        });
        
        if (score > maxScore) {
          maxScore = score;
          bestSentence = sentence;
        }
      }
      
      summary = `${firstSentence}. ${bestSentence.trim()}. ${lastSentence}`;
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