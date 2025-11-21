import React, { useEffect, useState } from "react";
import "./TopSellingReport.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Link, useLocation } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const TOP_SELLING_API = `${API_BASE}/reports/sales/top-selling/`;

export default function TopSellingReport() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [monthsRange, setMonthsRange] = useState("Last 6 Months");

  async function handleExport(reportType = "SALES_REGISTER") {
    try {
        const res = await fetch(`${API_BASE}/reports/exports/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            report_type: reportType,
            params: {} // optional filters later
        }),
        });

        await res.json();
        alert("Export started! Check export list.");
    } catch (err) {
        console.error(err);
        alert("Export failed");
    }
 }


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(TOP_SELLING_API, { method: "GET", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      // Expecting backend to return: [{ medicine_name, units_sold, revenue }, ...]
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // Prepare chart: horizontal bar of units sold
  const labels = rows.map((r) => r.medicine_name || r.product_name || "—");
  const units = rows.map((r) => Number(r.units_sold ?? r.units ?? 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Units Sold",
        data: units,
        backgroundColor: "#13b57d",
        barThickness: 18,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="ts-wrap">
      <div className="ts-header">
        <div>
          <h2 className="ts-title">Reports & Analytics</h2>
          <p className="ts-sub">View detailed reports and insights</p>
        </div>

        <div className="ts-controls">
          <select className="ts-select" value={monthsRange} onChange={(e) => setMonthsRange(e.target.value)}>
            <option>Last 6 Months</option>
            <option>Last 10 Months</option>
            <option>Last 12 Months</option>
          </select>
          <button
            className="report-export-btn"
            onClick={() => handleExport("SALES_REGISTER")} 
            >
            Export
            </button>

        </div>
      </div>

      <div className="ts-tabs">
        <Link to="/reports/sales" className={location.pathname === "/reports/sales" ? "ts-tab active" : "ts-tab"}>Sales Report</Link>
        <Link to="/reports/purchases" className={location.pathname === "/reports/purchases" ? "ts-tab active" : "ts-tab"}>Purchase Report</Link>
        <Link to="/reports/expiry" className={location.pathname === "/reports/expiry" ? "ts-tab active" : "ts-tab"}>Expiry Report</Link>
        <Link to="/reports/top-selling" className={location.pathname === "/reports/top-selling" ? "ts-tab active" : "ts-tab"}>Top Selling</Link>
      </div>

      <div className="ts-card">
        <h4 className="ts-card-title">Top 5 Best Selling Medicines</h4>

        <div className="ts-table-wrap">
          {loading ? (
            <div className="ts-loading">Loading...</div>
          ) : error ? (
            <div className="ts-error">Error: {error}</div>
          ) : (
            <table className="ts-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Medicine Name</th>
                  <th>Units Sold</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan="4" className="ts-no-data">No records found</td></tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className="ts-rank">#{i + 1}</span>
                      </td>
                      <td className="td-left">{r.medicine_name || r.product_name || "-"}</td>
                      <td>{Number(r.units_sold ?? r.units ?? 0)}</td>
                      <td>₹ {Number(r.revenue ?? r.sale_amount ?? 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="ts-chart-card">
        <h4 className="ts-card-title">Sales Distribution</h4>
        <div className="ts-chart">
          <Bar
            data={chartData}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { beginAtZero: true, grid: { color: "#eee" } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
