import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetOrderHistoryApi } from "../../api/Adminapi";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // for searching
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await GetOrderHistoryApi(page, limit);

      if (res.success) {
        setOrders(res.data.orders || []);
        setAllOrders(res.data.orders || []); // keep a copy for search

        const count = res.data.count || 0;
        setTotalPages(Math.ceil(count / limit));
      } else {
        toast.error(res.message || "Failed to fetch order history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const statusColor = {
    PENDING: "text-yellow-600",
    ACCEPTED: "text-blue-600",
    BUYER_PAID: "text-purple-600",
    SELLER_CONFIRMED: "text-orange-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
    REJECTED:"text-red-600",
    DISPUTE:"text-red-600",
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      setOrders(allOrders);
      return;
    }

    const result = allOrders.filter((o) =>
      o._id.toLowerCase().includes(searchText.toLowerCase())
    );

    // if (result.length === 0) {
    //   toast.error("No order found with this Order ID");
    // }

    setOrders(result);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
           <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Order History</h1>

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


      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-6">No Orders Found.</p>
      ) : (
        <>
          {/* ================= Desktop Table ================= */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full border rounded-lg text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Sr. No.</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Buyer</th>
                  <th className="p-2 border">Seller</th>
                  <th className="p-2 border">Token</th>
                  <th className="p-2 border">Fiat</th>
                  <th className="p-2 border">Token Amount</th>
                  <th className="p-2 border">Fiat Amount</th>
                  <th className="p-2 border">Receipt</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Requested</th>
                  <th className="p-2 border">Completed</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o, ind) => (
                  <tr key={o._id} className="border-b">
                     <td className="border p-2">
                      {(page - 1) * limit + (ind + 1)}
                    </td>
                    <td className="p-2 border">{o._id}</td>
                    <td className="p-2 border">{o?.buyer?.userId || "-"}</td>
                    <td className="p-2 border">{o?.seller?.userId || "-"}</td>
                    <td className="p-2 border">{o.deal?.token || "-"}</td>
                    <td className="p-2 border">{o.deal?.fiat || "-"}</td>
                    <td className="p-2 border font-semibold">{o.tokenAmount}</td>
                    <td className="p-2 border font-semibold">₹ {o.fiatAmount}</td>
                    <td className="p-2 border">
                      {o.buyerReceipt ? (
                        <a href={o.buyerReceipt} target="_blank" className="text-blue-600 underline" > View</a>
                      ) : ("—")}
                    </td>
                    <td className={`p-2 border border-black font-semibold ${statusColor[o.status] || "text-gray-600"}`}>{o.status}</td>
                    <td className="p-2 border">{o.timestamps?.requestedAt ? new Date(o.timestamps.requestedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                      : "—"}
                    </td>
                    <td className="p-2 border"> {o.timestamps?.completedAt ? new Date(o.timestamps.completedAt).toLocaleString("en-IN",
                      { timeZone: "Asia/Kolkata" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= Mobile Card View ================= */}
          <div className="md:hidden space-y-4 mt-4">
            {orders.map((o, ind) => (
              <div
                key={o._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p><span className="font-semibold">Sr. No:</span> {ind + 1}</p>
                <p><span className="font-semibold">Order ID:</span> {o._id}</p>
                <p><span className="font-semibold">Buyer:</span> {o?.buyer?.userId || "-"}</p>
                <p><span className="font-semibold">Seller:</span> {o?.seller?.userId || "-"}</p>
                <p><span className="font-semibold">Token:</span> {o.deal?.token || "-"}</p>
                <p><span className="font-semibold">Fiat:</span> {o.deal?.fiat || "-"}</p>
                 <p> <span className="font-semibold">Token Amount:</span>{" "} {o.tokenAmount} </p>
                <p> <span className="font-semibold">Fiat Amount:</span>{" "} ₹ {o.fiatAmount}</p>
                <p> <span className="font-semibold">Receipt:</span>{" "}{o.buyerReceipt ? ( <a href={o.buyerReceipt}target="_blank" className="text-blue-600 underline">
                      View
                    </a>
                  ) : (  "—" )} </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                   <span className={`font-semibold ${statusColor[o.status] || "text-gray-600"}`}
                  >{o.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Requested:</span>{" "}
                  {o.timestamps?.requestedAt
                    ? new Date(o.timestamps.requestedAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                    : "—"}
                </p>
                <p>
                  <span className="font-semibold">Completed:</span>{" "}
                  {o.timestamps?.completedAt
                    ? new Date(o.timestamps.completedAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}


      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded ${page === 1
            ? "bg-gray-300 text-gray-500"
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
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded ${page >= totalPages
            ? "bg-gray-300 text-gray-500"
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

export default OrderHistory;
