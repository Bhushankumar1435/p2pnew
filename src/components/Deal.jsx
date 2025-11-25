import React, { useState, useEffect } from "react";
import { getData, postData } from "../api/protectedApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Timer from "./Timer";
import ExchangeIcon from "../assets/images/exchnage.png";
import BuyerPaymentCard from "../components/BuyerPaymentCard";
import UsdtIcon from "../assets/images/usdt.png";

const Deal = () => {
  const [dealList, setDealList] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyerFormOpen, setIsBuyerFormOpen] = useState(false);
  const [dealDetail, setDealDetail] = useState({});
  const [currentDealId, setCurrentDealId] = useState(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // FETCH DEALS
  
  const fetchDeals = async (pageToLoad = 1) => {
    try {
      const res = await getData("/user/allDeals", { page: pageToLoad, limit: 10 });
      const d = res?.data?.data;
      if (!d) return;

      if (d.dealStatus === false) {
        const newDeals = d.deals || [];
        if (pageToLoad === 1) {
          setDealList(newDeals);
        } else {
          setDealList((prev) => [...prev, ...newDeals]);
        }

        setHasMore(newDeals.length >= 10); 
        setCurrentDeal(false);
      } else {
        setCurrentDeal(d.deal || false);
        setDealList([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDeals(1); // initial load
  }, []);

  // =======================
  // Infinite scroll
  // =======================
  useEffect(() => {
    const onScroll = () => {
      if (loadingMore || !hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDeals(nextPage);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, hasMore, loadingMore]);

  // =======================
  // Utility: Show backend messages safely
  // =======================
  const showBackendMessage = (res, fallback = "Something went wrong") => {
    const message =
      res?.message ?? res?.data?.message ?? res?.data ?? fallback;
    return message;
  };

  // =======================
  // Pick Deal
  // =======================
  const handleDeal = async (dealId) => {
    const confirmed = window.confirm("Are you sure you want to pick this deal?");
    if (!confirmed) return;

    try {
      const res = await postData("/user/pickDeal", { id: dealId });

      if (res?.success === true) {
        toast.success(showBackendMessage(res, "Deal picked successfully"));
        setIsOpen(false);
        fetchDeals(1);
        setPage(1);
        return;
      }

      toast.error(showBackendMessage(res, "Failed to pick deal"));
    } catch (err) {
      console.error(err);
      toast.error("Request failed. Try again.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Current Active Deal */}
      {currentDeal && (
        <div className="border border-[var(--bg-color)] pt-2 px-4 pb-4 rounded-xl relative mb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <img src={UsdtIcon} className="w-5 h-5" alt="usdt" />
              <span className="ml-2 font-medium text-sm text-black">
                {currentDeal?.seller?.name}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-2">
            Your Deal - #{currentDeal?._id}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-lg font-medium">
                ₹{currentDeal?.deal?.price}
                <span className="text-sm text-gray-500">/USDT</span>
              </div>
              <div className="text-xs text-gray-500">
                Quantity: {currentDeal?.deal?.availableAmount} <br />
                Payable: {currentDeal?.fiatAmount} ₹
                <p>UPI</p>
              </div>
            </div>

            {currentDeal.status === "PENDING" && (
              <button className="bg-[var(--success)] text-white px-4 py-1 rounded">
                WAITING
              </button>
            )}

            {currentDeal.status === "ACCEPTED" && (
              <button
                className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded"
                onClick={() => {
                  setCurrentDealId(currentDeal?._id);
                  setIsBuyerFormOpen(true);
                }}
              >
                PAY
              </button>
            )}

            {currentDeal.status !== "PENDING" &&
              currentDeal.status !== "ACCEPTED" && (
                <button className="bg-[var(--success)] text-white px-4 py-1 rounded">
                  VIEW
                </button>
              )}
          </div>

          <div className="border-t border-dashed mt-4 pt-2">
            {/* <Timer expireAt={currentDeal.timestamps.expireAt} /> */}
            <Timer
              expireAt={currentDeal?.timestamps?.expireAt}
              // label="Deal Timer"
              status={currentDeal?.status}
            />
          </div>
        </div>
      )}

      {isBuyerFormOpen && (
        <BuyerPaymentCard
          id={currentDealId}
          closeBuyerForm={() => setIsBuyerFormOpen(false)}
        />
      )}

      {/* Deal Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-full border-b pb-3 mb-4">
                <h2 className="text-base font-medium">{dealDetail?.seller?.name}</h2>
              </div>

              <div className="w-full flex justify-between items-center gap-3 mb-4">
                <div className="flex items-center justify-center gap-2 bg-[var(--button-light)] px-3 py-2 rounded-lg text-sm flex-1">
                  <span className="text-black font-semibold">From</span>
                  <span className="text-black flex items-center ">
                    <span className="block">₹</span> Rupees
                  </span>
                </div>

                <img src={ExchangeIcon} alt="exchange" />

                <div className="flex items-center justify-center gap-3 bg-[var(--button-light)] px-3 py-2 rounded-lg text-sm flex-1">
                  <span className="text-black font-semibold">To</span>
                  <span className="flex items-center gap-1">
                    <img className="h-4 w-4" src={UsdtIcon} alt="usdt" />
                    {dealDetail.token}
                  </span>
                </div>
              </div>

              <div className="w-full mb-2 flex justify-between">
                <label className="text-sm text-gray-600">Amount</label>
                <span className="text-black text-sm">
                  ₹ {dealDetail?.price * dealDetail?.availableAmount}
                </span>
              </div>

              <div className="w-full mb-4 mt-4 flex justify-between text-sm">
                <p>Amount in {dealDetail.token}</p>
                <span className="text-black flex items-center gap-1">
                  <img src={UsdtIcon} alt="usdt" /> {dealDetail?.availableAmount}
                </span>
              </div>

              <button
                onClick={() => handleDeal(dealDetail._id)}
                className="w-full py-2 mt-6 rounded-lg bg-[var(--bg-color)] text-white text-base cursor-pointer"
              >
                Pick Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Deals List */}
      {dealList.length > 0 &&
        dealList.map((deal, index) => (
          <div
            key={index}
            className="border-b border-[var(--border-light)] pt-1.5 px-4 pb-4 hover:border-2 hover:border-gray-500 hover:rounded-md"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <img src={UsdtIcon} className="w-5 h-5" alt="usdt" />
                <span className="ml-2 font-medium text-sm text-black">
                  {deal.seller.name}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-2">Deal - #{deal._id}</div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-lg font-medium">
                  ₹{deal.price}
                  <span className="text-sm text-gray-500"> /USDT</span>
                </div>
                <div className="text-xs text-gray-500">
                  Quantity: {deal.availableAmount} <br />
                  Payable: {deal.price * deal.availableAmount} ₹
                  <p>{deal.paymentMethods.join(", ")}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setDealDetail(deal);
                  setIsOpen(true);
                }}
                className="bg-[var(--red)] text-white text-sm px-4 py-[6px] rounded"
              >
                Deal
              </button>
            </div>
          </div>
        ))}

      {/* Bottom Loader */}
      {loadingMore && (
        <div className="text-center py-4 text-gray-500">Loading more deals...</div>
      )}
    </>
  );
};

export default Deal;
