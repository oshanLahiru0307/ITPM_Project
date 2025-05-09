import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, message, Table, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import itemController from '../Services/ItemController';          // import item controller
import categoryController from '../Services/CategoryController';  // Import category controller

const { Option } = Select;

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); // Store available categories
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories(); // Fetch categories when component mounts
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemController.getItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryController.getAllCategories(); // Fetch categories
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddOrUpdateItem = async (values) => {  // adding and updating items and passing message
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
      console.error("Error saving item:", error.response?.data || error);
      message.error(error.response?.data?.error || 'Failed to save item');
    }
  };
  


  const handleEditItem = (record) => {
    setSelectedItem(record);
    form.setFieldsValue({
      ...record,
      mfd: record.mfd ? moment(record.mfd) : null,  // Convert to Moment
      expd: record.expd ? moment(record.expd) : null, // Convert to Moment
    });
    setModalVisible(true);
  };
  

  const handleDeleteItem = async (ItemId)=>{
    try{
      await itemController.deleteItem(ItemId)
      message.success('Item Deleted Successfuly')
    }catch(error){
      console.error('failed to delete item', error)
      message.error("Failed to delete Item")
    }
  }
  

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: ['category', 'name'], key: 'category' },  // Display category name
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Manufacturing Date', dataIndex: 'mfd', key: 'mfd' },
    { title: 'Expiry Date', dataIndex: 'expd', key: 'expd' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: '10px' }} onClick={() => handleEditItem(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDeleteItem(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '10px 20px', backgroundColor: '#F0F8FF', minHeight: '100vh' }}>
      <h1>Items</h1>
      <Button type="primary" style={{ marginBottom: '15px', float: 'right' }} onClick={() => setModalVisible(true)}>
        Add Item
      </Button>

      <Table dataSource={items} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />

      <Modal
        title={selectedItem ? 'Edit Item' : 'Add Item'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedItem(null);
        }}
        onOk={() => {
          form.validateFields()
            .then((values) => {
              handleAddOrUpdateItem(values);
              form.resetFields();
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Item Name" rules={[{ required: true, message: 'Please enter item name' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="qty" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>      

          <Form.Item name="mfd" label="Manufacturing Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="expd"
            label="Expiry Date"     // conditions for expiration date , after manufacutred date
            dependencies={['mfd']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {      //validate the input
                  const mfd = getFieldValue('mfd');
                  if (!value || !mfd || value.isAfter(mfd)) {   // checking conditions
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Expiry date must be after manufacturing date'));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Items;
