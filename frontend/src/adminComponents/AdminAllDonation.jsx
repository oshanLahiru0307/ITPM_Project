import React, { useState, useEffect } from "react";
import { Table, Card, Input, Button, Spin, Row, Col } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DonationController from "../Services/DonationController";

const { Search } = Input;

const AdminDonation = () => {
  const [donation, setDonation] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 576);
      setIsTablet(width > 576 && width <= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDonation = async () => {
    setLoading(true);
    try {
      const data = await DonationController.getDonation();
      setDonation(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch donations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, []);

  const handleSearch = (value) => {
    const filtered = donation.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.userName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Donation Report", 14, 10);
    const columns = [
      "#",
      "Name",
      "Description",
      "Category",
      "Qty",
      "Mfg Date",
      "Exp Date",
      "Owner",
    ];

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortedInfo.field) return 0;
      let sortOrder = sortedInfo.order === "ascend" ? 1 : -1;
      let valueA = a[sortedInfo.field];
      let valueB = b[sortedInfo.field];

      if (sortedInfo.field === "qty") {
        return (valueA - valueB) * sortOrder;
      } else if (sortedInfo.field === "mfd" || sortedInfo.field === "expd") {
        return (new Date(valueA) - new Date(valueB)) * sortOrder;
      } else {
        return valueA.localeCompare(valueB) * sortOrder;
      }
    });

    const rows = sortedData.map((donation, index) => [
      index + 1,
      donation.name,
      donation.description,
      donation.category,
      donation.qty,
      new Date(donation.mfd).toLocaleDateString(),
      new Date(donation.expd).toLocaleDateString(),
      donation.userName,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("Donation_Report.pdf");
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: "M.F.D Date",
      dataIndex: "mfd",
      key: "mfd",
      sorter: (a, b) => new Date(a.mfd) - new Date(b.mfd),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Exp Date",
      dataIndex: "expd",
      key: "expd",
      sorter: (a, b) => new Date(a.expd) - new Date(b.expd),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Added Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Owner",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F0F8FF",
        minHeight: "100vh",
      }}
    >
      <Card
        hoverable
        style={{ width: "100%", minHeight: "663px" }}
        title={
          <h3 style={{ color: "#007FFF", textAlign: "middle" }}>Donations</h3>
        }
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Search
              placeholder="Search by Item Name or Owner"
              onSearch={handleSearch}
              allowClear
              enterButton="Search"
              size="middle"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={4}>
            <Button
              type="primary"
              onClick={generatePDF}
              block={isMobile || isTablet}
              style={{
                float: isMobile || isTablet ? "none" : "right",
                width: isMobile || isTablet ? "100%" : "auto",
              }}
            >
              Generate PDF
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading} tip="Loading donations...">
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AdminDonation;
