const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminBannerSchema = new Schema({
  image: {
    type: String, // Base64 or URL to the image
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('AdminBanner', AdminBannerSchema);
