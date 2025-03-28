import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import DonationController from '../Services/DonationController';

const { Search } = Input;

const AllDonation = () => {
    const [donation, setDonation] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [sortedInfo, setSortedInfo] = useState({});

    const fetchDonation = async () => {
        try {
            const data = await DonationController.getDonation();
            setDonation(data);
            setFilteredDonations(data); // Initialize filtered data
        } catch (error) {
            console.error('Failed to fetch donations', error);
        }
    };

    useEffect(() => {
        fetchDonation();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = donation.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase()) ||
            item.category.toLowerCase().includes(value.toLowerCase()) ||
            item.userName.toLowerCase().includes(value.toLowerCase()) // Include owner in search
        );
        setFilteredDonations(filtered);
    };

    const handleSearchChange = (e) => {
        handleSearch(e.target.value); // Call handleSearch with the input value
      };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('All Donations List', 14, 16);

        // Sort data for PDF
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

        const headers = ['Name', 'Description', 'Category', 'Qty', 'Manufacturing Date', 'Expiry Date', 'Owner'];
        const data = sortedData.map(item => [
            item.name,
            item.description,
            item.category,
            item.qty,
            item.mfd ? moment(item.mfd).format('YYYY-MM-DD') : '',
            item.expd ? moment(item.expd).format('YYYY-MM-DD') : '',
            item.userName,
        ]);

        autoTable(doc, {
            head: [headers],
            body: data,
            startY: 30,
            theme: 'grid'
        });

        doc.save('all_donations.pdf');
    };

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
        { title: 'Owner', dataIndex: 'userName', key: 'userName', sorter: (a, b) => a.userName.localeCompare(b.userName) },
    ];

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
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '20%' }}
            />
            <Table dataSource={filteredDonations} columns={columns} rowKey="_id" pagination={{ pageSize: 6 }} onChange={handleTableChange}/>
        </div>
    );
};

export default AllDonation;