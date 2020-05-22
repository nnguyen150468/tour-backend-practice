const router = require('express').Router()
const {createUser, getAllUsers, getOneUser, 
    deleteUser, updateUser} = require('../controllers/userController')
const {auth, checkUser} = require('../controllers/authController')

router.route("/")
.post(createUser)
.get(getAllUsers)

router.route("/:id")
.get(getOneUser)
.delete(auth, checkUser, deleteUser)
.patch(auth, checkUser, updateUser)

module.exports = router;