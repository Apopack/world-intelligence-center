const axios = require('axios');
const NewsItem = require('../models/newsItem');
const SourceConfig = require('../models/sourceConfig');
const { processWithAI } = require('./aiProcessing');
const Parser = require('rss-parser');
const parser = new Parser();

/**
 * Fetch and process news from all configured sources
 */
async function fetchAndProcessNews() {
  try {
    // Get all active news sources from database
    const sources = await SourceConfig.find({ active: true });
    
    // Process each source
    for (const source of sources) {
      try {
        console.log(`Fetching news from: ${source.name}`);
        
        let articles = [];
        
        // Handle different source types
        switch(source.type) {
          case 'rss':
            articles = await fetchFromRSS(source);
            break;
          case 'api':
            articles = await fetchFromAPI(source);
            break;
          default:
            console.warn(`Unsupported source type: ${source.type}`);
            continue;
        }
        
        console.log(`Fetched ${articles.length} articles from ${source.name}`);
        
        // Process and store each article
        for (const article of articles) {
          await processAndStoreArticle(article, source);
        }
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
        // Continue with other sources even if one fails
      }
    }
  } catch (error) {
    console.error('Error in news ingestion:', error);
    throw error;
  }
}

/**
 * Fetch articles from RSS feed sources
 */
async function fetchFromRSS(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map(item => ({
      title: item.title,
      content: item.content || item.description,
      url: item.link,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      guid: item.guid
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${source.name}:`, error);
    throw error;
  }
}

/**
 * Fetch articles from API-based sources
 */
async function fetchFromAPI(source) {
  try {
    // Configure request based on source settings
    const config = {
      url: source.url,
      method: source.method || 'GET',
      headers: source.headers || {},
      params: source.params || {}
    };
    
    // Add API key if present
    if (source.apiKey) {
      if (source.apiKeyLocation === 'header') {
        config.headers[source.apiKeyName] = source.apiKey;
      } else if (source.apiKeyLocation === 'param') {
        config.params[source.apiKeyName] = source.apiKey;
      }
    }
    
    const response = await axios(config);
    
    // Extract articles using the source's response mapping
    const articlesPath = source.responseMapping.articlesPath;
    let articles = articlesPath ? getNestedProperty(response.data, articlesPath) : response.data;
    
    // Map API response to our standard article format
    return articles.map(item => ({
      title: getNestedProperty(item, source.responseMapping.title),
      content: getNestedProperty(item, source.responseMapping.content),
      url: getNestedProperty(item, source.responseMapping.url),
      publishedAt: new Date(getNestedProperty(item, source.responseMapping.publishedAt)),
      guid: getNestedProperty(item, source.responseMapping.guid || source.responseMapping.url)
    }));
  } catch (error) {
    console.error(`Error fetching API from ${source.name}:`, error);
    throw error;
  }
}

/**
 * Process and store an individual article
 */
async function processAndStoreArticle(article, source) {
  try {
    // Check if article already exists
    const existingArticle = await NewsItem.findOne({ url: article.url });
    if (existingArticle) {
      console.log(`Article already exists: ${article.title}`);
      return;
    }
    
    // Process article with AI
    const aiResult = await processWithAI(article);
    
    // Create new news item
    const newsItem = new NewsItem({
      title: article.title,
      content: article.content,
      summary: aiResult.summary,
      url: article.url,
      source: {
        name: source.name,
        logo: source.logo,
        domain: source.domain,
        reliability: source.reliability
      },
      publishedAt: article.publishedAt,
      aiAnalysis: {
        content: aiResult.analysis,
        relevance: aiResult.relevance,
        sentiment: aiResult.sentiment
      },
      impact: {
        level: aiResult.impact.level,
        score: aiResult.impact.score
      },
      region: aiResult.region,
      country: aiResult.country,
      sector: aiResult.sector,
      tags: aiResult.tags,
      entityMentions: aiResult.entities,
      verified: aiResult.verified,
      verificationSources: aiResult.verificationSources
    });
    
    await newsItem.save();
    console.log(`Saved new article: ${article.title}`);
  } catch (error) {
    console.error(`Error processing article: ${article.title}`, error);
    throw error;
  }
}

/**
 * Helper function to safely get nested properties from objects
 */
function getNestedProperty(obj, path) {
  if (!path) return undefined;
  
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
}

module.exports = { fetchAndProcessNews };