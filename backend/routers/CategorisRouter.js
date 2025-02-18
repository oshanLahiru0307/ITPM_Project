const express = require('express')
const router = express.Router()
const {
    getCategories,
    getaCategory,
    addCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/CategoriesController')



//get Category...
router.get('/:id', getaCategory)

//get Categories...
router.get('/',  getCategories)

//add Category...
router.post('/', addCategory)

//update Category...
router.patch('/:id', updateCategory)

//delete Category...
router.delete('/:id', deleteCategory)

module.exports = router