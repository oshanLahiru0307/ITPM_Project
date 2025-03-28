import React, { useState, useEffect } from 'react';
import UserController from '../Services/UserController';
import { Button, Form, message, Modal, Table, Input, Card } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Search } = Input;

const UserDetails = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

  const fetchUsers = async () => {
    try {
      const data = await UserController.getAllUsers();
      setUsers(data);
      setFilteredData(data); // Initialize filtered data
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data.');
    }
  };

  const handleaddUser = async (values) => {
    try {
      if (!selectedItem) {
        await UserController.addUser(values);
        message.success('User Added Successfully');
      } else {
        await UserController.updateUser(selectedItem._id, values);
        message.success('User Updated Successfully');
      }
      setModalVisible(false);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error Adding User', error);
      message.error('Failed To Add User');
    }
  };

  const deleteUser = async (record) => {
    try {
      await UserController.deleteUser(record._id);
      message.success('User Deleted Successfully');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error while deleting', error);
      message.error('Failed to Delete');
    }
  };

  const edit = (record) => {
    setSelectedItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleCancle = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedItem(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.address.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('User Report', 14, 10);
    const columns = ['#', 'Name', 'Email', 'Phone', 'Address'];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;
      let sortOrder = sortedInfo.order === 'ascend' ? 1 : -1;
      let valueA = a[sortedInfo.field];
      let valueB = b[sortedInfo.field];
      return valueA.localeCompare(valueB) * sortOrder;
    });

    const rows = sortedData.map((user, index) => [
      index + 1,
      user.name,
      user.email,
      user.phone,
      user.address,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });
    doc.save('User_Report.pdf');
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', sorter: (a, b) => a.phone.localeCompare(b.phone) },
    { title: 'Address', dataIndex: 'address', key: 'address', sorter: (a, b) => a.address.localeCompare(b.address) }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#F0F8FF', minHeight: '100vh' }}>
      <Card hoverable style={{ width: '100%', height: '663px' }} title={<h3 style={{ color: '#007FFF' }}>All Users</h3>}>
        <Search
          placeholder="Search by Name, Email, Phone, or Address"
          onChange={handleSearchChange}
          allowClear
          enterButton="Search"
          size="medium"
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={generatePDF}
          style={{ marginLeft: 10, marginBottom: 20, float: 'right' }}
        >
          Generate PDF
        </Button>
        <Table dataSource={filteredData} columns={columns} rowKey="_id" onChange={handleTableChange} />

        <Modal title={selectedItem ? 'Edit User' : 'Add User'} open={modalVisible} onCancel={handleCancle} onOk={() => { form.validateFields().then((values) => { handleaddUser(values); form.resetFields(); }).catch((info) => { console.log('Validate Failed:', info); }); }}>
          <Form form={form} layout="vertical">
            <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
              <Input placeholder="Enter your full name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Invalid email format!' }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter your Phone Number!' }, { min: 10, message: 'Phone number must be at least 10 characters!' }]}>
              <Input style={{ width: '100%' }} placeholder="Enter your Phone Number" />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter your Address!' }]}>
              <Input style={{ width: '100%' }} placeholder="Enter your Address" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserDetails;