import React, { useEffect, useState } from "react";
import "./purchase_lines.css";

// Toggle to persist across page reloads
const USE_LOCAL_STORAGE = false;
const LS_KEY = "dummy_purchase_lines";

const PurchaseLines = () => {
  const [lines, setLines] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    purchase_id: "",
    product_id: "",
    batch_no: "",
    expiry_date: "",
    qty_packs: "",
    received_base_qty: "",
    unit_cost: "",
    mrp: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading] = useState(false);
  const [error] = useState("");

  useEffect(() => {
    if (USE_LOCAL_STORAGE) {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          setLines(JSON.parse(raw));
          return;
        }
      } catch (e) {
        console.error("Failed to read purchase lines from localStorage", e);
      }
    }
    // start empty
    setLines([]);
  }, []);

  const saveIfNeeded = (next) => {
    setLines(next);
    if (USE_LOCAL_STORAGE) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save purchase lines to localStorage", e);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      purchase_id: "",
      product_id: "",
      batch_no: "",
      expiry_date: "",
      qty_packs: "",
      received_base_qty: "",
      unit_cost: "",
      mrp: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      ...formData,
      id: editingId ? editingId : Math.max(0, ...lines.map((r) => Number(r.id) || 0)) + 1,
    };

    if (editingId) {
      const next = lines.map((r) => (r.id === editingId ? obj : r));
      saveIfNeeded(next);
      alert("✅ Purchase line updated!");
    } else {
      const next = [obj, ...lines];
      saveIfNeeded(next);
      alert("✅ Purchase line created!");
    }
    resetForm();
  };

  const handleEdit = (line) => {
    setFormData({
      id: line.id ?? "",
      purchase_id: line.purchase_id ?? "",
      product_id: line.product_id ?? "",
      batch_no: line.batch_no ?? "",
      expiry_date: line.expiry_date ?? "",
      qty_packs: line.qty_packs ?? "",
      received_base_qty: line.received_base_qty ?? "",
      unit_cost: line.unit_cost ?? "",
      mrp: line.mrp ?? "",
    });
    setEditingId(line.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this purchase line?")) return;
    const next = lines.filter((r) => r.id !== id);
    saveIfNeeded(next);
    alert("🗑️ Purchase line deleted!");
  };

  return (
    <div className="purchase-lines-container">
      <h2>Purchase Lines</h2>

      <form className="purchase-lines-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          disabled={!editingId}
        />
        <input
          type="text"
          name="purchase_id"
          placeholder="Purchase ID"
          value={formData.purchase_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="product_id"
          placeholder="Product ID"
          value={formData.product_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="batch_no"
          placeholder="Batch No"
          value={formData.batch_no}
          onChange={handleChange}
        />
        <label>
          Expiry Date
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
          />
        </label>
        <input
          type="number"
          name="qty_packs"
          placeholder="Qty (Packs)"
          value={formData.qty_packs}
          onChange={handleChange}
        />
        <input
          type="number"
          name="received_base_qty"
          placeholder="Received Base Qty"
          value={formData.received_base_qty}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="unit_cost"
          placeholder="Unit Cost"
          value={formData.unit_cost}
          onChange={handleChange}
        />
        <input
          type="number"
          step="0.01"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Update Line" : "Add Line"}</button>
      </form>

      <h3 className="purchase-lines-list-title">
        {loading ? "Loading..." : error || "Purchase Line Entries"}
      </h3>

      <table className="purchase-lines-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Purchase ID</th>
            <th>Product ID</th>
            <th>Batch No</th>
            <th>Expiry</th>
            <th>Qty (Packs)</th>
            <th>Received Base Qty</th>
            <th>Unit Cost</th>
            <th>MRP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lines.length > 0 ? (
            lines.map((line, idx) => (
              <tr key={line.id || idx}>
                <td>{idx + 1}</td>
                <td>{line.id}</td>
                <td>{line.purchase_id}</td>
                <td>{line.product_id}</td>
                <td>{line.batch_no}</td>
                <td>{line.expiry_date}</td>
                <td>{line.qty_packs}</td>
                <td>{line.received_base_qty}</td>
                <td>{line.unit_cost}</td>
                <td>{line.mrp}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(line)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(line.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                No purchase lines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseLines;
