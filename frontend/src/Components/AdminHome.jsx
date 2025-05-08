import React from "react";
import { Card } from "antd";
import NoticeBanner from "./NoticeBanner";
import AdminStats from "./AdminStat";

/*const tabList = [
  { key: "NoticeBanner", tab: "Notices" },
  { key: "Stats", tab: "Statistics" },
];*/

const AdminHome = () => {

  //const [activeTabKey1, setActiveTabKey1] = useState("NoticeBanner");
  //const onTab1Change = (key) => setActiveTabKey1(key);
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
        //tabList={tabList}
        //activeTabKey={activeTabKey1}
        //onTabChange={onTab1Change}
        
      >
        {/*activeTabKey1 === "NoticeBanner" ? <NoticeBanner /> : <Stats />*/}
        <NoticeBanner />
        <AdminStats />
      </Card>
    </div>
  );
};

export default AdminHome;
