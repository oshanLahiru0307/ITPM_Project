import React, { useState, useEffect } from "react";
import { Table, Card, Input, Button } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable
import DonationController from "../Services/DonationController";

const { Search } = Input;

const AdminDonation = () => {
    const [donation, setDonation] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Fetch donations
    const fetchDonation = async () => {
        try {
            const data = await DonationController.getDonation();
            setDonation(data);
            setFilteredData(data); // Initialize filtered data
        } catch (error) {
            console.error("Failed to fetch donations", error);
        }
    };

    useEffect(() => {
        fetchDonation();
    }, []);

    // Search function
    const handleSearch = (value) => {
        const filtered = donation.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.userName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Generate PDF function
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.text("Donation Report", 14, 10);

        // Define table columns
        const columns = ["#", "Name", "Description", "Category", "Qty", "Owner"];

        // Format data for table
        const rows = filteredData.map((donation, index) => [
            index + 1, 
            donation.name, 
            donation.description, 
            donation.category, 
            donation.qty, 
            donation.userName
        ]);

        // Use autoTable correctly
        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 20, // Start position for table
        });

        // Save the PDF
        doc.save("Donation_Report.pdf");
    };

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Qty", dataIndex: "qty", key: "qty" },
        { title: "Manufacturing Date", dataIndex: "mfd", key: "mfd" },
        { title: "Expiry Date", dataIndex: "expd", key: "expd" },
        { title: "Owner", dataIndex: "userName", key: "userName" },
    ];

    return (
        <div style={{ padding: "20px", backgroundColor: "#F0F8FF", minHeight: "100vh" }}>
            <Card
                hoverable={true}
                style={{ width: "100%", height: "auto" }}
                title={<h3 style={{ color: "#007FFF" }}>Donations</h3>}
            >
                {/* Search Bar */}
                <Search
                    placeholder="Search by Item Name or Owner"
                    onSearch={handleSearch}
                    allowClear
                    enterButton="Search"
                    size="medium"
                    style={{ width: 300, marginBottom: 20 }}
                />

                {/* Generate PDF Button */}
                <Button type="primary" onClick={generatePDF} style={{ marginLeft: 10, marginBottom: 20, float: "right" }}>
                    Generate PDF
                </Button>

                {/* Table */}
                <Table dataSource={filteredData} columns={columns} rowKey="_id" pagination={{ pageSize: 6 }} />
            </Card>
        </div>
    );
};

export default AdminDonation;
