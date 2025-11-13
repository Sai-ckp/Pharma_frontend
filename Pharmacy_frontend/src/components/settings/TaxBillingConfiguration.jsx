// src/components/TaxBilling/TaxBilling.jsx
import React, { useEffect, useState } from "react";
import "./taxbilling.css";
import { FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TaxBilling = () => {
  const [loading, setLoading] = useState(false);
  const [taxData, setTaxData] = useState({
    gstRate: "",
    taxMethod: "inclusive",
    cgstRate: "",
    sgstRate: "",
    invoicePrefix: "",
    invoiceStart: "",
    invoiceTemplate: "standard",
    invoiceFooter: "",
    cashPayment: true,
    cardPayment: false,
    upiPayment: false,
    creditSales: false,
  });

  // ✅ Fetch existing settings from /settings/
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/app/`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const settings = data[0];
            setTaxData({
              gstRate: settings.gst_rate || "",
              taxMethod: settings.tax_method || "inclusive",
              cgstRate: settings.cgst_rate || "",
              sgstRate: settings.sgst_rate || "",
              invoicePrefix: settings.invoice_prefix || "",
              invoiceStart: settings.invoice_start || "",
              invoiceTemplate: settings.invoice_template || "standard",
              invoiceFooter: settings.invoice_footer || "",
              cashPayment: settings.cash_payment ?? true,
              cardPayment: settings.card_payment ?? false,
              upiPayment: settings.upi_payment ?? false,
              creditSales: settings.credit_sales ?? false,
            });
          }
        } else {
          console.error("Failed to fetch tax & billing settings");
        }
      } catch (err) {
        console.error("Error fetching tax & billing settings:", err);
      }
    };

    fetchTaxData();
  }, []);

  // ✅ Handle Input Changes
  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxData({ ...taxData, [name]: value });
  };

  // ✅ Handle Toggle Switch
  const togglePayment = (field) => {
    setTaxData({ ...taxData, [field]: !taxData[field] });
  };

  // ✅ Save Tax & Billing Data
  const handleTaxSave = async () => {
    setLoading(true);

    const payload = {
      gst_rate: taxData.gstRate,
      tax_method: taxData.taxMethod,
      cgst_rate: taxData.cgstRate,
      sgst_rate: taxData.sgstRate,
      invoice_prefix: taxData.invoicePrefix,
      invoice_start: taxData.invoiceStart,
      invoice_template: taxData.invoiceTemplate,
      invoice_footer: taxData.invoiceFooter,
      cash_payment: taxData.cashPayment,
      card_payment: taxData.cardPayment,
      upi_payment: taxData.upiPayment,
      credit_sales: taxData.creditSales,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/settings/app/`, {
        method: "POST", // ✅ POST since PUT not allowed
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Tax & Billing Configuration Saved Successfully!");
      } else {
        const errText = await response.text();
        console.error("Save failed:", errText);
        alert("⚠️ Failed to save Tax & Billing configuration.");
      }
    } catch (err) {
      console.error("Error saving tax data:", err);
      alert("❌ Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-section">
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={28} /> Tax & Billing Configuration
      </h2>
      <p style={{ color: "#555", marginBottom: 20 }}>
        Configure tax rates and invoice settings
      </p>

      <div className="tax-card">
        {/* TAX SETTINGS */}
        <h3>Tax Settings</h3>

        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>GST Rate (%)</label>
            <input
              type="number"
              name="gstRate"
              value={taxData.gstRate}
              onChange={handleTaxChange}
            />
          </div>

          <div className="alert-field">
            <label>Tax Calculation Method</label>
            <select
              name="taxMethod"
              value={taxData.taxMethod}
              onChange={handleTaxChange}
            >
              <option value="inclusive">Tax Inclusive</option>
              <option value="exclusive">Tax Exclusive</option>
            </select>
          </div>
        </div>

        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>CGST Rate (%)</label>
            <input
              type="number"
              name="cgstRate"
              value={taxData.cgstRate}
              onChange={handleTaxChange}
            />
          </div>

          <div className="alert-field">
            <label>SGST Rate (%)</label>
            <input
              type="number"
              name="sgstRate"
              value={taxData.sgstRate}
              onChange={handleTaxChange}
            />
          </div>
        </div>

        <hr className="divider" />

        {/* INVOICE SETTINGS */}
        <h3>Invoice Settings</h3>
        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>Invoice Prefix</label>
            <input
              type="text"
              name="invoicePrefix"
              value={taxData.invoicePrefix}
              onChange={handleTaxChange}
            />
          </div>

          <div className="alert-field">
            <label>Starting Number</label>
            <input
              type="number"
              name="invoiceStart"
              value={taxData.invoiceStart}
              onChange={handleTaxChange}
            />
          </div>
        </div>

        <div className="alert-row-horizontal">
          <div className="alert-field">
            <label>Invoice Template</label>
            <select
              name="invoiceTemplate"
              value={taxData.invoiceTemplate}
              onChange={handleTaxChange}
            >
              <option value="standard">Standard</option>
              <option value="modern">Detailed</option>
              <option value="minimal">Compact</option>
            </select>
          </div>

          <div className="alert-field">
            <label>Invoice Footer Text</label>
            <input
              type="text"
              name="invoiceFooter"
              value={taxData.invoiceFooter}
              onChange={handleTaxChange}
            />
          </div>
        </div>

        <hr className="divider" />

        {/* PAYMENT METHODS */}
        <h3>Payment Methods</h3>
        <div className="payment-methods">
          {[
            ["cashPayment", "Cash Payment", "Accept cash payments"],
            ["cardPayment", "Card Payment", "Accept debit/credit card payments"],
            ["upiPayment", "UPI Payment", "Accept UPI and QR-based payments"],
            ["creditSales", "Credit Sales", "Allow credit sales for customers"],
          ].map(([key, label, desc]) => (
            <div className="payment-row" key={key}>
              <div>
                <label>{label}</label>
                <p>{desc}</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={taxData[key]}
                  onChange={() => togglePayment(key)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>

        <div className="save-btn-container">
          <button
            className="save-btn"
            onClick={handleTaxSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxBilling;
