import React from 'react'
import { useState, useEffect } from 'react'
import {Table, Button} from 'antd'
import CategoryController from '../Services/CategoryController'

const Categories = () => {

  const [categories, SetCategories] = useState([])
  const [selectedItem, SetselectedItem] = useState()

  const fetchCategories = async ()=> {
    try{
      const data = await CategoryController.getAllCategories()
      SetCategories(data)
    }catch(error){
      console.error('error while fetching categories', error)
    }
  }

  useEffect(()=>{
    fetchCategories()
  }, [])

  const columns = [
    {title:'Name', dataIndex:'name', key:'name'},
    {title:'Date', dataIndex:'createdAt', key:'date'},
    {title:'Action', key:'action',
      render: (_, record) => (
        <span>
          <Button type='primary' style={{
            marginRight:'10px'
          }}>Edit</Button>
          <Button type='primary' danger>Delete</Button>
        </span>
      )
    }
  ]

  return (
    <div
    style={{
      padding:'20px',
      backgroundColor:'#F0F8FF',
      minHeight:'100vh'
    }}> 
      <Button type='primary' style={{
        marginBlock:'20px'
      }}>Add Category</Button>
      <Table dataSource={categories} columns={columns}/>
    </div>
  )
}

export default Categories
