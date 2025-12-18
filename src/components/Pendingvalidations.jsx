import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import { getUserOrderhistory, getUserPercentApi } from "../api/protectedApi";
import { useNavigate } from "react-router-dom";


const statusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const Pendingvalidations = () => {
  const [deals, setDeals] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [profitPercent, setProfitPercent] = useState(0);

  const navigate = useNavigate();

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res = await getUserOrderhistory(page, limit);

    if (res?.success) {
      const newOrders = Array.isArray(res?.data?.orders)
        ? res.data.orders
        : [];

      setDeals((prev) => [...prev, ...newOrders]);

      if (newOrders.length < limit) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } else {
      toast.error(res?.message || "Failed to fetch orders");
    }

    setLoading(false);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchOrders();
    fetchProfitPercent();
    // eslint-disable-next-line
  }, []);

  const fetchProfitPercent = async () => {
    const res = await getUserPercentApi();

    if (res?.success) {
      setProfitPercent(res.percents);
    } else {
      toast.error(res?.message);
    }
  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 120) {
        fetchOrders();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  /* ================= MODAL HANDLERS ================= */
  const handlePick = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[var(--primary)] flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-[600px] bg-white flex flex-col shadow-lg">
        <Header />

        <div className="flex-1 px-3 py-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">
            Pending Validations
          </h2>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border text-sm rounded-lg ">
              <thead className="bg-blue-50 text-center">
                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Buyer</th>
                  <th className="border p-2">Seller</th>
                  <th className="border p-2">Token</th>
                  <th className="border p-2">Fiat</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {deals.map((deal, index) => (
                  <tr
                    key={deal._id}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                          deal.status
                        )}`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {deal.buyer?.userId || "—"}
                    </td>
                    <td className="border p-2">
                      {deal.seller?.userId || "—"}
                    </td>
                    <td className="border p-2 font-medium">
                      {deal.tokenAmount}
                    </td>
                    <td className="border p-2 font-medium">
                      {deal.fiatAmount}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handlePick(deal)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Pick
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden flex flex-col gap-4">
            {deals.map((deal, index) => (
              <div
                key={deal._id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-bold">#{index + 1}</span>
                  <td className="border p-0.5 rounded-md">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                        deal.status
                      )}`}
                    >
                      {deal.status}
                    </span>
                  </td>
                </div>
                <div className="w-full flex justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">
                      <b>Buyer:</b> {deal.buyer?.userId || "—"}
                    </p>
                    <p className="text-sm">
                      <b>Seller:</b> {deal.seller?.userId || "—"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">
                      <b>Token:</b> {deal.tokenAmount}
                    </p>
                    <p className="text-sm">
                      <b>Fiat:</b> {deal.fiatAmount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handlePick(deal)}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded"
                >
                  Pick
                </button>
              </div>
            ))}
          </div>

          {/* ================= BOTTOM LOADER ================= */}
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-7 h-7 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-sm text-gray-400 py-4">
              No more orders
            </p>
          )}
        </div>

        <Footer />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[90%] max-w-[400px] p-6">
            <h3 className="text-lg font-semibold mb-3">
              Confirm Order Pickup
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              To be able to validate crypto transaction and earn
              <b className="text-green-600"> {profitPercent}% mining income</b> , please upgrade to Validator Account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pendingvalidations;
