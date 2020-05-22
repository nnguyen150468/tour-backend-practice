const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../middlewares/appError')
const Review = require('../models/review')

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const filters = {...req.query}
    console.log('req.query=====',req.query.sort)
    const paginationKeys = ['limit', 'sort', 'page']
    paginationKeys.map(el => delete filters[el])

    const query = Model.find(filters) //don't put await here so we can sort query
    
    console.log("MODEL========", Model.modelName)
    if (!query) return next(new AppError(404, "Not found"))

    let items = []
    //query chain. SORT
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query.sort(sortBy)
        // query.sort(req.query.sort)
        items = await query
    }

    

    return res.status(200).json({
        status: 'success',
        data: items
    })
})

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    let id;
    switch (Model.modelName) {
        case ("User"):
            id = req.user._id;
            break;
        case ("Tour"):
            id = req.params.tourID;
            break;
        case ("Review"):
            id = req.params.reviewID;
            break;
        default:
            id = req.params.id
    }
    if (!id) { return next(new AppError(404, "Not found")) }
    await Model.findOneAndDelete({_id: id})

    if(Model.modelName==="Tour"){
        await Review.deleteMany({"tour": id})
    }

    return res.status(204).end()
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    let id;
    let allows = [];
    switch (Model.modelName) {
        case ("User"):
            id = req.user._id;
            allows = ['password']
            break;
        case ("Tour"):
            id = req.params.tourID;
            allows = ['name', 'description', 'categories'];
            break;
        case ("Review"):
            id = req.params.reviewID;
            allows = ['content','rating'];
            break;
        default:
            id = req.params.id
    }
    if (!id) { return next(new AppError(404, "Not found")) }
    
    if(!req.body) return next(new AppError(400, "Please provide the info"))

    let item = await Model.findById(id)

    Object.keys(req.body).map(el => {
        if(allows.includes(el)){
            item[el] = req.body[el]
        }
    })
    
    await item.save()

    return res.status(201).json({
        status: "success",
        data: item
    })
})