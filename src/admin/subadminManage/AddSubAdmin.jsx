import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AddSubAdminApi, GetAdminUsersApi } from "../../api/Adminapi";

const AddSubAdmin = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState(""); 
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await GetAdminUsersApi(1, 500); 
      if (res.success) setAllUsers(res.data.users);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserName("");
      return;
    }
    const user = allUsers.find((u) => u.userId === userId.trim());
    setUserName(user ? user.name : "");
  }, [userId, allUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID is required!");
      return;
    }

    setLoading(true);
    try {
      const res = await AddSubAdminApi({ userId });

      if (!res.success) {
        toast.error(res.message || "Failed to create Sub-Admin");
        setLoading(false);
        return;
      }

      toast.success(res.message || "Sub-Admin created successfully!");
      setTimeout(() => navigate("/admin/subadmin/list"), 700);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Add Sub-Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg outline-none"
            placeholder="Enter User ID"
          />

          {/* Show username if exists */}
          {userId && userName && (
            <p className="text-green-600 font-semibold mt-1">
              User Name: {userName}
            </p>
          )}

          {/* User not found */}
          {userId && !userName && (
            <p className="text-red-500 text-sm mt-1">User Not Found</p>
          )}
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
