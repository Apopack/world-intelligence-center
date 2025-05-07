const mongoose = require('mongoose');

const newsItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  source: {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    domain: String,
    reliability: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    }
  },
  publishedAt: {
    type: Date,
    required: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  aiAnalysis: {
    content: String,
    relevance: Number,
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  impact: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    }
  },
  region: {
    type: String,
    required: true
  },
  country: String,
  sector: {
    type: String,
    enum: ['politics', 'governance', 'economics', 'civil_society'],
    required: true
  },
  tags: [String],
  entityMentions: [{
    name: String,
    type: String, // person, organization, location
    count: Number
  }],
  verified: {
    type: Boolean,
    default: false
  },
  verificationSources: [String]
});

// Index for search functionality
newsItemSchema.index({ title: 'text', content: 'text', summary: 'text' });

// Add additional compound indexes for common queries
newsItemSchema.index({ region: 1, sector: 1, publishedAt: -1 });
newsItemSchema.index({ 'impact.level': 1, publishedAt: -1 });
newsItemSchema.index({ sector: 1, publishedAt: -1 });
newsItemSchema.index({ tags: 1 });

const NewsItem = mongoose.model('NewsItem', newsItemSchema);

module.exports = NewsItem;