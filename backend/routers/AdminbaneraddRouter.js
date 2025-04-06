const express = require('express');
const {
  getBanners,
  addBanner,
  deleteBanner,
} = require('../controllers/AdminbaneraddController.js');

const router = express.Router();

// Get all banners
router.get('/', getBanners);

// Add a new banner
router.post('/', addBanner);

// Delete a banner by ID
router.delete('/:id', deleteBanner);

module.exports = router;
