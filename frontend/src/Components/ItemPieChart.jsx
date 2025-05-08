import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import ItemController from '../Services/ItemController';
import { useSnapshot } from 'valtio';
import state from '../State/state';

const ItemPieChart = () => {
  const snap = useSnapshot(state);
  const [items, setItems] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const userId = snap.currentUser._id;

  const fetchItems = async () => {
    try {
      const response = await ItemController.getItemsByUser(userId);
      if (response) {
        setItems(response);
      } else {
        console.log("Error fetching items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
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
    label: {
      text: 'value',
      style: {
        fontWeight: 'normal',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  return <div
  style={{
    width:'400px',
    height:'400px',
  }}>
    <Pie {...config} />
  </div>;
};

export default ItemPieChart;