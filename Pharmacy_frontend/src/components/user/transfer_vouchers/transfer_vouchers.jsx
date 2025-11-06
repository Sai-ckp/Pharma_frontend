import React, { useEffect, useState } from "react";
import "./transfer_vouchers.css";

const API_URL = "http://127.0.0.1:8000/api/transfer-vouchers/";

const TransferVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    from_location_id: "",
    to_location_id: "",
    transporter: "",
    challan_no: "",
    eway_data: "",
    status: "",
    created_by: "",
    created_at: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toDatetimeLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };
  const toISOIfNeeded = (val) => (val ? new Date(val).toISOString() : "");

  const fetchVouchers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setVouchers(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error("Error fetching transfer vouchers:", err);
      setError("⚠️ Unable to load transfer vouchers.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      from_location_id: "",
      to_location_id: "",
      transporter: "",
      challan_no: "",
      eway_data: "",
      status: "",
      created_by: "",
      created_at: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, created_at: toISOIfNeeded(formData.created_at) };
      if (!editingId) delete payload.id;

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to save: ${res.status} ${txt}`);
      }

      resetForm();
      await fetchVouchers();
      alert(editingId ? "✅ Transfer voucher updated!" : "✅ Transfer voucher created!");
    } catch (err) {
      console.error("Error saving transfer voucher:", err);
      alert("❌ Failed to save transfer voucher.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id ?? "",
      from_location_id: item.from_location_id ?? "",
      to_location_id: item.to_location_id ?? "",
      transporter: item.transporter ?? "",
      challan_no: item.challan_no ?? "",
      eway_data: item.eway_data ?? "",
      status: item.status ?? "",
      created_by: item.created_by ?? "",
      created_at: toDatetimeLocal(item.created_at),
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transfer voucher?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchVouchers();
      alert("🗑️ Transfer voucher deleted!");
    } catch (err) {
      console.error("Error deleting transfer voucher:", err);
      alert("❌ Failed to delete transfer voucher.");
    }
  };

  return (
    <div className="transfer-vouchers-container">
      <h2>Transfer Vouchers</h2>

      <form className="transfer-vouchers-form" onSubmit={handleSubmit}>
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
          name="from_location_id"
          placeholder="From Location ID"
          value={formData.from_location_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="to_location_id"
          placeholder="To Location ID"
          value={formData.to_location_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="transporter"
          placeholder="Transporter"
          value={formData.transporter}
          onChange={handleChange}
        />
        <input
          type="text"
          name="challan_no"
          placeholder="Challan No"
          value={formData.challan_no}
          onChange={handleChange}
        />
        <input
          type="text"
          name="eway_data"
          placeholder="E-Way Data"
          value={formData.eway_data}
          onChange={handleChange}
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
        />
        <input
          type="text"
          name="created_by"
          placeholder="Created By"
          value={formData.created_by}
          onChange={handleChange}
        />
        <label>
          Created At
          <input
            type="datetime-local"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {editingId ? "Update Voucher" : "Add Voucher"}
        </button>
      </form>

      <h3 className="transfer-vouchers-list-title">
        {loading ? "Loading..." : error || "Voucher List"}
      </h3>

      <table className="transfer-vouchers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>From Location</th>
            <th>To Location</th>
            <th>Transporter</th>
            <th>Challan No</th>
            <th>E-Way Data</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length > 0 ? (
            vouchers.map((v, idx) => (
              <tr key={v.id || idx}>
                <td>{idx + 1}</td>
                <td>{v.id}</td>
                <td>{v.from_location_id}</td>
                <td>{v.to_location_id}</td>
                <td>{v.transporter}</td>
                <td>{v.challan_no}</td>
                <td title={v.eway_data}>{v.eway_data}</td>
                <td>{v.status}</td>
                <td>{v.created_by}</td>
                <td>{v.created_at ? new Date(v.created_at).toLocaleString() : ""}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(v)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(v.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            !loading && (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                  No transfer vouchers found.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransferVouchers;
