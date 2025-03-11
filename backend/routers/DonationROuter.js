const express = require('express')
const router = express.Router()
const {
    getDonations,
    getSingleDonation,
    addDonation,
    updateDonation,
    deleteDonation,
    getUserDonations
} = require('../controllers/DonationControll')


router.get('/', getDonations)

router.get('/:id', getSingleDonation)

router.get('/userDonation/:id', getUserDonations)

router.post('/', addDonation)

router.patch('/:id', updateDonation)

router.delete('/:id', deleteDonation)

module.exports = router