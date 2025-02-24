import axios from 'axios'

const BASE_URI  = 'http://localhost:5000/api/item'

class itemController {

    static async getItems(){
        try{
            const response = await axios.get(BASE_URI)
            return response.data
        }catch(error){
            console.error('Error while fetching items', error)
            throw error
        }
    }

    static async getSingleItem(itemId){
        try{
            const response = await axios.get(`${BASE_URI}/${itemId}`)
            return response.data
        }catch(error){
            console.error('Error while fetching item data', error)
            throw error
        }
    }

    static async addItem(value){
        try{
            const response = await axios.post(BASE_URI, value)
            return response.data
        }catch(error){
            console.error('error while adding new data', error)
            throw error
        }
    }

    static async updateItem(itemId, value){
        try{
            const response = await axios.patch(`${BASE_URI}/${itemId}`, value)
            return response.data.data
        }catch(error){
            console.error('error whike updating item details', error)
            throw error
        }
    }
    
    static async deleteItem(itemId){
        try{
            const response = await axios.delete(`${BASE_URI}/${itemId}`)
            return response.data
        }catch(error){
            console.error('error while deleting item',error)
            throw error
        }
    }
}

export default itemController