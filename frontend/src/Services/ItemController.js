import axios from 'axios'

const BASE_URI = 'http://localhost:5000/api/item'

class ItemController{

    static async getitem(){
        try{
            const response = await axios.get(BASE_URI)
            return response.data
        }catch(error){
            console.error('error while fetching data',error)
            throw error
        }

    }

    static async getSingleitem(itemId){
        try{
            const response = await axios.get(`${BASE_URI}/${itemId}`)
            return response.data
        }catch(error){
            console.error("error while fething user", error)
            throw error
        }
    }

    static async addItem(values){
        try{
            const response = await axios.post(BASE_URI, values)
            return response.data
        }catch(error){
            console.error("failed to add new item")
            throw error
        }
    }

    static async deleteItem(itemId){
        try{
            const response = await axios.delete(`${BASE_URI}/${itemId}`)
            return response.data
        }catch(error){
            console.error('error while deleting item', error)
            throw error
        }
    }

    static async updateItem(itemId, values){
        try{
            const response = await axios.patch(`${BASE_URI}/${itemId}`, values)
            return response.data
        }catch(error){
            console.error('error while updating data', error)
            throw error
        }
    }

}

export default ItemController