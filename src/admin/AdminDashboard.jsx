import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/Adminapi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubAdmins: 0,
    activeDeals: 0,
    totalDeals: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      if (res.success) {
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalSubAdmins: res.data.totalSubAdmins || 0,
          activeDeals: res.data.activeDeals || 0,
          totalDeals: res.data.totalDeals || 0,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10 text-2xl font-semibold">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 mt-10 lg:mt-0 text-center">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total Sub-Admins</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalSubAdmins}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Active Deals</h2>
          <p className="text-3xl font-bold text-gray-600">{stats.activeDeals}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Total Deals</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.totalDeals}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
