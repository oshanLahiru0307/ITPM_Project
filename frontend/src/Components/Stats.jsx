import React from 'react'
import { Card, Col, Row, List } from 'antd';
import { useState, useEffect } from 'react';
import UserController from "../Services/UserController";
import BarChartView from './ItemBarChart'
import DonationDonutChart from "./DonationDonutChart";
import AllDonationDonutChart from './AllDonationDonutChart';
import PieChartView from './ItemPieChart'
import CategoryController from '../Services/CategoryController';
import { useSnapshot } from 'valtio';
import state from '../State/state';

const Stats = () => {

    const [latestUsers, setLatestUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const snap = useSnapshot(state);
    const userId = snap.currentUser._id;

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
          const categories = await CategoryController.getAllCategoriesByUser(userId);
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
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
       <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={24} md={12} lg={8}>
                <Card style={{ height: "300px", backgroundColor: "#F0F8FF" }}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>Item Distribution</h2>
                  <BarChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"  }}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>My Donation</h2>
                    <DonationDonutChart/>
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
                  <PieChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"}}>
                <h2 style={{color:'#1F75FE', margin:'0'}}>All Donation</h2>
                    <AllDonationDonutChart/>
                </Card>
              </Col>

            </Row>
    </div>
  )
}

export default Stats
