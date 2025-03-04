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
        title={<h3
          style={{
            color: '#007FFF'
          }}>Profile</h3>}
        style={{
          height: '663px'
        }}></Card></div>
    </div>
  )
}

export default Profile
