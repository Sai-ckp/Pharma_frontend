import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./billgeneration.css";
import { authFetch } from "../../api/http";
 
export default function GenerateBill() {
  const navigate = useNavigate();
 
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [gst, setGst] = useState(12); // default 12% GST as per image
 
  // Fetch products (medicines)
  useEffect(() => {
    authFetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);
 
  // Filter products by search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const addToCart = (product) => {
    if (!product) return;
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };
 
  const updateQty = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };
 
  const removeItem = (id) => setCart(cart.filter((item) => item.id !== id));
 
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = (subtotal * gst) / 100;
  const total = subtotal + gstAmount;
 
  const handleSubmit = () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      alert("Please fill all customer info and add items to cart.");
      return;
    }
 
    const bill = {
      customer,
      cart,
      subtotal,
      gst,
      total,
      date: new Date().toISOString(),
    };
 
    authFetch("/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/masters/billgeneration/invoice/${data.id}`))
      .catch(() => alert("Failed to save bill"));
  };
 
  const cardStyle = {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  };
 
  return (
    <div
      className="billgeneration-page"
      style={{ maxWidth: "1200px", margin: "auto", padding: "1rem" }}
    >
      <h1
        className="page-title"
        style={{ fontWeight: "600", marginBottom: "1.5rem" }}
      >
        Billing &amp; Invoicing
      </h1>
 
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "1rem",
          fontSize: "0.9rem",
        }}
      >
        {/* Customer Information */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>
            Customer Information
          </h3>
          <label>Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>
 
        {/* Select Medicines */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>
            Select Medicines
          </h3>
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
          />
          <div
            style={{
              maxHeight: "280px",
              overflowY: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "0.5rem",
            }}
          >
            {filteredProducts.length === 0 && <p>No medicines found.</p>}
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.4rem 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600" }}>{product.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    Stock: {product.stock} | ₹{product.price} each
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    backgroundColor: "#14b8a6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.3rem 0.7rem",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
 
        {/* Cart Items */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Cart Items</h3>
          {cart.length === 0 ? (
            <p>No items added.</p>
          ) : (
            <table
              className="cart-table"
              style={{
                width: "100%",
                fontSize: "0.9rem",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #d1d5db" }}>
                    Item
                  </th>
                  <th style={{ padding: "0.5rem", width: "90px", borderBottom: "1px solid #d1d5db" }}>
                    Qty
                  </th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #d1d5db" }}>
                    Price
                  </th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #d1d5db" }}>
                    Total
                  </th>
                  <th style={{ padding: "0.5rem", width: "50px", borderBottom: "1px solid #d1d5db" }}>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        style={{
                          backgroundColor: "#e5e7eb",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0 0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span style={{ margin: "0 0.5rem" }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          backgroundColor: "#e5e7eb",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0 0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>
                      ₹{(item.qty * item.price).toFixed(2)}
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontSize: "1.2rem",
                        }}
                        title="Remove item"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
 
        {/* Bill Summary */}
        <div className="card" style={cardStyle}>
          <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Bill Summary</h3>
 
          <div style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "1rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #d1d5db", paddingBottom: "0.5rem" }}>Item</th>
                  <th style={{ textAlign: "center", borderBottom: "1px solid #d1d5db", paddingBottom: "0.5rem" }}>Qty</th>
                  <th style={{ textAlign: "right", borderBottom: "1px solid #d1d5db", paddingBottom: "0.5rem" }}>Price</th>
                  <th style={{ textAlign: "right", borderBottom: "1px solid #d1d5db", paddingBottom: "0.5rem" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "0.3rem 0" }}>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.qty}</td>
                    <td style={{ textAlign: "right" }}>₹{item.price.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>₹{(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
 
            <hr style={{ margin: "0.5rem 0" }} />
 
            <p style={{ display: "flex", justifyContent: "space-between", margin: "0.2rem 0" }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>
 
            <p style={{ display: "flex", justifyContent: "space-between", margin: "0.2rem 0" }}>
              <span>GST ({gst}%):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </p>
 
            <hr style={{ margin: "0.5rem 0" }} />
 
            <p style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "1.2rem" }}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </p>
          </div>
 
          <button
            onClick={handleSubmit}
            className="generate-btn"
            style={{
              marginTop: "1rem",
              backgroundColor: "#14b8a6",
              color: "white",
              width: "100%",
              borderRadius: "6px",
              padding: "0.7rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
}
