import React, { useState } from 'react';
import { Card, Button, Form, Input, Modal, message } from 'antd';

const Profile = () => {
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [user, setUser] = useState({
    picture: 'https://www.example.com/user-picture.jpg', // Replace with actual user picture URL
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    address: '123 Main Street, City, Country'
  });

  const handleEdit = () => {
    form.setFieldsValue(user);
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setUser(values);
      setEditModalVisible(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    message.success("Account deleted successfully!");
    setDeleteModalVisible(false);
    // Here, you can call an API to delete the account.
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}
    >
      <Card
        hoverable={true}
        title={
          <h3
            style={{
              color: '#007FFF'
            }}
          >
            Profile
          </h3>
        }
        style={{
          height: '663px'
        }}
      >
        <div>
          <Card
            style={{
              width: 400,
              textAlign: 'center',
              margin: 'auto',
              padding: '20px'
            }}
          >
            <img
              src={user.picture}
              alt="User"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                marginBottom: '20px'
              }}
            />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.address}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button type="primary" onClick={handleEdit}>Edit Profile</Button>
              <Button type="primary" danger onClick={handleDelete}>Delete Account</Button>
            </div>
          </Card>

          {/* Edit Profile Modal */}
          <Modal
            title="Edit Profile"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onOk={handleSave}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number!" },
                  { min: 10, message: "Phone number must be at least 10 characters!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter your address!" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Confirm Delete"
            open={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onOk={confirmDelete}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete your account?</p>
          </Modal>
        </div>
      </Card>
    </div>
  );
};

export default Profile;