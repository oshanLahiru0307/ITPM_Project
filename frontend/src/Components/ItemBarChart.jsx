import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import ItemController from '../Services/ItemController';
import { useSnapshot } from 'valtio';
import state from '../State/state';

const ItemBarChart = () => {
  const snap = useSnapshot(state);
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState([]);

  const userId = snap.currentUser._id;
  const fetchItems = async () => {
    try {
      const response = await ItemController.getItemsByUser(userId);
      console.log("Response from getItemsByUser:", response);
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
    // Process the fetched items to the desired chart data format
    if (Array.isArray(items)) {
      const categoryQuantities = {};
      items.forEach(item => {
        if (item.category && typeof item.qty === 'number') {
          if (categoryQuantities[item.category]) {
            categoryQuantities[item.category] += item.qty;
          } else {
            categoryQuantities[item.category] = item.qty;
          }
        }
      });

      const formattedChartData = Object.keys(categoryQuantities).map(category => ({
        category: category,
        qty: categoryQuantities[category],
      }));

      setChartData(formattedChartData);
    } else {
      // Optionally set chartData to an empty array or handle the loading state
      setChartData([]);
      console.log("Items data is not an array yet.");
    }
  }, [items]);

  const config = {
    data: chartData,
    xField: 'category',
    yField: 'qty',
    label: {
      position: 'top', // Changed 'middle' to 'top'
      style: {
        fill: '#000000', // Changed label color for better visibility
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
      },
    },
    onReady: ({ chart }) => {
      try {
        if (chartData.length > 0) {
          const { height } = chart._container.getBoundingClientRect();
          const tooltipItem = chartData[Math.floor(Math.random() * chartData.length)];
          chart.on(
            'afterrender',
            () => {
              chart.emit('tooltip:show', {
                data: {
                  data: tooltipItem,
                },
                offsetY: height / 2 - 60,
              });
            },
            true,
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
  return <div
  style={{
    height:"240px",
    width:"350px",
  }}>
    <Column {...config} />
  </div>;
};

export default ItemBarChart;