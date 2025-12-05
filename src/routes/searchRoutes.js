const express = require('express');
const router = express.Router();
const {
  advancedSearch,
  getFilterOptions,
  getSearchSuggestions,
  searchByImage
} = require('../controllers/searchController');

// Routes
router.get('/advanced', advancedSearch);
router.get('/filters', getFilterOptions);
router.get('/suggestions', getSearchSuggestions);
router.post('/by-image', searchByImage);

module.exports = router;
