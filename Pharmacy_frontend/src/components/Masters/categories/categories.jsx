import React, { useEffect, useState } from "react";
import "./categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/categories/");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Add / Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://127.0.0.1:8000/api/categories/${editingId}/`
        : "http://127.0.0.1:8000/api/categories/";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // ✅ Edit existing category
  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category.id);
  };

  // ✅ Delete category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
        method: "DELETE",
      });
      fetchCategories();
    }
  };

  return (
    <div className="categories-container">
      <h1 className="categories-title">Category Management</h1>

      <p className="categories-description">
        🗂️ Manage your product categories — add, update, or delete categories easily.
      </p>

      <div className="categories-card">
        <h3>{editingId ? "Update Category" : "Add New Category"}</h3>

        <form className="categories-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Category Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editingId ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>

      <div className="categories-list">
        <h3>Category List</h3>
        <table className="categories-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description || "—"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
