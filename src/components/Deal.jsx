import React, { useState, useEffect } from "react";
import { getData, postData } from "../api/protectedApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Timer from "./Timer";
import ExchangeIcon from "../assets/images/exchnage.png";
import DealModal from "./DealModal"; // Adjust path if needed
import BuyerPaymentCard from "../components/BuyerPaymentCard";
import UsdtIcon from "../assets/images/usdt.png";

const Deal = () => {
  const [dealList, setDealList] = useState([]);
  const [currentDeal, setCurrentDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBuyerFormOpen, setIsBuyerFormOpen] = useState(false);
  const [dealDetail, setDealDetail] = useState({});
  const [currentDealId, setCurrentDealId] = useState(null);

  const navigate = useNavigate();

  // // Fetch deals on mount
  // useEffect(() => {
  //   getData("/user/allDeals", {})
  //     .then((res) => {
  //       if (res.data.data.dealStatus === false) {
  //         setDealList(res.data.data.deals);
  //       } else {
  //         setCurrentDetail(res.data.data.deal);
  //       }
  //       console.log("data ", res.data.data);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  const fetchDeals = () => {
    setDealList([]);
    setCurrentDetail(false);
    getData("/user/allDeals", {})
      .then((res) => {
        if (res.data.data.dealStatus === false) {
          setDealList(res.data.data.deals);
        } else {
          setCurrentDetail(res.data.data.deal);
        }
        console.log("data ", res.data.data);
      })
      .catch((err) => console.error(err));
  };

  // Fetch deals when component mounts
  useEffect(() => {
    fetchDeals();
  }, []);


  const showDealDetails = (deal) => {
    setDealDetail(deal);
    setIsOpen(true);
  };

  const hideBuyerPaymentCard = () => {
    setIsBuyerFormOpen(false);
  };

  // ✅ Updated: Handle pick deal with navigation
  const handleDeal = async (dealId) => {
    const confirmed = window.confirm("Are you sure you want to pick this deal?");
    if (!confirmed) return;

    try {
      const res = await postData("/user/pickDeal", { id: dealId });
      console.log("Deal picked:", res);

      if (res?.success) {
        toast.success("Deal picked successfully!"); // ✅ Close modal
        setIsOpen(false);

        // ✅ Refresh deal list (soft reload)
        fetchDeals();
      } else {
        toast.error(res?.data?.message || "Failed to pick deal.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to pick deal. Please try again.");
    }
  };




  return (
    <>
      {/* Active / Current Deal */}
      {currentDeal && (
        <div className="border border-[var(--bg-color)] pt-2 px-4 pb-4 relative overflow-hidden  rounded-xl">
          <div className="flex justify-between items-center mb-1">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <img src={UsdtIcon} className="w-5 h-5 shrink-0" alt="usdt" />
                <span className="ml-2 font-medium text-sm text-black">
                  {currentDeal?.seller?.name}
                </span>
              </div>
              <div className="flex justify-end">
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-2">
            Your Deal - #{currentDeal?._id}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-lg font-medium">
                ₹{currentDeal?.deal?.price}
                <span className="text-lg text-gray-500">/USDT</span>
              </div>
              <div className="text-xs text-gray-500">
                Quantity: {currentDeal?.deal?.availableAmount} <br />
                Payable: {currentDeal?.fiatAmount} ₹
                <p>UPI</p>
              </div>
            </div>

            {currentDeal.status === "PENDING" ? (
              <button className="bg-[var(--success)] text-white px-4 py-1 rounded cursor-pointer">
                WAITING
              </button>
            ) : currentDeal.status === "ACCEPTED" ? (
              <button
                className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded"
                onClick={() => {
                  setCurrentDealId(currentDeal?._id);
                  setIsBuyerFormOpen(true);
                }}
              >
                PAY
              </button>
            ) : (
              <button className="bg-[var(--success)] text-white px-4 py-1 rounded">
                VIEW
              </button>
            )}
          </div>
          <div className="border-t border-dashed mt-4">
            <Timer expireAt={currentDeal.timestamps.expireAt} />
          </div>
        </div>
      )}

      {/* Buyer Payment Card */}
      {isBuyerFormOpen && (
        <BuyerPaymentCard
          id={currentDealId}
          closeBuyerForm={hideBuyerPaymentCard}
        />
      )}

      {/* Deal Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>

            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-full border-b border-[var(--border-light)] pb-3 mb-4">
                <h2 className="text-base font-medium tracking-wide">
                  {dealDetail?.seller?.name}
                </h2>
                {/* <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-100 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black rounded-full"
                >
                  ✕
                </button> */}
              </div>

              <div className="flex justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-[9px] bg-[var(--button-light)] text-blue-600 font-medium rounded-lg px-3 py-2 text-sm flex-1">
                  <span className="text-[var(--text-color)] font-semibold text-sm">
                    From
                  </span>
                  <span className="flex text-black text-sm gap-[5px]">
                    <span className="text-[var(--link-color)]">₹</span> Rupees
                  </span>
                </div>
                <img src={ExchangeIcon} alt="exchange" />
                <div className="flex items-center gap-3.5 bg-[var(--button-light)] text-green-600 font-medium rounded-lg px-3 py-2 text-sm flex-1">
                  <span className="text-[var(--text-color)] font-semibold text-sm mr-2">
                    To
                  </span>
                  <span className="text-black text-sm flex gap-[5px]">
                    <img className="h-4 w-4" src={UsdtIcon} alt="usdt" />
                    {dealDetail.token}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full mb-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Amount
                </label>
                <span className="text-black text-sm">
                  <span className="text-[var(--link-color)]">₹</span>{" "}
                  {dealDetail?.price * dealDetail?.availableAmount}
                </span>
              </div>

              <div className="w-full mb-4 mt-4 flex justify-between text-sm text-[var(--text-color)]">
                <p>Amount in {dealDetail.token}</p>
                <span className="text-black text-sm flex items-center gap-1">
                  <img src={UsdtIcon} alt="usdt" />
                  {dealDetail?.availableAmount}
                </span>
              </div>

              <button
                type="button"
                className="w-full py-2 mt-6 rounded-lg bg-[var(--bg-color)] text-white font-normal text-base hover:bg-blue-700 cursor-pointer"
                onClick={() => handleDeal(dealDetail._id)}
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
            className="border-b border-[var(--border-light)] pt-0 px-4 pb-4 relative overflow-hidden transition-all hover:border hover:border-blue-500 hover:rounded-md"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <img src={UsdtIcon} className="w-5 h-5 shrink-0" alt="usdt" />
                <span className="ml-2 font-medium text-sm text-black">
                  {deal.seller.name}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-2">
              Deal - #{deal._id}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-lg font-medium">
                  ₹{deal.price}
                  <span className="text-sm text-gray-500">/USDT</span>
                </div>
                <div className="text-xs text-gray-500">
                  Quantity: {deal.availableAmount} <br />
                  Payable: {deal.price * deal.availableAmount} ₹
                  <p>{deal.paymentMethods.join(", ")}</p>
                </div>
              </div>

              <button
                onClick={() => showDealDetails(deal)}
                className="bg-[var(--red)] text-white text-sm px-4 py-[6px] rounded"
              >
                Deal
              </button>
              {/* <p><Timer expireAt={deal.timestamps.expireAt} /></p> */}

            </div>
          </div>

        ))}
    </>
  );
};

export default Deal;
