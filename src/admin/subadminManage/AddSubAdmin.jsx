import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddSubAdminApi } from "../../api/Adminapi";   

const AddSubAdmin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.password) {
    toast.error("All fields are required!");
    return;
  }

  setLoading(true);

  const res = await AddSubAdminApi(form);

  if (!res.success) {
    toast.error(res.message || "Failed to create Sub-Admin");
    setLoading(false);
    return;
  }

  toast.success(res.message || "Sub-Admin created successfully!");

  setTimeout(() => navigate("/admin/subadmin/list"), 700);

  setLoading(false);
};


  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Add Sub-Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg outline-none"
            placeholder="Set login password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Sub-Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddSubAdmin;
