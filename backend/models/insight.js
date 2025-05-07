const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['trend', 'pattern', 'risk', 'opportunity', 'anomaly'],
    required: true
  },
  importance: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  relatedRegions: [String],
  relatedCountries: [String],
  relatedSectors: [{
    type: String,
    enum: ['politics', 'governance', 'economics', 'civil_society']
  }],
  relatedTags: [String],
  sourceNewsItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsItem'
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  }
});

insightSchema.index({ relatedRegions: 1, relatedSectors: 1 });
insightSchema.index({ relatedTags: 1 });
insightSchema.index({ importance: -1 });
insightSchema.index({ generatedAt: -1 });

const Insight = mongoose.model('Insight', insightSchema);

module.exports = Insight;