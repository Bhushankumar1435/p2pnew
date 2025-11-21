// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showUserSubMenu, setShowUserSubMenu] = useState(false);
  const [transferFundMenu, setTransferFundMenu] = useState(false);

  const location = useLocation();

  // Update activeTab based on current URL
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/admin/dashboard")) setActiveTab("dashboard");
    else if (path.startsWith("/admin/add-subadmin")) setActiveTab("add-subadmin");
    else if (path.startsWith("/admin/subadmin/list")) setActiveTab("subadmin-list");
    else if (path.startsWith("/admin/subadmin/request")) setActiveTab("subadmin-request");
    else if (path.startsWith("/admin/subadmin/deposits")) setActiveTab("subadmin-deposits");
    else if (path.startsWith("/admin/users")) setActiveTab("user-list");
    else if (path.startsWith("/admin/deals")) setActiveTab("manage-deals");
    else if (path.startsWith("/admin/tickets")) setActiveTab("ticket-history");
    else if (path.startsWith("/admin/transferfund")) setActiveTab("transfer-fund");
    else if (path.startsWith("/admin/wallet-history")) setActiveTab("wallet-history");
    else if (path.startsWith("/admin/income-history")) setActiveTab("income-history");
    else if (path.startsWith("/admin/withdraw-orders")) setActiveTab("withdraw-orders");
    else if (path.startsWith("/admin/deposit-history")) setActiveTab("deposit-history");

    // Automatically open the relevant submenu
    if (path.includes("/subadmin")) setShowSubMenu(true);
    else setShowSubMenu(false);

    if (path.includes("/users") || path.includes("/deals") || path.includes("/tickets")) setShowUserSubMenu(true);
    else setShowUserSubMenu(false);

    if (path.includes("/transferfund") || path.includes("/wallet-history") || path.includes("/income-history") || path.includes("/withdraw-orders") || path.includes("/deposit-history")) setTransferFundMenu(true);
    else setTransferFundMenu(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showSubMenu={showSubMenu}
        setShowSubMenu={setShowSubMenu}
        showUserSubMenu={showUserSubMenu}
        setShowUserSubMenu={setShowUserSubMenu}
        transferFundMenu={transferFundMenu}
        setTransferFundMenu={setTransferFundMenu}
      />

      {/* Main Content */}
      <div className="flex-1 px-4 py-10 relative">
        {/* Mobile menu button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
