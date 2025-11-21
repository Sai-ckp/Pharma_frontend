import React, { useEffect, useState } from "react";
import "./ExpiryReport.css";
import { Link, useLocation } from "react-router-dom";


const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const EXPIRY_API = `${API_BASE}/reports/expiry/`;

export default function ExpiryReport() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [windowFilter, setWindowFilter] = useState("all"); // all|warning|critical
  const [monthsRange, setMonthsRange] = useState("Last 6 Months");

    // ⭐ ADD EXPORT FUNCTION HERE
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


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(EXPIRY_API, window.location.origin);
      if (windowFilter && windowFilter !== "all") url.searchParams.set("window", windowFilter);
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch (${res.status})`);
      }
      const data = await res.json();
      // data is expected to be an array of objects:
      // [{ product_name, batch_no, quantity, expiry_date, days_left, status }, ...]
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [windowFilter]);

  return (
    <div className="er-wrap">
      <div className="er-header">
        <div>
          <h2 className="er-title">Reports &amp; Analytics</h2>
          <p className="er-sub">View detailed reports and insights</p>
        </div>

        <div className="er-controls">
          <select
            className="er-select"
            value={monthsRange}
            onChange={(e) => setMonthsRange(e.target.value)}
            aria-label="Months range"
          >
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

    <div className="er-tabs">
    <Link
        to="/reports/sales"
        className={location.pathname === "/reports/sales" ? "er-tab active" : "er-tab"}
    >
        Sales Report
    </Link>

    <Link
        to="/reports/purchases"
        className={location.pathname === "/reports/purchases" ? "er-tab active" : "er-tab"}
    >
        Purchase Report
    </Link>

    <Link
        to="/reports/expiry"
        className={location.pathname === "/reports/expiry" ? "er-tab active" : "er-tab"}
    >
        Expiry Report
    </Link>

    <Link
        to="/reports/top-selling"
        className={location.pathname === "/reports/top-selling" ? "er-tab active" : "er-tab"}
    >
        Top Selling
    </Link>
    </div>


      <div className="er-card">
        <h4 className="er-card-title">Medicine Expiry Tracking</h4>

        {/* Filters row */}
        <div className="er-filter-row">
          <div className="er-filter-group">
            <label>Window:</label>
            <div className="er-filter-buttons">
              <button
                className={windowFilter === "all" ? "er-filter-btn active" : "er-filter-btn"}
                onClick={() => setWindowFilter("all")}
              >
                All
              </button>
              <button
                className={windowFilter === "warning" ? "er-filter-btn active" : "er-filter-btn"}
                onClick={() => setWindowFilter("warning")}
              >
                Warning
              </button>
              <button
                className={windowFilter === "critical" ? "er-filter-btn active" : "er-filter-btn"}
                onClick={() => setWindowFilter("critical")}
              >
                Critical
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="er-table-wrap">
          {loading ? (
            <div className="er-loading">Loading...</div>
          ) : error ? (
            <div className="er-error">Error: {error}</div>
          ) : (
            <table className="er-table" role="table" aria-label="Expiry tracking table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Batch Number</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="er-no-data">No items found.</td>
                  </tr>
                ) : (
                  rows.map((r, i) => {
                    const status = (r.status || "").toLowerCase();
                    return (
                      <tr key={i}>
                        <td className="td-left">{r.product_name || r.product || "-"}</td>
                        <td>{r.batch_no || "-"}</td>
                        <td>{typeof r.quantity === "number" ? r.quantity : (r.quantity || "-")}</td>
                        <td>{r.expiry_date ? String(r.expiry_date) : "-"}</td>
                        <td>{r.days_left != null ? `${r.days_left} days` : "-"}</td>
                        <td>
                          <span
                            className={
                              status === "critical"
                                ? "er-badge er-badge-critical"
                                : status === "warning"
                                ? "er-badge er-badge-warning"
                                : "er-badge er-badge-safe"
                            }
                          >
                            {r.status || (status === "critical" ? "Critical" : status === "warning" ? "Warning" : "Safe")}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
