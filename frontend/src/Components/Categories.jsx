import React, { useState, useEffect } from 'react';
import { Table, Button, message, Form, Modal, Input, Card, Spin, Row, Col, Popconfirm } from 'antd';
import CategoryController from '../Services/CategoryController';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import state from '../State/state';
import { useSnapshot } from 'valtio';
import PDF_Logo from "../assets/inventory_11000621.png";
import moment from "moment";

const { Search } = Input;

const Categories = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true);
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

  const fetchCategories = async () => {
    setLoading(true);
    const user = snap.currentUser._id;
    try {
      const data = await CategoryController.getAllCategoriesByUser(user);
      setCategories(data);
      setFilteredData(data);
    } catch (error) {
      console.error('error while fetching categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values) => {
    const formatedData = {
      user: snap.currentUser._id,
      ...values
    };
    try {
      if (!selectedItem) {
        await CategoryController.addCategory(formatedData);
      } else {
        await CategoryController.updateCategory(selectedItem._id, formatedData);
      }
      setModalVisible(false);
      message.success('Category saved successfully');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Failed to save item!');
    }
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async (categoryId) => {
    try {
      await CategoryController.deleteCategory(categoryId);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Failed to delete category!');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedItem(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value) => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSearchChange = (e) => {
    handleSearch(e.target.value);
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
        doc.text('Category Report', 14, 10 + imgHeight + 12 + 7); // Adjusted Y position
    
        // Add download date
        doc.setFontSize(10);
        doc.text(`Downloaded on: ${moment().format('YYYY-MM-DD')}`, pageWidth - 14, 15, { align: "right" });

    const columns = ['#', 'Name', 'Description', 'Date'];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;
      let sortOrder = sortedInfo.order === 'ascend' ? 1 : -1;
      let valueA = a[sortedInfo.field];
      let valueB = b[sortedInfo.field];
      return valueA.localeCompare(valueB) * sortOrder;
    });

    const rows = sortedData.map((category, index) => [
      index + 1,
      category.name,
      category.description,
      new Date(category.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 10 + imgHeight + 15 + 7,
    });
    doc.save('Category_Report.pdf');
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Description', dataIndex: 'description', key: 'description', sorter: (a, b) => a.description.localeCompare(b.description) },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
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
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Card
        hoverable
        style={{ width: '100%', height: '663px', background: '#F0F8FF' }}
        title={<h3 style={{ color: '#007FFF' }}>Categories</h3>}
        extra={<Button type='primary' style={{ float: 'right' }} onClick={() => setModalVisible(true)}>+ Add Category</Button>}
      >
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} sm={24} md={12} lg={8}>
            <Search
              placeholder="Search by Category Name"
              onChange={handleSearchChange}
              allowClear
              enterButton="Search"
              size="middle"
              style={{ width: '100%', marginBottom: 20 }}
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

        <Spin spinning={loading} tip="Loading Categories...">
          <Table
            dataSource={filteredData}
            columns={columns}
            onChange={handleTableChange}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>

        <Modal
          title={selectedItem ? 'Edit Category' : 'Add Category'}
          open={modalVisible}
          onCancel={handleCancel}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddCategory(values);
                form.resetFields();
              })
              .catch(() => {
                message.error("Fill all the required fields!");
              });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Category" rules={[{ required: true, message: 'Please enter category name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Categories;