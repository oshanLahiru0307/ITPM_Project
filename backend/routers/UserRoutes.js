const express = require('express')
const {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    loginUser
} = require('../controllers/UserController')

const router = express.Router()


//get user...
router.get('/:id', getUser)

//get users...
router.get('/',  getUsers)

//add/ register user...
router.post('/', addUser)

//login user...
router.post('/login', loginUser)

//update user...
router.patch('/:id', updateUser)

//delete user...
router.delete('/:id', deleteUser)

module.exports = router