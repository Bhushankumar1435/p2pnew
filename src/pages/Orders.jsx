import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CopyIcon from "../assets/images/copy_icon.png";
import { getData } from "../api/protectedApi";
import { ToastContainer } from "react-toastify";

const Orders = () => {
  const [tab, setTab] = useState("all_orders");
  const [filter, setFilter] = useState("all");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef(null);

  // FETCH ORDERS FROM BACKEND

  const fetchOrders = async (params = {}, pageToLoad = 1) => {
    // prevent duplicate loads
    if (loading) return;

    setLoading(true);
    try {
      const res = await getData("/user/orderHistory", {
        page: pageToLoad,
        limit: 10,
        ...params,
      });

      const list = (res?.data?.data?.orders) || [];

      if (pageToLoad === 1) {
        setOrders(list);
      } else {
        setOrders((prev) => [...prev, ...list]);
      }

      // if returned list length < limit then no more pages
      setHasMore(list.length >= 10);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      if (pageToLoad === 1) setOrders([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    let statusParam = {};

    if (tab === "processing") statusParam = { status: "PROCESSING" };
    if (tab === "pl-statement") statusParam = { status: "COMPLETED" };
    if (tab === "accepted") statusParam = { status: "ACCEPTED" };

    setPage(1);
    setHasMore(true);
    fetchOrders(statusParam, 1);
  }, [tab]);

  useEffect(() => {
    if (tab !== "all_orders") return;

    let statusParam = {};
    if (filter === "completed") statusParam = { status: "COMPLETED" };
    if (filter === "rejected") statusParam = { status: "REJECTED" };

    setPage(1);
    setHasMore(true);
    fetchOrders(statusParam, 1);
  }, [filter, tab]);

  // Scroll handler attached to scrollable container

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    // when user is within 120px of bottom, load next page
    if (scrollHeight - (scrollTop + clientHeight) < 120) {
      const next = page + 1;
      setPage(next);

      let statusParam = {};
      if (tab === "processing") statusParam = { status: "PROCESSING" };
      if (tab === "pl-statement") statusParam = { status: "COMPLETED" };
      if (tab === "accepted") statusParam = { status: "ACCEPTED" };

      if (tab === "all_orders") {
        if (filter === "completed") statusParam = { status: "COMPLETED" };
        if (filter === "rejected") statusParam = { status: "REJECTED" };
      }

      fetchOrders(statusParam, next);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore, tab, filter]);



  // RENDER

  return (
    <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        {/* This is the actual scroll container — keep its classes (UI unchanged) */}
        <div
          className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]"
          ref={scrollContainerRef}
        >
          <Header />

          <div className="w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto">
            <div className="w-full pt-3">
              {/* Tabs */}
              <div className="flex border-b border-[var(--border-light)] px-4 gap-4 mb-4">
                {[
                  { key: "all_orders", label: "All Orders" },
                  { key: "processing", label: "Processing" },
                  { key: "pl-statement", label: "Profit & Loss Statement" },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`pb-2 text-base font-semibold ${tab === item.key
                      ? "border-b-2 border-blue-500 text-black"
                      : "text-[var(--text-color)]"
                      }`}
                    onClick={() => setTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              {tab === "all_orders" && (
                <div className="flex px-4 mb-4 gap-2">
                  {["all", "completed", "rejected"].map((f) => (
                    <button
                      key={f}
                      className={`px-3 py-1 rounded-md border ${filter === f
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

              {/* Orders list */}
              <div className="w-full px-4">
                {!loading && orders.length === 0 && (
                  <p className="text-center text-gray-400 py-10">No orders found.</p>
                )}

                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}

                {/* bottom loader / end message */}
                {loading && (
                  <p className="text-center text-gray-500 py-4">Loading...</p>
                )}

                {!hasMore && !loading && orders.length > 0 && (
                  <p className="text-center text-gray-400 py-4">No more orders.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

// =====================================================================
// ORDER CARD COMPONENT (UI kept the same)
// =====================================================================
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

      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-600 text-sm">Receipt</span>

        {order.status === "COMPLETED" ? (
          order.deal?.buyerReceipt ? (
            <a
              href={order.deal.buyerReceipt}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              {order.deal.buyerReceipt.length > 20
                ? `${order.deal.buyerReceipt.slice(0, 10)}...${order.deal.buyerReceipt.slice(-10)}`
                : order.deal.buyerReceipt}
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )}
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
