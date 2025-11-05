import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./productsdashboard.css";

const ProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
      });
      fetchProducts();
    }
  };

  return (
    <div className="customers-container">
      <div className="flex justify-between items-center">
        <h1 className="customers-title">Products Management</h1>

        <button className="add-btn" onClick={() => navigate("/masters/products/add")}>
          + Add Product
        </button>
      </div>

      <h2 className="customer-heading">Manage product items & stock definitions</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Active Items</h3>
          <p className="text-3xl font-bold mt-2">312</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Sensitive Drugs</h3>
          <p className="text-3xl font-bold mt-2">41</p>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="customers-list">
        <h3>Products List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>HSN</th>
              <th>Schedule</th>
              <th>Manufacturer</th>
              <th>MRP</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.hsn}</td>
                <td>{product.schedule}</td>
                <td>{product.manufacturer}</td>
                <td>₹ {product.mrp}</td>
                <td>{product.is_active ? "Active" : "Inactive"}</td>

                <td>
                  <button className="edit-btn" onClick={() => navigate(`/masters/products/edit/${product.id}`)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsDashboard;
