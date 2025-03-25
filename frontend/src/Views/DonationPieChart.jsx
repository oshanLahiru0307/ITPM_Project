import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import DonationController from "../Services/DonationController"; // Update with actual API service

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"];

const DonationPieChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const donations = await DonationController.getAllDonations();

                // Group donations by category
                const categoryData = donations.reduce((acc, donation) => {
                    acc[donation.category] = (acc[donation.category] || 0) + 1;
                    return acc;
                }, {});

                // Format data for Recharts
                const formattedData = Object.keys(categoryData).map((category) => ({
                    name: category,
                    value: categoryData[category],
                }));

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching donation data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <PieChart width={200} height={200}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#FF6384">
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default DonationPieChart;
