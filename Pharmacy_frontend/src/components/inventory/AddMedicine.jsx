import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inventory.css";
import { authFetch } from "../../api/http";

const rawBase = import.meta.env.VITE_API_URL || "";
const normalizeBase = (u) =>
  u
    .trim()
    .replace(/\/+$/g, "")
    .replace(/\/api\/v1$/i, "");

const API_BASE = normalizeBase(rawBase);

// Endpoints
const ADD_API = `${API_BASE}/api/v1/inventory/add-medicine/`;
const CATEGORY_API = `${API_BASE}/api/v1/catalog/categories/`;
const FORMS_API = `${API_BASE}/api/v1/catalog/forms/`;
const UOMS_API = `${API_BASE}/api/v1/catalog/uoms/`;
const RACKS_API = `${API_BASE}/api/v1/inventory/rack-locations/`;

const emptyForm = {
  medicine_id: "",
  medicine_name: "",
  generic_name: "",
  category: "",
  medicine_form: "",
  strength: "",
  base_uom: "",
  tablets_per_strip: "",
  strips_per_box: "",
  quantity_uom: "",
  selling_uom: "",
  manufacturer: "",
  quantity: "",
  mrp: "",
  purchase_price: "",
  expiry_date: "",
  mfg_date: "",
  gst_percent: "",
  rack_location: "",
  description: "",
  reorder_level: "",
  batch_number: "",
  storage_instructions: "",
};

// ---------------- TOKEN REFRESH ----------------
async function tryRefreshToken() {
  try {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;

    const refreshUrl = `${API_BASE}/api/v1/auth/token/refresh/`;
    const r = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!r.ok) return false;

    const body = await r.json();
    if (body.access) localStorage.setItem("access", body.access);
    if (body.refresh) localStorage.setItem("refresh", body.refresh);
    return true;
  } catch (e) {
    return false;
  }
}

async function fetchWithAuthRetry(url, options = {}) {
  let response = await authFetch(url, options);
  if (response.status !== 401) return response;

  const refreshed = await tryRefreshToken();
  if (!refreshed) return response;

  return await authFetch(url, options);
}

