const Categories = require('../models/CategoriesModel')


//get categories...
const getCategories = async (req, res)=> {
    try{
        const response = await Categories.find()
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }
}

//get category...
const getaCategory = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await Categories.findById(id)
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }

}

//addCategory...
const addCategory = async (req,res)=> {
    const {name,description} = req.body
    try{
        const exist = await Categories.findOne({name})
        if(!exist){
            const response = await Categories.create({name,description})
            res.status(200).json(response)
        }else{
            res.status(400).json({msg:"this category is all ready exist."})
        }
        
    }catch(error){
        res.status(400).json({error: error})
    }
}

//updateCategory...
const updateCategory = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await Categories.findByIdAndUpdate({_id:id}, {...req.body})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }

}

//deleteCategory...
const deleteCategory = async (req,res)=> {
    const {id} = req.params
    try{
        const response = await Categories.findByIdAndDelete({_id:id})
        res.status(200).json(response)
    }catch(error){
        res.status(400).json({error: error})
    }

}


module.exports = {
    getCategories,
    getaCategory,
    addCategory,
    updateCategory,
    deleteCategory
}