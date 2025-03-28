const donation = require('../models/DonationModel')
const User = require("../models/UserModel")

const mongoose = require('mongoose');

const getDonations = async (req, res) => {
    try {
        // Fetch all donation items
        const donations = await donation.find();

        // Format donations with user names
        const formattedDonations = await Promise.all(
            
            donations.map(async (donation) => {
                try {
                    // Ensure user ID is in the correct format
                    const userId = donation.user?.toString(); // Convert to string if not already

                    // Find the user by ID
                    const user = mongoose.Types.ObjectId.isValid(userId)
                        ? await User.findById(userId).select('name')
                        : null;

                    return {
                        ...donation._doc, // Spread existing donation data
                        userName: user ? user.name : 'Unknown',
                    };
                } catch (userError) {
                    console.error(`Error fetching user for donation ${donation._id}:`, userError);
                    return { ...donation._doc, userName: 'Unknown' };
                }
            })
        );

        res.status(200).json(formattedDonations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



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
        const {user,name, description, price, category, qty, mfd, expd} = req.body
        const response = await donation.create({user, name, description, price, category, qty, mfd, expd})
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

const getUserDonations = async (req, res) => {
    const { id } = req.params;  
    try {
        const donations = await donation.find({ user: id }); 
        res.status(200).json(donations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    getDonations,
    getSingleDonation,
    addDonation,
    updateDonation,
    deleteDonation,
    getUserDonations
}