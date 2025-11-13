import React, { useState, useEffect } from "react";
import "./notifications.css";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ from .env

const Notifications = () => {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const [lowStock, setLowStock] = useState(false);
  const [expiry, setExpiry] = useState(false);
  const [dailyReports, setDailyReports] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [smtpServer, setSmtpServer] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing notification settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/`);
        const data = await res.json();
        const n = data.notifications || {};

        setEmailEnabled(n.NOTIFY_EMAIL_ENABLED === "true");
        setSmsEnabled(n.NOTIFY_SMS_ENABLED === "true");
        setLowStock(n.NOTIFY_LOW_STOCK === "true");
        setExpiry(n.NOTIFY_EXPIRY === "true");
        setDailyReports(n.NOTIFY_DAILY_REPORT === "true");

        setEmailAddress(n.NOTIFY_EMAIL || "");
        setPhoneNumber(n.NOTIFY_SMS_PHONE || "");

        setSmtpServer(n.SMTP_HOST || "");
        setPort(n.SMTP_PORT || "");
        setUsername(n.SMTP_USER || "");
        setPassword(n.SMTP_PASSWORD || "");
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Save all notification settings
  const handleSave = async () => {
    setLoading(true);

    const settingsData = {
      NOTIFY_EMAIL_ENABLED: emailEnabled,
      NOTIFY_SMS_ENABLED: smsEnabled,
      NOTIFY_LOW_STOCK: lowStock,
      NOTIFY_EXPIRY: expiry,
      NOTIFY_DAILY_REPORT: dailyReports,
      NOTIFY_EMAIL: emailAddress,
      NOTIFY_SMS_PHONE: phoneNumber,
      SMTP_HOST: smtpServer,
      SMTP_PORT: port,
      SMTP_USER: username,
      SMTP_PASSWORD: password,
    };

    try {
      // Save each key-value pair using KVDetailView (PUT)
      for (const [key, value] of Object.entries(settingsData)) {
        await fetch(`${API_BASE_URL}/api/settings/${key}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        });
      }

      alert("✅ Notification preferences saved successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("❌ Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    alert("Testing SMTP connection (mock).");
  };

  return (
    <div className="tax-section notifications-container">
      <h2 style={{ marginBottom: "16px" }}>Notification Preferences</h2>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Configure how and when you receive notifications.
      </p>

      {/* Email Notifications Card */}
      <div className="tax-card">
        <h3>Email Notifications</h3>
        <div className="payment-methods">
          <div className="payment-row">
            <label>Enable Email Notifications</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={() => setEmailEnabled(!emailEnabled)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {emailEnabled && (
            <>
              <div className="payment-row">
                <label>Low Stock Alerts</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={lowStock}
                    onChange={() => setLowStock(!lowStock)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="payment-row">
                <label>Expiry Alerts</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={expiry}
                    onChange={() => setExpiry(!expiry)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="payment-row">
                <label>Daily Reports</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={dailyReports}
                    onChange={() => setDailyReports(!dailyReports)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="alert-row-horizontal">
                <div className="alert-field">
                  <label>Notification Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SMS Notifications Card */}
      <div className="tax-card">
        <h3>SMS Notifications</h3>
        <div className="payment-methods">
          <div className="payment-row">
            <label>Enable SMS Notifications</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={() => setSmsEnabled(!smsEnabled)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {smsEnabled && (
            <div className="alert-row-horizontal">
              <div className="alert-field">
                <label>Notification Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Integration Card */}
      <div className="tax-card">
        <h3>Email Integration</h3>
        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>SMTP Server</label>
            <input
              type="text"
              placeholder="Enter SMTP server"
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
            />
          </div>
          <div className="alert-field">
            <label>Port</label>
            <input
              type="text"
              placeholder="Enter port number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
        </div>

        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="alert-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="save-btn-container">
          <button className="save-btn" onClick={handleTestConnection}>
            Test Connection
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-btn-container">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Notifications"}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
