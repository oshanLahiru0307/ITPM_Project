import React, { useState, useEffect } from "react";
import UserController from "../Services/UserController";
import { Button, Form, message, Modal, Table, Input, Card, Row, Col, Spin } from 'antd';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Search } = Input;

const UserDetails = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);


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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserController.getAllUsers();
      setUsers(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data.');
    } finally {
      setLoading(false);
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
      fetchUsers();
    } catch (error) {
      console.error("Error Adding User", error);
      message.error("Failed To Add User");
    }
  };

  const deleteUser = async (record) => {
    try {
      await UserController.deleteUser(record._id);
      message.success("User Deleted Successfully");
      fetchUsers();
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
    doc.text("User Report", 14, 10);
    const columns = ["#", "Name", "Email", "Phone", "Address"];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;
      let sortOrder = sortedInfo.order === "ascend" ? 1 : -1;
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
    doc.save("User_Report.pdf");
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
  ];

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
        style={{ width: "100%", height: "663px" }}
        title={<h3 style={{ color: "#007FFF" }}>All Users</h3>}
      >
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={24} md={12} lg={8}>
            <Search
              placeholder="Search by Name, Email, Phone, or Address"
              onChange={handleSearchChange}
              allowClear
              enterButton="Search"
              size="middle"
              style={{ width: "100%", marginBottom: 20 }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={4}>
            <Button
              type="primary"
              onClick={generatePDF}
              block={isMobile || isTablet}
              style={{
                float: isMobile || isTablet ? "none" : "right",
                width: isMobile || isTablet ? "100%" : "auto",
                marginBottom: 20
              }}
            >
              Generate PDF
            </Button>
          </Col>
        </Row>
        <Spin spinning={loading} tip="Loading Users...">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
</Spin>
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
                {
                  min: 10,
                  message: "Phone number must be at least 10 characters!",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Enter your Phone Number"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please enter your Address!" },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Enter your Address"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default UserDetails;
