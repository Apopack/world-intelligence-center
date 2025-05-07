const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// API details for our AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_API_KEY = process.env.AI_API_KEY;

/**
 * Process an article with AI analysis
 */
async function processWithAI(article) {
  try {
    // Call our Python AI service
    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
      title: article.title,
      content: article.content,
      url: article.url,
      publishedAt: article.publishedAt
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in AI processing:', error);
    
    // Return default values if AI service fails
    return {
      summary: article.content.substring(0, 200) + '...',
      analysis: 'AI analysis service unavailable.',
      relevance: 0.5,
      sentiment: 'neutral',
      impact: {
        level: 'medium',
        score: 5
      },
      region: 'Unknown',
      country: 'Unknown',
      sector: 'politics',
      tags: [],
      entities: [],
      verified: false,
      verificationSources: []
    };
  }
}

/**
 * Generate strategic insights based on recent news
 */
async function generateInsights(options = {}) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/insights`, options, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

module.exports = { processWithAI, generateInsights };