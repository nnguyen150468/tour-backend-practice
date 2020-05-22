const Review = require('../models/review')
const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const {getAll, deleteOne, updateOne} = require('../controllers/factories')

exports.createReview = catchAsync(async (req, res, next) => {
    const review = new Review({
        ...req.body,
        tour: req.params.tourID,
        user: req.user
    })
    await review.save()
    return res.status(201).json({
        status: 'success',
        data: review
    })
})

exports.getAllReviews = getAll(Review)

exports.deleteReview = deleteOne(Review)

exports.updateReview = updateOne(Review)