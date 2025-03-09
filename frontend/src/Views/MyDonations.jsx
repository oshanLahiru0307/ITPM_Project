import React, { useState, useEffect } from 'react';
import { useSnapshot } from "valtio";
import { Table, message } from 'antd';
import state from '../State/state.js';
import DonationController from '../Services/DonationController.jsx';

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
    { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
];

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const snap = useSnapshot(state);
    const user = snap.currentUser?._id;

    useEffect(() => {
        if (!user) {
            message.warning("User not logged in");
            return;
        }

        const fetchDonation = async () => {
            try {
                const data = await DonationController.getUserDonation(user);
                setDonations(data);
            } catch (error) {
                console.error("Error fetching user donations:", error);
                message.error("Failed to fetch donations");
            }
        };

        fetchDonation();
    }, [user]);

    return (
        <div>
            <h2>My Donations</h2>
            <Table dataSource={donations} columns={columns} rowKey="_id" />
        </div>
    );
};

export default MyDonations;
