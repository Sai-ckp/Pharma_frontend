import React, { useState, useEffect } from "react";
import { Home, AlertCircle, CreditCard, Database, Bell } from "lucide-react";
import "./settingsdashboard.css";
import TaxBillingConfiguration from "./TaxBillingConfiguration";
import Notifications from "./Notifications";
import BackupRestore from "./BackupRestore";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const SettingsDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [businessExists, setBusinessExists] = useState(false);

  // ✅ Tabs Configuration
  const settingsSections = [
    { name: "Business Details", icon: <Home size={24} /> },
    { name: "Alert Thresholds", icon: <AlertCircle size={24} /> },
    { name: "Tax & Billing", icon: <CreditCard size={24} /> },
    { name: "Backup & Restore", icon: <Database size={24} /> },
    { name: "Notifications", icon: <Bell size={24} /> },
  ];

  // ✅ Match Django model fields exactly
  const [formData, setFormData] = useState({
    business_name: "",
    email: "",
    phone: "",
    address: "",
    owner_name: "",
    registration_date: "",
    gst_number: "",
    pharmacy_license_number: "",
    drug_license_number: "",
  });

  // ✅ Alert Threshold data
  const [alertData, setAlertData] = useState({
    low_stock_threshold: "",
    out_of_stock_alert: "No",
    critical_expiry_days: "",
    warning_expiry_days: "",
    check_frequency: "",
    auto_remove_expired: "Manually only,",
  });

  // ✅ Fetch existing business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/business-profile/`);
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setBusinessExists(true);
            setFormData({
              business_name: data.business_name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
              owner_name: data.owner_name || "",
              registration_date: data.registration_date || "",
              gst_number: data.gst_number || "",
              pharmacy_license_number: data.pharmacy_license_number || "",
              drug_license_number: data.drug_license_number || "",
            });
          }
        } else {
          console.warn("⚠️ No existing business profile found.");
        }
      } catch (error) {
        console.error("❌ Error fetching business details:", error);
      }
    };
    fetchBusinessDetails();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAlertChange = (e) => {
    setAlertData({ ...alertData, [e.target.name]: e.target.value });
  };

  // ✅ Save business details
  const handleSave = async () => {
    setLoading(true);
    try {
      const method = businessExists ? "PUT" : "POST";

      const response = await fetch(`${API_BASE_URL}/settings/business-profile/`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Non-JSON response:", text);
      }

      if (response.ok) {
        alert(`✅ Business details ${businessExists ? "updated" : "saved"} successfully!`);
        console.log("Saved Data:", data);
        setBusinessExists(true);
      } else {
        console.error("❌ Failed to save business details:", data || text);
        alert("❌ Failed to save business details. Check console for details.");
      }
    } catch (err) {
      console.error("⚠️ Error saving business details:", err);
      alert("⚠️ Something went wrong while saving");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Alert Configuration
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
        console.error("❌ Failed to save alert thresholds");
        alert("❌ Failed to save alert thresholds");
      }
    } catch (err) {
      console.error("⚠️ Error saving alert thresholds:", err);
      alert("⚠️ Something went wrong while saving");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render UI
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <h2 className="settings-heading">Manage application configuration</h2>

      {/* ✅ Tabs Row */}
      <div className="settings-tab-container">
        {settingsSections.map((section) => (
          <div
            key={section.name}
            className={`settings-tab ${activeSection === section.name ? "active" : ""}`}
            onClick={() => setActiveSection(section.name)}
          >
            {section.icon}
            <span>{section.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        {/* ✅ Business Details Section */}
        {activeSection === "Business Details" && (
          <div className="business-section">
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Home size={28} /> Business Information
            </h2>
            <p style={{ color: "#555", marginBottom: 20 }}>
              Manage your pharmacy business details
            </p>

            <div className="business-form">
              {Object.entries(formData).map(([key, value]) => (
                <div className="form-row" key={key}>
                  <label>
                    {key.replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  {key === "address" ? (
                    <textarea name={key} value={value} onChange={handleChange} />
                  ) : key === "registration_date" ? (
                    <input
                      type="date"
                      name={key}
                      value={value}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
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

        {/* ✅ Alert Threshold Section */}
        {activeSection === "Alert Thresholds" && (
          <div className="alert-section">
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={28} /> Alert Threshold Configuration
            </h2>
            <p style={{ color: "#555", marginBottom: 20 }}>
              Configure inventory and expiry alerts
            </p>

            <div className="alert-card">
              <h3>Inventory Alerts</h3>
              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Low Stock Threshold (units)</label>
                  <input
                    type="number"
                    name="low_stock_threshold"
                    value={alertData.low_stock_threshold}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="alert-field">
                  <label>Out of Stock Alert</label>
                  <select
                    name="out_of_stock_alert"
                    value={alertData.out_of_stock_alert}
                    onChange={handleAlertChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <hr className="divider" />

              <h3>Expiry Alerts</h3>
              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Critical Expiry Period (days)</label>
                  <input
                    type="number"
                    name="critical_expiry_days"
                    value={alertData.critical_expiry_days}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="alert-field">
                  <label>Warning Expiry Period (days)</label>
                  <input
                    type="number"
                    name="warning_expiry_days"
                    value={alertData.warning_expiry_days}
                    onChange={handleAlertChange}
                  />
                </div>
              </div>

              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Check Frequency (days)</label>
                  <input
                    type="number"
                    name="check_frequency"
                    value={alertData.check_frequency}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="alert-field">
                  <label>Auto Remove Expired Items</label>
                  <select
                    name="auto_remove_expired"
                    value={alertData.auto_remove_expired}
                    onChange={handleAlertChange}
                  >
                    <option value="Manually only">Manually only</option>
                    <option value="Automatically">Auto Flag for Review</option>
                     <option value="Auto Remove (after 7 days)">Automatically</option>
                  </select>
                </div>
              </div>

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

        {/* ✅ Other Sections */}
        {activeSection === "Tax & Billing" && (
          <div className="tax-section">
            <TaxBillingConfiguration />
          </div>
        )}

        {activeSection === "Backup & Restore" && (
          <div className="tax-section">
            <BackupRestore />
          </div>
        )}

        {activeSection === "Notifications" && (
          <div className="alert-section">
            <Notifications />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsDashboard;
