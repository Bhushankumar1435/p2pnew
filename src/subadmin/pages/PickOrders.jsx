import React, { useEffect, useState } from "react";
import { getSubAdminOrderhistory, pickOrder } from "../../api/SubAdminapi";
import { ToastContainer } from "react-toastify";

const PickOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiMessage, setApiMessage] = useState(""); 

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNumber) => {
    setLoading(true);
    setError("");

    try {
      const res = await getSubAdminOrderhistory(pageNumber, limit);

      setApiMessage(res.message); 

      if (res.success) {
        const ordersData = res.data?.orders || [];
        const totalCount = res.data?.count ?? ordersData.length;

        setOrders(ordersData);
        setTotalPages(Math.ceil(totalCount / limit));
      } else {
        setOrders([]);
        setError(res.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
      setError("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePickOrder = async (orderId) => {
    try {
      const result = await pickOrder(orderId);

      alert(result.message); 

      if (result.success) {
        fetchOrders(page);
      }
    } catch (err) {
      alert("Server error!");
    }
  };

  return (
    <div className="w-full p-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-4 text-start">Pick Orders</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <p className="text-center py-10">Loading orders...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center">
            {apiMessage || "No orders found"}
          </p>
        ) : (
          <>
            <table className="w-full border rounded-lg text-center">
              <thead className="bg-gray-200">
                <tr className="bg-gray-100 text-center">
                  <th className="p-3 border">S.No.</th>
                  <th className="p-3 border">Order ID</th>
                  <th className="p-3 border">Buyer</th>
                  <th className="p-3 border">Seller</th>
                  <th className="p-3 border">Token</th>
                  <th className="p-3 border">Fiat</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order,idx) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-2 border"> {(page - 1) * limit + idx + 1} </td>
                    <td className="p-3 border">{order._id}</td>
                    <td className="p-3 border">{order.buyer?.userId || "—"}</td>
                    <td className="p-3 border">{order.seller?.userId || "—"}</td>
                    <td className="p-3 border">{order.tokenAmount ?? "—"}</td>
                    <td className="p-3 border">{order.fiatAmount ?? "—"}</td>
                    <td className="p-3 border font-semibold">{order.status ?? "—"}</td>

                    <td className="p-3 border">
                      <button
                        onClick={() => handlePickOrder(order._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={order.status === "picked"}
                      >
                        {order.status === "picked" ? "Picked" : "Pick"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={`px-4 py-2 rounded ${
                  page === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className={`px-4 py-2 rounded ${
                  page === totalPages || totalPages === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PickOrders;
