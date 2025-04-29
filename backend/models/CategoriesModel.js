const mongoose = require('mongoose')

const Schema = mongoose.Schema

//category model schema...
const Categories = new Schema({
    name:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    description:{
        type: String,
        
    }
}, {timestamps:true})

module.exports = mongoose.model('Category', Categories)