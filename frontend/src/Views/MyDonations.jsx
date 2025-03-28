import React, { useState, useEffect } from 'react';
import { useSnapshot } from "valtio";
import { Table, message, Button, Modal, Select, Input, InputNumber, Form, DatePicker } from 'antd';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import state from '../State/state.js';
import DonationController from '../Services/DonationController';
import CategoryController from '../Services/CategoryController';

const { Search } = Input;

const MyDonations = ({ refresh }) => {
    const [donations, setDonations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortedInfo, setSortedInfo] = useState({})
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [form] = Form.useForm();
    const snap = useSnapshot(state);
    const user = snap.currentUser?._id;

    // Fetch donations
    const fetchDonations = async () => {
        try {
            const data = await DonationController.getUserDonation(user);
            setDonations(data);
            setFilteredData(data)
        } catch (error) {
            console.error("Error fetching user donations:", error);
            message.error("Failed to fetch donations");
        }
    };

    // Fetch categories
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
        fetchDonations();
        fetchCategories();
    }, [refresh]);

    // Handle search
    const handleSearch = (value) => {
        const filteredDonations = donations.filter(donation =>
            donation.name.toLowerCase().includes(value.toLowerCase()) ||
            donation.description.toLowerCase().includes(value.toLowerCase()) ||
            donation.category.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filteredDonations)
    };

    const handleSearchChange = (e) => {
        handleSearch(e.target.value); // Call handleSearch with the input value
      };


    const handleTableChange = (sorter)=> {
        setSortedInfo(sorter)
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('My Donation Report', 14, 10);
        const columns = ['#', 'Name', 'Description', 'Category', 'Qty', 'MFD Date', 'Exf Date'];
    
        const sortedData = [...filteredData].sort((a, b) => {
          if (!sortedInfo.field) return 0;
          let sortOrder = sortedInfo.order === 'ascend' ? 1 : -1;
          let valueA = a[sortedInfo.field];
          let valueB = b[sortedInfo.field];
          return valueA.localeCompare(valueB) * sortOrder;
        });
    
        const rows = sortedData.map((donation, index) => [
          index + 1,
          donation.name,
          donation.description,
          donation.category,
          donation.qty,
          new Date(donation.mfd).toLocaleDateString(),
          new Date(donation.expd).toLocaleDateString(),
          new Date(donation.createdAt).toLocaleDateString(),
        ]);
    
        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 20,
        });
        doc.save('My_Donation_Report.pdf');
      };

    // Handle edit - Show modal
    const handleEdit = (record) => {
        setSelectedItem(record);
        form.setFieldsValue({
            ...record,
            mfd: record.mfd ? moment(record.mfd) : null,
            expd: record.expd ? moment(record.expd) : null,
        });
        setModalVisible(true);
    };

    // Handle modal close
    const handleCancel = () => {
        setModalVisible(false);
        setSelectedItem(null);
        form.resetFields();
    };

    // Handle update
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const updatedData = {
                ...values,
                mfd: values.mfd ? values.mfd.format('YYYY-MM-DD') : null,
                expd: values.expd ? values.expd.format('YYYY-MM-DD') : null,
            };

            await DonationController.updatedonation(selectedItem._id, updatedData);
            message.success("Donation updated successfully");

            fetchDonations();

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error updating donation:", error);
            message.error("Failed to update donation");
        }
    };

    // Handle delete donation
    const handleDeleteItem = async (id) => {
        try {
            await DonationController.deleteDonation(id);
            message.success("Donation deleted successfully");

            fetchDonations();
        } catch (error) {
            console.error("Error deleting donation:", error);
            message.error("Failed to delete donation");
        }
    };

    // Table columns
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => a.description.localeCompare(b.description) },
        { title: 'Category', dataIndex: 'category', key: 'category', sorter: (a, b) => a.category.localeCompare(b.category) },
        { title: 'Qty', dataIndex: 'qty', key: 'qty', sorter: (a, b) => a.qty - b.qty },
        { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd', render: (text) => text ? moment(text).format('YYYY-MM-DD') : '' },
        { title: 'Expiry Date', dataIndex: 'expd', key: 'expd', render: (text) => text ? moment(text).format('YYYY-MM-DD') : '' },
        {
            title: 'Action', key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: 10 }}>
                        Edit
                    </Button>
                    <Button type="primary" danger onClick={() => handleDeleteItem(record._id)}>
                        Delete
                    </Button>
                </>
            )
        }
    ];

    return (
        <div>
        <Search
          placeholder="Search by Donation"
          onChange={handleSearchChange}
          allowClear
          enterButton="Search"
          size="medium"
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
        type='primary'
        style={{
            float:'right'
        }}
        onClick={generatePDF}>
            Genarate PDF
        </Button>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                onChange={handleTableChange}
            />

            {/* Edit Modal */}
            <Modal
                title="Edit Donation"
                open={modalVisible}
                onCancel={handleCancel}
                onOk={handleUpdate}
                okText="Update"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="category" label="Category">
                        <Select>
                            {categories.map(category => (
                                <Select.Option key={category._id} value={category.name}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="qty" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="mfd" label="Manufacturing Date">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="expd" label="Expiry Date">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyDonations;
