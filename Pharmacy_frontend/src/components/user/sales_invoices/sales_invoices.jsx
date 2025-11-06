import React, { useEffect, useState } from "react";
import "./sales_invoices.css";

const SalesInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    invoice_no: "",
    location_id: "",
    customer_id: "",
    created_by: "",
    invoice_date: "",
    place_of_supply: "",
    buyer_gstin: "",
    gross_total: "",
    tax_total: "",
    net_total: "",
    disclaimers: "",
    created_at: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // 🚫 No dummy data — start empty or replace with API fetch here
    setInvoices([]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      invoice_no: "",
      location_id: "",
      customer_id: "",
      created_by: "",
      invoice_date: "",
      place_of_supply: "",
      buyer_gstin: "",
      gross_total: "",
      tax_total: "",
      net_total: "",
      disclaimers: "",
      created_at: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      ...formData,
      id: editingId ? editingId : Math.max(0, ...invoices.map((i) => Number(i.id) || 0)) + 1,
    };

    if (editingId) {
      setInvoices((prev) => prev.map((i) => (i.id === editingId ? newInvoice : i)));
      alert("✅ Invoice updated!");
    } else {
      setInvoices((prev) => [newInvoice, ...prev]);
      alert("✅ Invoice added!");
    }
    resetForm();
  };

  const handleEdit = (inv) => {
    setFormData(inv);
    setEditingId(inv.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this invoice?")) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      alert("🗑️ Invoice deleted!");
    }
  };

  return (
    <div className="sales-invoices-container">
      <h2>Sales Invoices</h2>

      <form className="sales-invoices-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="invoice_no"
          placeholder="Invoice No"
          value={formData.invoice_no}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location_id"
          placeholder="Location ID"
          value={formData.location_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
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
          Invoice Date
          <input
            type="datetime-local"
            name="invoice_date"
            value={formData.invoice_date}
            onChange={handleChange}
          />
        </label>
        <input
          type="text"
          name="place_of_supply"
          placeholder="Place of Supply"
          value={formData.place_of_supply}
          onChange={handleChange}
        />
        <input
          type="text"
          name="buyer_gstin"
          placeholder="Buyer GSTIN"
          value={formData.buyer_gstin}
          onChange={handleChange}
        />
        <input
          type="number"
          name="gross_total"
          placeholder="Gross Total"
          value={formData.gross_total}
          onChange={handleChange}
        />
        <input
          type="number"
          name="tax_total"
          placeholder="Tax Total"
          value={formData.tax_total}
          onChange={handleChange}
        />
        <input
          type="number"
          name="net_total"
          placeholder="Net Total"
          value={formData.net_total}
          onChange={handleChange}
        />
        <textarea
          name="disclaimers"
          placeholder="Disclaimers"
          rows="2"
          value={formData.disclaimers}
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

        <button type="submit">{editingId ? "Update Invoice" : "Add Invoice"}</button>
      </form>

      <h3 className="sales-invoices-list-title">Invoice List</h3>

      <table className="sales-invoices-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>Gross</th>
            <th>Tax</th>
            <th>Net</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((inv, idx) => (
              <tr key={inv.id}>
                <td>{idx + 1}</td>
                <td>{inv.id}</td>
                <td>{inv.invoice_no}</td>
                <td>{inv.customer_id}</td>
                <td>{inv.gross_total}</td>
                <td>{inv.tax_total}</td>
                <td>{inv.net_total}</td>
                <td>{inv.created_by}</td>
                <td>{inv.created_at ? new Date(inv.created_at).toLocaleString() : ""}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(inv)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(inv.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesInvoices;
