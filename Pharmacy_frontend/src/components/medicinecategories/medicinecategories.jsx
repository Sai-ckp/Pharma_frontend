import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./medicinecategories.css";

const USE_LOCAL_STORAGE = false;
const LS_KEY = "medicine_categories";

const empty = { id: "", name: "", description: "" };

export default function MedicineCategories() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const save = (next) => setRows(next);

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
    if (!window.confirm("Delete this category?")) return;
    save(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="mcWrap">
      <div className="mcHeader">
        <button className="mcBack" onClick={() => nav(-1)}>
          ← Back
        </button>
        <div className="mcHeadings">
          <h2>Medicine Categories</h2>
        </div>
        <button className="mcAdd" onClick={openAdd}>
          ＋ Add New
        </button>
      </div>

      <div className="mcCard">
        <table className="mcTable">
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Name</th>
              <th>Description</th>
              <th style={{ width: 140, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td className="mcMuted">{r.description}</td>
                  <td className="mcActions">
                    <button
                      className="mcIcon"
                      title="Edit"
                      onClick={() => openEdit(r)}
                    >
                      ✎
                    </button>
                    <button
                      className="mcIcon danger"
                      title="Delete"
                      onClick={() => handleDelete(r.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: 16 }}>
                  No medicine categories yet. Click <strong>Add New</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="mcModalBackdrop" onMouseDown={closeForm}>
          <div
            className="mcModal"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mcModalHeader">
              <h3>
                {editingId ? "Edit Medicine Category" : "Add New Medicine Category"}
              </h3>
              <button className="mcClose" onClick={closeForm}>
                ✕
              </button>
            </div>

            <form className="mcForm" onSubmit={handleSubmit}>
              <label className="mcLabel">
                Name <span className="mcReq">*</span>
                <input
                  className={`mcInput ${errors.name ? "mcInputError" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.name && <div className="mcError">{errors.name}</div>}
              </label>

              <label className="mcLabel">
                Description
                <input
                  className="mcInput"
                  type="text"
                  name="description"
                  placeholder="Enter description (optional)"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <div className="mcBtnRow">
                <button type="button" className="mcBtn ghost" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="mcBtn primary">
                  {editingId ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
