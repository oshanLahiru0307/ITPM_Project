const express = require('express')
const router = express.Router()
const express = require('express')
const {
    getCategories,
    getaCategory,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoriesController')



//get user...
router.get('/:id', getaCategory)

//get users...
router.get('/',  getCategories)

//add user...
router.post('/', addCategory)

//update user...
router.patch('/:id', updateCategory)

//delete user...
router.delete('/:id', deleteCategory)

module.exports = router