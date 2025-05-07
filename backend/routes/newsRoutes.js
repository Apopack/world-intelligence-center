const express = require('express');
const NewsItem = require('../models/newsItem');
const auth = require('../middleware/auth');
const router = express.Router();

// Get news items with filtering
router.get('/', auth, async (req, res) => {
  try {
    const {
      region,
      country,
      sector,
      impact,
      tags,
      search,
      sort = 'publishedAt',
      order = 'desc',
      limit = 25,
      page = 1
    } = req.query;
    
    // Build query
    const query = {};
    
    if (region) query.region = region;
    if (country) query.country = country;
    if (sector) query.sector = sector;
    if (impact) query['impact.level'] = impact;
    if (tags) query.tags = { $in: tags.split(',') };
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const newsItems = await NewsItem.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await NewsItem.countDocuments(query);
    
    res.json({
      items: newsItems,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    console.error('Error fetching news items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single news item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id).lean();
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending topics/tags
router.get('/trending/topics', auth, async (req, res) => {
  try {
    const { days = 7, limit = 10 } = req.query;
    
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    
    const trendingTopics = await NewsItem.aggregate([
      { $match: { publishedAt: { $gte: since } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.json(trendingTopics);
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmark a news item
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);
    
    if (!newsItem) {
      return res.status(404).json({ message: 'News item not found' });
    }
    
    // Update user's bookmarks (handled in userRoutes)
    const User = require('../models/user');
    
    // Check if already bookmarked
    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.some(bookmark => 
      bookmark.itemType === 'news' && bookmark.itemId.toString() === req.params.id
    );
    
    if (alreadyBookmarked) {
      return res.status(400).json({ message: 'Item already bookmarked' });
    }
    
    // Add to bookmarks
    user.bookmarks.push({
      itemType: 'news',
      itemId: newsItem._id,
      addedAt: new Date()
    });
    
    await user.save();
    
    res.json({ message: 'Item bookmarked successfully' });
  } catch (error) {
    console.error('Error bookmarking news item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;