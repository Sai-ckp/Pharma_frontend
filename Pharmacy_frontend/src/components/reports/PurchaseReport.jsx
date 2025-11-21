import React, { useEffect, useState } from "react";
import "./SalesPurchaseReport.css";
import { Bar } from "react-chartjs-2";
import { Link, useLocation } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const PURCHASE_SUMMARY_API = `${API_BASE}/reports/purchases/summary/`;

export default function PurchaseReport() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

    // ⭐ ADD EXPORT FUNCTION HERE
  async function handleExport(reportType) {
    try {
      const res = await fetch(`${API_BASE}/reports/exports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          report_type: reportType,
          params: {} // later we will add date filters
        }),
      });

      const data = await res.json();
      alert("Export started! Check Export List.");
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    }
  }

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(PURCHASE_SUMMARY_API, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();

      setSummary({
        total_purchase: data.total_purchase ?? 0,
        total_orders: data.total_orders ?? 0,
        monthly: data.trend.map((t) => ({
          month: t.month,
          value: t.orders ?? 0,
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;
  if (!summary) return null;

  const chartData = {
    labels: summary.monthly.map((m) => m.month),
    datasets: [
      {
        label: "Purchases",
        data: summary.monthly.map((m) => m.value),
        backgroundColor: "#13b57d",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="pr-wrap">
      {/* ===================== HEADER ====================== */}
      <div className="pr-header">
        <div>
          <h2 className="pr-title">Reports & Analytics</h2>
          <p className="pr-sub">View detailed reports and insights</p>
        </div>

        {/* FILTER + EXPORT */}
        <div className="report-controls">
          <select className="report-select">
            <option>Last 10 Months</option>
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
          <button
            className="report-export-btn"
            onClick={() => handleExport("STOCK_LEDGER")}
          >
            Export
          </button>

        </div>
      </div>

      {/* ===================== TABS ====================== */}
      <div className="pr-tabs">
        <Link to="/reports/sales" className={location.pathname === "/reports/sales" ? "active" : ""}>
          Sales Report
        </Link>

        <Link
          to="/reports/purchases"
          className={location.pathname === "/reports/purchases" ? "active" : ""}
        >
          Purchase Report
        </Link>

        <Link
          to="/reports/expiry"
          className={location.pathname === "/reports/expiry" ? "active" : ""}
        >
          Expiry Report
        </Link>

        <Link
          to="/reports/top-selling"
          className={location.pathname === "/reports/top-selling" ? "active" : ""}
        >
          Top Selling
        </Link>
      </div>

      {/* ===================== KPI CARDS ====================== */}
      <div className="pr-cards">
        <div className="pr-card card-green">
          <p>Total Purchase</p>
          <h3>₹ {Number(summary.total_purchase).toLocaleString()}</h3>
          <small className="pr-kpi-sub">▲ +15.2% from last period</small>
        </div>

        <div className="pr-card card-orange">
          <p>Total Orders</p>
          <h3>{summary.total_orders}</h3>
          <small className="pr-kpi-sub">▲ +11.7% from last period</small>
        </div>
      </div>

      {/* ===================== CHART ====================== */}
      <div className="pr-chart-card">
        <h4>Monthly Purchase Trend</h4>

        <div className="pr-chart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#eee" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
