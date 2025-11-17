import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./productcatalog.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProductCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor || { name: "Unknown Vendor" };

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!vendor?.id) return;

    // Fetch vendor-specific products
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/procurement/vendors/${vendor.id}/products/`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [vendor]);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/catalog/categories/`);
        const data = await res.json();

        // API returns results? Use results format (depending on your backend)
        const list = data.results ? data.results : data;

        setCategories(list);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? p.category === categoryFilter : true)
  );

  return (
    <div className="catalog-container">
      {/* Header with back button */}
      <div className="catalog-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="catalog-header-text">
          <h1 className="catalog-title">Product Catalog</h1>
          <p className="vendor-subtitle">{vendor.name}</p>
        </div>
      </div>

      {/* Available Products Card */}
      <div className="catalog-card">
        <div className="catalog-card-header">
          <h2>Available Products</h2>

          <div className="catalog-filters">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* ✅ Dropdown now uses API categories */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.length > 0 &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.category || "Uncategorized"}</td>
                  <td>
                    {product.updated_at
                      ? new Date(product.updated_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCatalog;