// ---------------- COMPONENT --------------------
export default function AddMedicine() {
  const nav = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [forms, setForms] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(true);

  // Load master data
  useEffect(() => {
    async function load() {
      try {
        const [c, f, u, r] = await Promise.all([
          authFetch(CATEGORY_API),
          authFetch(FORMS_API),
          authFetch(UOMS_API),
          authFetch(RACKS_API),
        ]);

        setCategories((await c.json())?.results || []);
        setForms((await f.json())?.results || []);
        setUoms((await u.json())?.results || []);
        setRacks((await r.json())?.results || []);
      } catch (e) {
        console.log("Master load error", e);
      } finally {
        setLoadingMasters(false);
      }
    }
    load();
  }, []);

  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // VALIDATION
  const validate = () => {
    const e = {};
    if (!form.medicine_name) e.medicine_name = "Required";
    if (!form.category) e.category = "Required";
    if (!form.medicine_form) e.medicine_form = "Required";
    if (!form.base_uom) e.base_uom = "Required";
    if (!form.quantity) e.quantity = "Required";
    if (!form.quantity_uom) e.quantity_uom = "Required";
    if (!form.purchase_price) e.purchase_price = "Required";
    if (!form.mrp) e.mrp = "Required";
    if (!form.batch_number) e.batch_number = "Required";
    if (!form.expiry_date) e.expiry_date = "Required";
    if (!form.reorder_level) e.reorder_level = "Required";

    return e;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    setSubmitting(true);
    setServerError("");

    // Compute units_per_pack automatically
let unitsPerPack = 1;
const tabletsPerStrip = Number(form.tablets_per_strip) || 1;
const stripsPerBox = Number(form.strips_per_box) || 1;

if (form.base_uom && form.quantity_uom && form.base_uom !== form.quantity_uom) {
  // Determine units per pack depending on UOM hierarchy
  // Assuming UOM order: 1=Tablet, 2=Strip, 3=Box (adjust IDs if different)
  if (Number(form.quantity_uom) === Number(form.base_uom) + 1) {
    // e.g., quantity_uom = strip, base = tablet
    unitsPerPack = tabletsPerStrip;
  } else if (Number(form.quantity_uom) === Number(form.base_uom) + 2) {
    // e.g., quantity_uom = box, base = tablet
    unitsPerPack = tabletsPerStrip * stripsPerBox;
  } else {
    unitsPerPack = 1;
  }
}

const payload = {
  location_id: 1,
  medicine: {
    name: form.medicine_name,
    generic_name: form.generic_name,
    category: Number(form.category),
    form: Number(form.medicine_form),
    strength: form.strength,
    base_uom: Number(form.base_uom),
    pack_unit: Number(form.quantity_uom),
    selling_uom: form.selling_uom ? Number(form.selling_uom) : null,
    rack_location: form.rack_location ? Number(form.rack_location) : null,
    tablets_per_strip: form.tablets_per_strip ? tabletsPerStrip : null,
    strips_per_box: form.strips_per_box ? stripsPerBox : null,
    gst_percent: form.gst_percent ? String(form.gst_percent) : "0",
    reorder_level: form.reorder_level ? Number(form.reorder_level) : null,
    mrp: form.mrp ? String(form.mrp) : "0",
    description: form.description,
    storage_instructions: form.storage_instructions,
    units_per_pack: unitsPerPack, // optional, but safe to send
  },

  batch: {
    batch_number: form.batch_number,
    mfg_date: form.mfg_date || null,
    expiry_date: form.expiry_date,
    quantity: Number(form.quantity),
    quantity_uom: Number(form.quantity_uom),
    purchase_price: String(form.purchase_price),
    units_per_pack: unitsPerPack, // ✅ crucial
  },
};


    try {
      const res = await fetchWithAuthRetry(ADD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setServerError(JSON.stringify(body || "Save failed"));
        return;
      }

      nav("/inventory/medicines");
    } catch (err) {
      setServerError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UI ----------------------
  return (
    <div className="inv-form-wrap">
      <div className="inv-form-header">
        <button
          className="btn-secondary"
          style={{ marginBottom: "10px" }}
          onClick={() => nav(-1)}
        >
          ← Back
        </button>

        <h2>Add New Medicine</h2>
        <p>Enter the medicine details</p>
      </div>

      <div className="inv-form-card">
        {serverError && <div className="inv-error-banner">{serverError}</div>}

        <form className="grid2" onSubmit={handleSubmit}>
          {/* Medicine Name */}
          <div className="field">
            <label>Medicine Name *</label>
            <input
              name="medicine_name"
              value={form.medicine_name}
              onChange={change}
              className={errors.medicine_name ? "error" : ""}
            />
            {errors.medicine_name && <div className="err">{errors.medicine_name}</div>}
          </div>

          {/* Generic */}
          <div className="field">
            <label>Generic Name</label>
            <input name="generic_name" value={form.generic_name} onChange={change} />
          </div>

          {/* Category */}
          <div className="field">
            <label>Category *</label>
            {loadingMasters ? (
              <div>Loading...</div>
            ) : (
              <select
                name="category"
                value={form.category}
                onChange={change}
                className={errors.category ? "error" : ""}
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            {errors.category && <div className="err">{errors.category}</div>}
          </div>

          {/* Rack Location */}
          <div className="field">
            <label>Rack Location</label>
            <select
              name="rack_location"
              value={form.rack_location}
              onChange={change}
            >
              <option value="">Select</option>
              {racks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.rack_location || r.name || "Rack"}
                </option>
              ))}
            </select>
          </div>

          {/* Medicine Form */}
          <div className="field">
            <label>Medicine Form *</label>
            <select
              name="medicine_form"
              value={form.medicine_form}
              onChange={change}
              className={errors.medicine_form ? "error" : ""}
            >
              <option value="">Select</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {errors.medicine_form && <div className="err">{errors.medicine_form}</div>}
          </div>

          {/* Strength */}
          <div className="field">
            <label>Strength</label>
            <input name="strength" value={form.strength} onChange={change} />
          </div>

          {/* Base UOM */}
          <div className="field">
            <label>Base UOM *</label>
            <select
              name="base_uom"
              value={form.base_uom}
              onChange={change}
              className={errors.base_uom ? "error" : ""}
            >
              <option value="">Select</option>
              {uoms.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.base_uom && <div className="err">{errors.base_uom}</div>}
          </div>

          {/* Tablets per Strip */}
          <div className="field">
            <label>Tablets per Strip</label>
            <input
              name="tablets_per_strip"
              value={form.tablets_per_strip}
              onChange={change}
            />
          </div>

          {/* Strips per Box */}
          <div className="field">
            <label>Strips per Box</label>
            <input
              name="strips_per_box"
              value={form.strips_per_box}
              onChange={change}
            />
          </div>

          {/* Quantity */}
          <div className="field">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={change}
              className={errors.quantity ? "error" : ""}
            />
            {errors.quantity && <div className="err">{errors.quantity}</div>}
          </div>

          {/* Quantity UOM */}
          <div className="field">
            <label>Quantity UOM *</label>
            <select
              name="quantity_uom"
              value={form.quantity_uom}
              onChange={change}
              className={errors.quantity_uom ? "error" : ""}
            >
              <option value="">Select</option>
              {uoms.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.quantity_uom && <div className="err">{errors.quantity_uom}</div>}
          </div>

          {/* Selling UOM */}
          <div className="field">
            <label>Selling UOM</label>
            <select
              name="selling_uom"
              value={form.selling_uom}
              onChange={change}
            >
              <option value="">Select</option>
              {uoms.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Purchase Price */}
          <div className="field">
            <label>Purchase Price *</label>
            <input
              type="number"
              name="purchase_price"
              value={form.purchase_price}
              onChange={change}
              className={errors.purchase_price ? "error" : ""}
            />
            {errors.purchase_price && <div className="err">{errors.purchase_price}</div>}
          </div>

          {/* MRP */}
          <div className="field">
            <label>MRP *</label>
            <input
              type="number"
              name="mrp"
              value={form.mrp}
              onChange={change}
              className={errors.mrp ? "error" : ""}
            />
            {errors.mrp && <div className="err">{errors.mrp}</div>}
          </div>

          {/* Batch Number */}
          <div className="field">
            <label>Batch Number *</label>
            <input
              name="batch_number"
              value={form.batch_number}
              onChange={change}
              className={errors.batch_number ? "error" : ""}
            />
            {errors.batch_number && <div className="err">{errors.batch_number}</div>}
          </div>

          {/* Reorder Level */}
          <div className="field">
            <label>Reorder Level *</label>
            <input
              type="number"
              name="reorder_level"
              value={form.reorder_level}
              onChange={change}
              className={errors.reorder_level ? "error" : ""}
            />
            {errors.reorder_level && <div className="err">{errors.reorder_level}</div>}
          </div>

          {/* MFG Date */}
          <div className="field">
            <label>MFG Date</label>
            <input
              type="date"
              name="mfg_date"
              value={form.mfg_date}
              onChange={change}
            />
          </div>

          {/* Expiry Date */}
          <div className="field">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={change}
              className={errors.expiry_date ? "error" : ""}
            />
            {errors.expiry_date && <div className="err">{errors.expiry_date}</div>}
          </div>

          {/* GST */}
          <div className="field">
            <label>GST %</label>
            <input name="gst_percent" value={form.gst_percent} onChange={change} />
          </div>

          {/* Storage Instructions */}
          <div className="field">
            <label>Storage Instructions</label>
            <input
              name="storage_instructions"
              value={form.storage_instructions}
              onChange={change}
            />
          </div>

          {/* Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
            />
          </div>

          <div style={{ gridColumn: "1/3" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => nav("/inventory/medicines")}
              >
                Cancel
              </button>

              <button className="btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
