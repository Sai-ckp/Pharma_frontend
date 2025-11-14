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

  const settingsSections = [
    { name: "Business Details", icon: <Home size={24} /> },
    { name: "Alert Thresholds", icon: <AlertCircle size={24} /> },
    { name: "Tax & Billing", icon: <CreditCard size={24} /> },
    { name: "Backup & Restore", icon: <Database size={24} /> },
    { name: "Notifications", icon: <Bell size={24} /> },
  ];

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

  const [alertData, setAlertData] = useState({
    low_stock_threshold: "",
    out_of_stock_alert: "No",
    critical_expiry_days: "",
    warning_expiry_days: "",
    check_frequency: "",
    auto_remove_expired: "Manually only",
  });

  // ---------------------------------------------------------
  // 🚀 FETCH BUSINESS DETAILS & ALERT SETTINGS
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/business-profile/`);
        if (res.ok) {
          const data = await res.json();
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
      } catch (error) {
        console.error("❌ Error fetching business:", error);
      }
    };

    const fetchAlertSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/app/`);
        if (res.ok) {
          const data = await res.json();

          const alerts = data.alerts || {};

          setAlertData({
            low_stock_threshold: alerts.ALERT_LOW_STOCK_DEFAULT || "",
            out_of_stock_alert: alerts.OUT_OF_STOCK_ACTION || "No",
            critical_expiry_days: alerts.ALERT_EXPIRY_CRITICAL_DAYS || "",
            warning_expiry_days: alerts.ALERT_EXPIRY_WARNING_DAYS || "",
            check_frequency: alerts.ALERT_CHECK_FREQUENCY || "",
            auto_remove_expired: alerts.AUTO_REMOVE_EXPIRED || "Manually only",
          });
        }
      } catch (error) {
        console.error("❌ Error fetching alert data:", error);
      }
    };

    fetchBusinessDetails();
    fetchAlertSettings();
  }, []);

  // ---------------------------------------------------------
  // 🚀 FORM HANDLERS
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAlertChange = (e) => {
    setAlertData({ ...alertData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------
  // 🚀 SAVE BUSINESS DETAILS
  // ---------------------------------------------------------
  const handleSave = async () => {
    setLoading(true);
    try {
      const method = businessExists ? "PUT" : "POST";

      const response = await fetch(`${API_BASE_URL}/settings/business-profile/`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Business details saved successfully!");
        setBusinessExists(true);
      } else {
        alert("❌ Failed to save business details");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 🚀 HELPER: SAVE ONE SETTING KEY
  // ---------------------------------------------------------
  const saveSetting = async (key, value) => {
    const response = await fetch(`${API_BASE_URL}/settings/settings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
      const msg = await response.text();
      console.error(`❌ Failed to save ${key}:`, msg);
    }
  };

  // ---------------------------------------------------------
  // 🚀 SAVE ALERT SETTINGS (Correct: multiple POST calls)
  // ---------------------------------------------------------
  const handleAlertSave = async () => {
    setLoading(true);

    try {
      await saveSetting("ALERT_LOW_STOCK_DEFAULT", alertData.low_stock_threshold);
      await saveSetting("OUT_OF_STOCK_ACTION", alertData.out_of_stock_alert);
      await saveSetting(
        "ALERT_EXPIRY_CRITICAL_DAYS",
        alertData.critical_expiry_days
      );
      await saveSetting(
        "ALERT_EXPIRY_WARNING_DAYS",
        alertData.warning_expiry_days
      );
      await saveSetting("ALERT_CHECK_FREQUENCY", alertData.check_frequency);
      await saveSetting("AUTO_REMOVE_EXPIRED", alertData.auto_remove_expired);

      alert("✅ Alert thresholds saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save alerts");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 🚀 UI
  // ---------------------------------------------------------
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <h2 className="settings-heading">Manage application configuration</h2>

      <div className="settings-tab-container">
        {settingsSections.map((section) => (
          <div
            key={section.name}
            className={`settings-tab ${
              activeSection === section.name ? "active" : ""
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            {section.icon}
            <span>{section.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        {activeSection === "Business Details" && (
          <div className="business-section">
            <h2>
              <Home size={28} /> Business Information
            </h2>

            <div className="business-form">
              {Object.entries(formData).map(([key, value]) => (
                <div className="form-row" key={key}>
                  <label>{key.replace(/_/g, " ").toUpperCase()}</label>

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
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "Alert Thresholds" && (
          <div className="alert-section">
            <h2>
              <AlertCircle size={28} /> Alert Configuration
            </h2>

            <div className="alert-card">
              <h3>Inventory Alerts</h3>
              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Low Stock Threshold</label>
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

              <h3>Expiry Alerts</h3>
              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Critical Expiry Days</label>
                  <input
                    type="number"
                    name="critical_expiry_days"
                    value={alertData.critical_expiry_days}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="alert-field">
                  <label>Warning Expiry Days</label>
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
                  <label>Check Frequency</label>
                  <input
                    type="number"
                    name="check_frequency"
                    value={alertData.check_frequency}
                    onChange={handleAlertChange}
                  />
                </div>

                <div className="alert-field">
                  <label>Auto Remove Expired</label>
                  <select
                    name="auto_remove_expired"
                    value={alertData.auto_remove_expired}
                    onChange={handleAlertChange}
                  >
                    <option value="Manually only">Manually only</option>
                    <option value="Automatically">Automatically</option>
                    <option value="Auto Remove (after 7 days)">
                      Auto Remove (after 7 days)
                    </option>
                  </select>
                </div>
              </div>

              <button
                className="save-btn"
                onClick={handleAlertSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {activeSection === "Tax & Billing" && <TaxBillingConfiguration />}
        {activeSection === "Backup & Restore" && <BackupRestore />}
        {activeSection === "Notifications" && <Notifications />}
      </div>
    </div>
  );
};

export default SettingsDashboard;
