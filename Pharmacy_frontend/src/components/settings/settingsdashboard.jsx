import React, { useState, useEffect } from "react";
import { Home, AlertCircle, CreditCard, Database } from "lucide-react";
import "./settingsdashboard.css";
import TaxBillingConfiguration from "./TaxBillingConfiguration";



const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ from .env

const SettingsDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const settingsSections = [
    { name: "Business Details", icon: <Home size={24} /> },
    { name: "Alert Thresholds", icon: <AlertCircle size={24} /> },
    { name: "Tax & Billing", icon: <CreditCard size={24} /> },
    { name: "Backup & Restore", icon: <Database size={24} /> },
  ];





  const [formData, setFormData] = useState({
    businessName: "",
    pharmacyLicense: "",
    gstNumber: "",
    drugLicense: "",
    contactPhone: "",
    email: "",
    businessAddress: "",
    ownerName: "",
    registrationDate: "",
  });

  const [alertData, setAlertData] = useState({
    lowStockThreshold: "",
    outOfStockAlert: "No",
    criticalExpiryDays: "",
    warningExpiryDays: "",
  });

  // ✅ Fetch existing business details when component loads
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/business-profile/`);
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setFormData({
              businessName: data.businessName || "",
              pharmacyLicense: data.pharmacyLicense || "",
              gstNumber: data.gstNumber || "",
              drugLicense: data.drugLicense || "",
              contactPhone: data.contactPhone || "",
              email: data.email || "",
              businessAddress: data.businessAddress || "",
              ownerName: data.ownerName || "",
              registrationDate: data.registrationDate || "",
            });
          }
        }
      } catch (error) {
        console.error("❌ Error fetching details:", error);
      }
    };
    fetchBusinessDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAlertChange = (e) => {
    setAlertData({ ...alertData, [e.target.name]: e.target.value });
  };


  // ✅ Save to database
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings/business-profile/`, {
        method: "POST", // or PUT if you’re updating an existing record
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("✅ Business details saved successfully!");
        console.log("Saved Data:", data);
      } else {
        const errorText = await response.text();
        console.error("Failed to save:", errorText);
        alert("❌ Failed to save business details");
      }
    } catch (err) {
      console.error("⚠️ Error saving details:", err);
      alert("⚠️ Something went wrong while saving");
    } finally {
      setLoading(false);
    }
  };


   // ✅ Save Alert Config
  const handleAlertSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings/alert-thresholds/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      });
      if (response.ok) {
        alert("✅ Alert thresholds saved successfully!");
      } else {
        alert("❌ Failed to save alert thresholds");
      }
    } catch (err) {
      alert("⚠️ Something went wrong while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <h2 className="settings-heading">Manage application configuration</h2>

      {/* Clickable Cards */}
      <div
        className="settings-cards"
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        {settingsSections.map((section) => (
          <div
            key={section.name}
            className="settings-card"
            style={{
              flex: "1 1 200px",
              padding: 20,
              background: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: 12,
              cursor: "pointer",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
            onClick={() => setActiveSection(section.name)}
          >
            {section.icon}
            <h3 style={{ marginTop: 10 }}>{section.name}</h3>
          </div>
        ))}
      </div>

      {/* Inline Section Content */}
      <div style={{ marginTop: 40 }}>
        {activeSection === "Business Details" && (
          <div className="business-section">
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Home size={28} /> Business Information
            </h2>
            <p style={{ color: "#555", marginBottom: 20 }}>
              Manage your pharmacy business details
            </p>

            <div className="business-form">
              {Object.keys(formData).map((key) => (
                <div className="form-row" key={key}>
                  <label>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {key === "businessAddress" ? (
                    <textarea
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  ) : key === "registrationDate" ? (
                    <input
                      type="date"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              <button
                className="save-btn"
                style={{
                  marginTop: 20,
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  float: "right",
                }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}


        {/* ✅ ALERT THRESHOLDS */}
{activeSection === "Alert Thresholds" && (
  <div className="alert-section">
    <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <AlertCircle size={28} /> Alert Threshold Configuration
    </h2>
    <p style={{ color: "#555", marginBottom: 20 }}>
      Configure inventory and expiry alerts
    </p>

    <div className="alert-card">
      {/* 🧩 Inventory Alerts */}
      <h3>Inventory Alerts</h3>

      <div className="alert-row-horizontal">
  <div className="alert-field">
    <label>Low Stock Threshold (units)</label>
    <input
      type="number"
      name="lowStockThreshold"
      value={alertData.lowStockThreshold}
      onChange={handleAlertChange}
    />
  </div>

  <div className="alert-field">
    <label>Out of Stock Alert</label>
    <select
      name="outOfStockAlert"
      value={alertData.outOfStockAlert}
      onChange={handleAlertChange}
    >
      <option value="No">No</option>
      <option value="Yes">Yes</option>
    </select>
  </div>
</div>

      {/* 🔹 Divider line */}
      <hr className="divider" />

      {/* 🧩 Expiry Alerts */}
<h3>Expiry Alerts</h3>

<div className="alert-row-horizontal">
  <div className="alert-field">
    <label>Critical Expiry Period (days)</label>
    <input
      type="number"
      name="criticalExpiryDays"
      value={alertData.criticalExpiryDays}
      onChange={handleAlertChange}
    />
  </div>

  <div className="alert-field">
    <label>Warning Expiry Period (days)</label>
    <input
      type="number"
      name="warningExpiryDays"
      value={alertData.warningExpiryDays}
      onChange={handleAlertChange}
    />
  </div>
</div>

<div className="alert-row-horizontal">
  <div className="alert-field">
    <label>Check Frequency (days)</label>
    <input
      type="number"
      name="checkFrequency"
      value={alertData.checkFrequency}
      onChange={handleAlertChange}
    />
  </div>

  <div className="alert-field">
    <label>Auto Remove Expired Items</label>
    <select
      name="autoRemoveExpired"
      value={alertData.autoRemoveExpired}
      onChange={handleAlertChange}
    >
      <option value="Manually only">Manually only</option>
    </select>
  </div>
</div>


      {/* ✅ Save button inside the card */}
      <button
        className="save-btn"
        style={{
          marginTop: 6,
          fontSize: "0.8rem",
          padding: "6px 12px",
          float: "right",
        }}
        onClick={handleAlertSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
)}


  {/* ✅ TAX & BILLING CONFIGURATION */}
{activeSection === "Tax & Billing" && (
  <div className="alert-section">
    <TaxBillingConfiguration />
  </div>
)}

      </div>
    </div>
  );
};



export default SettingsDashboard;
