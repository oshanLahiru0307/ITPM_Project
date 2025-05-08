import React from 'react'
import { Card, Col, Row, List } from 'antd';
import { useState, useEffect } from 'react';
import UserController from "../Services/UserController";
import AdminBarChartView from './AdminBarChart'
import AdminDonationDonutChart from "./AdminDonationDonutChart";
import AllDonationDonutChart from './AllDonationDonutChart';
import CategoryController from '../Services/CategoryController';
import AdminPieChartView from './AdminPieChartView';

const AdminStats = () => {

    const [latestUsers, setLatestUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    

    const fetchData = async () => {
        try {
          const users = await UserController.getAllUsers();
          const sortedUsers = [...users].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestUsers(sortedUsers.slice(0, 5));

        } catch (err) {
          console.error("Failed to fetch data:", err);
        } 
      };

      const fetchCategories = async () => {
        try {
          const categories = await CategoryController.getAllCategories();
          console.log("Categories:", categories);
          setCategories(categories);
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        }
      }
  
     useEffect(() => {
        fetchData();
        fetchCategories();
      }, []);


  return (
    <div style={{ marginTop: "40px", marginBottom: "20px" }}>
       <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={24} md={12} lg={8}>
                <Card style={{ height: "300px", backgroundColor: "#F0F8FF" }}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>Items</h2>
                  <AdminBarChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"  }}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>Donations</h2>
                    <AdminDonationDonutChart/>
                </Card>
              </Col>


              <Col xs={24} md={12} lg={8}>
                <Card
                  style={{ height: "300px", overflowY: "auto",  backgroundColor: "#F0F8FF"  }}
                >
                <h2 style={{color:'#1F75FE', margin:'0'}}>New Users</h2>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={latestUsers}
                      renderItem={(user) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <img
                                src={
                                  user.picture ||
                                  "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                                }
                                alt="profile"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            }
                            title={<strong style={{fontWeight:'bold'}}>{user.name}</strong>}
                            description={user.email}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ width: "100%", marginTop: "20px" }}>

            <Col xs={24} md={12} lg={8}>
                <Card
                  style={{ height: "300px", overflowY: "auto",  backgroundColor: "#F0F8FF"  }}>
                    <h2 style={{color:'#1F75FE', margin:'0'}}>Categories</h2>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={categories}
                      renderItem={(category) => (
                        <List.Item>
                          <List.Item.Meta
                            title={<strong style={{fontWeight:'bold'}}>{category.name}</strong>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"  }}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>Item Distribution</h2>
                  <AdminPieChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"}}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>Donation Distribution</h2>
                    <AllDonationDonutChart/>
                </Card>
              </Col>

            </Row>
    </div>
  )
}

export default AdminStats
