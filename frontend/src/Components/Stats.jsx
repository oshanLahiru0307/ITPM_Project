import React from 'react'
import { Card, Col, Row, List } from 'antd';
import { useState, useEffect } from 'react';
import UserController from "../Services/UserController";
import BarChartView from './ItemBarChart'
import DonationDonutChart from "./DonationDonutChart";
import PieChartView from './ItemPieChart'

const Stats = () => {

    const [latestUsers, setLatestUsers] = useState([]);

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
  
     useEffect(() => {
        fetchData();
      }, []);


  return (
    <div>
       <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={24} md={12} lg={8}>
                <Card style={{ height: "300px", backgroundColor: "#F0F8FF" }}>
                  Bar Chart( Categories wise items)
                  <BarChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"  }}>
                    Donation
                    <DonationDonutChart/>
                </Card>
              </Col>


              <Col xs={24} md={12} lg={8}>
                <Card
                  style={{ height: "300px", overflowY: "auto",  backgroundColor: "#F0F8FF"  }}
                  title={<h3 style={{ margin: 0 }}>New Users</h3>}
                >
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
                            title={<strong>{user.name}</strong>}
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
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF"  }}>
                  Pie Chart( Categories wise items)
                  <PieChartView/>
                </Card>
              </Col>
              
              
              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px",  backgroundColor: "#F0F8FF" }}>
                    Donation
                    <DonationDonutChart/>
                </Card>
              </Col>


              <Col xs={24} md={12} lg={8}>
                <Card
                  style={{ height: "300px", overflowY: "auto",  backgroundColor: "#F0F8FF"  }}
                  title={<h3 style={{ margin: 0 }}>Items</h3>}
                >
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
                            title={<strong>{user.name}</strong>}
                            description={user.email}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
    </div>
  )
}

export default Stats
