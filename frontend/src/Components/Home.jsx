import React, { useEffect, useState } from "react";
import { Card, Space, List } from "antd";
import UserController from "../Services/UserController";

const Home = () => {
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserController.getAllUsers();
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestUsers(sorted.slice(0, 5)); // Get latest 5 users
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
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
        style={{ height: "663px" }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card style={{ width: "100%", height: "230px" }}>Banner</Card>
          <Space direction="horizontal" size="middle">
            <Card style={{ width: "405px", height: "300px" }}>
              Pie Chart( Categories wise items)
            </Card>

            <Card
              style={{ width: "405px", height: "300px", overflowY: "auto" }}
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

            <Card style={{ width: "405px", height: "300px" }}>New Items</Card>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Home;
