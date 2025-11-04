import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./vendorsdashboard.css";

const VendorsDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/vendors/");
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await fetch(`http://127.0.0.1:8000/api/vendors/${id}/`, {
        method: "DELETE",
      });
      fetchVendors();
    }
  };

  return (
    <div className="customers-container">
      <div className="flex justify-between items-center">
        <h1 className="customers-title">Vendor Management</h1>

        <button className="add-btn" onClick={() => navigate("/masters/vendors/add")}>
          + Add Vendor
        </button>
      </div>

      <h2 className="customer-heading">Manage vendor details and supply records</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Total Vendors</h3>
          <p className="text-3xl font-bold mt-2">{vendors.length}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Avg Purchase Value</h3>
          <p className="text-3xl font-bold mt-2">₹ 32000</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Active Suppliers</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
      </div>

      {/* VENDORS LIST */}
      <div className="customers-list">
        <h3>Vendor List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>GSTIN</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={vendor.id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.gstin}</td>
                <td>{vendor.contact_phone}</td>
                <td>{vendor.address}</td>
                <td>{vendor.is_active ? "Active" : "Inactive"}</td>

                <td>
                  <button className="edit-btn" onClick={() => alert("Vendor View Screen Coming!")}>
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/masters/vendors/edit/${vendor.id}`)}
                  >
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(vendor.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {vendors.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">No vendors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsDashboard;
