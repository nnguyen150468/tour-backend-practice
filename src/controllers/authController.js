const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const Tour = require('../models/tour.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body
    const user = await User.findByCredentials(email, password)
    
    const token = await user.generateToken()

    return res.status(200).json({
        status: 'success',
        data: user,
        token: token
    })
})


exports.auth = catchAsync(async (req, res, next) => {

    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return next(new AppError(401, "Unauthorized"))
    }

    const token = req.headers.authorization.replace('Bearer ', "")
    
    const decoded = await jwt.verify(token, process.env.SECRET)
    
    const user = await User.findById(decoded.id)

    req.user = user;

    next()
})

exports.checkUser = catchAsync(async (req, res, next) => {
    if(req.user._id.toString()!==req.params.id){
        return next(new AppError(401, "You can only modify your account"))
    }
    next()
})

exports.checkTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourID)
    if(!tour) return next(new AppError(404, "Tour not found"))
    this.tour = tour
    next()
})

exports.checkIfUsersTour = catchAsync(async (req, res, next) => {
    if(req.user._id.toString()!==this.tour.organizer._id.toString()) return next(new AppError(401, "You can only modify your own tour"))
    next()
})