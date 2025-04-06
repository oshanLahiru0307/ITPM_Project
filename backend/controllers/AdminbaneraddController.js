const AdminBanner = require('../models/AdminbaneraddModel');

// Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await AdminBanner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a new banner
const addBanner = async (req, res) => {
  const { image, title, description } = req.body;
  try {
    const banner = await AdminBanner.create({ image, title, description });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a banner by ID
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AdminBanner.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBanners,
  addBanner,
  deleteBanner,
};
