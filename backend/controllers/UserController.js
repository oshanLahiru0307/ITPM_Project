const bcrypt = require('bcrypt')
const jwttoken = require('jsonwebtoken')
const UserSchema = require('../models/UserModel')
const { findOne } = require('../models/DonationModel')


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
// 12345

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
    const {name, email, password, phone, address,picture} = req.body
    const Password = await bcrypt.hash(password, 10)
    try{
        const exist = await UserSchema.findOne({email:email})
        if(!exist){
            const response = await UserSchema.create({name, email, password:Password, phone, address,picture})
            res.status(200).json(response)
        }
        else{
            res.status(402).json({error: "user email is already exist."}) 
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
        console.log("error while updating",error)
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

const loginUser = async (req, res)=> {

    const {email, password} = req.body

    try{
        const user = await UserSchema.findOne({email:email})
        if(!user){
           return res.status(400).json({mssg:"user name is wrong..."})
        }
        const matchUser = await bcrypt.compare(password,user.password)
        if(!matchUser){
        return res.status(400).json({mssg:"password is wrong..."}) 
        }
        const token = jwttoken.sign({id:user._id}, process.env.SECRET_KEY)
        delete user.password
        res.status(200).json({user, token})
    }catch(error){
        res.status(400).json(error)
    }
}



module.exports = {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    loginUser
}