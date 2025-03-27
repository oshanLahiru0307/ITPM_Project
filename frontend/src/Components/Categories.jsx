import React, { useState, useEffect } from 'react';
import { Table, Button, message, Form, Modal, Input, Card, Input as AntInput } from 'antd';
import CategoryController from '../Services/CategoryController';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import state from '../State/state';
import { useSnapshot } from 'valtio';

const { Search } = AntInput;

const Categories = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});

  const fetchCategories = async () => {
    const user = snap.currentUser._id;
    try {
      const data = await CategoryController.getAllCategoriesByUser(user);
      setCategories(data);
      setFilteredData(data); // Initialize filtered data
    } catch (error) {
      console.error('error while fetching categories', error);
    }
  };

  const handleAddCategory = async (values) => {
    const formatedData = {
      user:snap.currentUser._id,
      ...values
    }
    try {
      if (!selectedItem) {
        await CategoryController.addCategory(formatedData);
        console.log('data added successfuly!');
      } else {
        await CategoryController.updateCategory(selectedItem._id, formatedData);
        console.log('data updated successfuly');
      }
      setModalVisible(false);
      message.success('Category saved successfuly');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('failed to saved item!');
    }
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await CategoryController.deleteCategory(categoryId);
      message.success('Category deleted successfuly');
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error('Faled to delete Category!');
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Category Report', 14, 10);
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
      startY: 20,
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
          <Button type="primary" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#F0F8FF', minHeight: '100vh' }}>
      <Card hoverable style={{ width: '100%', height: '663px' }} title={<h3 style={{ color: '#007FFF' }}>Categories</h3>}
        extra={<Button type='primary' style={{ float: 'right' }} onClick={() => { setModalVisible(true) }}>+ Add Category</Button>}>

        <Search
          placeholder="Search by Category Name"
          onSearch={handleSearch}
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
        <Table dataSource={filteredData} columns={columns} onChange={handleTableChange} />
        <Modal title={selectedItem ? 'Edit Item' : 'Add Item'} open={modalVisible} onCancel={handleCancel} onOk={() => { form.validateFields().then((values) => { handleAddCategory(values); form.resetFields(); }).catch((info) => { console.log('Validate Failed:', info); message.error("fill all the rquired fields!.")}); }}>
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