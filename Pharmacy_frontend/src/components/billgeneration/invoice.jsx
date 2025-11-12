import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./billgeneration.css";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    // fetch your bill dynamically here using id
    // example placeholder, replace with real API
    const fetchBill = async () => {
      // const response = await fetch(`/api/bills/${id}`);
      // const data = await response.json();
      // setBill(data);

      // For now using dummy data for demo
      setBill({
        id: 1,
        billNumber: "INV-1001",
        date: "2025-11-11",
        gst: 12,
        customer: { name: "John Doe", phone: "9876543210" },
        paymentMethod: "Cash",
        paymentStatus: "Paid",
        cart: [
          { id: 1, name: "Paracetamol 500mg", qty: 2, price: 25 },
          { id: 2, name: "Vitamin C Tablets", qty: 1, price: 150 },
          { id: 3, name: "Cough Syrup", qty: 1, price: 200 },
        ],
        store: {
          name: "Sai Medical Store",
          address: "Junnar Road, Narayangaon, Pune",
          phone: "1234567890",
          gstin: "27AAAAA0000A1Z5",
        },
      });
    };

    fetchBill();
  }, [id]);

  if (!bill) {
    return (
      <div className="billgeneration-page" style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
        <p>Loading invoice...</p>
      </div>
    );
  }

  const subtotal = bill.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = (subtotal * bill.gst) / 100;
  const total = subtotal + gstAmount;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${bill.billNumber}.pdf`);
  };

  return (
    <div className="billgeneration-page" style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#e5e7eb",
            borderRadius: "6px",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              cursor: "pointer",
            }}
          >
            🖨️ Print
          </button>
          <button
            onClick={handleDownloadPDF}
            style={{
              backgroundColor: "#14b8a6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            ⬇️ Download PDF
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "6px",
          background: "white",
        }}
      >
        {/* Header */}
        <div className="header" style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 style={{ color: "#14b8a6", marginBottom: "0.25rem" }}>{bill.store.name}</h2>
          <p style={{ margin: "0" }}>{bill.store.address}</p>
          <p style={{ margin: "0" }}>Phone: {bill.store.phone} | GSTIN: {bill.store.gstin}</p>
        </div>

        {/* Customer + Invoice Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h4 style={{ marginBottom: "0.3rem", color: "#111827" }}>Customer Details</h4>
            <p style={{ margin: "0.2rem 0" }}>
              <strong>Name:</strong> {bill.customer.name}
            </p>
            <p style={{ margin: "0.2rem 0" }}>
              <strong>Phone:</strong> {bill.customer.phone}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h4 style={{ marginBottom: "0.3rem", color: "#111827" }}>Invoice Info</h4>
            <p style={{ margin: "0.2rem 0" }}>
              <strong>Invoice #:</strong> {bill.billNumber}
            </p>
            <p style={{ margin: "0.2rem 0" }}>
              <strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f3f4f6" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Product</th>
              <th style={{ textAlign: "right", padding: "0.5rem" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "0.5rem" }}>Price</th>
              <th style={{ textAlign: "right", padding: "0.5rem" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.cart.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.5rem" }}>{item.name}</td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>{item.qty}</td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>₹{item.price}</td>
                <td style={{ textAlign: "right", padding: "0.5rem" }}>
                  ₹{(item.qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <p>
            <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
          </p>
          <p>
            <strong>GST ({bill.gst}%):</strong> ₹{gstAmount.toFixed(2)}
          </p>
          <h3 style={{ borderTop: "1px solid #ddd", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
            Total: ₹{total.toFixed(2)}
          </h3>
        </div>

        {/* Payment Info */}
        <div
          style={{
            marginTop: "1rem",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "0.5rem",
            color: "#374151",
          }}
        >
          <p>
            <strong>Payment Method:</strong> {bill.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong> {bill.paymentStatus}
          </p>
        </div>

        {/* Footer */}
        <div
          className="footer"
          style={{
            marginTop: "2rem",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "1rem",
            color: "#6b7280",
          }}
        >
          <p style={{ marginBottom: "0.25rem" }}>Thank you for choosing {bill.store.name}!</p>
          <p style={{ margin: 0 }}>This is a computer-generated invoice.</p>
        </div>
      </div>
    </div>
  );
}
