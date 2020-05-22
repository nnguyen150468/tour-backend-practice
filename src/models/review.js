const mongoose = require('mongoose')
const Tour = require('../models/tour')

const reviewSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "What tour are you reviewing?"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Who is writing the review?"]
    },
    rating: {
        type: Number,
        required: [true, "Review must have a rating"],
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: [true, "Review must have content"],
        trim: true
    },
},
{
   timestamps: true,
   toJSON: {virtuals: true},
   toObject: {virtuals: true}
})

reviewSchema.methods.toJSON = function(){
    const reviewObject = this.toObject()
    
    delete reviewObject.user.tokens
    delete reviewObject.tour.reviews
    console.log('reviewObject',reviewObject)
    
    delete reviewObject.tour.__v
    // delete reviewObject.tour.id
    delete reviewObject.user.password
    delete reviewObject.user.__v
    return reviewObject
}

reviewSchema.pre("save", async function(next){
    const tour = await Tour.findById(this.tour)
    this.tour = tour
    next()
})

//calculate average rating
reviewSchema.statics.calcAvgRating = async function(tourID){
    console.log('tourID====',tourID)
    const stats = await this.aggregate([
        {$match: {tour: tourID}}, //find all reviews that have matching tourID
        {$group: {
            _id: "$tour",
            numOfRatings: {$sum: 1}, //add 1 for each review found
            avgRating: {$avg: "$rating"}
        }}  
    ])
        console.log('stats=====',stats)

    //save to database
    await Tour.findByIdAndUpdate(tourID, {
        avgRating: stats.length===0? 0 : stats[0].avgRating,
        numOfRatings: stats.length===0? 0 : stats[0].numOfRatings
    })
}

reviewSchema.post(/^findOneAnd/, async function(){
    const doc = await Review.findOne()
    // console.log('doc', doc)
    // console.log('doc.constructor',doc.constructor)
    doc.constructor.calcAvgRating(doc.tour)
})

reviewSchema.post("save", function(){
    console.log('save calcAvgRating')
    this.constructor.calcAvgRating(this.tour._id);
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review;