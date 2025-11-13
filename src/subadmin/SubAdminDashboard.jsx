import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getSubAdminDashboard } from "../api/SubAdminapi";

const SubAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({});
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [allDeals, setAllDeals] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);


  const handleLogout = () => {
    localStorage.removeItem("sub_admin_token");
    navigate("/subadmin/login");
  };

  // ===== Fetch Dashboard Data =====
  useEffect(() => {
    console.log("SubAdminDashboard mounted ✅");

    const fetchDashboardData = async () => {
      try {
        console.log("Fetching subadmin dashboard data...");
        const response = await getSubAdminDashboard();
        console.log("Response:", response);

        if (response.success) {
          setDashboardData(response.data || {});
        }
      } catch (err) {
        console.error("Error fetching subadmin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const API_BASE = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  // ===== Fetch Orders (Deals) =====
  useEffect(() => {
    if (activeTab === "deals") {
      const fetchDeals = async () => {
        setDealsLoading(true);
        try {
          const token = localStorage.getItem("sub_admin_token");
          if (!token) return;

          // 👇 Send pagination params to backend
          const res = await fetch(
            `${API_BASE}sub-admin/requestOrders?page=${page}&limit=${limit}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();
          const orders = data?.data?.orders || data?.orders || [];

          if (Array.isArray(orders)) {
            setAllDeals(orders);
            setDeals(orders);

            // 👇 Dynamically calculate total pages
            const totalCount = data?.data?.count || data?.count
            const pages = Math.ceil(totalCount / limit);
            setTotalPages(pages || 1);
          }
        } catch (err) {
          console.error("Error fetching deals:", err);
        } finally {
          setDealsLoading(false);
        }
      };

      fetchDeals();
    }
  }, [activeTab, page, API_BASE]);



  // ===== Order Actions =====
  const handleActionBySubAdmin = async (orderId, action) => {
    try {
      const token = localStorage.getItem("sub_admin_token");
      const res = await fetch(`${API_BASE}sub-admin/manageOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, action }),
      });
      const result = await res.json();
      if (result.success) {
        alert(`Order ${action} successfully!`);
        setAllDeals((prev) =>
          prev.map((d) => (d._id === orderId ? { ...d, status: action } : d))
        );
      } else {
        alert(result.message || "Failed to perform action.");
      }
    } catch (error) {
      alert("Server error while performing action.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar ===== */}
      <div
        className={`fixed lg:static z-50 inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white w-64 shadow-md`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Sub-Admin Panel</h2>
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === "dashboard"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("deals");
                setSidebarOpen(false);
              }}
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === "deals"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              Manage Orders
            </button>
          </nav>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col items-center justify-start text-center px-4 py-10 relative">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* ===== Dashboard ===== */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-10 lg:mt-0 mt-6">
              Sub-Admin Dashboard
            </h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.totalUsers || 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
                  <p className="text-3xl font-semibold text-green-600">
                    {dashboardData.totalOrders || 46}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Active Deals</h2>
                  <p className="text-3xl font-semibold text-purple-600">
                    {dashboardData.activeDeals || 9}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                  <p className="text-3xl font-semibold text-orange-600">
                    ${dashboardData.totalRevenue || 13275}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== Deals Tab ===== */}
        {activeTab === "deals" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-6">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 lg:mt-0 mt-6">
                Manage Orders
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeals(allDeals);
                    setActiveFilter("all");
                  }}
                  className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "all"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                    }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => {
                    setDeals(
                      allDeals.filter(
                        (d) => d.status?.toUpperCase() === "CONFIRMED"
                      )
                    );
                    setActiveFilter("confirmed");
                  }}
                  className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "confirmed"
                    ? "bg-green-700 text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  Confirmed Orders
                </button>
                <button
                  onClick={() => {
                    setDeals(
                      allDeals.filter(
                        (d) => d.status?.toUpperCase() === "FAILED"
                      )
                    );
                    setActiveFilter("failed");
                  }}
                  className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "failed"
                    ? "bg-red-700 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  Failed Orders
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-6xl text-left overflow-x-auto">
              {dealsLoading ? (
                <p>Loading deals...</p>
              ) : deals.length > 0 ? (
                <table className="min-w-full border text-sm">
                  <thead className="bg-blue-50 text-center">
                    <tr>
                      <th className="py-2 px-3 border">S.No</th>
                      <th className="py-2 px-3 border">Status</th>
                      <th className="py-2 px-3 border">Buyer</th>
                      <th className="py-2 px-3 border">Seller</th>
                      <th className="py-2 px-3 border">Token</th>
                      <th className="py-2 px-3 border">Fiat</th>
                      <th className="py-2 px-3 border">Receipt</th>
                      <th className="py-2 px-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((deal, index) => (
                      <tr key={deal._id} className="hover:bg-gray-50 text-center">
                        <td className="py-2 px-3 border font-medium">{(page - 1) * limit + (index + 1)}</td>
                        <td className="py-2 px-3 border">{deal.status}</td>
                        <td className="py-2 px-3 border">{deal.buyer?.userId || "—"}</td>
                        <td className="py-2 px-3 border">{deal.seller?.userId || "—"}</td>
                        <td className="py-2 px-3 border">{deal.tokenAmount}</td>
                        <td className="py-2 px-3 border">{deal.fiatAmount}</td>
                        <td className="py-2 px-3 border">
                          {deal.buyerReceipt ? (
                            <a
                              href={deal.buyerReceipt}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {deal.buyerReceipt.length > 20
                                ? `${deal.buyerReceipt.slice(0, 10)}...${deal.buyerReceipt.slice(-10)}`
                                : deal.buyerReceipt}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 px-3 border flex justify-center flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedDeal(deal)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            More Details
                          </button>

                          {(activeFilter === "confirmed" || activeFilter === "failed") && (
                            <>
                              <button
                                onClick={() => handleActionBySubAdmin(deal._id, "COMPLETED")}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleActionBySubAdmin(deal._id, "REJECTED")}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Failed
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No orders found</p>
              )}
              <div className="flex justify-between items-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-4 py-2 rounded-lg shadow-md ${page === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-800"
                    }`}
                >
                  ← Prev
                </button>

                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className={`px-4 py-2 rounded-lg shadow-md ${page === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-800"
                    }`}
                >
                  Next →
                </button>
              </div>

            </div>
          </>
        )}
      </div>

      {/* ===== Modal ===== */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Order Details
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-700">Buyer Info</h3>
                <p><strong>ID:</strong> {selectedDeal.buyer?.userId || "—"}</p>
                <p><strong>Name:</strong> {selectedDeal.buyer?.name || "—"}</p>
                <p><strong>Email:</strong> {selectedDeal.buyer?.email || "—"}</p>
                <p><strong>Ph. Number:</strong> {selectedDeal.buyer?.phoneNumber || "—"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mt-3">Seller Info</h3>
                <p><strong>ID:</strong> {selectedDeal.seller?.userId || "—"}</p>
                <p><strong>Name:</strong> {selectedDeal.seller?.name || "—"}</p>
                <p><strong>Email:</strong> {selectedDeal.seller?.email || "—"}</p>
                <p><strong>Ph. Number:</strong> {selectedDeal.seller?.phoneNumber || "—"}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mt-3">Deal Info</h3>
                <p><strong>Token Amount:</strong> {selectedDeal.tokenAmount}</p>
                <p><strong>Token Commission:</strong> {selectedDeal.sellerCommission}</p>
                <p><strong>Fiat Amount:</strong> {selectedDeal.fiatAmount}</p>
                <p><strong>Fiat Commission:</strong> {selectedDeal.buyerCommission}</p>
                <p><strong>Status:</strong> {selectedDeal.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubAdminDashboard;
