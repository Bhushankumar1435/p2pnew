import React, { useState, useEffect } from "react";
import { getData, cancelDeal } from "../../api/protectedApi";
import { toast } from "react-toastify";

const MyAds = ({ ads = [] }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await getData("/user/myDeals");
      console.log("📦 My Deals API Response:", res);

      // ✅ Correct extraction based on your actual JSON
      const fetchedDeals = res?.data?.data?.deals || [];
      console.log("✅ Deals extracted:", fetchedDeals);

      setDeals(fetchedDeals);
    } catch (err) {
      console.error("❌ Error fetching deals:", err);
      toast.error("Failed to fetch deals");
    }
  };

  const handleRemove = async (dealId) => {
    if (!window.confirm("Are you sure you want to cancel this deal?")) return;

    setLoading(true);
    try {
      console.log("🚀 Canceling deal with ID:", dealId);
      const res = await cancelDeal(dealId);
      console.log("🧾 Cancel deal response:", res);

      if (res?.success) {
        toast.success(res.message || "Deal canceled successfully!");
        setDeals((prevDeals) => prevDeals.filter((deal) => deal._id !== dealId));
      } else {
        toast.error(res?.message || "Failed to cancel deal.");
      }
    } catch (err) {
      console.error("❌ Cancel deal error:", err);
      toast.error("Something went wrong while canceling the deal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* <h2 className="text-xl font-semibold text-center mb-4">My Ads</h2> */}

      {deals.length === 0 ? (
        <p className="text-center text-gray-500">No deals found.</p>
      ) : (
        deals.map((deal, index) => (
          <div
            key={deal._id || index}
            className="flex items-baseline-last justify-between p-4 border rounded-md shadow-sm bg-white max-w-xl mx-auto"
          >
            <div>
              <p className="text-2xl font-semibold text-black mt-1">
                ₹ {deal.price}{" "}
                <span className="text-sm font-normal text-gray-500">/USDT</span>
              </p>
              <p className="text-black underline mt-2">
                Quantity {deal.availableAmount} USDT
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Payable ₹ {deal.availableAmount * deal.price}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    deal.status === "COMPLETED"
                      ? "text-green-600"
                      : deal.status === "PROCESSING"
                      ? "text-yellow-600"
                      : "text-gray-800"
                  }`}
                >
                  {deal.status}
                </span>
              </p>
            </div>

            <div className="flex items-center">
              {deal.status === "PENDING" ? (
                <button
                  onClick={() => handleRemove(deal._id)}
                  disabled={loading}
                  className="bg-gray-100 text-red-600 font-medium px-4 py-2 rounded-md hover:bg-red-100 disabled:opacity-50"
                >
                  {loading ? "Removing..." : "Remove"}
                </button>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  Not cancellable
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAds;
