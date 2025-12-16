import React, { useState, useEffect } from "react";
import UsdtIcon from "../assets/images/usdt.png";
import { getData, postData } from "../api/protectedApi";
import Timer from "./Timer";
import SellerPaymentCard from "./SellerPaymentCard";
import { toast, ToastContainer } from "react-toastify";

const Accept = () => {
  const [acceptedDeals, setAcceptedDeals] = useState([]);
  const [isSellerOpen, setIsSellerFormOpen] = useState(false);
  const [currentDealId, setCurrentDealId] = useState(null);
  const [loading, setLoading] = useState(false);

  const showRequest = async () => {
    try {
      setLoading(true);
      const res = await getData("/user/getRequests", {});

      const data =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data ||
        [];

      const list = Array.isArray(data) ? data : data.acceptedDeals || [];

      setAcceptedDeals(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setAcceptedDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showRequest();

    const interval = setInterval(() => {
      showRequest();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const UpdateDealStatus = async (dealId, status) => {
    const action = status === "ACCEPTED" ? "Accept" : "Reject";
    if (!window.confirm(`Are you sure you want to ${action} this offer?`)) return;

    try {
      const res = await postData("/user/manageDeal", { id: dealId, status });

      const success = res?.success;
      const message = res?.message || "Something went wrong";

      if (success) {
        toast.success(message); // Shows backend success message
        await showRequest();    // Refresh data
      } else {
        toast.error(message);   // Shows backend fail message
      }

    } catch (err) {
      console.error("Error updating deal status:", err);
      const errMsg = err?.message || "Something went wrong";
      toast.error(errMsg);
    }
  };




  const hideSellerPaymentCard = () => {
    setIsSellerFormOpen(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Seller payment modal */}
      {isSellerOpen && (
        <SellerPaymentCard id={currentDealId} closeSellerForm={hideSellerPaymentCard} />
      )}

      {/* Loading placeholder (optional) */}
      {loading && acceptedDeals.length === 0 && <p className="text-center py-4">Loading...</p>}

      {/* If no deals */}
      {!loading && acceptedDeals.length === 0 && (
        <p className="text-center py-4 text-gray-500">No requests found.</p>
      )}

      {acceptedDeals.map((deal) => (
        <div
          key={deal._id}
          className="border border-[var(--bg-color)] rounded-lg p-4 shadow-sm relative overflow-hidden mb-4"
        >
          <div className="absolute top-0 right-0 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-bl-full text-[8px] font-semibold leading-4">
            Featured Deal
          </div>

          <div className="flex justify-between items-center mb-1">
            <div className="items-center flex">
              <img src={UsdtIcon} alt="usdt" className="shrink-0 w-5 h-5" />
              <span className="ml-2 font-medium text-sm text-black">
                {deal.buyer?.name} {deal.buyer?.country ? `— ${deal.buyer.country}` : ""}
              </span>

              <span className="ml-2">
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0.5L11.0206 6.71885H17.5595L12.2694 10.5623L14.2901 16.7812L9 12.9377L3.70993 16.7812L5.73056 10.5623L0.440492 6.71885H6.97937L9 0.5Z" fill="#A707F1" />
                </svg>
              </span>
            </div>
          </div>

          <div className="text-xs font-normal text-[var(--text-color)] mb-2">
            Trade(s) {deal.tradeCount || 0} ({deal.successRate || "—"}%)
          </div>

          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="text-lg">
                <span className="text-sm font-bold">₹</span> {deal.price ?? deal.deal?.price ?? "—"}
                <span className="text-sm text-[var(--text-color)]">/USDT</span>
              </div>

              <div className="text-xs text-[var(--text-color)]">
                Amount req. {deal.deal?.availableAmount ?? deal.availableAmount ?? 0}
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 shrink-0">
              {deal.status === "PENDING" ? (
                <>
                  <button
                    className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded"
                    onClick={() => UpdateDealStatus(deal._id, "REJECTED")}
                  >
                    Reject
                  </button>

                  <button
                    className="bg-[var(--success)] text-white px-4 py-1 rounded"
                    onClick={() => UpdateDealStatus(deal._id, "ACCEPTED")}
                  >
                    Accept
                  </button>
                </>
              ) : deal.status === "PAID" ? (
                <button
                  className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded"
                  onClick={() => {
                    setCurrentDealId(deal._id);
                    setIsSellerFormOpen(true);
                  }}
                >
                  View
                </button>
              ) : (
                <button className="bg-[var(--success)] text-white px-4 py-1 rounded">
                  Waiting for Validation
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-dashed mt-4 pt-2">
            {/* <Timer expireAt={deal.timestamps?.expireAt} /> */}
            <Timer
              expireAt={deal?.timestamps?.expireAt}
              // label="Deal Timer"
              status={deal?.status}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Accept;
