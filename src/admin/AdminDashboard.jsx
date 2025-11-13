import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getAdminDashboard } from "../api/Adminapi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [allDeals, setAllDeals] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboard();
        if (response.success) {
          setTotalUsers(response.data?.totalUsers || response.totalUsers || 0);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const API_BASE = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  // Fetch all deals
  useEffect(() => {
    if (activeTab === "deals") {
      const fetchDeals = async () => {
        setDealsLoading(true);
        try {
          const token = localStorage.getItem("admin_token");
          if (!token) return;

          const res = await fetch(`${API_BASE}admin/requestOrders`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          let orders = data?.data?.orders || data?.orders || [];
          if (Array.isArray(orders)) {
            setAllDeals(orders);
            setDeals(orders);
          }
        } catch (err) {
          console.error("Error fetching deals:", err);
        } finally {
          setDealsLoading(false);
        }
      };
      fetchDeals();
    }
  }, [activeTab, API_BASE]);

  const handleActionByAdmin = async (orderId, action) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}admin/manageOrder`, {
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
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col h-full p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Admin panel</h2>
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === "dashboard"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
                }`} >
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
                }`} >
              Manage Orders
            </button>
          </nav>
          <div className="mt-auto">
            <button onClick={handleLogout}
              className="w-full mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col items-center justify-start text-center px-4 py-10">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)} >
          <Menu size={22} />
        </button>
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-10 lg:mt-0 mt-6">Admin Dashboard</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalUsers}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Active Deals</h2>
                  <p className="text-3xl font-semibold text-green-600">46</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Pending Withdrawal
                  </h2>
                  <p className="text-3xl font-semibold text-red-600">7</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                  <p className="text-3xl font-semibold text-orange-600">
                    $12,760
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
                    }`} >
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
                    }`}  >
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
                    }`} >
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
                    {deals.map((deal) => (
                      <tr
                        key={deal._id}
                        className="hover:bg-gray-50 text-center" >
                        <td className="py-2 px-3 border">{deal.status}</td>
                        <td className="py-2 px-3 border">
                          {deal.buyer?.userId || "—"}
                        </td>
                        <td className="py-2 px-3 border">
                          {deal.seller?.userId || "—"}
                        </td>
                        <td className="py-2 px-3 border">
                          {deal.tokenAmount}
                        </td>
                        <td className="py-2 px-3 border">
                          {deal.fiatAmount}
                        </td>
                        <td className="py-2 px-3 border">
                          {deal.buyerReceipt ? (
                            <a href={deal.buyerReceipt}
                              target="_blank"
                              className="text-blue-600 underline" >

                              {deal.buyerReceipt.length > 20
                                ? `${deal.buyerReceipt.slice(0, 10)}...${deal.buyerReceipt.slice(-10)}`
                                : deal.buyerReceipt}
                            </a>
                          ) : ("—"
                          )}
                        </td>
                        <td className="py-2 px-3 border flex justify-center gap-2">
                          {/* Always show More Details */}
                          <button onClick={() => setSelectedDeal(deal)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"  >
                            More Details
                          </button>

                          {/* Accept / Failed only for confirmed & failed filters */}
                          {(activeFilter === "confirmed" ||
                            activeFilter === "failed") && (
                              <>
                                <button onClick={() => handleActionByAdmin(deal._id, "COMPLETED")}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700" >
                                  Accept
                                </button>
                                <button onClick={() => handleActionByAdmin(deal._id, "REJECTED")}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"    >
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

export default AdminDashboard;
