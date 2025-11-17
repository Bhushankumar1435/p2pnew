import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../api/Adminapi";
import AddSubAdmin from "./subadminManage/AddSubAdmin";
import SubAdminList from "./subadminManage/SubAdminList";
import SubAdminrequest from "./subadminManage/SubAdminrequest";
import SubadminDeposit from "./subadminManage/SubadminDeposit";
import Userlist from "./usermanage/Userlist";
import ManageDeals from "./usermanage/ManageDeals";
import TicketHistory from "./usermanage/TicketHistory";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showUserSubMenu, setShowUserSubMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

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

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-md w-64 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Mobile Close */}
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-full p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Admin Panel</h2>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col space-y-3">

            {/* Dashboard Tab */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setShowSubMenu(false);
              }}
              className={`px-4 py-2 rounded-lg text-left font-medium transition 
              ${activeTab === "dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Dashboard
            </button>

            {/* Sub Admin Menu */}
            <div>
              <button
                onClick={() => {
                  setShowSubMenu(!showSubMenu);
                  setShowUserSubMenu(false);
                }}
                className={`px-4 py-2 w-full flex justify-between items-center rounded-lg font-medium transition 
                ${showSubMenu ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
              >
                Sub-Admin Management
                {showSubMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>


              {/* Submenu Items */}
              {showSubMenu && (
                <div className="pl-4 space-y-2 mt-2">

                  <button
                    onClick={() => setActiveTab("addSubAdmin")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    ➕ Add Sub-Admin
                  </button>

                  <button
                    onClick={() => setActiveTab("subAdminList")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    📋 Sub-Admin List
                  </button>

                  <button
                    onClick={() => setActiveTab("subAdminRequests")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    ⚙️ Sub-Admin Request
                  </button>

                  <button
                    onClick={() => setActiveTab("subDepositTxn")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    💰 Deposit Transactions
                  </button>

                </div>
              )}
            </div>
            {/* User Admin Menu */}

            <div>
              <button
                onClick={() => {
                  setShowUserSubMenu(!showUserSubMenu);
                  setShowSubMenu(false);
                }}
                className={`px-4 py-2 w-full flex justify-between items-center rounded-lg font-medium transition 
             ${showUserSubMenu ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
              >
                User Management
                {showUserSubMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>


              {showUserSubMenu && (
                <div className="pl-4 space-y-2 mt-2">

                  <button
                    onClick={() => setActiveTab("userList")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"   >
                    📋 User List
                  </button>
                  <button
                    onClick={() => setActiveTab("ManageDeals")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" >
                    🤝 Deals
                  </button>
                  <button
                    onClick={() => setActiveTab("TicketHistory")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100" >
                    🎟 Ticket History
                  </button>

                </div>
              )}
            </div>

          </nav>

          {/* Logout */}
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 px-4 py-10 relative">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Dashboard */}
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

        {/* Sub-Admin Management */}

        {activeTab === "addSubAdmin" && <AddSubAdmin />}

        {activeTab === "subAdminList" && <SubAdminList />}

        {activeTab === "subAdminRequests" && <SubAdminrequest />}

        {activeTab === "subDepositTxn" && <SubadminDeposit />}

        {/* User-Management */}

        {activeTab === "userList" && <Userlist />}

        {activeTab === "ManageDeals" && <ManageDeals />}

        {activeTab === "TicketHistory" && <TicketHistory />}

      </div>
    </div>
  );
};

export default AdminDashboard;
