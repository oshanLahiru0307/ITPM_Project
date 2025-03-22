import React from 'react'
import {Table, Card} from 'antd'
import { useState, useEffect } from 'react'
import DonationController from '../Services/DonationController'

const columns = [

    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
    { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
    { title: 'Owner', dataIndex: 'userName', key: 'userName' },
]
const AdminDonation = () => {
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
    <div
    style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}>
        <Card
        hoverable={true}
        style={{
          width: '100%',
          height: '663px',
        }}
        title={<h3
          style={{
            color: '#007FFF'
          }}>Categories</h3>}>
        <Table dataSource={donation} columns={columns} rowKey={donation._id}  pagination={{pageSize: 6}}/>
        </Card>
    </div>
  )
}

export default AdminDonation
