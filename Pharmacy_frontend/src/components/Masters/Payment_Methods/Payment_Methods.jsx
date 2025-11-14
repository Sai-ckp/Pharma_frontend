import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment_Methods.css";
import { Eye, Pencil, Trash2 } from "lucide-react";

const USE_LOCAL_STORAGE = false;
const LS_KEY = "payment_methods";

const empty = { id: "", name: "", description: "" };

// Normalize VITE_API_URL so both of these work correctly:
//  - http://127.0.0.1:8000
//  - http://127.0.0.1:8000/api/v1
const rawBase = import.meta.env.VITE_API_URL || "";

// Removes whitespace, trailing slashes, and trailing "/api/v1"
const normalizeBase = (u) =>
  u
    .trim()
    .replace(/\/+$/g, "")      // strip ending slashes
    .replace(/\/api\/v1$/i, ""); // strip ending /api/v1 if present

const API_BASE = normalizeBase(rawBase);

// Final API endpoint — always correct
const API = `${API_BASE}/api/v1/settings/payment-methods/`;

export default function PaymentMethods() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);

  // If API returns a total count (pagination), we store it here.
  // Otherwise we'll simply use rows.length which reflects realtime client state.
  const [totalCount, setTotalCount] = useState(null);

  // Load from local storage if enabled (fallback)
  useEffect(() => {
    if (!USE_LOCAL_STORAGE) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setRows(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist local storage if enabled
  const saveLocal = (next) => {
    setRows(next);
    if (USE_LOCAL_STORAGE) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {}
    }
  };

  // Fetch from backend
  const fetchList = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch(API, { headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      // Expecting an array. If API returns {results: [...], count: N}, handle that.
      const list = Array.isArray(data) ? data : data?.results || [];
      setRows(list);
      // If the API provided a count (common with paginated endpoints), store it
      if (!Array.isArray(data) && typeof data?.count === "number") {
        setTotalCount(data.count);
      } else {
        setTotalCount(list.length);
      }

      if (USE_LOCAL_STORAGE) try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Error loading payment methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep totalCount in sync with the realtime rows when API doesn't provide a separate count.
  useEffect(() => {
    // Only overwrite totalCount if it's null or matches previous rows length —
    // this avoids clobbering a server-provided count when it's intentionally different (paginated).
    setTotalCount((prev) => (prev === null || prev === rows.length ? rows.length : prev));
  }, [rows]);

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

  // CREATE or UPDATE to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    setSaving(true);
    setServerError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
    };

    try {
      if (editingId) {
        const res = await fetch(`${API}${editingId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Update failed (${res.status})`);
        const updated = await res.json();
        setRows((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
      } else {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed (${res.status})`);
        const created = await res.json();
        setRows((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Save failed");
      // As a fallback: refetch full list to sync
      await fetchList();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    setSaving(true);
    setServerError(null);
    try {
      const res = await fetch(`${API}${id}/`, { method: "DELETE", headers: { "Accept": "application/json" } });
      if (!res.ok && res.status !== 204) throw new Error(`Delete failed (${res.status})`);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Delete failed");
      await fetchList();
    } finally {
      setSaving(false);
    }
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
        <button className="pm-back" onClick={() => nav(-1)} disabled={loading}>← Back</button>
        <div className="pm-headings">
          <h2>Payment Methods</h2>
          {/* Realtime total display: prefer server-provided totalCount when available, fall back to rows.length */}
        </div>
        <button className="pm-add" onClick={openAdd} disabled={loading || saving}>＋ Add New</button>
      </div>

      {/* Server error / loading */}
      {serverError && <div style={{ color: "crimson", padding: 8 }}>{serverError}</div>}
      {loading ? (
        <div style={{ padding: 20 }}>Loading...</div>
      ) : (
        <div className="pm-card">
          <table className="pm-table">
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Name</th>
                <th>Description</th>
                <th style={{ width: 140, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r, i) => (
                  <tr key={r.id || i}>
                    <td>{r.name}</td>
                    <td className="pm-muted">{r.description}</td>
                    <td className="pm-actions">
                      <button className="pm-icon" title="View" onClick={() => openView(r)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#136FD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>

<button className="pm-icon" title="Edit" onClick={() => openEdit(r)}>
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#000" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="M12 17l5-5"></path>
    <path d="M15 10l2 2"></path>
  </svg>
</button>


                      <button className="pm-icon danger" title="Delete" onClick={() => handleDelete(r.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E23636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                        </svg>
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 16 }}>
                    No payment methods yet. Click <strong>Add New</strong>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="pm-modal-backdrop" onMouseDown={closeForm}>
          <div className="pm-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
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
                <button type="button" className="pm-btn ghost" onClick={closeForm} disabled={saving}>Cancel</button>
                <button type="submit" className="pm-btn primary" disabled={saving}>
                  {saving ? (editingId ? "Saving..." : "Adding...") : editingId ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && (
        <div className="pm-modal-backdrop" onMouseDown={() => setShowView(null)}>
          <div className="pm-modal" onMouseDown={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
