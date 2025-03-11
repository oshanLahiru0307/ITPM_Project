import React, { useState, useEffect } from 'react';
import { useSnapshot } from "valtio";
import { Table, message, Button, Modal, Select, Input, InputNumber, Form, DatePicker } from 'antd';
import moment from 'moment'; // Import Moment.js for date conversion
import state from '../State/state.js';
import DonationController from '../Services/DonationController';
import CategoryController from '../Services/CategoryController';

const { Option } = Select;

const MyDonations = () => {

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Qty', dataIndex: 'qty', key: 'qty' },
        { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
        { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
        {
            title: 'Action', key: 'action',
            render: (_, record) => (
                <span>
                    <Button type='primary' danger
                        style={{ marginRight: '10px' }}
                        onClick={() => handleDeleteItem(record._id)}>
                        Delete
                    </Button>
                    <Button type='primary' onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                </span>
            )
        }
    ];

    const [donations, setDonations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
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
    }, []);

    // Handle opening edit modal and setting form fields
    const handleEdit = (values) => {
        setSelectedItem(values);
        form.setFieldsValue({
            ...values,
            mfd: values.mfd ? moment(values.mfd) : null, // Convert to Moment.js
            expd: values.expd ? moment(values.expd) : null, // Convert to Moment.js
        });
        setModalVisible(true);
    };

    // Handle donation update
    const handleEditDonation = async (values) => {
        if (selectedItem) {
            try {
                if (!user) {
                    message.error("User not logged in");
                    return;
                }

                const formattedValues = {
                    ...values,
                    user: user, // Attach logged-in user
                    mfd: values.mfd ? values.mfd.format('YYYY-MM-DD') : null, // Convert back to string
                    expd: values.expd ? values.expd.format('YYYY-MM-DD') : null, // Convert back to string
                };

                console.log("Submitting Data:", formattedValues);

                await DonationController.updatedonation(selectedItem._id, formattedValues);
                setModalVisible(false);
                form.resetFields();
                message.success('Donation updated successfully');
                fetchDonation(); // Refresh data
            } catch (error) {
                console.error('Error while updating donation:', error);
                message.error('Failed to update donation');
            }
        } else {
            console.error('No item selected for editing');
        }
    };

    // Handle delete...
    const handleDeleteItem = async (id) => {
        try {
            await DonationController.deleteDonation(id);
            message.success("Donation deleted successfully");
            setDonations((prevDonations) => prevDonations.filter(donation => donation._id !== id));
        } catch (error) {
            console.error("Error deleting donation:", error);
            message.error("Failed to delete donation");
        }
    }

    return (
        <div>
            <Table dataSource={donations} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }}/>

            <Modal
                title="Edit Donation"
                open={modalVisible}
                onCancel={() => { setModalVisible(false); form.resetFields(); }}
                onOk={() => {
                    form.validateFields()
                        .then(values => handleEditDonation(values))
                        .catch(error => console.log("Validation Failed:", error));
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select placeholder="Select a category">
                            {categories.map((category) => (
                                <Option key={category._id} value={category.name}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="qty" label="Quantity" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="mfd" label="Manufacture Date">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="expd" label="Expiry Date">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyDonations;
