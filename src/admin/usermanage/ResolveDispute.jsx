import React, { useEffect, useState } from "react";
import { getAllDisputesApi, resolveDisputeApi } from "../../api/Adminapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DisputeList = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadDisputes = async () => {
    setLoading(true);
    const res = await getAllDisputesApi();

    if (res.success && res.data?.orders) {
      setOrders(res.data.orders);
      setAllOrders(res.data.orders);
    } else {
      setOrders([]);
      setAllOrders([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") {
      setOrders(allOrders);
      return;
    }

    const result = allOrders.filter((o) =>
      o._id.toLowerCase().includes(searchText.toLowerCase())
    );

    setOrders(result);
  };

  const statusColor = {
    DISPUTE: "text-red-600",
    PENDING: "text-yellow-600",
    COMPLETED: "text-green-600",
  };

  const handleResolve = async (orderId) => {
    if (!window.confirm("Are you sure you want to resolve this dispute?")) return;

    setLoadingIds((prev) => [...prev, orderId]);

    const res = await resolveDisputeApi(orderId);

    setLoadingIds((prev) => prev.filter((id) => id !== orderId));

    if (res?.success) {
      toast.success("Dispute resolved successfully!");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      setAllOrders((prev) => prev.filter((order) => order._id !== orderId));
    } else {
      toast.error(res?.message || "Failed to resolve dispute");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Disputed Orders</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-60"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : orders.length === 0 ? (
        <p>No disputed orders found.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
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
                    <td className="border p-2">{idx + 1}</td>
                    <td className="p-2 border">{order._id}</td>
                    <td className="p-2 border">{order.reportBy.userId}</td>
                    <td className="p-2 border">{order.reportOn.userId}</td>
                    <td className="p-2 border">{order.deal.token}</td>
                    <td className="p-2 border font-semibold">{order.tokenAmount}</td>
                    <td className="p-2 border font-semibold">₹ {order.fiatAmount}</td>
                    <td className="p-2 border">
                      {order.buyerReceipt ? (
                        <a href={order.buyerReceipt} target="_blank" className="text-blue-600 underline" > View</a>
                      ) : ("—")}
                    </td>
                    <td className={`p-2 border border-black font-semibold ${statusColor[order.status] || "text-gray-600"}`}>
                      {order.status}
                    </td>

                    <td className="p-2 border">
                      <button
                        disabled={loadingIds.includes(order._id)}
                        onClick={() => handleResolve(order._id)}
                        className={`px-3 py-1 rounded-md text-white ${
                          loadingIds.includes(order._id)
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

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="md:hidden space-y-4 mt-4">
            {orders.map((o, ind) => (
              <div key={o._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <p><span className="font-semibold">Sr. No:</span> {ind + 1}</p>
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
                  className={`mt-3 w-full px-3 py-2 rounded-md text-white ${
                    loadingIds.includes(o._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingIds.includes(o._id) ? "Resolving..." : "Resolve"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DisputeList;
