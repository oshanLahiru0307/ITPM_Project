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
          <h3
            style={{
              color: '#007FFF'
            }}>Home</h3>}
        style={{
          height: '663px'
        }}></Card>
    </div>
  )
}

export default Home
