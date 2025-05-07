const express = require('express');
const Insight = require('../models/insight');
const { generateInsights } = require('../services/aiProcessing');
const auth = require('../middleware/auth');
const router = express.Router();

// Get insights with filtering
router.get('/', auth, async (req, res) => {
  try {
    const {
      region,
      country,
      sector,
      category,
      tags,
      importance,
      sort = 'generatedAt',
      order = 'desc',
      limit = 10,
      page = 1
    } = req.query;
    
    // Build query
    const query = {};
    
    if (region) query.relatedRegions = region;
    if (country) query.relatedCountries = country;
    if (sector) query.relatedSectors = sector;
    if (category) query.category = category;
    if (tags) query.relatedTags = { $in: tags.split(',') };
    if (importance) query.importance = { $gte: parseInt(importance) };
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const insights = await Insight.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await Insight.countDocuments(query);
    
    res.json({
      items: insights,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single insight by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id)
      .populate('sourceNewsItems', 'title url source publishedAt')
      .lean();
    
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }
    
    res.json(insight);
  } catch (error) {
    console.error('Error fetching insight:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new insights (admin only)
router.post('/generate', auth, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { region, sector, days = 7 } = req.body;
    
    // Call AI service to generate insights
    const insights = await generateInsights({ region, sector, days });
    
    // Save generated insights to database
    const savedInsights = [];
    
    for (const insightData of insights) {
      const insight = new Insight(insightData);
      await insight.save();
      savedInsights.push(insight);
    }
    
    res.status(201).json({
      message: 'Insights generated successfully',
      count: savedInsights.length,
      insights: savedInsights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmark an insight
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id);
    
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }
    
    // Update user's bookmarks
    const User = require('../models/user');
    
    // Check if already bookmarked
    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.some(bookmark => 
      bookmark.itemType === 'insight' && bookmark.itemId.toString() === req.params.id
    );
    
    if (alreadyBookmarked) {
      return res.status(400).json({ message: 'Item already bookmarked' });
    }
    
    // Add to bookmarks
    user.bookmarks.push({
      itemType: 'insight',
      itemId: insight._id,
      addedAt: new Date()
    });
    
    await user.save();
    
    res.json({ message: 'Item bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking insight:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;