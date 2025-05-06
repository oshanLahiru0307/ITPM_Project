import React, { useEffect, useState } from "react";
import { Card, Space, List, Carousel, Row, Col, Spin } from "antd";
import BannerController from "../Services/BannerController";
import UserController from "../Services/UserController";

const Home = () => {
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await UserController.getAllUsers();
        const sortedUsers = [...users].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestUsers(sortedUsers.slice(0, 5));

      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F0F8FF",
        minHeight: "100vh",
      }}
    >
      <Card
        hoverable={true}
        title={<h3 style={{ color: "#007FFF" }}>Home</h3>}
        style={{ minHeight: "663px" }}
      >
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={24} md={12} lg={8}>
                <Card style={{ height: "300px" }}>
                  Pie Chart( Categories wise items)
                </Card>
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Card
                  style={{ height: "300px", overflowY: "auto" }}
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

              <Col xs={24} md={24} lg={8}>
                <Card style={{ height: "300px" }}>New Items</Card>
              </Col>
            </Row>
      </Card>
    </div>
  );
};

export default Home;
