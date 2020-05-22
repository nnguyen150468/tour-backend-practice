const router = require('express').Router({mergeParams: true})
const {auth, checkTour} = require('../controllers/authController')
const {createReview, getAllReviews, 
    deleteReview, updateReview} = require('../controllers/reviewController')


router.route("/")
.post(auth, checkTour, createReview)
.get(getAllReviews)

router.route("/:reviewID")
.delete(auth, checkTour, deleteReview)
.patch(auth, checkTour, updateReview)

module.exports = router;