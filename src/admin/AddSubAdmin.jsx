import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const API_BASE = import.meta.env.VITE_API_URL; 

const AddSubAdmin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        navigate("/admin/login");
        return;
      }

      const res = await fetch(`${API_BASE}admin/addSubAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to create Sub-Admin");
        return;
      }

      toast.success(data.message || "Sub-Admin created successfully!");

      // redirect
      setTimeout(() => navigate("/admin/subadmin/list"), 700);

    } catch (err) {
      console.error("Add SubAdmin error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
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
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Sub-Admin"}
        </button>

      </form>
    </div>
  );
};

export default AddSubAdmin;
