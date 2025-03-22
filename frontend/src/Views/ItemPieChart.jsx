import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ItemController from "../Services/ItemController"; // Update with actual API service

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ItemPieChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = await ItemController.getAllItems();

                // Group items by category
                const categoryData = items.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                }, {});

                // Format data for Recharts
                const formattedData = Object.keys(categoryData).map((category) => ({
                    name: category,
                    value: categoryData[category],
                }));

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching item data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <PieChart width={350} height={250}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default ItemPieChart;
