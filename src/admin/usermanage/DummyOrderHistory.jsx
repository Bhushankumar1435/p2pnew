import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetOrderHistoryApi } from "../../api/Adminapi";

const DummyOrderHistory = () => {
  const [allOrders, setAllOrders] = useState([]); // all DUMMY orders
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Sliding window pagination
  const maxVisiblePages = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch all orders at once
      const res = await GetOrderHistoryApi(1, 1000);
      if (res.success) {
        const dummyOrders = (res.data.orders || []).filter(
          (o) => o.type === "DUMMY"
        );
        setAllOrders(dummyOrders);
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
  }, []);

  const statusColor = {
    PENDING: "text-yellow-600",
    ACCEPTED: "text-blue-600",
    BUYER_PAID: "text-purple-600",
    SELLER_CONFIRMED: "text-orange-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
    REJECTED: "text-red-600",
    DISPUTE: "text-red-600",
  };

  // Search handler
  const handleSearch = () => {
    setPage(1);
  };

  // Filtered + searched orders
  const filteredOrders = allOrders.filter((o) =>
    o._id.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit
  );

  const getVisiblePageNumbers = () => {
    let start = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
    let end = Math.min(start + maxVisiblePages - 1, totalPages);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Dummy-Order History</h1>

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
      ) : paginatedOrders.length === 0 ? (
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
                  <th className="p-2 border">Token Amount</th>
                  <th className="p-2 border">Fiat Amount</th>
                  <th className="p-2 border">Receipt</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((o, ind) => (
                  <tr key={o._id} className="border-b">
                    <td className="border p-2">{(page - 1) * limit + ind + 1}</td>
                    <td className="p-2 border">{o._id}</td>
                    <td className="p-2 border">{o?.dummyBuyer?.userId || "-"}</td>
                    <td className="p-2 border">{o?.dummySeller?.userId || "-"}</td>
                    <td className="p-2 border font-semibold">{o.tokenAmount}</td>
                    <td className="p-2 border font-semibold">₹ {o.fiatAmount}</td>
                    <td className="p-2 border">
                      {o.buyerReceipt ? (
                        <a
                          href={o.buyerReceipt}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td
                      className={`p-2 border border-black font-semibold ${
                        statusColor[o.status] || "text-gray-600"
                      }`}
                    >
                      {o.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= Mobile Card View ================= */}
          <div className="md:hidden space-y-4 mt-4">
            {paginatedOrders.map((o, ind) => (
              <div
                key={o._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p>
                  <span className="font-semibold">Sr. No:</span>{" "}
                  {(page - 1) * limit + ind + 1}
                </p>
                <p>
                  <span className="font-semibold">Order ID:</span> {o._id}
                </p>
                <p>
                  <span className="font-semibold">Buyer:</span>{" "}
                  {o?.dummyBuyer?.userId || "-"}
                </p>
                <p>
                  <span className="font-semibold">Seller:</span>{" "}
                  {o?.dummySeller?.userId || "-"}
                </p>
                <p>
                  <span className="font-semibold">Token Amount:</span>{" "}
                  {o.tokenAmount}
                </p>
                <p>
                  <span className="font-semibold">Fiat Amount:</span> ₹{" "}
                  {o.fiatAmount}
                </p>
                <p>
                  <span className="font-semibold">Receipt:</span>{" "}
                  {o.buyerReceipt ? (
                    <a
                      href={o.buyerReceipt}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      statusColor[o.status] || "text-gray-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= Pagination Buttons ================= */}
      <div className="flex justify-between items-center mt-6 gap-4 flex-wrap">
        <button
          disabled={page === 1}
          onClick={handlePrevPage}
          className={`px-4 py-2 rounded-lg shadow-md ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          ← Prev
        </button>

        <div className="flex items-center gap-1 flex-wrap">
          {getVisiblePageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-2 py-1 rounded-md text-sm font-medium cursor-pointer ${
                page === p
                  ? "text-blue-600 underline"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-lg shadow-md ${
            page === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DummyOrderHistory;
