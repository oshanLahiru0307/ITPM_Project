import React, { useState } from "react";
import { Card } from "antd";
import NoticeBanner from "./NoticeBanner";
import UserList from "./UserList";
import BarChartView from './ItemBarChart'
import PieChartView from './ItemPieChart'
const tabList = [
  { key: "NoticeBanner", tab: "Notices" },
  { key: "Stats", tab: "Stats" },
];

const Home = () => {

  const [activeTabKey1, setActiveTabKey1] = useState("NoticeBanner");
  const onTab1Change = (key) => setActiveTabKey1(key);
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
        style={{ minHeight: "663px"}}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
        
      >
        {activeTabKey1 === "NoticeBanner" ? <NoticeBanner /> : 
        <div
        style={{
          display: "flex",
          alignItems: "center",
        }}>
          <BarChartView/>
          <PieChartView/>
        </div> }
      </Card>
    </div>
  );
};

export default Home;
