const Items = require('../models/ItemModel') //import item model

//get item...
const getItems = async (req,res)=> {
    try{
        const response = await Items.find()
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//get items from item page

const getItem = async (req,res)=> {
    try{
        const {id} = req.params
        const response = await Items.findById(id)
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error:error})
    }
}

//add item from item page

const addItem = async (req,res)=> {

    // catch errors when adding items
    try{ 
        const {name, description, price, category, qty, mfd, expd} = req.body
        const response = await Items.create({name, description, price, category, qty, mfd, expd})  
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
    deelteItem
}