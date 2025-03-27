const express = require('express')
const router = express.Router()

const {
    getItems,
    getItem,
    addItem,
    updateItem,
    deelteItem,
    getItemsByUser
} = require('../controllers/ItemController')



//get item...
router.get('/:id', getItem)

//get items by user...
router.get('/userItems/:user', getItemsByUser)

//get items...
router.get('/',  getItems)

//add item...
router.post('/', addItem)

//update item...
router.patch('/:id', updateItem)

//delete item...
router.delete('/:id', deelteItem)

module.exports = router