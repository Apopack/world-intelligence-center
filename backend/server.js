const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const newsRoutes = require('./routes/newsRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const { fetchAndProcessNews } = require('./services/newsIngestion');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/users', userRoutes);

// Schedule news ingestion (every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled news ingestion...');
  try {
    await fetchAndProcessNews();
    console.log('News ingestion completed successfully');
  } catch (error) {
    console.error('Error in scheduled news ingestion:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});