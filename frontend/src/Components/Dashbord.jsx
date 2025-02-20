import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import state from '../State/state';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import Home from '../Components/Home'
import Items from '../Components/Items'
import Categories from '../Components/Categories'
import Users from '../Components/UserDetails'
import Donation from '../Components/Donation'

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const Dashbord = () => {
  const [collapsed, setCollapsed] = useState(false);
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Title
          level={3}
          style={{
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px' // Increased gap below title
          }}
        >
          Home Stock
        </Title>

        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item
            key="1"
            icon={<HomeOutlined/>}
            onClick={() => { state.activeIndex = 0; }}
            style={{ marginBottom: "15px" }} // Increased gap between items
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<AppstoreOutlined />}
            onClick={() => { state.activeIndex = 1; }}
            style={{ marginBottom: "15px" }}
          >
            Items
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<ShoppingCartOutlined />}
            onClick={() => { state.activeIndex = 2; }}
            style={{ marginBottom: "15px" }}
          >
            Categories
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<UserOutlined />}
            onClick={() => { state.activeIndex = 3; }}
            style={{ marginBottom: "15px" }}
          >
            Users
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<HeartOutlined />}
            onClick={() => { state.activeIndex = 3; }}
            style={{ marginBottom: "15px" }}
          >
            Donation
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<LogoutOutlined />}
            onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ marginBottom: "15px" }}
          >
            Log Out
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "10px 20px",
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <h1 style={{ margin: 0, textAlign: 'left', flex: 1 }}>Users Details</h1>
        </Header>

        <Content>
          {snap.activeIndex === 1 && <Home/>}
          {snap.activeIndex === 2 && <Items/>}
          {snap.activeIndex === 3 && <Categories/>}
          {snap.activeIndex === 4 && <Users/>}
          {snap.activeIndex === 5 && <Donation/>}

        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashbord;
