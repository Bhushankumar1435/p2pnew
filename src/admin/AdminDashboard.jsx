import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getAdminDashboard } from "../api/Adminapi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // DEFAULT TAB

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboard();
        if (response.success) {
          setDashboardData(response.data || {});
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== Sidebar ===== */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-md w-64 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Admin Panel</h2>

          {/* ===== Sidebar Navigation ===== */}
          <nav className="flex flex-col space-y-3">

            {/* Dashboard */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 rounded-lg text-left font-medium transition 
              ${activeTab === "dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Dashboard
            </button>

            {/* Sub-Admin Management */}
            <button
              onClick={() => {
                setActiveTab("subadmin");
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 rounded-lg text-left font-medium transition 
              ${activeTab === "subadmin" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Sub-Admin Management
            </button>
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mt-6"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 px-4 py-10 relative">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Dashboard Page */}
        {activeTab === "dashboard" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-10 mt-10 lg:mt-0">
              Admin Dashboard
            </h1>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                  <p className="text-3xl font-bold">{dashboardData.totalUsers || 0}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Sub-Admins</h2>
                  <p className="text-3xl font-bold">{dashboardData.totalSubAdmins || 0}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Active Deals</h2>
                  <p className="text-3xl font-bold">46</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                  <p className="text-3xl font-bold">$12,760</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-Admin Management Page */}
        {activeTab === "subadmin" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Sub-Admin Management</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <button
                onClick={() => navigate("/admin/subadmin/add")}
                className="bg-white shadow-md p-6 rounded-xl hover:bg-gray-50 transition"
              >
                ➕ Add Sub-Admin
              </button>

              <button
                onClick={() => navigate("/admin/subadmin/list")}
                className="bg-white shadow-md p-6 rounded-xl hover:bg-gray-50 transition"
              >
                📋 Sub-Admin List
              </button>

              <button
                onClick={() => navigate("/admin/subadmin/prereq")}
                className="bg-white shadow-md p-6 rounded-xl hover:bg-gray-50 transition"
              >
                ⚙️ Sub-Admin Prerequisites
              </button>

              <button
                onClick={() => navigate("/admin/subadmin/deposits")}
                className="bg-white shadow-md p-6 rounded-xl hover:bg-gray-50 transition"
              >
                💰 Deposit Transactions
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
