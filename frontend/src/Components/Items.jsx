import React from 'react'
import { useState, useEffect } from 'react'
import {Button, message, Table, Modal} from 'antd'

import itemController from '../Services/ItemController'
import Title from 'antd/es/skeleton/Title'

const Items = () => {
  
  const [Items, SetItems] = useState([])
  const [modalVisible, SetmodalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  const fetchItems = async ()=>{
    try{
      const data = await itemController.getItems()
      SetItems(data)
    }catch(error){
      console.error(error)
    }
  }

  const handleAddItem = async (values)=> {
    SetmodalVisible(true)
    try{
      if(!selectedItem){
        await itemController.addItem(values)
        message.success("Item added succesfully")
      }else{
        await itemController.updateItem(selectedItem._id, values)
        message.success("item updated successfuly")
      }
      fetchItems()
      SetmodalVisible(false)
    }catch(error){
      console.error(error)
      message.error("Failed to add Item")
    }
  }

  const handleDelete = async ()=> {
    try{
      await itemController.deleteItem(selectedItem._id)
      message.success("Item deleted Successfuly")
    }catch(error){
      console.error(error)
      message.error('Failed to delete item')
    }
  }

  const handleEditItem = ()=> {
    
  }

  useEffect(()=>{
    fetchItems()
  }, [])

  const columns = [
    {title:'Name', dataIndex:'name', key:'name'},
    {title:'Description', dataIndex:'description', key:'description'},
    {title:'Category', dataIndex:'category', key:'category'},
    {title:'Qty', dataIndex:'qty', key:'qty'},
    {title:'Expd', dataIndex:'expd', key:'expd'},
    {title:'Action', key:'action',
      render:(_, record) => (
        <spsan>
          <Button type="primary" style={{marginRight:'10px'}}
          onClick={
            setSelectedItem(record)
          }>Edit</Button>
          <Button type="primary" danger>Delete</Button>
        </spsan>
      )
    }
  ]
  return (
    <div>
      <Button type='primary' style={{
        margin:"10px"
      }}
      onClick={()=>{
        handleAddItem()
      }}>Add Item</Button>
      <Table dataSource={Items} columns = {columns}/>
      <Modal modalVisible={modalVisible}></Modal>
    </div>
  )
}

export default Items
