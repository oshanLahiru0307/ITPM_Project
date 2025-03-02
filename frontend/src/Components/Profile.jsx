import React from 'react'
import { Card } from 'antd'
const Profile = () => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#F0F8FF',
        minHeight: '100vh'
      }}>

      <div><Card
        hoverable={true}
        title={<h1
          style={{
            color: '#007FFF'
          }}>Profile</h1>}
        style={{
          height: '740px'
        }}></Card></div>
    </div>
  )
}

export default Profile
