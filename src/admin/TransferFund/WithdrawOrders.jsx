import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminGet, adminPost } from "../../api/Adminapi"; 

const WithdrawOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("pending"); 

  const fetchWithdrawOrders = async () => {
    setLoading(true);
    try {
      const endpoint = `admin/withdrawOrders?page=${page}&limit=${limit}&status=${activeTab.toUpperCase()}`;
      const res = await adminGet(endpoint, true);

      if (res.success) {
        setOrders(res.data.data);
        const count = res.data.count || 0;
        setTotalPages(Math.ceil(count / limit));
      } else {
        toast.error(res.message || "Failed to fetch withdraw orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawOrders();
  }, [page, activeTab]);

  const handleAction = async (id, action) => {
    try {
      const res = await adminPost("admin/manageWithdraw", { id, status: action }, true);
      if (res.success) {
        toast.success(res.message || `Withdraw ${action.toLowerCase()} successfully!`);
        fetchWithdrawOrders(); 
      } else {
        toast.error(res.message || "Action failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-4">Withdraw Orders</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {["pending", "approved", "rejected"].map((tab) => {
            const colors = {
              pending: "bg-gray-600 text-white",
              approved: "bg-green-600 text-white",
              rejected: "bg-red-600 text-white",
            };
            const defaultColors = {
              pending: "bg-gray-200 text-gray-600 hover:bg-gray-300",
              approved: "bg-green-100 text-green-600 hover:bg-green-200",
              rejected: "bg-red-100 text-red-600 hover:bg-red-200",
            };
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab ? colors[tab] : defaultColors[tab]
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No {activeTab} withdraw orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User ID</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Token</th>
                {/* <th className="p-2 border">Mode</th> */}
                {/* <th className="p-2 border">Remark</th> */}
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{order.userId.userId}</td>
                  <td className="p-2 border">{order.amount}</td>
                  <td className="p-2 border">{order.token}</td>
                  {/* <td className="p-2 border">{order.mode}</td> */}
                  {/* <td className="p-2 border">{order.remark}</td> */}
                  <td className="p-2 border">
                    {activeTab === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleAction(order._id, "APPROVED")}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(order._id, "REJECTED")}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>{order.status || activeTab.toUpperCase()}</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          <span className="md:hidden">←</span>
          <span className="hidden md:inline">← Prev</span>
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md ${
            page >= totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          <span className="md:hidden">→</span>
          <span className="hidden md:inline">Next →</span>
        </button>
      </div>
    </div>
  );
};

export default WithdrawOrders;
