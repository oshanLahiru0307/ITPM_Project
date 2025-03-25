import React from 'react'
import { Card, Space } from 'antd'
import ItemPieChart from '../Views/ItemPieChart'

const Home = () => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}>
      <Card
        hoverable={true}
        title={
          <h3
            style={{
              color: '#007FFF'
            }}>Home</h3>}
        style={{
          height: '663px'
        }}>
        <Space
          direction="vertical"
          size="middle"
          style={{
            width: '100%',
          }}
        >
          <Card
            style={{
              width: '100%',
              height: "230px"
            }}>Banner</Card>
          <Space
            direction='horizontal'
            size="middle">
            <Card
              style={{
                width: '405px',
                height: "300px"
              }}>
              Pie Chart( Categories wise items)
            </Card>

            <Card
              style={{
                width: '405px',
                height: "300px"
              }}>
              New Users
            </Card>

            <Card
              style={{
                width: '405px',
                height: "300px"
              }}>
              New Items
            </Card>

          </Space>
        </Space>
      </Card>
    </div>
  )
}

export default Home
