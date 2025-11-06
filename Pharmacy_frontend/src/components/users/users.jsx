import React, { useState } from "react";
import "./users.css";

const Users = () => {
  const [idCounter, setIdCounter] = useState(1);
  const [users, setUsers] = useState([]);

  const generateUserId = (counter) => `USR${String(counter).padStart(3, "0")}`;

  const [formData, setFormData] = useState({
    userId: generateUserId(idCounter),
    fullName: "",
    email: "",
    createdAt: "",
    isActive: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();
    const createdAt = now.toLocaleString();
    const newUser = { ...formData, createdAt };

    setUsers([...users, newUser]);

    alert(
      `✅ User Created Successfully!\n
User ID: ${newUser.userId}
Full Name: ${newUser.fullName}
Email: ${newUser.email}
Created At: ${newUser.createdAt}
Status: ${newUser.isActive ? "Active" : "Inactive"}`
    );

    // Increment counter and reset form
    const nextCounter = idCounter + 1;
    setIdCounter(nextCounter);
    setFormData({
      userId: generateUserId(nextCounter),
      fullName: "",
      email: "",
      createdAt: "",
      isActive: false,
    });
  };

  return (
    <div className="users">
      <h2>Create User</h2>

      {/* ===== FORM SECTION ===== */}
      <form onSubmit={handleSubmit} className="userForm">
        <div className="formGroup">
          <label>User ID:</label>
          <input type="text" name="userId" value={formData.userId} readOnly />
        </div>

        <div className="formGroup">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>Created At:</label>
          <input
            type="text"
            value={formData.createdAt || new Date().toLocaleString()}
            readOnly
          />
        </div>

        <div className="formGroup checkboxGroup">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
            />
            Active User
          </label>
          <p
            className="statusText"
            style={{
              color: formData.isActive ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {formData.isActive
              ? "✅ This user is active and exists in this organization."
              : "❌ This user is inactive or no longer in this organization."}
          </p>
        </div>

        <button type="submit" className="submitBtn">
          Create User
        </button>
      </form>

      {/* ===== LIST SECTION ===== */}
      <div className="userList">
        <h3>📋 User Records</h3>
        {users.length === 0 ? (
          <p className="noRecords">No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.userId}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.createdAt}</td>
                  <td style={{ color: user.isActive ? "green" : "red" }}>
                    {user.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
