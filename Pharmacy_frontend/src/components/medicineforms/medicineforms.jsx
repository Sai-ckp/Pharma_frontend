// src/components/Masters/medicineforms/medicineforms.jsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./medicineforms.css";

const empty = { id: "", name: "", description: "" };

export default function MedicineForms() {
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
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!window.confirm("Delete this form?")) return;
    save(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="mfWrap">
      <div className="mfHeader">
        <button className="mfBack" onClick={() => nav(-1)}>
          ← Back
        </button>
        <div className="mfHeadings">
          <h2>Medicine Forms</h2>
          <p>Manage all available medicine forms</p>
        </div>
        <button className="mfAdd" onClick={openAdd}>
          ＋ Add New
        </button>
      </div>

      <div className="mfCard">
        <table className="mfTable">
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
                  <td className="mfMuted">{r.description}</td>
                  <td className="mfActions">
                    <button
                      className="mfIcon"
                      title="Edit"
                      onClick={() => openEdit(r)}
                    >
                      ✎
                    </button>
                    <button
                      className="mfIcon danger"
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
                  No medicine forms yet. Click <strong>Add New</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="mfModalBackdrop" onMouseDown={closeForm}>
          <div
            className="mfModal"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mfModalHeader">
              <h3>
                {editingId ? "Edit Medicine Form" : "Add New Medicine Form"}
              </h3>
              <button className="mfClose" onClick={closeForm}>
                ✕
              </button>
            </div>

            <form className="mfForm" onSubmit={handleSubmit}>
              <label className="mfLabel">
                Name <span className="mfReq">*</span>
                <input
                  className={`mfInput ${errors.name ? "mfInputError" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Enter form name"
                  value={form.name}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.name && <div className="mfError">{errors.name}</div>}
              </label>

              <label className="mfLabel">
                Description
                <input
                  className="mfInput"
                  type="text"
                  name="description"
                  placeholder="Enter description (optional)"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <div className="mfBtnRow">
                <button
                  type="button"
                  className="mfBtn ghost"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="mfBtn primary">
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
