import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment_Methods.css";

const USE_LOCAL_STORAGE = false;
const LS_KEY = "payment_methods";

const empty = { id: "", name: "", description: "" };

export default function PaymentMethods() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(null);
  const [errors, setErrors] = useState({});

  // Load/persist (optional)
  useEffect(() => {
    if (!USE_LOCAL_STORAGE) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setRows(JSON.parse(raw));
    } catch {}
  }, []);
  const save = (next) => {
    setRows(next);
    if (USE_LOCAL_STORAGE) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    }
  };

  const nextId = useMemo(() => {
    const nums = rows.map((r) => Number(r.id) || 0);
    return (Math.max(0, ...nums) + 1).toString();
  }, [rows]);

  const openAdd = () => {
    setForm(empty);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };
  const openEdit = (r) => {
    setForm({ id: r.id, name: r.name, description: r.description || "" });
    setEditingId(r.id);
    setErrors({});
    setShowForm(true);
  };
  const openView = (r) => setShowView(r);
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    const payload = {
      id: editingId ? editingId : nextId,
      name: form.name.trim(),
      description: form.description?.trim() || "",
      created_at: editingId
        ? rows.find((x) => x.id === editingId)?.created_at
        : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      save(rows.map((r) => (r.id === editingId ? payload : r)));
    } else {
      save([payload, ...rows]);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    save(rows.filter((r) => r.id !== id));
  };

  // ESC closes modals
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showForm) closeForm();
        if (showView) setShowView(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showForm, showView]);

  return (
    <div className="pm-wrap">
      {/* Header */}
      <div className="pm-header">
        <button className="pm-back" onClick={() => nav(-1)}>← Back</button>
        <div className="pm-headings">
          <h2>Payment Methods</h2>
          {/* <p>Cash, Card, UPI, Credit, etc.</p> */}
        </div>
        <button className="pm-add" onClick={openAdd}>＋ Add New</button>
      </div>

      {/* List card */}
      <div className="pm-card">
        <table className="pm-table">
          <thead>
            <tr>
              <th style={{width:"35%"}}>Name</th>
              <th>Description</th>
              <th style={{width:140, textAlign:"right"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((r, i) => (
              <tr key={r.id || i}>
                <td>{r.name}</td>
                <td className="pm-muted">{r.description}</td>
                <td className="pm-actions">
                  <button className="pm-icon" title="View" onClick={() => openView(r)}>👁️</button>
                  <button className="pm-icon" title="Edit" onClick={() => openEdit(r)}>✎</button>
                  <button className="pm-icon danger" title="Delete" onClick={() => handleDelete(r.id)}>🗑️</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} style={{textAlign:"center", padding:16}}>
                  No payment methods yet. Click <strong>Add New</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="pm-modal-backdrop" onMouseDown={closeForm}>
          <div className="pm-modal" onMouseDown={(e)=>e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="pm-modal-header">
              <h3>{editingId ? "Edit Payment Method" : "Add New Payment Method"}</h3>
              <button className="pm-close" onClick={closeForm}>✕</button>
            </div>

            <form className="pm-form" onSubmit={handleSubmit}>
              <label className="pm-label">
                Name <span className="pm-req">*</span>
                <input
                  className={`pm-input ${errors.name ? "pm-input-error" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.name && <div className="pm-error">{errors.name}</div>}
              </label>

              <label className="pm-label">
                Description
                <input
                  className="pm-input"
                  type="text"
                  name="description"
                  placeholder="Enter description (optional)"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <div className="pm-btn-row">
                <button type="button" className="pm-btn ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="pm-btn primary">
                  {editingId ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && (
        <div className="pm-modal-backdrop" onMouseDown={() => setShowView(null)}>
          <div className="pm-modal" onMouseDown={(e)=>e.stopPropagation()}>
            <div className="pm-modal-header">
              <h3>View Payment Method</h3>
              <button className="pm-close" onClick={() => setShowView(null)}>✕</button>
            </div>
            <div className="pm-view">
              <div className="pm-view-row"><span className="pm-view-label">Name</span><span className="pm-view-value">{showView.name || "-"}</span></div>
              <div className="pm-view-row"><span className="pm-view-label">Description</span><span className="pm-view-value">{showView.description || "-"}</span></div>
              <div className="pm-view-row"><span className="pm-view-label">Created</span><span className="pm-view-value">{showView.created_at ? new Date(showView.created_at).toLocaleString() : "-"}</span></div>
              <div className="pm-view-row"><span className="pm-view-label">Updated</span><span className="pm-view-value">{showView.updated_at ? new Date(showView.updated_at).toLocaleString() : "-"}</span></div>
            </div>
            <div className="pm-btn-row">
              <button className="pm-btn ghost" onClick={() => setShowView(null)}>Close</button>
              <button className="pm-btn" onClick={() => { setShowView(null); openEdit(showView); }}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
