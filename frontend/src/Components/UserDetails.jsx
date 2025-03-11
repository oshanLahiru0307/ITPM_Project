import React, { useState, useEffect } from 'react';
import UserController from '../Services/UserController';
import { Button, Form, message, Modal, Table, Input, Card } from 'antd';

const UserDetails = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const users = await UserController.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching data', error);
      message.error("Failed To load datar");
    }
  };

  const handleaddUser = async (values) => {
    try {
      if (!selectedItem) {
        await UserController.addUser(values);
        message.success("User Added Successfully");
      } else {
        await UserController.updateUser(selectedItem._id, values);
        message.success("User Updated Successfully");
      }
      setModalVisible(false);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error Adding User", error);
      message.error("Failed To Add User");
    }
  };

  const deleteUser = async (record) => {
    try {
      await UserController.deleteUser(record._id);
      message.success('User Deleted Successfully');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error while deleting", error);
      message.error("Failed to Delete");
    }
  };

  const edit = (record) => {
    setSelectedItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleCancle = () => {
    setModalVisible(false)
    form.resetFields()
    setSelectedItem(null)
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="primary" onClick={() => edit(record)}
            style={{
              marginRight: '10px'
            }}>Edit</Button>
          <Button type="primary" danger onClick={() => deleteUser(record)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{
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
          }}>Users</h3>}
      >
        <Table dataSource={users} columns={columns} rowKey="_id" />

        <Modal
          title={selectedItem ? "Edit User" : "Add User"}
          open={modalVisible}
          onCancel={handleCancle}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleaddUser(values);
                form.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>


            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please enter your Phone Number!" },
                { min: 10, message: "Phone number must be at least 10 characters!" },
              ]}
            >
              <Input style={{ width: "100%" }}
                placeholder="Enter your Phone Number" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter your Address!" },
              ]}
            >
              <Input style={{ width: "100%" }}
                placeholder="Enter your Address" />
            </Form.Item>

          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserDetails;
