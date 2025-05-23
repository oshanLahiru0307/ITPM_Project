const Items = require('../models/ItemModel')

//get item...
const getItems = async (req,res)=> {
    try{
        const response = await Items.find()
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//get items bu user name...
const getItemsByUser = async(req, res)=> {

    const user = req.params.user

    try{
        const items = await Items.find({user:user})
        res.status(200).json(items)
    }catch(error){
        res.status(500).json({error:error})
    }
}

//get items...

const getItem = async (req,res)=> {
    try{
        const {id} = req.params
        const response = await Items.findById(id)
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//add item...

const addItem = async (req,res)=> {
    try{
        const {name, user, description, price, category, qty, mfd, expd} = req.body
        const response = await Items.create({name, user, description, price, category, qty, mfd, expd})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//update item...

const updateItem  = async (req,res)=> {
    try{
        const {id} = req.params
        const response = await Items.findByIdAndUpdate({_id:id}, {...req.body})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//delete item...

const deelteItem = async (req,res)=> {
    try{
        const {id} = req.params
        const response = await Items.findByIdAndDelete({_id:id})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}



module.exports = {
    getItems,
    getItem,
    addItem,
    updateItem,
    deelteItem,
    getItemsByUser
}