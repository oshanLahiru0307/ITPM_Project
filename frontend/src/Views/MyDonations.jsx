import React, { useState, useEffect } from 'react';
import { useSnapshot } from "valtio";
import { Table, message, Button, Modal, Select, Input, InputNumber, Form, DatePicker } from 'antd';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import state from '../State/state.js';
import DonationController from '../Services/DonationController';
import CategoryController from '../Services/CategoryController';

const { Option } = Select;
const { Search } = Input;

const MyDonations = ({ refresh }) => {
    const [donations, setDonations] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [form] = Form.useForm();
    const [sortedInfo, setSortedInfo] = useState({});
    const snap = useSnapshot(state);
    const user = snap.currentUser?._id;

    // Fetch user's donations
    const fetchDonation = async () => {
        try {
            const data = await DonationController.getUserDonation(user);
            setDonations(data);
        } catch (error) {
            console.error("Error fetching user donations:", error);
            message.error("Failed to fetch donations");
        }
    };

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const data = await CategoryController.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            message.warning("User not logged in");
            return;
        }
        fetchDonation();
        fetchCategories();
    }, [refresh]);

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Filter donations based on search text
    const filteredDonations = donations.filter(donation =>
        donation.name.toLowerCase().includes(searchText.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Donation List', 14, 16);

        // Sort Data for PDF
        const sortedData = [...filteredDonations].sort((a, b) => {
            if (!sortedInfo.field) return 0;
            let sortOrder = sortedInfo.order === 'ascend' ? 1 : -1;
            let valueA = a[sortedInfo.field];
            let valueB = b[sortedInfo.field];
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            if (sortedInfo.field === 'mfd' || sortedInfo.field === 'expd') {
                valueA = moment(valueA).unix();
                valueB = moment(valueB).unix();
            }
            return valueA > valueB ? sortOrder : valueA < valueB ? -sortOrder : 0;
        });

        const headers = ['Name', 'Description', 'Category', 'Qty', 'Manufacturing Date', 'Expiry Date'];

        const data = sortedData.map(donation => [
            donation.name,
            donation.description,
            donation.category,
            donation.qty,
            donation.mfd ? moment(donation.mfd).format('YYYY-MM-DD') : '',
            donation.expd ? moment(donation.expd).format('YYYY-MM-DD') : ''
        ]);

        autoTable(doc, {
            head: [headers],
            body: data,
            startY: 30,
            theme: 'grid'
        });

        doc.save('donations.pdf');
    };

    // Handle deleting donation
    const handleDeleteItem = async (id) => {
        try {
            await DonationController.deleteDonation(id);
            message.success("Donation deleted successfully");
            setDonations((prevDonations) => prevDonations.filter(donation => donation._id !== id));
        } catch (error) {
            console.error("Error deleting donation:", error);
            message.error("Failed to delete donation");
        }
    };

    // Handle editing donation
    const handleEdit = (record) => {
        setSelectedItem(record);
        form.setFieldsValue({
            ...record,
            mfd: record.mfd ? moment(record.mfd) : null,
            expd: record.expd ? moment(record.expd) : null,
        });
        setModalVisible(true);
    };

    // Table columns
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => a.description.localeCompare(b.description) },
        { title: 'Category', dataIndex: 'category', key: 'category', sorter: (a, b) => a.category.localeCompare(b.category) },
        { title: 'Qty', dataIndex: 'qty', key: 'qty', sorter: (a, b) => a.qty - b.qty },
        { 
          title: 'Manufacturing Date', 
          dataIndex: 'mfd', 
          key: 'mfd', 
          sorter: (a, b) => moment(a.mfd).isBefore(moment(b.mfd)) ? -1 : 1,
          render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
        },
        { 
          title: 'Expiry Date', 
          dataIndex: 'expd', 
          key: 'expd', 
          sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
          render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
        },
        { 
            title: 'Added Date', 
            dataIndex: 'updatedAt', 
            key: 'updatedAt', 
            sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
            render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
          },
        {
            title: 'Action', key: 'action',
            render: (_, record) => (
                <span>
                    <Button type='primary' danger style={{ marginRight: '10px' }} onClick={() => handleDeleteItem(record._id)}>
                        Delete
                    </Button>
                    <Button type='primary' onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                </span>
            )
        }
    ];

    // Handle table change for sorting
    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    return (
        <div>
            <Button type="primary" onClick={generatePDF} style={{ float: 'right', marginBottom: '20px' }}>
                Generate PDF
            </Button>
            <Search
                placeholder="Search Donations"
                allowClear
                enterButton="Search"
                size="medium"
                onSearch={handleSearch}
                style={{ marginBottom: '20px', width: '20%' }}
            />
            <Table dataSource={filteredDonations} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} onChange={handleTableChange} />
        </div>
    );
};

export default MyDonations;