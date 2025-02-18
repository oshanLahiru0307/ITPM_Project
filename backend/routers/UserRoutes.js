const express = require('express')
const {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
} = require('../controllers/UserController')

const router = express.Router()


//get user...
router.get('/:id', getUser)

//get users...
router.get('/',  getUsers)

//add user...
router.post('/', addUser)

//update user...
router.patch('/:id', updateUser)

//delete user...
router.delete('/:id', deleteUser)

module.exports = router