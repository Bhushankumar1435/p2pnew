import React, { useEffect, useState } from "react";
import { getAllDisputesApi, resolveDisputeApi } from "../../api/Adminapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DisputeList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const statusColor = {
    DISPUTE: "text-red-600",
    PENDING: "text-yellow-600",
    COMPLETED: "text-green-600",
  };

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const res = await getAllDisputesApi(page, limit); // Adjust API to accept page & limit
      if (res.success && res.data?.orders) {
        setOrders(res.data.orders);
        const count = res.data.count || res.data.orders.length;
        setTotalPages(Math.ceil(count / limit));
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [page]);

  const handleResolve = async (orderId) => {
    if (!window.confirm("Are you sure you want to resolve this dispute?")) return;
    setLoadingIds((prev) => [...prev, orderId]);
    const res = await resolveDisputeApi(orderId);
    setLoadingIds((prev) => prev.filter((id) => id !== orderId));

    if (res?.success) {
      toast.success("Dispute resolved successfully!");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } else {
      toast.error(res?.message || "Failed to resolve dispute");
    }
  };

  const getVisiblePageNumbers = () => {
    const maxVisiblePages = 10;
    const start = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
    const end = Math.min(start + maxVisiblePages - 1, totalPages);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Move to previous page
  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));

  // Move to next page
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold mb-4">Disputed Orders</h1>

      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No disputed orders found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full border rounded-lg text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">S.No.</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Complaint By</th>
                  <th className="p-2 border">Complaint Against</th>
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Fiat Amount</th>
                  <th className="p-2 border">Receipt</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order._id} className="border">
                    <td className="border p-2">{(page - 1) * limit + idx + 1}</td>
                    <td className="p-2 border">{order._id}</td>
                    <td className="p-2 border">{order.reportBy.userId}</td>
                    <td className="p-2 border">{order.reportOn.userId}</td>
                    <td className="p-2 border">{order.deal.token}</td>
                    <td className="p-2 border font-semibold">{order.tokenAmount}</td>
                    <td className="p-2 border font-semibold">₹ {order.fiatAmount}</td>
                    <td className="p-2 border">
                      {order.buyerReceipt ? (
                        <a href={order.buyerReceipt} target="_blank" className="text-blue-600 underline">
                          View
                        </a>
                      ) : "—"}
                    </td>
                    <td className={`p-2 border font-semibold ${statusColor[order.status] || "text-gray-600"}`}>
                      {order.status}
                    </td>
                    <td className="p-2 border">
                      <button
                        disabled={loadingIds.includes(order._id)}
                        onClick={() => handleResolve(order._id)}
                        className={`px-3 py-1 rounded-md text-white ${loadingIds.includes(order._id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {loadingIds.includes(order._id) ? "Resolving..." : "Resolve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 mt-4">
            {orders.map((o, ind) => (
              <div key={o._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <p><span className="font-semibold">Sr. No:</span> {(page - 1) * limit + ind + 1}</p>
                <p><span className="font-semibold">Order ID:</span> {o._id}</p>
                <p><span className="font-semibold">Complaint By:</span> {o.reportBy.userId}</p>
                <p><span className="font-semibold">Complaint Against:</span> {o.reportOn.userId}</p>
                <p><span className="font-semibold">Token:</span> {o.deal.token}</p>
                <p><span className="font-semibold">Amount:</span> {o.tokenAmount}</p>
                <p><span className="font-semibold">Fiat Amount:</span> ₹ {o.fiatAmount}</p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={`font-semibold ${statusColor[o.status]}`}>{o.status}</span>
                </p>
                <button
                  disabled={loadingIds.includes(o._id)}
                  onClick={() => handleResolve(o._id)}
                  className={`mt-3 w-full px-3 py-2 rounded-md text-white ${loadingIds.includes(o._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {loadingIds.includes(o._id) ? "Resolving..." : "Resolve"}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={handlePrevPage}
              className={`px-4 py-2 rounded-lg shadow-md ${page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 flex-wrap">
              {getVisiblePageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 py-1 rounded-md text-sm font-medium cursor-pointer ${page === p ? "text-blue-600 underline" : "text-gray-700 hover:text-blue-500"}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={handleNextPage}
              className={`px-4 py-2 rounded-lg shadow-md ${page === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-800"}`}
            >
              Next →
            </button>
          </div>

        </>
      )}
    </div>
  );
};

export default DisputeList;
