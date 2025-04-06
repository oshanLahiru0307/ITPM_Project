import axios from 'axios'
const BASE_URI = 'http://localhost:5000/api/AdminbanneraddRoutes'

class BannerController {

    static async addBanner(values){
        try{
            const response = await axios.post(BASE_URI, values)
            return response.data
        }catch(error){
            console.error('error while data adding', error)
            throw error
        }
    }

}

export default  BannerController