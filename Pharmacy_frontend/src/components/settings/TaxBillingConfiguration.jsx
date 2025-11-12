import React, { useState } from "react";
import "./taxbilling.css";
import { FileText } from "lucide-react";

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

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxData({ ...taxData, [name]: value });
  };

  const togglePayment = (field) => {
    setTaxData({ ...taxData, [field]: !taxData[field] });
  };

  const handleTaxSave = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("✅ Saved Tax & Billing Data:", taxData);
      setLoading(false);
      alert("Tax & Billing Configuration Saved Successfully!");
    }, 800);
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
        {/* 🧾 TAX SETTINGS */}
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

        {/* Divider line */}
        <hr className="divider" />

        {/* 🧾 INVOICE SETTINGS */}
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
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
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

        {/* Divider line */}
        <hr className="divider" />

        {/* 💳 PAYMENT METHODS */}
        <h3>Payment Methods</h3>

        <div className="payment-methods">
          <div className="payment-row">
            <div>
              <label>Cash Payment</label>
              <p>Accept cash payments</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={taxData.cashPayment}
                onChange={() => togglePayment("cashPayment")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="payment-row">
            <div>
              <label>Card Payment</label>
              <p>Accept debit/credit card payments</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={taxData.cardPayment}
                onChange={() => togglePayment("cardPayment")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="payment-row">
            <div>
              <label>UPI Payment</label>
              <p>Accept UPI and QR-based payments</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={taxData.upiPayment}
                onChange={() => togglePayment("upiPayment")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="payment-row">
            <div>
              <label>Credit Sales</label>
              <p>Allow credit sales for customers</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={taxData.creditSales}
                onChange={() => togglePayment("creditSales")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* ✅ Save button inside card (non-overlapping) */}
        <div className="save-btn-container">
          <button className="save-btn" onClick={handleTaxSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxBilling;
