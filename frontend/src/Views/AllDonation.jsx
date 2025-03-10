import React from 'react'
import {Table} from 'antd'
import { useState, useEffect } from 'react'
import DonationController from '../Services/DonationController'

const columns = [

    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
    { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
    { title: 'Owner', dataIndex: 'user', key: 'user' },
]
const AllDonation = () => {
    const [donation, setDonation] = useState([])
    
    const fetchDonation = async ()=> {
        try{
            const data = await DonationController.getDonation()
            console.log(data)
            setDonation(data)
        }catch(error){
            console.error('Failed to fetch donations', error)
        }
    }

    useEffect(()=>{
        fetchDonation()
    },[])

  return (
    <div>
      <Table dataSource={donation} columns={columns} rowKey={donation._id}  pagination={{pageSize: 6}}/>
    </div>
  )
}

export default AllDonation
