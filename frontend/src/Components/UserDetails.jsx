import React, { useState, useEffect } from 'react';
import UserController from '../Services/UserController';
import { Button, Form, message, Modal, Table, Input} from 'antd';

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

  const addUser = async (values) => {
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
          <Button type="primary" onClick={() => edit(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => deleteUser(record)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)} style={{
        margin:"15px"
      }}>Add User</Button>
      <Table dataSource={users} columns={columns} rowKey="_id" />

      <Modal
        title={selectedItem ? "Edit User" : "Add User"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then( (values) => {
              form.resetFields()
              addUser(values)
            })
            .catch((info)=> {
              console.log("Validation Failed:", info)
            })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            lable="Name"
            rule = {[{
              require:true, message: "Please enter notice title"
            }]}>
              <Input.TextArea rows = {4}/>
            </Form.Item>
            <Form.Item
            name="name"
            lable="Name"
            rule = {[{
              require:true, message: "Please enter notice title"
            }]}>
              <Input.TextArea rows = {4}/>
            </Form.Item>
            <Form.Item
            name="name"
            lable="Name"
            rule = {[{
              require:true, message: "Please enter notice title"
            }]}>
              <Input.TextArea rows = {4}/>
            </Form.Item>
            <Form.Item
            name="name"
            lable="Name"
            rule = {[{
              require:true, message: "Please enter notice title"
            }]}>
              <Input.TextArea rows = {4}/>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetails;
