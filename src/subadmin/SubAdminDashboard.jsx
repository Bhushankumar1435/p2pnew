import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getSubAdminDashboard } from "../api/SubAdminapi";
import PickOrders from "./pages/PickOrders";
import Timer from "../components/Timer";


const SubAdminDashboard = () => {
  const navigate = useNavigate();

  // General/UI state
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dashboard stats
  const [dashboardData, setDashboardData] = useState({});

  // Deals state + pagination
  const [deals, setDeals] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const API_BASE = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  const handleLogout = () => {
    localStorage.removeItem("sub_admin_token");
    navigate("/subadminauth/login");
  };

  // ===== Fetch Dashboard Data =====
  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const response = await getSubAdminDashboard();
        if (!mounted) return;
        if (response?.success) {
          setDashboardData(response.data || {});
        } else {
          console.warn("getSubAdminDashboard returned no success:", response);
        }
      } catch (err) {
        console.error("Error fetching subadmin dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset to page 1 when user switches to deals tab
  useEffect(() => {
    if (activeTab === "deals") {
      setActiveFilter("all");
      setDeals(allDeals);
    }
  }, [activeTab, allDeals]);


  // ===== Fetch Deals (paginated) =====
  useEffect(() => {
    if (activeTab !== "deals") return;

    let mounted = true;
    const fetchDeals = async () => {
      setDealsLoading(true);
      try {
        const token = localStorage.getItem("sub_admin_token");
        if (!token) {
          navigate("/subadmin/login");
          return;
        }

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
        if (!mounted) return;

        const orders = data?.data?.orders || data?.orders || [];
        const totalCount =
          data?.data?.count ?? data?.data?.total ?? data?.count ?? data?.total ?? null;

        if (Array.isArray(orders)) {
          setAllDeals(orders);
          setDeals(orders);
        } else {
          setAllDeals([]);
          setDeals([]);
        }

        if (typeof totalCount === "number") {
          const pages = Math.max(1, Math.ceil(totalCount / limit));
          setTotalPages(pages);
        } else {
          setTotalPages(Math.max(1, Math.ceil((orders?.length || 0) / limit)));
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        if (mounted) setDealsLoading(false);
      }
    };

    fetchDeals();
    return () => {
      mounted = false;
    };
  }, [activeTab, page, limit, API_BASE, navigate]);

  // ===== Order Actions =====
  const handleActionBySubAdmin = async (orderId, action) => {
    try {
      const token = localStorage.getItem("sub_admin_token");
      if (!token) {
        navigate("/subadminauth/login");
        return;
      }


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

        setDeals(prev => prev.filter(d => d._id !== orderId));
        setAllDeals(prev => prev.filter(d => d._id !== orderId));
        setSelectedDeal(null);


      } else {
        alert(result.message || "Failed to perform action.");
      }
    } catch (error) {
      console.error("manageOrder error:", error);
      alert("Server error while performing action.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed lg:static z-50 inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white w-64 shadow-md`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full p-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Validator Panel</h2>
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
                navigate("/subadmin/dashboard");
              }}
              className={`text-left px-4 py-2 rounded-lg text-lg font-semibold transition ${activeTab === "dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab("deals");
                setSidebarOpen(false);
                navigate("/subadmin/manage-orders");
              }}
              className={`text-left px-4 py-2 rounded-lg text-lg font-semibold transition ${activeTab === "deals" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Manage Orders
            </button>

            <button
              onClick={() => {
                setActiveTab("pick-orders");
                setSidebarOpen(false);
                navigate("/subadmin/pick-orders");
              }}
              className={`text-left px-4 py-2 rounded-lg text-lg font-semibold transition ${activeTab === "pick-orders" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"}`}
            >
              Pick Orders
            </button>
          </nav>

          <div className="">
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 min-h-screen overflow-y-auto px-10 py-10 relative">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-md shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <section className="w-full max-w-6xl">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 mt-8">
              {/* ---------------- Title ---------------- */}
              <div className="flex gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                Validator Dashboard
              </h1>

              {dashboardData?.subAdmin?.userId && (
                <span
                  className="px-4 py-1.5 rounded-md text-sm sm:text-base
                   font-semibold bg-blue-100 text-blue-700
                   border border-blue-300 shadow-sm"
                >
                  Validator ID: {dashboardData.subAdmin.userId}
                </span>
              )}
            </div>

            {/* ---------------- Button ---------------- */}
            <button onClick={() => navigate("/login")}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold
               text-white bg-gradient-to-br from-blue-600 to-blue-400 
               hover:scale-105 hover:brightness-110 hover:shadow-lg 
               transition-transform duration-300 ease-in-out w-full md:w-auto text-center" >
              Go To User Panel
            </button>

          </div>


            {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Total Users</h2>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.totalUsers || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
              <p className="text-3xl font-semibold text-green-600">{dashboardData.totalOrders ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Active Deals</h2>
              <p className="text-3xl font-semibold text-gray-600">{dashboardData.activeDeals ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <h2 className="text-xl font-semibold mb-2">Total Deals</h2>
              <p className="text-3xl font-semibold text-orange-600">{dashboardData.totalDeals ?? 0}</p>
            </div>
          </div>
        )}
      </section>
        )}

      {/* Deals View */}
      {activeTab === "deals" && (
        <section className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 lg:mt-0 mt-6">
            <h1 className="text-3xl font-bold text-left ">Manage Orders</h1>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() => {
                  setDeals(allDeals.filter((d) => d.status?.toUpperCase() === "CONFIRMED"));
                  setActiveFilter("confirmed");
                }}
                className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "confirmed" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
              >
                Confirmed Orders
              </button>

              <button
                onClick={() => {
                  setDeals(allDeals.filter((d) => d.status?.toUpperCase() === "FAILED"));
                  setActiveFilter("failed");
                }}
                className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "failed" ? "bg-red-700 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                Reject Orders
              </button>
              <button
                onClick={() => {
                  setDeals(allDeals);
                  setActiveFilter("all");
                }}
                className={`px-4 py-2 rounded-lg shadow-md transition ${activeFilter === "all" ? "bg-gray-700 text-white" : "bg-gray-500 text-white hover:bg-gray-600"}`}
              >
                All Orders
              </button>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-md overflow-x-auto">
            {dealsLoading ? (
              <p>Loading deals...</p>
            ) : deals.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-blue-50 text-center">
                      <tr>
                        <th className="py-2 px-3 border">S.No</th>
                        <th className="py-2 px-3 border">Status</th>
                        <th className="py-2 px-3 border">Buyer</th>
                        <th className="py-2 px-3 border">Seller</th>
                        <th className="py-2 px-3 border">Tokens</th>
                        <th className="py-2 px-3 border">Fiat</th>
                        <th className="py-2 px-3 border">Receipt</th>
                        <th className="py-2 px-3 border">Order Expiry</th>
                        <th className="py-2 px-3 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.map((deal, index) => (
                        <tr key={deal._id} className="hover:bg-gray-50 text-center">
                          <td className="py-2 px-3 border font-medium">{(page - 1) * limit + (index + 1)}</td>
                          <td className="py-2 px-3 border">{deal.status}</td>
                          <td className="py-2 px-3 border">{deal?.type !== "DUMMY" ? deal.buyer?.userId || "-" : deal.dummyBuyer?.userId || "-"}</td>
                          <td className="py-2 px-3 border">{deal?.type !== "DUMMY" ? deal.seller?.userId || "-" : deal.dummySeller?.userId || "-"}</td>
                          <td className="py-2 px-3 border">{deal.tokenAmount}</td>
                          <td className="py-2 px-3 border">{deal.fiatAmount}</td>
                          <td className="py-2 px-3 border">
                            {deal.buyerReceipt ? (
                              <a href={deal.buyerReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {deal.buyerReceipt.length > 20 ? `${deal.buyerReceipt.slice(0, 10)}...${deal.buyerReceipt.slice(-10)}` : deal.buyerReceipt}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-2 px-3 border text-center">
                            <span className="inline-block">
                              <Timer expireAt={deal?.timestamps?.expireAt} status={deal?.status} />
                            </span>
                          </td>
                          <td className="py-2 px-3 border text-center">
                            <div className="flex justify-center flex-wrap gap-2">
                              <button
                                onClick={() => setSelectedDeal(deal)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                More Details
                              </button>

                              {activeFilter !== "all" &&
                                (deal.status === "CONFIRMED" || deal.status === "FAILED") && (
                                  <>
                                    <button
                                      onClick={() => handleActionBySubAdmin(deal._id, "COMPLETED")}
                                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                      Validate 
                                    </button>

                                    <button
                                      onClick={() => handleActionBySubAdmin(deal._id, "REJECTED")}
                                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-4">
                  {deals.map((deal, index) => (
                    <div key={deal._id} className="border rounded-xl p-4 bg-gray-50 shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">#{(page - 1) * limit + (index + 1)}</h3>
                        <span className="px-2 py-1 text-xs rounded bg-blue-200 text-blue-700">{deal.status}</span>
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <div className="">
                          <p className="text-sm"><strong>Buyer:</strong> {deal.buyer?.userId || "—"}</p>
                          <p className="text-sm"><strong>Seller:</strong> {deal.seller?.userId || "—"}</p>
                        </div>
                        <div className="">
                          <p className="text-sm"><strong>Token:</strong> {deal.tokenAmount}</p>
                          <p className="text-sm"><strong>Fiat:</strong> {deal.fiatAmount}</p>
                        </div>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <p className="mt-2 text-sm">
                          <strong>Receipt:</strong>{" "}
                          {deal.buyerReceipt ? (
                            <a href={deal.buyerReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Receipt</a>
                          ) : (
                            "—"
                          )}
                        </p>
                        <div className="flex justify-center items-center mt-1">
                          <Timer
                            expireAt={deal?.timestamps?.expireAt}
                            status={deal?.status}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() => setSelectedDeal(deal)}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                        >
                          More Details
                        </button>

                        {activeFilter !== "all" &&
                          (deal.status === "CONFIRMED" || deal.status === "FAILED") && (
                            <>
                              <button
                                onClick={() => handleActionBySubAdmin(deal._id, "COMPLETED")}
                                className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleActionBySubAdmin(deal._id, "REJECTED")}
                                className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}

                      </div>

                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center gap-4 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
                  >
                    <span className="md:hidden">←</span>
                    <span className="hidden md:inline">← Prev</span>
                  </button>

                  <span className="text-gray-700 font-medium ">Page {page} of {totalPages}</span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${page >= totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
                  >
                    <span className="md:hidden">→</span>
                    <span className="hidden md:inline">Next →</span>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No orders found</p>
            )}
          </div>
        </section>
      )}
      {activeTab === "pick-orders" && (
        <section className="w-full max-w-6xl">
          <PickOrders />
        </section>
      )}

    </main>

      {/* ===== Modal: Selected Deal ===== */ }
  {
    selectedDeal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button onClick={() => setSelectedDeal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>
          <h2 className="text-2xl font-semibold mb-4 text-center">Order Details</h2>

          <div className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold text-gray-700">Buyer Info</h3>
              <p><strong>ID:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.buyer?.userId || "-" : selectedDeal.dummyBuyer?.userId || "-"}</p>
              <p><strong>Name:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.buyer?.name || "-" : selectedDeal.dummyBuyer?.name || "-"}</p>
              <p><strong>Email:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.buyer?.email || "-" : selectedDeal.dummyBuyer?.email || "-"}</p>
              <p><strong>Phone:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.buyer?.phoneNumber || "-" : selectedDeal.dummyBuyer?.phoneNumber || "-"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mt-3">Seller Info</h3>
              <p><strong>ID:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.seller?.userId || "-" : selectedDeal.dummySeller?.userId || "-"}</p>
              <p><strong>Name:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.seller?.name || "-" : selectedDeal.dummySeller?.name || "-"}</p>
              <p><strong>Email:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.seller?.email || "-" : selectedDeal.dummySeller?.email || "-"}</p>
              <p><strong>Phone:</strong> {selectedDeal?.type !== "DUMMY" ? selectedDeal.seller?.phoneNumber || "-" : selectedDeal.dummySeller?.phoneNumber || "-"}</p>
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
    )
  }
    </div >
  );
};

export default SubAdminDashboard;
