import React, { useState, useEffect } from 'react';
import { Button, message, Table, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import itemController from '../Services/ItemController';

const { Option } = Select;

const Items = () => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    try {
      const data = await itemController.getItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrUpdateItem = async (values) => {
    try {
      if (selectedItem) {
        await itemController.updateItem(selectedItem._id, values);
        message.success('Item updated successfully');
      } else {
        await itemController.addItem(values);
        message.success('Item added successfully');
      }
      fetchItems();
      setModalVisible(false);
      form.resetFields();
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      message.error('Failed to save item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemController.deleteItem(itemId);
      message.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error(error);
      message.error('Failed to delete item');
    }
  };

  const handleEditItem = (record) => {
    setSelectedItem(record);
    form.setFieldsValue({
    });
    setModalVisible(true);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
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
    <div>
      <Button type="primary" style={{ margin: '10px' }} onClick={() => setModalVisible(true)}>
        Add Item
      </Button>

      <Table dataSource={items} columns={columns} rowKey="_id" />

      <Modal
        title={selectedItem ? 'Edit Item' : 'Add Item'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedItem(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdateItem}>
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
              <Option value="Food">Food</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Electronics">Electronics</Option>
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
            label="Expiry Date"
            dependencies={['mfd']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const mfd = getFieldValue('mfd');
                  if (!value || !mfd || value.isAfter(mfd)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Expiry date must be after manufacturing date'));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {selectedItem ? 'Update Item' : 'Add Item'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Items;
