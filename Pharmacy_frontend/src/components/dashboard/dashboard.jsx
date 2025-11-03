import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/dashboard_summary/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard API Error:", err));
  }, []);

  if (!data) return <p className="ml-72 p-8">Loading dashboard...</p>;

  return (
    <div className="ml-72 p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Total Items</h2>
          <p className="text-2xl font-bold">{data.inventory_stats.total_items}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Low Stock</h2>
          <p className="text-2xl font-bold text-orange-600">{data.inventory_stats.low_stock}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Out of Stock</h2>
          <p className="text-2xl font-bold text-red-600">{data.inventory_stats.out_of_stock}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Today's Sales</h2>
          <p className="text-2xl font-bold text-green-600">₹{data.sales_stats.today.total || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
