import React, { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
} from "antd";
import AllDonation from "../Views/AllDonation";
import MyDonations from "../Views/MyDonations";
import CategoryController from "../Services/CategoryController";
import DonationController from "../Services/DonationController";
import state from "../State/state.js";
import dayjs from "dayjs";

const { Option } = Select;

const tabList = [
  { key: "MyDonations", tab: "My Donations" },
  { key: "AllDonations", tab: "All Donations" },
];

const Donation = () => {
  const snap = useSnapshot(state);
  const currentUser = snap.currentUser?._id; // Get current user ID

  const [activeTabKey1, setActiveTabKey1] = useState("MyDonations");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false); 

  const onTab1Change = (key) => setActiveTabKey1(key);

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const data = await CategoryController.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleAddDonation = async (values) => {
    try {
      if (!currentUser) {
        message.error("User not logged in");
        return;
      }

      const formattedValues = {
        ...values,
        user: currentUser, // Attach logged-in user
        mfd: values.mfd ? values.mfd.format("YYYY-MM-DD") : null,
        expd: values.expd ? values.expd.format("YYYY-MM-DD") : null,
      };

      await DonationController.addDonation(formattedValues);
      message.success("Donation added successfully");

      setModalVisible(false);
      form.resetFields();
      setRefresh((prev) => !prev); // Trigger re-fetch in child components
    } catch (error) {
      console.error("Error adding donation:", error);
      message.error("Failed to add donation");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Card
        hoverable
        extra={
          <Button type="primary" onClick={() => setModalVisible(true)}>
            + Add Donation
          </Button>
        }
        style={{ width: "100%", minHeight: "663px", background:'#F0F8FF' }}
        title={<h3 style={{ color: "#007FFF" }}>Donation</h3>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {activeTabKey1 === "MyDonations" ? <MyDonations refresh={refresh} /> : <AllDonation refresh={refresh} />}
      </Card>

      {/* Add Donation Modal */}
      <Modal
        title="Add Donation"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleAddDonation(values))
            .catch((errorInfo) => console.error("Validation Failed:", errorInfo));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Item Name"
            rules={[
              { required: true, message: "Item name is required" },
              { min: 3, message: "Item name must be at least 3 characters long" },
            ]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Description is required" },
              { min: 10, message: "Description must be at least 10 characters long" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Price is required" },
              { type: "number", min: 1, message: "Price must be greater than zero" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Option key={category._id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="qty"
            label="Quantity"
            rules={[
              { required: true, message: "Quantity is required" },
              { type: "number", min: 1, message: "Quantity must be at least 1" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter quantity" />
          </Form.Item>

          <Form.Item
            name="mfd"
            label="Manufacture Date"
            rules={[
              { required: true, message: "Manufacturing date is required" },
              {
                validator: (_, value) =>
                  value && value.isBefore(dayjs()) ? Promise.resolve() : Promise.reject("Date must be in the past"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select manufacturing date" />
          </Form.Item>

          <Form.Item
            name="expd"
            label="Expiry Date"
            rules={[
              { required: true, message: "Expiry date is required" },
              {
                validator: (_, value) =>
                  value && value.isAfter(dayjs()) ? Promise.resolve() : Promise.reject("Date must be in the future"),
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select expiry date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Donation;
