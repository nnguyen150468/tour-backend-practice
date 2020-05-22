const router = require('express').Router()

const {createTour, getAllTours, getSingleTour, 
    updateTour, deleteTour} = require('../controllers/tourController')
const {auth, checkTour, checkIfUsersTour} = require('../controllers/authController')
const {checkCategory} = require('../middlewares/checkCategory')

router.route("/newTour")
.post(auth, checkCategory, createTour)

router.route("/")
.get(getAllTours)

router.route("/:tourID")
.get(checkTour, getSingleTour)
.patch(auth, checkTour, checkIfUsersTour, updateTour)
.delete(auth, checkTour, checkIfUsersTour, deleteTour)

module.exports = router;