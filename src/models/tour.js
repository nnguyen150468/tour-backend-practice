const mongoose = require('mongoose');
const Category = require('./category')
const User = require('./user')

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Tour must have a title"]
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Tour must have description"]
    },
    categories: [{
        type: String,
        trim: true,
        required: [true, "Tour must have at least one category"]
    }],
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Tour must have at least one guide"]
    }],
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Tour must have an organizer"]
    },
    avgRating: {
        type: Number
    },
    numOfRatings: {
        type: Number
    }
    ,
    price: {
        type: Number,
        required: [true, "Tour must have a price"],
        min: 0
    }, 
    duration: {
        type: Number,
        required: [true, "Tour must have duration"],
        min: 1
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('reviews', {
    ref: "Review",
    localField: "_id",
    foreignField: "tour"
})

tourSchema.methods.toJSON = function(){
    const tourObject = this.toObject()
    delete tourObject.organizer.tokens
    delete tourObject.organizer.password
    delete tourObject.organizer.__v
    delete tourObject.__v
    tourObject.guides.map(el => {delete el.tokens; delete el.password; delete el.__v})
    return tourObject
}

tourSchema.pre("save", async function(next){
    //check guides exist
    const found = await User.find({_id: {$in: this.guides}})

    if(found.length!==this.guides.length) throw new Error("Guide(s) not found")
    
    this.guides = found
    const categoryArray = this.categories.map(async el => await Category.findById(el))
    this.categories = await Promise.all(categoryArray)
    next()
})

tourSchema.pre(/^find/, function(next){
    this
    .populate("reviews", "_id content rating -tour -__v")
    .populate({
        path: 'reviews',
        select: "_id content rating -tour",
        populate: {
            path: 'user',
            select: 'name _id email'
        }
    })
    .populate("guides organizer", "_id email name")
    next()
})

const Tour = mongoose.model("Tour", tourSchema)
module.exports = Tour;