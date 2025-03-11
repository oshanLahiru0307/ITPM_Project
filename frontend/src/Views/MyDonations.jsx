import React, { useState, useEffect } from 'react';
import { useSnapshot } from "valtio";
import { Table, message, Button} from 'antd';
import state from '../State/state.js';
import DonationController from '../Services/DonationController.jsx';



const MyDonations = () => {

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Qty', dataIndex: 'qty', key: 'qty' },
        { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
        { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
        { title: 'Action', key: 'action', 
            render: (_, record)=> (
                <span>
                    <Button type = 'primary' danger onClick = {()=> handleDeleteItem(record._id)}>
                        Delete
                    </Button>
                </span>
            )
        }
    ];
    const [donations, setDonations] = useState([]);
    const snap = useSnapshot(state);
    const user = snap.currentUser?._id;

    const fetchDonation = async () => {
        try {
            const data = await DonationController.getUserDonation(user);
            setDonations(data);
        } catch (error) {
            console.error("Error fetching user donations:", error);
            message.error("Failed to fetch donations");
        }
    };

    useEffect(() => {
        if (!user) {
            message.warning("User not logged in");
            return;
        }
        fetchDonation();
    }, []);

    const handleDeleteItem = async (id) => {
        try{
            await DonationController.deleteDonation(id);
            message.success("Donation deleted successfully");
            setDonations((prevDonations) => prevDonations.filter(donation => donation._id !== id))
        }catch(error){
            console.error("Error deleting donation:", error);
            message.error("Failed to delete donation");
        }
    }

    return (
        <div>
            <Table dataSource={donations} columns={columns} rowKey="_id" />
        </div>
    );
};

export default MyDonations;
