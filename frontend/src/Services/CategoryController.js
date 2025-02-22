import axios from 'axios'

const BASE_URI = 'http://localhost:5000/api/category'

class CategoryController{

    static async getAllCategories(){
        try{
            const response = await axios.get(BASE_URI)
            return response.data
        }catch(error){
            console.error("error while fetching categories")
            throw error
        }
    }

    static async getCategory(categoryId){
        try{
            const response = await axios.get(`${BASE_URI}/${categoryId}`)
            return response.data
        }catch(error){
            console.error("error fetching category item", error)
            throw error
        }
    }

    static async addCategory(values){
        try{
            const response = await axios.post(BASE_URI, values)
            return response.data
        }catch(error){
            console.error("error while adding data", error)
            throw error
        }
    }

    static async deleteCategory(categoryId){
        try{
            const response = await axios.delete(`${BASE_URI}/${categoryId}`)
            return response.data
        }catch(error){
            console.error("error while deleting category", error)
            throw error
        }
    }

    static async updateCategory(categoryId, values){
        try{    
            const response = await axios.patch(`${BASE_URI}/${categoryId}`, values)
            return response.data
        }catch(error){
            console.error('error while updating data', error)
            throw error
        }
    }

}

export default CategoryController