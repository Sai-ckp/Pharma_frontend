import React, { useEffect, useState } from "react";
import api from "../../api/api";
import FormModal from "../../components/FormModal";

export default function UnitMaster() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUnits = async () => {
    const res = await api.get("units/");
    setUnits(res.data);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await api.put(`units/${editingId}/`, form);
    } else {
      await api.post("units/", form);
    }
    fetchUnits();
    setShowModal(false);
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this unit?")) {
      await api.delete(`units/${id}/`);
      fetchUnits();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Unit Master</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Unit
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Description</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u, i) => (
            <tr key={u.id}>
              <td className="border px-3 py-2">{i + 1}</td>
              <td className="border px-3 py-2">{u.name}</td>
              <td className="border px-3 py-2">{u.description}</td>
              <td className="border px-3 py-2 space-x-2">
                <button
                  onClick={() => {
                    setEditingId(u.id);
                    setForm({ name: u.name, description: u.description });
                    setShowModal(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <FormModal
          title={editingId ? "Edit Unit" : "Add Unit"}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div>
            <label>Name</label>
            <input
              type="text"
              className="border w-full p-2 rounded mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              className="border w-full p-2 rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </FormModal>
      )}
    </div>
  );
}
