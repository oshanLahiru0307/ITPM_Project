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

    static async getBanners() {
        try {
          const response = await axios.get(BASE_URI);
          return response.data;
        } catch (error) {
          console.error('Error while fetching banners:', error);
          throw error;
        }
      }
    
      static async deleteBanner(id) {
        try {
          const response = await axios.delete(`${BASE_URI}/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error while deleting banner:', error);
          throw error;
        }
      }

}

export default  BannerController