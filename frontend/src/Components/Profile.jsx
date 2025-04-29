<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Modal, message } from 'antd';
import UserController from '../Services/UserController';
import state from '../State/state';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const snap = useSnapshot(state)
  const navigate = useNavigate()
=======
import React, { useState, useEffect } from "react";
import { Card, Button, Form, Input, Modal, message } from "antd";
import UserController from "../Services/UserController";
import state from "../State/state";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
>>>>>>> e0c6a02b5d36635b868b2924238b5ad05429cb15
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [satisfactionModalVisible, setSatisfactionModalVisible] =
    useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);
  const defaultProfilePic =
    "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png";

  useEffect(() => {
<<<<<<< HEAD
    const storedUser = snap.currentUser
=======
    const storedUser =
      JSON.parse(localStorage.getItem("user")) || state.currentUser;
>>>>>>> e0c6a02b5d36635b868b2924238b5ad05429cb15
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
      const updatedUser = {
        ...user,
        ...values,
        picture: previewImage || user?.picture,
      };
      await UserController.updateUser(user._id, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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

  const deleteUser = async () => {
    try {
      await UserController.deleteUser(user._id);
      message.success("User Deleted Successfully");
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Remove user from local storage
      setUser(null); // Clear the state
      setDeleteModalVisible(false);
      navigate("/"); // Redirect after deletion
    } catch (error) {
      console.error("Error while deleting", error);
      message.error("Failed to delete account");
    }
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F0F8FF",
        minHeight: "100vh",
      }}
    >
      <Card
        hoverable
        style={{ width: "100%", minHeight: "663px" }}
        title={<h3 style={{ color: "#007FFF" }}>User Profile</h3>}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#2b6cb0",
              height: "120px",
              position: "relative",
              padding: "20px",
            }}
          >
            <h1
              style={{
                color: "#fff",
                fontSize: "30px",
                fontWeight: "bold",
                marginTop: "40px",
                marginLeft: "170px",
              }}
            >
              {user.name}
            </h1>
            <img
              src={user.picture || defaultProfilePic}
              alt="User"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                border: "5px solid #fff",
                position: "absolute",
                top: "20px",
                left: "30px",
                objectFit: "cover",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div style={{ display: "flex", padding: "30px" }}>
            <div
              style={{
                width: "25%",
                backgroundColor: "#eee",
                padding: "20px",
                borderRadius: "10px",
                marginRight: "30px",
              }}
            >
              <h3>About Us:</h3>
              <hr />
              <p>
                Welcome to our platform! We are committed to providing you with
                seamless experiences for your holiday and travel needs. Our
                mission is to connect users with the best destinations, offering
                personalized support and user-friendly features to make your
                journey unforgettable.
              </p>
            </div>

            <div
              style={{
                flex: 1,
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <p>
                <strong>User Name:</strong> {user.name}
              </p>
              <hr />
              <p>
                <strong>Email Address:</strong> {user.email}
              </p>
              <hr />
              <p>
                <strong>Mobile Number:</strong> {user.phone || "Add number"}
              </p>
              <hr />
              <p>
                <strong>Address:</strong> {user.address || "Add address"}
              </p>
              <hr />

              <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
                <Button type="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setDeleteModalVisible(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
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
          <Form.Item label="Profile Picture">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage || defaultProfilePic}
                alt="Preview"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginTop: "10px",
                }}
              />
            )}
          </Form.Item>
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
              { required: true, message: "Please enter your Phone Number!" },
              {
                min: 10,
                message: "Phone number must be at least 10 characters!",
              },
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

      {/* Confirm Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        // onOk={deleteUser}

        onOk={() => {
          deleteUser("user");
          state.currentUser = null;
          message.success("Account deleted successfully!");
          setDeleteModalVisible(false);
          window.location.replace("/");
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
