import React from 'react'
import { useState } from 'react'
import { Card,Button } from 'antd'
import AllDonation from '../Views/AllDonation';

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
  MyDonations: <p>My Donations</p>,
  AllDonations: <AllDonation />,
};


const Donation = () => {
  const [activeTabKey1, setActiveTabKey1] = useState('MyDonations');

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };


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
          <Button type="primary" style={{ float: 'right' }}>
          + Add Donation
        </Button>
        }
        style={{
          width: '100%',
          height: '740px',
        }}
        title={<h1
          style={{
            color: '#007FFF'
          }}>Donation</h1>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  )
}

export default Donation
