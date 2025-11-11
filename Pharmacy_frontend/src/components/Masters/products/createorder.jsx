import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./createorder.css";

const CreateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor;

  useEffect(() => {
    if (!vendor) {
      navigate("/masters/vendors");
    }
  }, [vendor, navigate]);

  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/catalog/products/");
        const data = await res.json();
        setItems(data.results ? data.results.map(p => ({ ...p, quantity: 0 })) : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const totalQty = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const sub = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.mrp || 0)), 0);
    const gstAmount = sub * 0.12;
    setTotalItems(totalQty);
    setSubtotal(sub);
    setGst(gstAmount);
    setTotalAmount(sub + gstAmount);
  }, [items]);

  const handleAddProduct = () => {
    navigate("/masters/products/add");
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...items];
    newItems[index].quantity = Number(value);
    setItems(newItems);
  };

  const handleCreateOrder = () => {
    if (!vendor) return;
    const orderItems = items.filter((item) => item.quantity > 0);
    const payload = {
      vendor: vendor.id,
      order_date: orderDate,
      expected_delivery: expectedDate,
      notes,
      items: orderItems,
    };
    console.log("Create order payload:", payload);
  };

  if (!vendor) return null;

  return (
    <div className="createorder-container">
      <h1 className="page-title">Create Order for {vendor.name}</h1>
      <div className="order-main">
        <div className="left-section">
          {/* Supplier Info */}
          <div className="kpi-card">
            <h3>Supplier Information</h3>
            <div className="kpi-item"><strong>Supplier:</strong> {vendor.name}</div>
            <div className="kpi-item">
              <strong>Order Date:</strong>
              <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
          </div>

          {/* Add Product */}
          <div className="kpi-card add-product-card">
            <div className="card-header">
              <h3>Order Items</h3>
              <button className="add-btn" onClick={handleAddProduct}>+ Add Product</button>
            </div>

            {items.length === 0 ? (
              <div className="no-products">No products added yet.</div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity || 0}
                          min="0"
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        />
                      </td>
                      <td>₹ {item.mrp}</td>
                      <td>₹ {(item.quantity * item.mrp || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Additional Info */}
          <div className="kpi-card">
            <h3>Additional Information</h3>
            <div className="kpi-item">
              <strong>Expected Delivery Date:</strong>
              <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </div>
            <div className="kpi-item">
              <strong>Notes:</strong>
              <textarea placeholder="Enter additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="right-section">
          <div className="kpi-card summary-card">
            <h3>Order Summary</h3>
            <div className="kpi-item"><strong>Total Items:</strong> {totalItems}</div>
            <div className="kpi-item"><strong>Subtotal:</strong> ₹ {subtotal.toFixed(2)}</div>
            <div className="kpi-item"><strong>GST (12%):</strong> ₹ {gst.toFixed(2)}</div>
            <div className="kpi-item total"><strong>Total Amount:</strong> ₹ {totalAmount.toFixed(2)}</div>
          </div>

          <div className="form-actions">
            <button className="submit-btn" onClick={handleCreateOrder}>Create Order</button>
            <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
