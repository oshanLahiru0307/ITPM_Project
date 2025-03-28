const express = require('express')
const router = express.Router()
const {
    getCategories,
    getaCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByUser
} = require('../controllers/CategoriesController')



//get Category...
router.get('/:id', getaCategory)

//get Categories...
router.get('/',  getCategories)

//get Categories by user...
router.get('/userId/:user', getCategoriesByUser)


//add Category...
router.post('/', addCategory)

//update Category...
router.patch('/:id', updateCategory)

//delete Category...
router.delete('/:id', deleteCategory)

module.exports = router