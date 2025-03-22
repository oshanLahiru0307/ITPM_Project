import React from 'react'
import { useState, useEffect } from 'react'
import { Table, Button, message, Form, Modal, Input, Card } from 'antd'
import CategoryController from '../Services/CategoryController'

const AdminCategories = () => {

  const [form] = Form.useForm()
  const [categories, SetCategories] = useState([])
  const [selectedItem, SetselectedItem] = useState()
  const [modalVisible, SetmodalVisible] = useState(false)

  const fetchCategories = async () => {
    try {
      const data = await CategoryController.getAllCategories()
      SetCategories(data)
    } catch (error) {
      console.error('error while fetching categories', error)
    }
  }

  const handleAddCategory = async (values) => {

    try {
      if (!selectedItem) {
        await CategoryController.addCategory(values)
        console.log("data added successfuly!")

      } else {
        await CategoryController.updateCategory(selectedItem._id, values)
        console.log('data updated successfuly')
      }
      SetmodalVisible(false)
      message.success('Category  saved successfuly')
      fetchCategories()
    } catch (error) {
      console.error(error)
      message.error('failed to saved item!')
    }
  }

  const handleEdit = (record) => {
    SetselectedItem(record)
    form.setFieldsValue(record)
    SetmodalVisible(true)
  }

  const handleDelete = async (categoryId) => {
    try {
      await CategoryController.deleteCategory(categoryId)
      message.success("Category deleted successfuly")
      fetchCategories()
    } catch (error) {
      console.error(error)
      message.error("Faled to delete Category!")
    }
  }

  const handleCancle = () => {
    SetmodalVisible(false);
    form.resetFields();
    SetselectedItem(null);
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Date', dataIndex: 'createdAt', key: 'date' },
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
    }
  ]

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}>
      <Card
        hoverable={true}
        style={{
          width: '100%',
          height: '663px',
        }}
        title={<h3
          style={{
            color: '#007FFF'
          }}>Categories</h3>}

        extra={<Button type='primary'
          style={{
            float: 'right'
          }}

          onClick={() => {
            SetmodalVisible(true)
          }}>+ Add Category</Button>}>



        <Table dataSource={categories} columns={columns} />
        <Modal
          title={selectedItem ? 'Edit Item' : 'Add Item'}
          open={modalVisible}
          onCancel={handleCancle}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleAddCategory(values);
                form.resetFields();
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          <Form form={form} layout="vertical" >
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
  )
}

export default AdminCategories
