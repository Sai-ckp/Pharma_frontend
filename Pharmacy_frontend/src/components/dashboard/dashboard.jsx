import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import "./dashboard.css"; // optional custom styling

const Dashboard = () => {

  // -------------------------------------------------------
  // Summary Cards Data
  // -------------------------------------------------------
  const summaryCards = [
    {
      title: "Total Medicines",
      value: "907",
      sub: "+172 This Month",
      color: "#2ECC71",
    },
    {
      title: "Low Stock Alerts",
      value: "45",
      sub: "Needs Immediate Attention",
      color: "#F39C12",
    },
    {
      title: "Today's Sales",
      value: "₹24,560",
      sub: "32 Invoices Today",
      color: "#3498DB",
    },
    {
      title: "Pending Bills",
      value: "8",
      sub: "Worth ₹11,650",
      color: "#9B59B6",
    },
  ];

  // -------------------------------------------------------
  // Bar Chart Data (Monthly Sales & Purchases)
  // -------------------------------------------------------
  const monthlyData = [
    { month: "Jan", sales: 42000, purchase: 32000 },
    { month: "Feb", sales: 38000, purchase: 29000 },
    { month: "Mar", sales: 45000, purchase: 35000 },
    { month: "Apr", sales: 48000, purchase: 37000 },
    { month: "May", sales: 50000, purchase: 40000 },
    { month: "Jun", sales: 55000, purchase: 43000 },
  ];

  // -------------------------------------------------------
  // Pie Chart — Inventory Status
  // -------------------------------------------------------
  const inventoryData = [
    { name: "In Stock", value: 850 },
    { name: "Low Stock", value: 45 },
    { name: "Out of Stock", value: 12 },
  ];

  const pieColors = ["#2ECC71", "#F1C40F", "#E74C3C"];

  // -------------------------------------------------------
  // Recent Sales
  // -------------------------------------------------------
  const recentSales = [
    { name: "Rajesh Kumar", date: "Today 09:42 AM", amount: "₹125" },
    { name: "Priya Sharma", date: "Today 10:15 AM", amount: "₹85" },
    { name: "Anil Patel", date: "09 Nov — 02:20 PM", amount: "₹210" },
    { name: "Sunita Singh", date: "08 Nov — 01:05 PM", amount: "₹56" },
  ];

  // -------------------------------------------------------
  // Low Stock Medicines
  // -------------------------------------------------------
  const lowStock = [
    { medicine: "Paracetamol 500mg", level: 12, threshold: 50 },
    { medicine: "Amoxicillin 250mg", level: 28, threshold: 80 },
    { medicine: "Atorvastatin 500mg", level: 20, threshold: 60 },
    { medicine: "Omeprazole 20mg", level: 18, threshold: 70 },
  ];

  return (
    <div className="dashboard-main">

      {/* ---------------------------------- */}
      {/* Top Greeting */}
      {/* ---------------------------------- */}
      <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
      <p className="text-gray-500 mb-5">
        Welcome back! Here's what's happening today.
      </p>

      {/* ---------------------------------- */}
      {/* Summary Cards */}
      {/* ---------------------------------- */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="summary-card shadow bg-white p-4 rounded-xl border border-gray-100"
          >
            <div className="font-medium text-gray-600">{card.title}</div>
            <div className="text-2xl font-bold mt-1">{card.value}</div>
            <div
              className="text-sm mt-1"
              style={{ color: card.color }}
            >
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* ---------------------------------- */}
        {/* Monthly Sales & Purchase (Bar Chart) */}
        {/* ---------------------------------- */}
        <div className="p-5 bg-white rounded-xl shadow border border-gray-100">
          <h3 className="font-semibold mb-3">Monthly Sales & Purchases</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3498DB" radius={[6,6,0,0]} />
              <Bar dataKey="purchase" fill="#2ECC71" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------------------------- */}
        {/* Inventory Status (Pie Chart) */}
        {/* ---------------------------------- */}
        <div className="p-5 bg-white rounded-xl shadow border border-gray-100">
          <h3 className="font-semibold mb-3">Inventory Status</h3>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="75%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">

        {/* ---------------------------------- */}
        {/* Recent Sales */}
        {/* ---------------------------------- */}
        <div className="p-5 bg-white rounded-xl shadow border border-gray-100">
          <h3 className="font-semibold mb-3">Recent Sales</h3>

          {recentSales.map((sale, index) => (
            <div className="flex justify-between py-3 border-b" key={index}>
              <div>
                <div className="font-medium">{sale.name}</div>
                <div className="text-gray-500 text-sm">{sale.date}</div>
              </div>
              <div className="font-semibold">{sale.amount}</div>
            </div>
          ))}
        </div>

        {/* ---------------------------------- */}
        {/* Low Stock Medicines */}
        {/* ---------------------------------- */}
        <div className="p-5 bg-white rounded-xl shadow border border-gray-100">
          <h3 className="font-semibold mb-3">Low Stock Medicines</h3>

          {lowStock.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <span className="font-medium">{item.medicine}</span>
                <span className="text-sm text-gray-600">
                  {item.level}/{item.threshold}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(item.level / item.threshold) * 100}%`,
                    background: "#E67E22",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
