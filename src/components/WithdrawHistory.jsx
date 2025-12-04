import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getWithdrawOrders } from "../api/api";

const WithdrawHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);

  const tabs = [
    { label: "Pending", value: "PENDING" },
    { label: "approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" }
  ];

  useEffect(() => {
    loadHistory(activeTab, page);
  }, [activeTab, page]);

  const loadHistory = async (status, pageNo) => {
    setLoading(true);

    const res = await getWithdrawOrders(limit, pageNo, status);

    if (res.success) {
      setOrders(res.data?.data || []);
      setTotalCount(res.data?.count || 0);
    } else {
      setOrders([]);
      setTotalCount(0);
    }

    setLoading(false);
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <>
      <div className="max-w-[600px] mx-auto w-full bg-[var(--primary)]">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="min-h-screen flex flex-col items-center bg-white text-black">
          <div className="h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]">
            <Header />

            <div className="w-full bg-[var(--primary)] rounded-t-xl">
              <div className="w-full py-5 px-3">

                {/* Header */}
                <div className="flex mt-4 mb-4">
                  
                  <h2 className="text-xl font-bold">Withdraw History</h2>
                </div>

                {/* Tabs (Responsive) */}
                <div className="flex w-full bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                  {tabs.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleTabChange(t.value)}
                      className={`flex-1 py-2 text-sm sm:text-base font-semibold transition-all ${
                        activeTab === t.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                  {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-500 text-center mt-10">
                      No {activeTab.toLowerCase()} orders found.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-xl p-3 sm:p-4 bg-gray-50 shadow-sm text-sm sm:text-base"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">Amount:</span>
                            <span className="font-bold text-blue-600">
                              ${item.amount}
                            </span>
                          </div>

                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">Status:</span>
                            <span
                              className={`font-semibold ${
                                item.status === "PENDING"
                                  ? "text-yellow-600"
                                  : item.status === "APPROVED"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-semibold">Date:</span>
                            <span>
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination (Mobile Friendly) */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-5 text-sm sm:text-base">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          page === 1
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        Prev
                      </button>

                      <span className="font-semibold">
                        Page {page} / {totalPages}
                      </span>

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          page === totalPages
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default WithdrawHistory;
