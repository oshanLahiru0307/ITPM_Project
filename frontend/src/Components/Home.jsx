import React from 'react'
import { Card } from 'antd'

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
          <h1
            style={{
              color: '#007FFF'
            }}>Home</h1>}
        style={{
          height: '740px'
        }}></Card>
    </div>
  )
}

export default Home
