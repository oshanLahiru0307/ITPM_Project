import React from 'react'
import { useSnapshot } from "valtio"
import state from '../State/state.js';
import { useState, useEffect } from 'react';
import { Table } from 'antd'
import DonationController from '../Services/DonationController.jsx';

const columns = [

    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
    { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
]

const MyDonations = () => {
    const [donations, setDonations] = useState([])
    const snap = useSnapshot(state)
    const user = snap.currentUser

    const fetchDonation = async (userId) => {

        try {
            console.log(userId)
            const data = await DonationController.getUserDonation(userId)
            setDonations(data)
            console.log(donations)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=> {
        fetchDonation(user)
    }, [user])
    return (
        <div>
            <Table dataSource={donations} columns={columns} rowKey={donations._id} />
        </div>
    )
}

export default MyDonations
