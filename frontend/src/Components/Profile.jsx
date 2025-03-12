import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Modal, message } from 'antd';
import UserController from '../Services/UserController';
import state from '../State/state';

const Profile = () => {
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || state.currentUser;
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleEdit = () => {
    form.setFieldsValue(user);
    setEditModalVisible(true);
    setPreviewImage(user?.picture);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...user, ...values, picture: previewImage || user?.picture };
      await UserController.updateUser(user._id, updatedUser);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      state.currentUser = updatedUser;
      setEditModalVisible(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      message.error("Failed to update profile");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#F0F8FF', minHeight: '100vh' }}>
      <Card hoverable style={{ width: '100%', minHeight: '663px' }} title={<h3 style={{ color: '#007FFF' }}>User Profile</h3>}>
        <Card style={{ width: '50vw', padding: '20px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={user.picture} alt="User" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <hr style={{ margin: '15px 0' }} />
          <div style={{ marginTop: '50px' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>User Name:</strong> <span>{user.name || 'Add name'}</span></p>
            <hr style={{ margin: '10px 0', border: '0', height: '1px', backgroundColor: '#ddd', opacity: '0.5' }} />
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Email Address:</strong> <span>{user.email || 'Add email'}</span></p>
            <hr style={{ margin: '10px 0', border: '0', height: '1px', backgroundColor: '#ddd', opacity: '0.5' }} />
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Mobile Number:</strong> <span>{user.phone || 'Add number'}</span></p>
            <hr style={{ margin: '10px 0', border: '0', height: '1px', backgroundColor: '#ddd', opacity: '0.5' }} />
            <p style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Address:</strong> <span>{user.address || 'Add address'}</span></p>
            <hr style={{ margin: '10px 0', border: '0', height: '1px', backgroundColor: '#ddd', opacity: '0.5' }} />

          </div>
          <div style={{ marginTop: '80px', display: 'flex', gap: '20px' }}>
            <Button type="primary" onClick={handleEdit}>Edit Profile</Button>
            <Button type="primary" danger onClick={() => setDeleteModalVisible(true)}>Delete Account</Button>
          </div>
        </Card>
      </Card>

      <Modal title="Edit Profile" open={editModalVisible} onCancel={() => setEditModalVisible(false)} onOk={handleSave}>
        <Form form={form} layout="vertical">
          <Form.Item label="Profile Picture">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img src={previewImage} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', marginTop: '10px' }} />
            )}
          </Form.Item>
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email format!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone number!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={() => {
          localStorage.removeItem('user'); // Remove user from storage
          state.currentUser = null;
          message.success("Account deleted successfully!");
          setDeleteModalVisible(false);
          window.location.replace('/'); 
        }}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete your account?</p>
      </Modal>

    </div>
  );
};

export default Profile;
