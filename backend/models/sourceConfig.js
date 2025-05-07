// Create a new file: backend/models/sourceConfig.js
const mongoose = require('mongoose');

const sourceConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    default: 7
  },
  type: {
    type: String,
    enum: ['rss', 'api'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST'],
    default: 'GET'
  },
  headers: {
    type: Map,
    of: String
  },
  params: {
    type: Map,
    of: String
  },
  apiKey: String,
  apiKeyName: String,
  apiKeyLocation: {
    type: String,
    enum: ['header', 'param'],
    default: 'header'
  },
  responseMapping: {
    articlesPath: String,
    title: String,
    content: String,
    url: String,
    publishedAt: String,
    guid: String
  },
  active: {
    type: Boolean,
    default: true
  },
  lastFetched: Date
});

const SourceConfig = mongoose.model('SourceConfig', sourceConfigSchema);

module.exports = SourceConfig;