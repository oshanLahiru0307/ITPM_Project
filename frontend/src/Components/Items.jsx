import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, message, Table, Modal, Form, Input, InputNumber, DatePicker, Select, Card } from 'antd';
import { EditOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons'; // Import icons
import itemController from '../Services/ItemController';
import categoryController from '../Services/CategoryController';
import DonationController from '../Services/DonationController';
import state from '../State/state';
import { useSnapshot } from 'valtio';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Option } = Select;
const { Search } = Input;


const Items = () => {
  const snap = useSnapshot(state);
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [donateModalVisible, setDonateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const [donateForm] = Form.useForm();



  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);


  const fetchItems = async () => {
    try {
      const data = await itemController.getItems();
      setItems(data);
      setFilteredData(data);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchCategories = async () => {
    try {
      const data = await categoryController.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handleAddOrUpdateItem = async (values) => {
    try {
      const formattedValues = {
        ...values,
        mfd: values.mfd ? values.mfd.format('YYYY-MM-DD') : null,
        expd: values.expd ? values.expd.format('YYYY-MM-DD') : null,
      };


      if (selectedItem) {
        await itemController.updateItem(selectedItem._id, formattedValues);
        message.success('Item updated successfully');
      } else {
        await itemController.addItem(formattedValues);
        message.success('Item added successfully');
      }


      fetchItems();
      setModalVisible(false);
      form.resetFields();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving item:', error.response?.data || error);
      message.error(error.response?.data?.error || 'Failed to save item');
    }
  };



  const handleEditItem = (record) => {
    setSelectedItem(record);
    form.setFieldsValue({
      ...record,
      mfd: record.mfd ? moment(record.mfd) : null,
      expd: record.expd ? moment(record.expd) : null,
    });
    setModalVisible(true);
  };



  const handleDeleteItem = async (ItemId) => {
    try {
      await itemController.deleteItem(ItemId);
      message.success('Item Deleted Successfully');
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item', error);
      message.error('Failed to delete Item');
    }
  };


  const handleDonateItem = (record) => {
    setSelectedItem(record);
    donateForm.setFieldsValue({
      qty: 1, // Default quantity to 1
    });
    setDonateModalVisible(true);
  };



  const handleDonateSubmit = async (values) => {
    try {
      const donationData = {
        user: snap.currentUser._id, // Pass current user ID
        ...selectedItem,
        qty: values.qty,
      };

      await DonationController.addDonation(donationData);
      message.success('Item donated successfully');
      setDonateModalVisible(false);
      donateForm.resetFields();
      fetchItems();
    } catch (error) {
      console.error('Error donating item:', error);
      message.error('Failed to donate item');
    }
  };

  const handleSearch = (value) => {
    const filtered = items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Item Report', 14, 10);
    const columns = ['#', 'Name', 'Description', 'Price', 'Category', 'Qty', 'Mfg Date', 'Exp Date'];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;

      let sortOrder = sortedInfo.order === 'ascend' ? 1 : -1;
      let valueA = a[sortedInfo.field];
      let valueB = b[sortedInfo.field];

      if (sortedInfo.field === 'price' || sortedInfo.field === 'qty') {
        return (valueA - valueB) * sortOrder;
      } else if (sortedInfo.field === 'mfd' || sortedInfo.field === 'expd') {
        return (new Date(valueA) - new Date(valueB)) * sortOrder;
      } else {
        return valueA.localeCompare(valueB) * sortOrder;
      }
    });

    const rows = sortedData.map((item, index) => [
      index + 1,
      item.name,
      item.description,
      item.price,
      item.category,
      item.qty,
      new Date(item.mfd).toLocaleDateString(),
      new Date(item.expd).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });
    doc.save('Item_Report.pdf');
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: 'Name', dataIndex: 'name', key: 'name',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
    },
    {
      title: 'Description', dataIndex: 'description', key: 'description',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
    },
    {
      title: 'Price', dataIndex: 'price', key: 'price',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
    },
    {
      title: 'Category', dataIndex: 'category', key: 'category',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
    },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    {
      title: 'Manufacturing Date',
      dataIndex: 'mfd',
      key: 'mfd',
      sorter: (a, b) => moment(a.mfd).isBefore(moment(b.mfd)) ? -1 : 1,
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expd',
      key: 'expd',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: 'Added Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => moment(a.expd).isBefore(moment(b.expd)) ? -1 : 1,
      render: (text) => text ? moment(text).format('YYYY-MM-DD') : ''
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: '5px' }} onClick={() => handleEditItem(record)}>
            Edit
          </Button>
          <Button type="primary" danger style={{ marginRight: '5px' }} onClick={() => handleDeleteItem(record._id)}>
            Delete
          </Button>
          <Button type="primary" style={{ background: '#5CD85A' }} onClick={() => handleDonateItem(record)}>
            <GiftOutlined />
          </Button>
        </>
      ),
    },
  ];


  return (
    <div style={{ padding: '20px', backgroundColor: '#F0F8FF', minHeight: '100vh' }}>
      <Card
        hoverable
        style={{ width: '100%', height: '663px' }}
        title={<h3 style={{ color: '#007FFF' }}>Items</h3>}
        extra={<Button type="primary" onClick={() => setModalVisible(true)}>+ Add Item</Button>}
      >        <Search
          placeholder="Search by Item Name"
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
        <Table dataSource={filteredData} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />
        {/* Add/Edit Modal */}
        <Modal
          title={selectedItem ? 'Edit Item' : 'Add Item'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setSelectedItem(null);
          }}
          onOk={() => {
            form.validateFields().then((values) => {
              handleAddOrUpdateItem(values);
              form.resetFields();
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select placeholder="Select a category">
                {categories.map((category) => (
                  <Option key={category._id} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="qty" label="Quantity" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="mfd" label="Manufacture Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="expd" label="Expire Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Donate Modal */}
        <Modal
          title="Donate Item"
          open={donateModalVisible}
          onCancel={() => {
            setDonateModalVisible(false);
            donateForm.resetFields();
            setSelectedItem(null);
          }}
          onOk={() => {
            donateForm.validateFields().then((values) => {
              handleDonateSubmit(values);
              donateForm.resetFields();
            });
          }}
        >
          <Form form={donateForm} layout="vertical">
            <Form.Item name="qty" label="Quantity to Donate" rules={[{ required: true }]}>
              <InputNumber min={1} max={selectedItem?.qty || 1} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>

  );

}



export default Items