import React, { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import {
  Table,
  message,
  Button,
  Spin,
  Modal,
  Select,
  Input,
  InputNumber,
  Form,
  DatePicker,
  Row,
  Col,
  Popconfirm, // Import Popconfirm
} from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import state from "../State/state.js";
import DonationController from "../Services/DonationController";
import CategoryController from "../Services/CategoryController";
import PDF_Logo from "../assets/inventory_11000621.png";
const { Search } = Input;

const MyDonations = ({ refresh }) => {
  const [donations, setDonations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const snap = useSnapshot(state);
  const user = snap.currentUser?._id;
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const data = await DonationController.getUserDonation(user);
      setDonations(data);
      setFilteredData(data);
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
      console.error("Error fetching categories:", error);
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
    const filteredDonations = donations.filter(
      (donation) =>
        donation.name.toLowerCase().includes(value.toLowerCase()) ||
        donation.description.toLowerCase().includes(value.toLowerCase()) ||
        donation.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filteredDonations);
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value); // Call handleSearch with the input value
  };

  const handleTableChange = (sorter) => {
    setSortedInfo(sorter);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // <--- PASTE YOUR BASE64 STRING HERE

    // Add logo
    const imgWidth = 30;
    // You might need to adjust the height based on your logo's aspect ratio
    const imgHeight = 15;
    const imgX = (pageWidth - imgWidth) / 2; // Center horizontally
    doc.addImage(PDF_Logo, 'PNG', imgX, 10, imgWidth, imgHeight);

    // Add title
    const title = 'Home Stock';
    doc.setFontSize(18);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2; // Center horizontally
    doc.text(title, titleX, 10 + imgHeight + 5);

    // Add subtitle
    doc.setFontSize(14);
    doc.text('My Donation Report', 14, 10 + imgHeight + 12 + 7); // Adjusted Y position

    // Add download date
    doc.setFontSize(10);
    doc.text(`Downloaded on: ${moment().format('YYYY-MM-DD')}`, pageWidth - 14, 15, { align: "right" });

    const columns = [
      "#",
      "Name",
      "Description",
      "Category",
      "Qty",
      "MFD Date",
      "Exf Date",
    ];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;
      let sortOrder = sortedInfo.order === "ascend" ? 1 : -1;
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
      donation.mfd ? new Date(donation.mfd).toLocaleDateString() : "",
      donation.expd ? new Date(donation.expd).toLocaleDateString() : "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 10 + imgHeight + 15 + 7,
    });
    doc.save("My_Donation_Report.pdf");
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
        mfd: values.mfd ? values.mfd.format("YYYY-MM-DD") : null,
        expd: values.expd ? values.expd.format("YYYY-MM-DD") : null,
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

  // Handle delete donation with Popconfirm
  const handleDeleteConfirm = async (id) => {
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
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: "Manufacturing Date",
      dataIndex: "mfd",
      key: "mfd",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Expiry Date",
      dataIndex: "expd",
      key: "expd",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this donation?"
            onConfirm={() => handleDeleteConfirm(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <Search
            placeholder="Search by Donation"
            onChange={handleSearchChange}
            allowClear
            enterButton="Search"
            size="medium"
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
              marginBottom: 20,
            }}
          >
            Genarate PDF
          </Button>
        </Col>
      </Row>

      <Spin spinning={loading} tip="Loading donations...">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      </Spin>

      {/* Edit Modal */}
      <Modal
        title="Edit Donation"
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleUpdate}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select>
              {categories.map((category) => (
                <Select.Option key={category._id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="qty"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
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