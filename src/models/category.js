const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    category: { 
        type: String,
        required: [true, "Category must have a name"],
        trim: true,
        unique: true
    }
})

const Category = mongoose.model("Category", categorySchema)
module.exports = Category;