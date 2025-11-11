import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyIcon from "../assets/images/copy_icon.png";

const BASE_URL = "http://192.168.1.34:8800/api";

const Orders = () => {
  const [tab, setTab] = useState("all_orders");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Orders Function
  const fetchOrders = async (params = {}) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log("🔹 Token from localStorage:", token);

      if (!token) {
        alert("No token found — please log in again.");
        setOrders([]);
        setLoading(false);
        return;
      }

      const query = new URLSearchParams(params).toString();
      const url = `${BASE_URL}/user/orderHistory${query ? `?${query}` : ""}`;
      console.log("🔹 Fetching from URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔹 HTTP Status:", res.status);

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // If not OK, log raw text for debugging
      if (!res.ok) {
        const rawText = await res.text();
        console.error("❌ Non-OK response:", rawText);
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ API Response Data:", data);

      if (data.success && data.data?.orders) {
        console.log("✅ Orders fetched successfully:", data.data.orders);
        setOrders(data.data.orders);
      } else {
        console.warn("⚠️ No orders or API returned error:", data.message);
        setOrders([]);
      }
    } catch (err) {
      console.error("🔥 Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
      console.log("🔹 Fetch Orders Complete");
    }
  };

  // ✅ Fetch when tab changes
  useEffect(() => {
    if (tab === "all_orders") {
      fetchOrders();
    } else if (tab === "processing") {
      fetchOrders({ status: "PROCESSING" });
    } else if (tab === "pl-statement") {
      fetchOrders({ status: "COMPLETED" });
    } else if(tab === "accepted"){
      fetchOrders({ status: "ACCEPTED"})
    } 
  }, [tab]);

  // ✅ Filtered Orders Logic
  const filteredOrders =
    tab === "all_orders"
      ? filter === "cancelled"
        ? orders.filter((order) => order.status === "CANCELLED")
        : filter === "completed"
        ? orders.filter((order) => order.status === "COMPLETED")
        : orders
      : orders;

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto">
            <div className="w-full pt-3">
              {/* ✅ Tabs */}
              <div className="flex border-b border-[var(--border-light)] px-4 gap-4 mb-4">
                {[
                  { key: "all_orders", label: "All Orders" },
                  { key: "processing", label: "Processing" },
                  { key: "pl-statement", label: "Profit & Loss Statement" },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`pb-2 text-base font-semibold ${
                      tab === item.key
                        ? "border-b-2 border-blue-500 text-black"
                        : "text-[var(--text-color)]"
                    }`}
                    onClick={() => setTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* ✅ Filters */}
              {tab === "all_orders" && (
                <div className="flex px-4 mb-4 gap-2">
                  {["all", "completed", "cancelled"].map((f) => (
                    <button
                      key={f}
                      className={`px-3 py-1 rounded-md border ${
                        filter === f
                          ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                          : "border-gray-300 text-gray-600"
                      }`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* ✅ Orders List */}
              <div className="w-full px-4">
                {loading && (
                  <p className="text-center text-gray-500 py-10">
                    Loading orders...
                  </p>
                )}

                {!loading && filteredOrders.length === 0 && (
                  <p className="text-center text-gray-400 py-10">
                    No orders found.
                  </p>
                )}

                {!loading &&
                  filteredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

// ✅ OrderCard Component
const OrderCard = ({ order }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <span
          className={`font-semibold ${
            order.status === "COMPLETED"
              ? "text-green-600"
              : order.status === "PROCESSING"
              ? "text-yellow-600"
              : order.status === "ACCEPTED"
              ? "text-blue-600"
              : "text-red-600"
          }`}
        >
          {order.deal?.token}/{order.deal?.fiat}
        </span>

        <span
          className={`px-2 py-0.5 text-xs rounded-md ${
            order.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : order.status === "PROCESSING"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "ACCEPTED"
              ? "bg-blue-100 text-blue-600"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Token Amount</span>
        <span className="text-black font-medium">{order.tokenAmount}</span>
      </div>

      {/* <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Fiat Amount</span>
        <span className="text-black font-medium">{order.fiatAmount}</span>
      </div> */}

      <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Price</span>
        <span className="text-black font-medium">{order.deal?.price}</span>
      </div>

     

      {/* <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Payment Method</span>
        <span className="text-black font-medium">
          {order.deal?.paymentMethods?.join(", ")}
        </span>
      </div> */}

      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600 text-sm">Hash</span>
        <span
          className="text-blue-600 cursor-pointer flex items-center gap-1"
          onClick={() => handleCopy(order.hash)}
        >
          {order.hash?.substring(0, 10)}...
          <img src={CopyIcon} alt="copy" className="w-4 h-4" />
        </span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600 text-sm">id</span>
        <span
          className="text-blue-600 cursor-pointer flex items-center gap-1"
          onClick={() => handleCopy(order._id)}
        >
          {order._id?.substring(0, 10)}...
          <img src={CopyIcon} alt="copy" className="w-4 h-4" />
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm">Completed At</span>
        <span className="text-gray-700 text-sm">
          {order.timestamps?.completedAt
            ? new Date(order.timestamps.completedAt).toLocaleString()
            : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default Orders;
