import axios from 'axios'
const BASE_URI = 'http://localhost:5000/api/donation'

class DonationController {

    static async getDonation(){
        try{
            const response = await axios.get(BASE_URI)
            console.log(response)
            return response.data
        }catch(error){
            console.error('error while fetching data', error)
            throw error
        }
    }

    static async getSingleDonation(donationId){
        try{
            const response = await axios.get(`${BASE_URI}/${donationId}`)
            return response.data
        }catch(error){
            console.log('erro while fetching data', error)
            throw error
        }
    }

    static async addDonation(values){
        try{
            const response = await axios.post(BASE_URI, values)
            return response.data
        }catch(error){
            console.error('error while data adding', error)
            throw error
        }
    }

    static async updatedonation(donationId, values){
        try{
            const response = await axios.patch(`${BASE_URI}/${donationId}`, values)
            return response.data
        }catch(error){
            console.error('error while updating data', error)
            throw error
        }
    }

    static async deleteDonation(donationId){
        try{
            const response = await axios.delete(`${BASE_URI}/${donationId}`)
            return response.data
        }catch(error){
            console.error('error while deleting', error)
            throw error
        }
    }
}

export default  DonationController