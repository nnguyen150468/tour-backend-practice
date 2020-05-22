const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const User = require('../models/user')
const {updateOne, getAll} = require('../controllers/factories')

exports.createUser = catchAsync(async (req, res, next) => {
    if(!req.body) return next(new AppError(400, "Req.body not found"))
    const user = new User({
        ...req.body
    })
    await user.save()
    return res.status(201).json({
        status: "success",
        data: user
    })
})

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find()
//     if(!users) return next(new AppError(404, "Not found"))
//     return res.status(200).json({
//         status: "success",
//         data: users
//     })
// })

exports.getAllUsers = getAll(User)

exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await User.find({_id: req.params.id})
    if(!user) return next(new AppError(404, "Not found"))
    return res.status(200).json({
        status: "success",
        data: user
    })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete({_id: req.params.id})
    return res.status(204).json({
        status: "success",
        data: null
    })
})

exports.updateUser = updateOne(User)

// exports.updateUser = catchAsync(async (req, res, next) => {
//     if(!req.body) return next(new AppError(400, "Missing body"))
    
//     const updatedUser = await User.findOneAndUpdate({_id: req.params.id},
//         {...req.body},
//         {new: true}
//     )
    
//     return res.status(201).json({
//         status: "success",
//         data: updatedUser
//     })
// })