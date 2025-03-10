const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DonationSchema = new Schema({

    user:{
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,  // Reference to CategorySchema
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0
    },
    mfd: {
        type: Date,
    },
    expd: {
        type: Date,
    }
}, { timestamps: true });


module.exports = mongoose.model('Donation', DonationSchema);
