import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import DonationController from '../Services/DonationController';

const AllDonationDonutChart = () => {

  const [items, setItems] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);


  const fetchItems = async () => {
    try {
      const response = await DonationController.getDonation();
      if (response) {
        setItems(response);
      } else {
        console.log("Error fetching donation");
      }
    } catch (error) {
      console.error("Error fetching donation:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (Array.isArray(items)) {
      const categoryQuantities = {};
      items.forEach(item => {
        if (item.category && typeof item.qty === 'number') {
          categoryQuantities[item.category] =
            (categoryQuantities[item.category] || 0) + item.qty;
        }
      });

      const formattedPieData = Object.keys(categoryQuantities).map(category => ({
        type: category,
        value: categoryQuantities[category],
      }));

      setPieChartData(formattedPieData);
    } else {
      setPieChartData([]);
      console.log("Items data is not an array yet for Pie Chart.");
    }
  }, [items]);

  const config = {
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'top',
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: 'Donation\nChart',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 15,
          fontStyle: 'bold',
        },
      },
    ],
  };

  return <div
  style={{
    width:'400px',
    height:'240px',
  }}>
    <Pie {...config} />
  </div>;
};

export default AllDonationDonutChart;