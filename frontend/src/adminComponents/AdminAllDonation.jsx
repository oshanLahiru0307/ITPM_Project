import React, { useState, useEffect } from "react";
import { Table, Card, Input, Button } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DonationController from "../Services/DonationController";

const { Search } = Input;

const AdminDonation = () => {
  const [donation, setDonation] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

  const fetchDonation = async () => {
    try {
      const data = await DonationController.getDonation();
      setDonation(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch donations", error);
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
    const columns = ["#", "Name", "Description", "Category", "Qty", "Mfg Date", "Exp Date", "Owner"];

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
      new Date(donation.mfd).toLocaleDateString(), // Format date
      new Date(donation.expd).toLocaleDateString(), // Format date
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
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Description", dataIndex: "description", key: "description", sorter: (a, b) => a.description.localeCompare(b.description) },
    { title: "Category", dataIndex: "category", key: "category", sorter: (a, b) => a.category.localeCompare(b.category) },
    { title: "Qty", dataIndex: "qty", key: "qty", sorter: (a, b) => a.qty - b.qty },
    {
      title: "Manufacturing Date",
      dataIndex: "mfd",
      key: "mfd",
      sorter: (a, b) => new Date(a.mfd) - new Date(b.mfd),
      render: (text) => new Date(text).toLocaleDateString(), // Format date in table
    },
    {
      title: "Expiry Date",
      dataIndex: "expd",
      key: "expd",
      sorter: (a, b) => new Date(a.expd) - new Date(b.expd),
      render: (text) => new Date(text).toLocaleDateString(), // Format date in table
    },
    { title: "Owner", dataIndex: "userName", key: "userName", sorter: (a, b) => a.userName.localeCompare(b.userName) },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#F0F8FF", minHeight: "100vh" }}>
      <Card hoverable={true} style={{ width: "100%", height: "663px" }} title={<h3 style={{ color: "#007FFF" }}>Donations</h3>}>
        <Search
          placeholder="Search by Item Name or Owner"
          onSearch={handleSearch}
          allowClear
          enterButton="Search"
          size="medium"
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button type="primary" onClick={generatePDF} style={{ marginLeft: 10, marginBottom: 20, float: "right" }}>
          Generate PDF
        </Button>
        <Table dataSource={filteredData} columns={columns} rowKey="_id" pagination={{ pageSize: 6 }} onChange={handleTableChange}/>
      </Card>
    </div>
  );
};

export default AdminDonation;