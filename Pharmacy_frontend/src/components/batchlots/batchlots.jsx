import React, { useEffect, useState } from "react";
import "./batchlots.css";
import { authFetch } from "../../api/http";

const Batchlots = () => {
  const [batchlots, setBatchlots] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    batchNo: "",
    expiryDate: "",
    status: "ACTIVE",
    recallReason: "",
    rackNo: "",
    createdAt: new Date().toLocaleString(),
  });

  // FETCH ALL BATCHES FROM API
  const fetchBatches = async () => {
    try {
      const res = await authFetch("http://127.0.0.1:8000/api/v1/catalog/batches/");
      const data = await res.json();

      setBatchlots(data.results); // if paginated
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // FORM CHANGE HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // SUBMIT BATCH TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await authFetch("http://127.0.0.1:8000/api/v1/catalog/batches/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        alert("Error creating batch!");
        return;
      }

      alert("✅ Batch Lot Created Successfully!");

      // Refresh list
      fetchBatches();

      // Reset form
      setFormData({
        productId: "",
        batchNo: "",
        expiryDate: "",
        status: "ACTIVE",
        recallReason: "",
        rackNo: "",
        createdAt: new Date().toLocaleString(),
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="batchlots">
      <h2>Create Batch Lot</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="batchForm">
        <div className="formGroup">
          <label>Product ID:</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="Enter Product ID"
            required
          />
        </div>

        <div className="formGroup">
          <label>Batch No:</label>
          <input
            type="text"
            name="batchNo"
            value={formData.batchNo}
            onChange={handleChange}
            placeholder="Enter Batch Number"
            required
          />
        </div>

        <div className="formGroup">
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Recall Reason:</label>
          <input
            type="text"
            name="recallReason"
            value={formData.recallReason}
            onChange={handleChange}
            placeholder="Enter reason if applicable"
          />
        </div>

        <div className="formGroup">
          <label>Rack No:</label>
          <input
            type="text"
            name="rackNo"
            value={formData.rackNo}
            onChange={handleChange}
            placeholder="Enter Rack/Bin No"
          />
        </div>

        <div className="formGroup">
          <label>Created At:</label>
          <input type="text" value={formData.createdAt} readOnly />
        </div>

        <button type="submit" className="submitBtn">
          Create Batch Lot
        </button>
      </form>

      {/* LIST */}
      <div className="batchList">
        <h3>📋 Batch Lot Records</h3>

        {batchlots.length === 0 ? (
          <p className="noRecords">No batch lots found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Batch No</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Recall Reason</th>
                <th>Rack No</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {batchlots.map((batch, index) => (
                <tr key={index}>
                  <td>{batch.productId}</td>
                  <td>{batch.batchNo}</td>
                  <td>{batch.expiryDate}</td>
                  <td>{batch.status}</td>
                  <td>{batch.recallReason || "N/A"}</td>
                  <td>{batch.rackNo}</td>
                  <td>{batch.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Batchlots;
