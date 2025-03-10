import React from 'react'
import { useSnapshot } from 'valtio'
import { useState,useEffect } from 'react'
import { Card,Button, Modal, Form, Input, InputNumber, DatePicker, Select,message} from 'antd'
import AllDonation from '../Views/AllDonation'
import MyDonations from '../Views/MyDonations';
import CategoryController from '../Services/CategoryController';
import DonationController from '../Services/DonationController';
import state from '../State/state';
const { Option } = Select;

const tabList = [
  {
    key: 'MyDonations',
    tab: 'My Donations',
  },
  {
    key: 'AllDonations',
    tab: 'All Donations',
  },
];
const contentList = {
  MyDonations: <MyDonations/>,
  AllDonations: <AllDonation />,
};


const Donation = () => {

  const [activeTabKey1, setActiveTabKey1] = useState('MyDonations');
  const [item, setItem] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const snap = useSnapshot(state);
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  const fetchCategories = async ()=> {
      try{
        const data = await CategoryController.getAllCategories();
        setCategories(data);
      }catch(error){
        console.error('Error fetching categories:', error)
      }
  }

  const fetchItems = async ()=> {
    try{
      const data = await DonationController.getDonation();
      setItem(data);
      snap.donations = item;
    }catch(error){
      console.error('Error fetching items:', error)
    }
  }

  const handleAddOrUpdateItem = async (values) => {
    try {
      const formattedValues = {
        user: snap.currentUser._id,
        ...values,
        mfd: values.mfd ? values.mfd.format('YYYY-MM-DD') : null,
        expd: values.expd ? values.expd.format('YYYY-MM-DD') : null,
      };
      await DonationController.addDonation(formattedValues);
      message.success('Item donate successfully');
      fetchItems();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving item:", error.response?.data || error);
      message.error(error.response?.data?.error || 'Failed to save item');
    }
  };

  useEffect(()=> {
    fetchCategories();
    fetchItems()
  },)

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}>
      <Card
        hoverable={true}
        extra={
          <Button type="primary" style={{ float: 'right' }} onClick={()=> {
            setModalVisible(true)
          }}>
          + Add Donation
        </Button>
        }
        style={{
          width: '100%',
          height: '663px',
        }}
        title={<h3
          style={{
            color: '#007FFF'
          }}>Donation</h3>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
      
      <Modal
          title={'Add Donation'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
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
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
          </Form>
        </Modal>
      
    </div>
  )
}

export default Donation
