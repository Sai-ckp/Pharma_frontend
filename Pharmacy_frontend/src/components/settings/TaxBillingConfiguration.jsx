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

  // ✅ Fetch from /settings/app/
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/app/`);
        if (!response.ok) return;

        const data = await response.json();

        setTaxData({
          gstRate: data.tax?.TAX_GST_RATE || "",
          taxMethod: data.tax?.TAX_CALC_METHOD?.toLowerCase() || "inclusive",
          cgstRate: data.tax?.TAX_CGST_RATE || "",
          sgstRate: data.tax?.TAX_SGST_RATE || "",
          invoicePrefix: data.invoice?.INVOICE_PREFIX || "",
          invoiceStart: data.invoice?.INVOICE_START || "",
          invoiceTemplate: data.invoice?.INVOICE_TEMPLATE || "standard",
          invoiceFooter: data.invoice?.INVOICE_FOOTER || "",
          cashPayment: data.notifications?.CASH_PAYMENT === "true",
          cardPayment: data.notifications?.CARD_PAYMENT === "true",
          upiPayment: data.notifications?.UPI_PAYMENT === "true",
          creditSales: data.notifications?.CREDIT_SALES === "true",
        });
      } catch (err) {
        console.error("Error fetching app settings:", err);
      }
    };

    fetchTaxData();
  }, []);

  // Input handler
  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxData({ ...taxData, [name]: value });
  };

  // Toggle handler
  const togglePayment = (key) => {
    setTaxData({ ...taxData, [key]: !taxData[key] });
  };

  // ----------------------------------------------------
  //  SAVE FUNCTION: sends 1 KEY at a time to backend
  // ----------------------------------------------------
  const saveKeyValue = async (key, value) => {
    await fetch(`${API_BASE_URL}/settings/settings/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  // Save all fields
  const handleTaxSave = async () => {
    setLoading(true);

    // mapping React fields → backend keys
    const mappings = {
      gstRate: "TAX_GST_RATE",
      taxMethod: "TAX_CALC_METHOD",
      cgstRate: "TAX_CGST_RATE",
      sgstRate: "TAX_SGST_RATE",
      invoicePrefix: "INVOICE_PREFIX",
      invoiceStart: "INVOICE_START",
      invoiceTemplate: "INVOICE_TEMPLATE",
      invoiceFooter: "INVOICE_FOOTER",
      cashPayment: "CASH_PAYMENT",
      cardPayment: "CARD_PAYMENT",
      upiPayment: "UPI_PAYMENT",
      creditSales: "CREDIT_SALES",
    };

    try {
      // save each one separately
      for (let field in mappings) {
        await saveKeyValue(mappings[field], String(taxData[field]));
      }

      alert("✅ Tax & Billing Configuration Saved!");
    } catch (err) {
      console.error("Save error:", err);
      alert("⚠️ Failed to save settings");
    }

    setLoading(false);
  };

  return (
    <div className="tax-section">
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={28} /> Tax & Billing Configuration
      </h2>

      <div className="tax-card">
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
            <label>Calculation Type</label>
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
            <label>CGST (%)</label>
            <input
              type="number"
              name="cgstRate"
              value={taxData.cgstRate}
              onChange={handleTaxChange}
            />
          </div>

          <div className="alert-field">
            <label>SGST (%)</label>
            <input
              type="number"
              name="sgstRate"
              value={taxData.sgstRate}
              onChange={handleTaxChange}
            />
          </div>
        </div>

        <hr className="divider" />

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
            <label>Start Number</label>
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
            <label>Invoice Footer</label>
            <input
              type="text"
              name="invoiceFooter"
              value={taxData.invoiceFooter}
              onChange={handleTaxChange}
            />
          </div>
        </div>

        <hr className="divider" />

        <h3>Payment Methods</h3>

        <div className="payment-methods">
          {[
            ["cashPayment", "Cash Payment"],
            ["cardPayment", "Card Payment"],
            ["upiPayment", "UPI Payment"],
            ["creditSales", "Credit Sales"],
          ].map(([key, label]) => (
            <div className="payment-row" key={key}>
              <label>{label}</label>
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
