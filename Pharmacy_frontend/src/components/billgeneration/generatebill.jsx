import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./billgeneration.css";
import { authFetch } from "../../api/http";
import QRCode from "react-qr-code";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export default function GenerateBill() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [gst, setGst] = useState(12);

  // Payment
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [showCashPopup, setShowCashPopup] = useState(false);

  const [upiStatus, setUpiStatus] = useState("pending"); // pending | paid | expired
  const [timeLeft, setTimeLeft] = useState(180);

  // Cash
  const [cashPaid, setCashPaid] = useState("");
  const [cashChange, setCashChange] = useState(0);

  const timerRef = useRef(null);
  const locationId = 1;

  // ------------------ FETCH PAYMENT METHODS ------------------
  useEffect(() => {
    async function loadPM() {
      try {
        const res = await authFetch(`${API_BASE}/settings/payment-methods/`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setPaymentMethods(items);
      } catch {
        setPaymentMethods([]);
      }
    }
    loadPM();
  }, []);

  // ------------------ FETCH PRODUCTS ------------------
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const params = new URLSearchParams({
          location_id: String(locationId),
          q: searchTerm || "",
        });

        const res = await authFetch(
          `${API_BASE}/sales/billing/medicines/?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) return setProducts([]);

        const data = await res.json();
        setProducts(
          data.map((p) => ({
            id: p.product_id,
            name: p.name,
            mrp: Number(p.mrp || 0),
            gstPercent: Number(p.gst_percent || 0),
            stock: p.stock || 0,
          }))
        );
      } catch (e) {
        if (e.name !== "AbortError") setProducts([]);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, [searchTerm]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchBatchLotId(productId) {
    try {
      const res = await authFetch(`${API_BASE}/catalog/batches/?product=${productId}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.results || [];
      return rows.length ? rows[0].id : null;
    } catch {
      return null;
    }
  }

  const addToCart = async (product) => {
    if (!product) return;

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
      return;
    }

    const batchLotId = await fetchBatchLotId(product.id);

    setCart([
      ...cart,
      {
        ...product,
        qty: 1,
        batch_lot_id: batchLotId,
      },
    ]);
  };

  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => setCart(cart.filter((item) => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
  const gstAmount = (subtotal * gst) / 100;
  const total = subtotal + gstAmount;

  // ------------------ PAYMENT POPUP ------------------
  const openPaymentPopup = () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      alert("Please fill all customer info and add items to cart.");
      return;
    }
    setShowPaymentPopup(true);
  };

  const handleSelectPayment = (pm) => {
    setSelectedPaymentMethod(pm);
    setShowPaymentPopup(false);

    if (pm.name.toUpperCase() === "CASH") {
      setCashPaid("");
      setCashChange(0);
      setShowCashPopup(true);
    } else if (pm.name.toUpperCase() === "UPI") {
      setUpiStatus("pending");
      setTimeLeft(180);
      setShowQRPopup(true);
      startUPITimer();
    } else {
      submitInvoice(pm.id);
    }
  };

  // ------------------ CASH PAYMENT ------------------
  useEffect(() => {
    const paid = parseFloat(cashPaid || "0");
    const change = paid - total;
    setCashChange(change > 0 ? change : 0);
  }, [cashPaid, total]);

  const handleCashSubmit = () => {
    const paid = parseFloat(cashPaid || "0");
    if (isNaN(paid) || paid <= 0) {
      alert("Enter a valid amount paid.");
      return;
    }

    setShowCashPopup(false);
    submitInvoice(selectedPaymentMethod.id, paid);
  };

  // ------------------ UPI ------------------
  const startUPITimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setUpiStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (upiStatus !== "pending") return;

    const poll = setInterval(() => {
      if (timeLeft <= 165 && upiStatus === "pending") {
        setUpiStatus("paid");
        clearInterval(timerRef.current);
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [upiStatus, timeLeft]);

  const handleUPIConfirmed = () => {
    setShowQRPopup(false);
    submitInvoice(selectedPaymentMethod.id);
  };

  // ------------------ INVOICE ------------------
  const submitInvoice = async (paymentMethodId, amountPaid) => {
    const withoutBatch = cart.filter((item) => !item.batch_lot_id);
    if (withoutBatch.length) {
      alert("Some items do not have stock batches. Add stock before billing.");
      return;
    }

    const lines = cart.map((item) => ({
      product: item.id,
      batch_lot: item.batch_lot_id,
      qty_base: String(item.qty),
      sold_uom: "BASE",
      rate_per_base: String(item.mrp),
      discount_amount: "0",
      tax_percent: String(item.gstPercent || gst),
    }));

    const payload = {
      location: locationId,
      invoice_date: new Date().toISOString(),
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email || "",
      customer_city: customer.city || "",
      lines,
      payment_method: paymentMethodId,
      amount_paid: amountPaid !== undefined ? amountPaid : total,
    };

    try {
      const res = await authFetch(`${API_BASE}/sales/invoices/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        alert("Invoice failed: " + t);
        return;
      }

      const invoice = await res.json();
      navigate(`/billgeneration/invoice/${invoice.id}`);
    } catch (e) {
      alert("Payment failed");
      console.error(e);
    }
  };

  const cardStyle = {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  };

  return (
    <div className="billgeneration-page" style={{ maxWidth: "1200px", margin: "auto", padding: "1rem" }}>
      <h1 className="page-title" style={{ fontWeight: "600", marginBottom: "1.5rem" }}>
        Billing & Invoicing
      </h1>

      {/* PAYMENT POPUP */}
      {showPaymentPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Select Payment Method</h3>

            {paymentMethods.length === 0 && <p style={{ color: "#888" }}>No payment methods found.</p>}

            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                className="popup-btn cash"
                onClick={() => handleSelectPayment(pm)}
              >
                {pm.name}
              </button>
            ))}

            <button className="popup-close" onClick={() => setShowPaymentPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* CASH POPUP */}
      {showCashPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Cash Payment</h3>
            <p>Total: ₹{total.toFixed(2)}</p>
            <input
              type="number"
              placeholder="Enter amount paid"
              value={cashPaid}
              onChange={(e) => setCashPaid(e.target.value)}
            />
            <p>Change: ₹{cashChange.toFixed(2)}</p>
            <button className="popup-btn" onClick={handleCashSubmit}>OK</button>
            <button className="popup-close" onClick={() => setShowCashPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* UPI POPUP */}
      {showQRPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Scan & Pay (UPI)</h3>

            {upiStatus === "pending" && (
              <>
                <QRCode
                  value={`upi://pay?pa=9480084459@axl&pn=Shreyas%20P%20S&am=${total.toFixed(2)}&cu=INR`}
                  size={200}
                />
                <p style={{ marginTop: "1rem" }}>
                  Amount: <strong>₹{total.toFixed(2)}</strong>
                </p>
                <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>Time left: {timeLeft} sec</p>
              </>
            )}

            {upiStatus === "paid" && (
              <>
                <p style={{ fontSize: "1.2rem", color: "green", fontWeight: 600 }}>✅ Payment Received</p>
                <button className="popup-btn cash" onClick={handleUPIConfirmed}>Continue</button>
              </>
            )}

            {upiStatus === "expired" && (
              <p style={{ fontSize: "1.2rem", color: "red", fontWeight: 600 }}>❌ Payment Expired</p>
            )}

            <button className="popup-close" onClick={() => setShowQRPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
        {/* CUSTOMER INFO */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Customer Information</h3>
          <label>Customer Name</label>
          <input type="text" value={customer.name} placeholder="Enter customer name" onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <label style={{ marginTop: "0.75rem" }}>Phone</label>
          <input type="text" value={customer.phone} placeholder="Phone number" onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <label style={{ marginTop: "0.75rem" }}>Email</label>
          <input type="email" value={customer.email} placeholder="Customer email" onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          <label style={{ marginTop: "0.75rem" }}>City</label>
          <input type="text" value={customer.city} placeholder="Customer city" onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
        </div>

        {/* MEDICINES */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Select Medicines</h3>

          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  marginBottom: "0.5rem",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>{product.name}</strong>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Stock: {product.stock} | ₹{product.mrp}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.25rem 0.75rem",
                    fontSize: "1.3rem",
                  }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Cart Items</h3>

          {cart.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No items added.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => updateQty(item.id, -1)}>−</button>
                      <span style={{ margin: "0 6px" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                    </td>

                    <td>₹{item.mrp.toFixed(2)}</td>
                    <td>₹{(item.qty * item.mrp).toFixed(2)}</td>
                    <td>
                      <button
                        style={{ color: "red", fontSize: "1.2rem" }}
                        onClick={() => removeItem(item.id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SUMMARY */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Bill Summary</h3>

          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal:</span> <strong>₹{subtotal.toFixed(2)}</strong>
          </p>

          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>GST ({gst}%):</span> <strong>₹{gstAmount.toFixed(2)}</strong>
          </p>

          <hr />

          <p style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>
            <strong>Total:</strong> <strong>₹{total.toFixed(2)}</strong>
          </p>

          <button
            className="generate-btn"
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={openPaymentPopup}
          >
            Complete Payment
          </button>

          <button
            className="generate-btn"
            style={{
              width: "100%",
              marginTop: "0.75rem",
              backgroundColor: "#0f766e",
            }}
            onClick={() => submitInvoice(paymentMethods[0]?.id)}
          >
            Print Bill (Default Method)
          </button>
        </div>
      </div>
    </div>
  );
}
