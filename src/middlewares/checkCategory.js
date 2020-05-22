const Category = require('../models/category')
const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')

exports.checkCategory = catchAsync(async (req, res, next) => {
    const categoryFound = await Category.find({_id: {$in: req.body.categories}}).select("_id")
    if(categoryFound.length!==req.body.categories.length) 
        return next(new AppError(404, "Category not found"))

    next()
})