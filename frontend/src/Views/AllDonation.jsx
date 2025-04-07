import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Spin, Row, Col } from 'antd';
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
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 576);
            setIsTablet(width > 576 && width <= 992);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchDonation = async () => {
        setLoading(true);
        try {
            const data = await DonationController.getDonation();
            setDonation(data);
            setFilteredDonations(data);
        } catch (error) {
            console.error('Failed to fetch donations', error);
        } finally {
            setLoading(false);
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
            item.userName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDonations(filtered);
    };

    const handleSearchChange = (e) => {
        handleSearch(e.target.value);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('All Donations List', 14, 16);

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
          sorter: (a, b) => moment(a.updatedAt).isBefore(moment(b.updatedAt)) ? -1 : 1,
          render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
        },
        { title: 'Owner', dataIndex: 'userName', key: 'userName', sorter: (a, b) => a.userName.localeCompare(b.userName) },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh' }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={8}>
                    <Search
                        placeholder="Search Donations"
                        allowClear
                        enterButton="Search"
                        size="medium"
                        onChange={handleSearchChange}
                        style={{ width: '100%', marginBottom: 20 }}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={4}>
                    <Button 
                        type="primary" 
                        onClick={generatePDF} 
                        block={isMobile || isTablet}
                        style={{
                            float: isMobile || isTablet ? 'none' : 'right',
                            width: isMobile || isTablet ? '100%' : 'auto',
                            marginBottom: 20
                        }}
                    >
                        Generate PDF
                    </Button>
                </Col>
            </Row>

            <Spin spinning={loading} tip="Loading donations...">
                <Table 
                    dataSource={filteredDonations} 
                    columns={columns} 
                    rowKey="_id" 
                    pagination={{ pageSize: 6 }} 
                    onChange={handleTableChange} 
                    scroll={{ x: 'max-content' }}
                />
            </Spin>
        </div>
    );
};

export default AllDonation;
