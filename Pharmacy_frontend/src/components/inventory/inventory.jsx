import React, { useEffect, useState } from "react";
import "./inventory.css";

export default function Inventory() {
  const [inwards, setInwards] = useState([]);
  const [outwards, setOutwards] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("inward");

  const [formMode, setFormMode] = useState("add");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("inward"); // inward | outward
  const [formData, setFormData] = useState(getEmptyForm());

  // 🔹 Helper to return empty form object
  function getEmptyForm() {
    return {
      id: null,
      item: "",
      vendor: "",
      quantity: "",
      batch_no: "",
      date: "",
      purchase_rate: "",
      remarks: "",
    };
  }

  // 🔹 Load all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ Fetch data from Django APIs
  async function fetchAll() {
    setLoading(true);
    const API_BASE = "http://127.0.0.1:8000/api/inventory"; // adjust if using another port or proxy

    try {
      const [inwardRes, outwardRes, stockRes] = await Promise.all([
        fetch(`${API_BASE}/inward/`),
        fetch(`${API_BASE}/outward/`),
        fetch(`${API_BASE}/stock/`),
      ]);

      if (!inwardRes.ok || !outwardRes.ok || !stockRes.ok) {
        throw new Error("One or more API requests failed.");
      }

      const [inwardJson, outwardJson, stockJson] = await Promise.all([
        inwardRes.json(),
        outwardRes.json(),
        stockRes.json(),
      ]);

      setInwards(inwardJson);
      setOutwards(outwardJson);
      setStock(stockJson);
      setError("");
    } catch (err) {
      console.error("Error fetching inventory data:", err);
      setError("Failed to load inventory data. Please check the backend API.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Open Add/Edit Form
  function openForm(type, mode = "add", data = null) {
    setFormType(type);
    setFormMode(mode);
    setFormData(data || getEmptyForm());
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormData(getEmptyForm());
  }

  // 🔹 Form field change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // 🔹 Save data (Add / Edit)
  async function handleSubmit(e) {
    e.preventDefault();
    const API_BASE = "http://127.0.0.1:8000/api";

    try {
      const url =
        formMode === "add"
          ? `${API_BASE}/${formType}/`
          : `${API_BASE}/${formType}/${formData.id}/`;
      const method = formMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save data");

      await fetchAll();
      closeForm();
    } catch (err) {
      alert(err.message || "Error saving data");
    }
  }

  // 🔹 Delete record
  async function handleDelete(type, id) {
    const API_BASE = "http://127.0.0.1:8000/api";
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`${API_BASE}/${type}/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete data");
      await fetchAll();
    } catch (err) {
      alert(err.message || "Error deleting data");
    }
  }

  // 🔹 Render
  return (
    <div className="inventory-root">
      <h2>Inventory Management</h2>
      {error && <div className="inv-error">{error}</div>}

      {/* Tabs */}
      <div className="tab-header">
        <button
          className={activeTab === "inward" ? "active" : ""}
          onClick={() => setActiveTab("inward")}
        >
          Inward
        </button>
        <button
          className={activeTab === "outward" ? "active" : ""}
          onClick={() => setActiveTab("outward")}
        >
          Outward
        </button>
        <button
          className={activeTab === "stock" ? "active" : ""}
          onClick={() => setActiveTab("stock")}
        >
          Stock Statement
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔹 INWARD TAB */}
          {activeTab === "inward" && (
            <div>
              <div className="toolbar">
                <button
                  className="btn primary"
                  onClick={() => openForm("inward")}
                >
                  + Add Inward
                </button>
              </div>

              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Vendor</th>
                    <th>Batch No</th>
                    <th>Date</th>
                    <th>Qty</th>
                    <th>Purchase Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inwards.length > 0 ? (
                    inwards.map((i) => (
                      <tr key={i.id}>
                        <td>{i.item_name || i.item}</td>
                        <td>{i.vendor_name || "-"}</td>
                        <td>{i.batch_no}</td>
                        <td>{i.date}</td>
                        <td>{i.quantity}</td>
                        <td>{i.purchase_rate}</td>
                        <td>
                          <button onClick={() => openForm("inward", "edit", i)}>
                            Edit
                          </button>
                          <button
                            className="danger"
                            onClick={() => handleDelete("inward", i.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No inward records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 🔹 OUTWARD TAB */}
          {activeTab === "outward" && (
            <div>
              <div className="toolbar">
                <button
                  className="btn primary"
                  onClick={() => openForm("outward")}
                >
                  + Add Outward
                </button>
              </div>

              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Date</th>
                    <th>Qty</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {outwards.length > 0 ? (
                    outwards.map((o) => (
                      <tr key={o.id}>
                        <td>{o.item_name || o.item}</td>
                        <td>{o.date}</td>
                        <td>{o.quantity}</td>
                        <td>{o.remarks || "-"}</td>
                        <td>
                          <button
                            onClick={() => openForm("outward", "edit", o)}
                          >
                            Edit
                          </button>
                          <button
                            className="danger"
                            onClick={() => handleDelete("outward", o.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No outward records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 🔹 STOCK TAB */}
          {activeTab === "stock" && (
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Inward Total</th>
                  <th>Outward Total</th>
                  <th>Closing Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stock.length > 0 ? (
                  stock.map((s) => (
                    <tr key={s.id}>
                      <td>{s.item_name || s.item}</td>
                      <td>{s.inward_total}</td>
                      <td>{s.outward_total}</td>
                      <td>{s.closing_stock}</td>
                      <td>{s.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No stock data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* 🔹 FORM OVERLAY */}
      {showForm && (
        <div className="inv-overlay">
          <div className="inv-form-card">
            <form onSubmit={handleSubmit}>
              <h3>
                {formMode === "add" ? "Add" : "Edit"}{" "}
                {formType === "inward" ? "Inward" : "Outward"}
              </h3>

              <label>Item</label>
              <input
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
              />

              {formType === "inward" && (
                <>
                  <label>Vendor</label>
                  <input
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleChange}
                  />

                  <label>Batch No</label>
                  <input
                    name="batch_no"
                    value={formData.batch_no}
                    onChange={handleChange}
                  />

                  <label>Purchase Rate</label>
                  <input
                    name="purchase_rate"
                    type="number"
                    value={formData.purchase_rate}
                    onChange={handleChange}
                  />
                </>
              )}

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

              {formType === "outward" && (
                <>
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                </>
              )}

              <div className="form-actions">
                <button className="btn primary" type="submit">
                  Save
                </button>
                <button type="button" className="btn" onClick={closeForm}>
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
