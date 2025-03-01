const donation = require('../models/DonationModel')

const getDonations = async (req, res) => {
    try {
        const response = await donation.find()
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error:error})
    }

}

const getSingleDonation = async (req, res)=> {
    const {id} = req.params
    try{
        const response = await donation.findById({_id: id})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

const addDonation = async (req, res)=> {
    try{
        const {name, description, price, category, qty, mfd, expd} = req.body
        const response = await donation.create({name, description, price, category, qty, mfd, expd})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

const updateDonation = async (req, res) => {
    const {id} = req.params
    try{
        const response = await donation.findByIdAndUpdate({_id: id}, {...req.body})
        res.status(200).json(response)
    }catch(error){
        res.status(200).json({error:error})
    }
}

const deleteDonation = async (req, res)=> {
    const {id} = req.params
    try{
        const response = await donation.findByIdAndDelete({_id: id})
        res.status(200).json(response)
    }catch(error){
        res.status(200).json({error:error})
    }
}

module.exports = {
    getDonations,
    getSingleDonation,
    addDonation,
    updateDonation,
    deleteDonation
}