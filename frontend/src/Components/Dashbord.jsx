import React, { useState,useEffect } from 'react';
import {Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import state from '../State/state';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';
import Home from '../Components/Home'
import Items from '../Components/Items'
import Categories from '../Components/Categories'
import Users from '../Components/UserDetails'
import Donation from '../Components/Donation'
import Profile from '../Components/Profile'

const { Sider, Content} = Layout;
const { Title } = Typography;

const Dashbord = () => {
  const [collapsed, setCollapsed] = useState(false);
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current User:', state.currentUser);
    console.log('Token:', state.token);
  }, []);

  return (
    <Layout  style={{ minHeight: '100vh' }}>
      <Sider theme='dark' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Title
          level={3}
          style={{
            color: '#ffffff',//#007FFF
            textAlign: 'center',
            marginBottom: '30px' // Increased gap below title
          }}
        >
          Home Stock
        </Title>

        <Menu theme='dark' defaultSelectedKeys={['0']} mode="inline">
          <Menu.Item
            key="0"
            icon={<HomeOutlined/>}
            onClick={() => { state.activeIndex = 0; }}
            style={{ marginBottom: "15px" }} // Increased gap between items
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="1"
            icon={<AppstoreOutlined />}
            onClick={() => { state.activeIndex = 1; }}
            style={{ marginBottom: "15px" }}
          >
            Items
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ShoppingCartOutlined />}
            onClick={() => { state.activeIndex = 2; }}
            style={{ marginBottom: "15px" }}
          >
            Categories
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<UserOutlined />}
            onClick={() => { state.activeIndex = 3; }}
            style={{ marginBottom: "15px" }}
          >
            Users
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<HeartOutlined />}
            onClick={() => { state.activeIndex = 4; }}
            style={{ marginBottom: "15px" }}
          >
            Donation
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<ProfileOutlined />}
            onClick={() => { state.activeIndex = 5; }}
            style={{ marginBottom: "15px" }}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<LogoutOutlined />}
            onClick={() => { 
              state.currentUser = null
              state.token = null
              state.activeIndex = -1
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              navigate("/"); }}
            style={{ marginBottom: "15px" }}
          >
            Log Out
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content>
          {snap.activeIndex === 0 && <Home/>}
          {snap.activeIndex === 1 && <Items/>}
          {snap.activeIndex === 2 && <Categories/>}
          {snap.activeIndex === 3 && <Users/>}
          {snap.activeIndex === 4 && <Donation/>}
          {snap.activeIndex === 5 && <Profile/>}

        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashbord;
