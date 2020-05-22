const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const Tour = require('../models/tour')
const Review = require('../models/review')
const {getAll, deleteOne} = require('../controllers/factories')

exports.createTour = catchAsync(async (req, res, next) => {
    if(!req.body){ return next(new AppError(400, "Please fill in required information"))}
    
    const tour = new Tour(
        {...req.body,
        organizer: req.user})
    
    await tour.save()
    return res.status(201).json({
        status: 'success',
        data: tour
    })
})

exports.getAllTours = getAll(Tour)

exports.getSingleTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourID)
    
    return res.status(200).json({
        status: 'success',
        data: tour
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const updated = await Tour.findOneAndUpdate({_id: req.params.tourID},
        {...req.body},
        {new: true})
    return res.status(201).json({
        status: 'success',
        data: updated
    })
})

exports.deleteTour = deleteOne(Tour)

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     await Tour.findByIdAndDelete(req.params.tourID)
//     await Review.deleteMany({tour: req.params.tourID})
//     return res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })