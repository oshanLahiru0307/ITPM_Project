const bcrypt = require('bcrypt')
const UserSchema = require('../models/UserModel')


//get user...
const getUser = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await UserSchema.findById(id)
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }
}


//get users...
const getUsers = async (req,res)=> {
    try{
        const response = await UserSchema.find()
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }
}


//add user...
const addUser = async (req,res)=> {
    const {name, email, password, phone, address} = req.body
    const Password = await bcrypt.hash(password, 10)
    try{
        const exist = await UserSchema.findOne({email:email})
        if(!exist){
            const response = await UserSchema.create({name, email, password:Password, phone, address})
            res.status(200).json(response)
        }
        else{
            res.status(402).json({error: "user email is already exist!!!."}) 
        }
    }catch(error){
        res.status(400).json({error: error})
    }
}


//update user...
const updateUser = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await UserSchema.findByIdAndUpdate({_id:id}, {...req.body})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }
}


//delete user...
const deleteUser = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await UserSchema.findByIdAndDelete({_id:id})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }
}



module.exports = {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
}