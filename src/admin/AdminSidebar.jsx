import React from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { FaMoneyCheckAlt, FaWallet, FaChartLine, FaUsers, FaHandshake, FaTicketAlt, FaUserPlus, FaCogs, FaMoneyBillWave, } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  showSubMenu,
  setShowSubMenu,
  showUserSubMenu,
  setShowUserSubMenu,
  transferFundMenu,
  setTransferFundMenu,
  globaldividend,
  setGlobaldividend,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/adminauth/login");
  };

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };


  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-md w-64 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}
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

        <nav className="flex flex-col space-y-3">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              handleNav("/admin/dashboard");
            }}
            className={`px-4 py-2 rounded-lg text-left font-medium transition
              ${activeTab === "dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
          >
            Dashboard
          </button>

          {/* Sub-Admin Menu */}
          <div>
            <button
              onClick={() => {
                setShowSubMenu(!showSubMenu);
                setShowUserSubMenu(false);
                setTransferFundMenu(false);
                setGlobaldividend(false);
              }}
              className={`px-4 py-2 w-full flex justify-between items-center rounded-lg font-medium transition
                ${showSubMenu ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Sub-Admin Management
              {showSubMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showSubMenu && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  onClick={() => handleNav("/admin/add-subadmin")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaUserPlus /> Add Sub-Admin
                </button>

                <button
                  onClick={() => handleNav("/admin/subadmin/list")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaUsers /> Sub-Admin List
                </button>

                <button
                  onClick={() => handleNav("/admin/subadmin/request")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaCogs /> Sub-Admin Requests
                </button>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div>
            <button
              onClick={() => {
                setShowUserSubMenu(!showUserSubMenu);
                setShowSubMenu(false);
                setTransferFundMenu(false);
                setGlobaldividend(false);

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
                  onClick={() => handleNav("/admin/users")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaUsers /> User List
                </button>

                <button
                  onClick={() => handleNav("/admin/deals")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaHandshake /> Deals
                </button>

                <button
                  onClick={() => handleNav("/admin/tickets")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaTicketAlt /> Ticket History
                </button>
                <button
                  onClick={() => handleNav("/admin/orders")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaTicketAlt /> Order History
                </button>
              </div>
            )}
          </div>

          {/* Transfer Fund Menu */}
          <div>
            <button
              onClick={() => {
                setTransferFundMenu(!transferFundMenu);
                setShowSubMenu(false);
                setShowUserSubMenu(false);
                setGlobaldividend(false);

              }}
              className={`px-4 py-2 w-full flex justify-between items-center rounded-lg font-medium transition
                ${transferFundMenu ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Fund Management
              {transferFundMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {transferFundMenu && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  onClick={() => handleNav("/admin/transferfund")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaMoneyCheckAlt /> Transfer Fund
                </button>

                <button
                  onClick={() => handleNav("/admin/wallet-history")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaWallet /> Wallet History
                </button>

                <button
                  onClick={() => handleNav("/admin/income-history")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaChartLine /> Income History
                </button>

                <button
                  onClick={() => handleNav("/admin/withdraw-orders")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaTicketAlt /> Withdraw Orders
                </button>

                <button
                  onClick={() => handleNav("/admin/deposit-history")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaMoneyBillWave /> Deposit History
                </button>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                setGlobaldividend(!globaldividend);
                setShowSubMenu(false);
                setShowUserSubMenu(false);
                setTransferFundMenu(false);

              }}
              className={`px-4 py-2 w-full flex justify-between items-center rounded-lg font-medium transition
                ${globaldividend ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Bonus
              {globaldividend ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {globaldividend && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  onClick={() => handleNav("/admin/global-dividend")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaMoneyCheckAlt /> Global Funding
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white text-xl font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition mt-6"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
