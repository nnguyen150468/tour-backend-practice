const router = require('express').Router()

const {login, auth} = require('../controllers/authController')

router.route("/login")
.post(login)

router.route("/")
.post(auth)

module.exports = router;