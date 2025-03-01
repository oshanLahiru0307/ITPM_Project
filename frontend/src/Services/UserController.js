import axios from 'axios'

const BASE_URI = 'http://localhost:5000/api/user'
const LOGIN_BASE_URI = 'http://localhost:5000/api/user/login'


    class UserController{

        static async getAllUsers(){
            try{
                const response = await axios.get(BASE_URI)
                return response.data
            }catch(error){
                console.error("error while fetching users", error);
                throw error
            }
        }

        static async getsingleUser(userid){
            try{
                const response = await axios.get(`${BASE_URI}/${userid}`)
                return response.data
            }catch(error){
                console.error("error while fetching user", error);
                throw error
            }
        }

        static async addUser(newData){
            try{
                const response = await axios.post(BASE_URI, newData)
                return response.data
            }catch(error){
                console.error("error while creating user", error);
                throw error
            }
        }

        
        static async updateUser(useID, newData){
            try{
                const response = await axios.patch(`${BASE_URI}/${useID}`, newData)
                return response.data
            }catch(error){
                console.error("error while updating user", error);
                throw error
            }
        }

        static async deleteUser(useID){
            try{
                const response = await axios.delete(`${BASE_URI}/${useID}`)
                return response.data
            }catch(error){
                console.error("error while deleting user", error);
                throw error
            }
        }

        static async loginUser(values){
            try{
                const response = await axios.post(LOGIN_BASE_URI, values)
                return response.data
            }catch(error){
                console.error("error while user login")
                throw error
            }
        }
    }

    
    export default UserController