import React, { useEffect, useState } from "react";
import "./SalesPurchaseReport.css";
import { Bar } from "react-chartjs-2";

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
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  // ⭐ DIRECT fetch (no token, no authFetch)
  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(PURCHASE_SUMMARY_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();

      const formatted = {
        total_purchase: data.total_purchase ?? 0,
        total_orders: data.total_orders ?? 0,
        monthly: (data.trend || []).map((t) => ({
          month: t.month,
          value: t.orders ?? 0,
        })),
      };

      setSummary(formatted);
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

  const labels = summary.monthly.map((m) => m.month);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Purchases",
        data: summary.monthly.map((m) => m.value),
        backgroundColor: "#13b57d", // GREEN palette as screenshot
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="pr-wrap">
      {/* TOP HEADER */}
      <div className="pr-header">
        <div>
          <h2 className="pr-title">Reports & Analytics</h2>
          <p className="pr-sub">View detailed reports and insights</p>
        </div>

        <div className="pr-controls">
          <select className="pr-select">
            <option>Last 10 Months</option>
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
          <button className="pr-export">Export</button>
        </div>
      </div>

      {/* TAB MENU */}
      <div className="pr-tabs">
        <button className="pr-tab">Sales Report</button>
        <button className="pr-tab active">Purchase Report</button>
        <button className="pr-tab">Expiry Report</button>
        <button className="pr-tab">Top Selling</button>
      </div>

      {/* KPI CARDS */}
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

      {/* BAR CHART */}
      <div className="pr-chart-card">
        <h4>Monthly Purchase Trend</h4>

        <div className="pr-chart">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
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
