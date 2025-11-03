import React, { useEffect, useState } from "react";
import "./billing.css";

const API_BASE = "http://127.0.0.1:8000/api"; // ✅ Django backend base URL

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState(getEmptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getEmptyForm() {
    return {
      bill_no: "",
      customer: "",
      date: "",
      total_amount: "",
      discount: "",
      tax: "",
      grand_total: "",
    };
  }

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/bills/`); // ✅ Correct full path
      if (!res.ok) throw new Error(`Failed to fetch bills (${res.status})`);
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/bills/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create bill");
      setFormVisible(false);
      setFormData(getEmptyForm());
      fetchBills();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="billing-root">
      <h2>Billing Management</h2>

      {error && <p className="error">⚠️ {error}</p>}

      <button className="btn primary" onClick={() => setFormVisible(true)}>
        + Add Bill
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table className="billing-table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.bill_no}</td>
                <td>{bill.customer_name}</td>
                <td>
                  {bill.date
                    ? new Date(bill.date).toLocaleDateString()
                    : "—"}
                </td>
                <td>{bill.total_amount}</td>
                <td>{bill.discount}</td>
                <td>{bill.tax}</td>
                <td>{bill.grand_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bill Creation Form */}
      {formVisible && (
        <div className="overlay">
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <h3>Add New Bill</h3>

              <label>Bill No</label>
              <input
                name="bill_no"
                value={formData.bill_no}
                onChange={handleChange}
                required
              />

              <label>Customer ID</label>
              <input
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
              />

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <label>Total Amount</label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
              />

              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />

              <label>Tax (%)</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
              />

              <label>Grand Total</label>
              <input
                type="number"
                name="grand_total"
                value={formData.grand_total}
                onChange={handleChange}
              />

              <div className="actions">
                <button type="submit" className="btn primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setFormVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
