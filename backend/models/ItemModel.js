const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
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
        type: Schema.Types.ObjectId,  // Reference to CategorySchema
        ref: 'Category',
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0
    },
    mfd: {
        type: Date,   // Manufacturing Date

    },
    expd: {
        type: Date,   // Expiry Date
        validate: {
            validator: function (value) {
                return value > this.mfd;  // Ensures expiry date is after manufacturing date
            },
            message: 'Expiry date must be after manufacturing date'
        }
    }
}, {timestamps:true});

module.exports = mongoose.model('Item', ItemSchema);
