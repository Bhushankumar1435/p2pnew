import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyIcon from "../assets/images/copy_icon.png";
import { getData } from "../api/protectedApi"; 

const Orders = () => {
  const [tab, setTab] = useState("all_orders");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH ORDERS
  const fetchOrders = async (params = {}) => {
    setLoading(true);

    try {
      const res = await getData("/user/orderHistory", params);

      console.log("🔥 API RAW RESPONSE:", res.data);

      if (res.data.success && Array.isArray(res.data.data.orders)) {
        setOrders(res.data.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setOrders([]);
    }

    setLoading(false);
  };

  // ✅ FETCH on tab change
  useEffect(() => {
    if (tab === "all_orders") fetchOrders();
    if (tab === "processing") fetchOrders({ status: "PROCESSING" });
    if (tab === "pl-statement") fetchOrders({ status: "COMPLETED" });
    if (tab === "accepted") fetchOrders({ status: "ACCEPTED" });
  }, [tab]);

  // ✅ FILTER LOGIC (fixed for REJECTED)
  const filteredOrders =
    tab === "all_orders"
      ? filter === "completed"
        ? orders.filter((o) => o.status === "COMPLETED")
        : filter === "cancelled"
        ? orders.filter((o) => o.status === "CANCELLED" || o.status === "REJECTED")
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

              {/* ✅ ORDERS LIST */}
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

// =========================================================
// ✅ ORDER CARD COMPONENT
// =========================================================

const OrderCard = ({ order }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-600";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusTextColor = () => {
    switch (order.status) {
      case "COMPLETED":
        return "text-green-600";
      case "PROCESSING":
        return "text-yellow-600";
      case "ACCEPTED":
        return "text-blue-600";
      case "REJECTED":
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold ${getStatusTextColor()}`}>
          {order.deal?.token}/{order.deal?.fiat}
        </span>

        <span className={`px-2 py-0.5 text-xs rounded-md ${getStatusColor()}`}>
          {order.status}
        </span>
      </div>

      <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Token Amount</span>
        <span className="text-black font-medium">{order.tokenAmount}</span>
      </div>

      <div className="flex justify-between mb-1">
        <span className="text-gray-600 text-sm">Price</span>
        <span className="text-black font-medium">{order.deal?.price}</span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600 text-sm">Hash</span>
        <span
          className="text-blue-600 cursor-pointer flex items-center gap-1"
          onClick={() => handleCopy(order.hash || "No Hash")}
        >
          {order.hash ? order.hash.substring(0, 10) : "No Hash"}...
          <img src={CopyIcon} alt="copy" className="w-4 h-4" />
        </span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-600 text-sm">ID</span>
        <span
          className="text-blue-600 cursor-pointer flex items-center gap-1"
          onClick={() => handleCopy(order._id)}
        >
          {order._id.substring(0, 10)}...
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
