require('dotenv').config({ path: ".env" })
const express = require('express');
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRouter = require('./src/routers/userRouter')
const tourRouter = require('./src/routers/tourRouter')
const authRouter = require('./src/routers/authRouter')
const reviewRouter = require('./src/routers/reviewRouter')

const {errorHandler} = require('./src/middlewares/errorHandler')

const catchAsync = require('./src/middlewares/catchAsync')
const Category = require('./src/models/category')

mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>console.log("Successfully connected to database"))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(router)


//routers
router.get("/", (req,res)=>res.send("OK"))

router.use("/users", userRouter)
router.use("/tours", tourRouter)
router.use("/auth", authRouter)
router.use("/tours/:tourID/reviews", reviewRouter)

router.get("/create-categories", catchAsync(async(req,res)=> {
    const arr = [
        { category: "japan" },
        { category: "russia" },
        { category: "vietnam" },
        { category: "korea" },
        { category: "china" },
        { category: "usa" },
        { category: "thailand" },
        { category: "australia" },
        { category: "asia" },
        { category: "europe" },
        { category: "SEA" }
    ]
    const cates = await Category.insertMany(arr)
    res.json(cates)
}))

const notFound = (req, res, next) => {
    const err = new Error("Route not found")
    err.status = "failed"
    err.statusCode = 404;
    next(err)
}

router.route("*").all(notFound)

app.use(errorHandler)

app.listen(process.env.PORT, () => {console.log("Listening to port", process.env.PORT)})