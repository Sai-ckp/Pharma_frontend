import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./billgeneration.css";
import { authFetch } from "../../api/http";

export default function BillList() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [kpis, setKpis] = useState({
    totalBills: 0,
    totalProducts: 0,
    totalRevenue: 0,
    changeBills: 0,
    changeProducts: 0,
    changeRevenue: 0,
  });

  // ✅ Utility: get start & end of current month
  const getMonthRange = (monthOffset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start: firstDay, end: lastDay };
  };

  // ✅ Calculate KPIs dynamically
  const calculateKPIs = (billsData) => {
    const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(0);
    const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(-1);

    const currentMonthBills = billsData.filter((b) => {
      const date = new Date(b.date);
      return date >= thisMonthStart && date <= thisMonthEnd;
    });

    const lastMonthBills = billsData.filter((b) => {
      const date = new Date(b.date);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    const currentBills = currentMonthBills.length;
    const currentProducts = currentMonthBills.reduce(
      (sum, b) => sum + (b.totalItems || 0),
      0
    );
    const currentRevenue = currentMonthBills.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    const lastBills = lastMonthBills.length || 1;
    const lastProducts =
      lastMonthBills.reduce((sum, b) => sum + (b.totalItems || 0), 0) || 1;
    const lastRevenue =
      lastMonthBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 1;

    const changeBills = (((currentBills - lastBills) / lastBills) * 100).toFixed(1);
    const changeProducts = (((currentProducts - lastProducts) / lastProducts) * 100).toFixed(1);
    const changeRevenue = (((currentRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1);

    return {
      totalBills: currentBills,
      totalProducts: currentProducts,
      totalRevenue: currentRevenue,
      changeBills,
      changeProducts,
      changeRevenue,
    };
  };

  // ✅ Fetch bills and calculate KPIs
  useEffect(() => {
    authFetch("/api/bills")
      .then((res) => res.json())
      .then((data) => {
        const billsData = data.bills || [];
        setBills(billsData);
        const calculated = calculateKPIs(billsData);
        setKpis(calculated);
      })
      .catch(() => {
        setBills([]);
      });
  }, []);

  // ✅ Helper to check if today is the last day of the month
  const isEndOfMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return today.getDate() === lastDay.getDate();
  };

  // ✅ Conditional color
  const getChangeColor = (change) => {
    if (change > 0) return "#14b8a6"; // teal (growth)
    if (change < 0) return "#ef4444"; // red (decline)
    return "#6b7280"; // neutral gray
  };

  // ✅ Conditional rendering of percentage only at EOM
  const formatChangeText = (change) => {
    if (!isEndOfMonth()) return null; // ❌ hide before end of month

    const color = getChangeColor(change);
    const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "▬";
    return (
      <span style={{ color, marginLeft: "0.5rem", fontSize: "0.875rem" }}>
        {arrow} {Math.abs(change)}%
      </span>
    );
  };

  return (
    <div className="billgeneration-page" style={{ maxWidth: "1200px", margin: "auto" }}>
      {/* Header Section */}
      <div
        className="header-section"
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="page-title" style={{ fontWeight: "600", color: "#111827" }}>
          Bill Generation
        </h1>
        <button
          className="generate-btn"
          style={{
            backgroundColor: "#14b8a6",
            borderRadius: "6px",
            color: "white",
            padding: "0.6rem 1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
          }}
          onClick={() => navigate("/billgeneration/generate")}
        >
          + Generate New Bill
        </button>
      </div>

      {/* KPI Cards */}
      <div
        className="kpi-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="kpi-card"
          style={{
            border: "1px solid #14b8a6",
            borderRadius: "8px",
            backgroundColor: "#f0fdfa",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <h4 style={{ color: "#0f766e" }}>Total Bills (This Month)</h4>
          <p style={{ fontWeight: "600", fontSize: "1.25rem", color: "#115e59" }}>
            {kpis.totalBills}
            {formatChangeText(kpis.changeBills)}
          </p>
          <small style={{ color: "#134e4a" }}>
            Total bills generated in {new Date().toLocaleString("default", { month: "long" })}
          </small>
        </div>

        <div
          className="kpi-card"
          style={{
            border: "1px solid #14b8a6",
            borderRadius: "8px",
            backgroundColor: "#f0fdfa",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <h4 style={{ color: "#0f766e" }}>Total Products Sold (This Month)</h4>
          <p style={{ fontWeight: "600", fontSize: "1.25rem", color: "#115e59" }}>
            {kpis.totalProducts}
            {formatChangeText(kpis.changeProducts)}
          </p>
          <small style={{ color: "#134e4a" }}>Total items sold this month</small>
        </div>

        <div
          className="kpi-card"
          style={{
            border: "1px solid #14b8a6",
            borderRadius: "8px",
            backgroundColor: "#f0fdfa",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <h4 style={{ color: "#0f766e" }}>Total Revenue (This Month)</h4>
          <p style={{ fontWeight: "600", fontSize: "1.25rem", color: "#115e59" }}>
            ₹{kpis.totalRevenue.toLocaleString()}
            {formatChangeText(kpis.changeRevenue)}
          </p>
          <small style={{ color: "#134e4a" }}>
            Revenue generated in {new Date().toLocaleString("default", { month: "long" })}
          </small>
        </div>
      </div>

      {/* Bills Table */}
      <table
        className="bill-table"
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 8px",
        }}
      >
        <thead style={{ backgroundColor: "#f3f4f6", textAlign: "left", color: "#6b7280" }}>
          <tr>
            <th style={{ padding: "0.75rem" }}>Bill ID</th>
            <th style={{ padding: "0.75rem" }}>Transaction Date</th>
            <th style={{ padding: "0.75rem" }}>Customer Name</th>
            <th style={{ padding: "0.75rem" }}>Total Items</th>
            <th style={{ padding: "0.75rem" }}>Total Amount</th>
            <th style={{ padding: "0.75rem" }}>Payment</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data" style={{ padding: "1rem", textAlign: "center" }}>
                No bills found
              </td>
            </tr>
          ) : (
            bills.map((bill) => (
              <tr
                key={bill.id}
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              >
                <td style={{ padding: "0.75rem" }}>{bill.billNumber}</td>
                <td style={{ padding: "0.75rem" }}>{bill.date}</td>
                <td style={{ padding: "0.75rem" }}>{bill.customerName}</td>
                <td style={{ padding: "0.75rem" }}>{bill.totalItems}</td>
                <td style={{ padding: "0.75rem" }}>₹{bill.totalAmount}</td>
                <td style={{ padding: "0.75rem" }}>{bill.paymentMethod}</td>
                <td style={{ padding: "0.75rem", textAlign: "center" }}>
                  <button
                    onClick={() => navigate(`/masters/billgeneration/invoice/${bill.id}`)}
                    style={{
                      backgroundColor: "#14b8a6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.7rem",
                      marginRight: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/masters/billgeneration/edit/${bill.id}`)}
                    style={{
                      backgroundColor: "#fbbf24",
                      color: "#78350f",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.7rem",
                      marginRight: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
