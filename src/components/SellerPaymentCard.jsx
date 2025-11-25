import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getData, postData } from '../api/protectedApi';

const BuyerPaymentCard = ({ id, closeSellerForm }) => {
  const [dealDetail, setDealDetail] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    getData('/user/billDetails?id=' + id, {})
      .then((res) => {
        if (res.data.success) {
          setDealDetail(res.data.data[0]);
        } else {
          console.log('No data found');
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

const updateOrderStatus = async (status) => {
  const showStatus = status === 'CONFIRMED' ? 'Confirm' : 'Reject';
  const confirmed = window.confirm(`Are you sure you want to ${showStatus} this order?`);

  if (!confirmed) return;

  try {
    const resp = await postData('/user/confirmCurrency', { id, status });

    // console.log("API Response:", resp);

    // Safety fix: ensure resp is always an object
    const success = resp?.success ?? false;
    const message = resp?.message ?? "Something went wrong";

    if (success) {
      toast.success(message);
      setTimeout(() => {
        closeSellerForm();
      }, 1500);
    } else {
      toast.error(message);
    }

  } catch (err) {
    console.error("Caught Error:", err);
    toast.error(err?.message || "Something went wrong");
  }
};


  if (!dealDetail) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-[320px] mx-auto bg-white rounded-2xl shadow-lg p-4 text-gray-800 font-sans relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-3 text-gray-400 text-xl"
            onClick={closeSellerForm}
          >
            &times;
          </button>

          {/* Buyer Info */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Buyer Info</h2>
          </div>
          <div className="text-sm space-y-1 border-b pb-2">
            <div className="flex justify-between pb-1">
              <span>Name</span>
              <span>{dealDetail?.buyerName}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-sm space-y-1 border-b py-3">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>{dealDetail?.fiatAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Commission (2.5%)</span>
              <span>{dealDetail?.buyerCommission} rs</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600 border-t pt-5 mt-5">
              <span>Total Amount</span>
              <span>
                {parseFloat(dealDetail?.fiatAmount) + parseFloat(dealDetail?.buyerCommission)} rs
              </span>
            </div>
          </div>

          {/* Bank Info */}
          {dealDetail?.bankDetails?.name && (
            <div className="py-3 space-y-1 text-sm border-b">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{dealDetail?.bankDetails?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Acc. No.</span>
                <span>{dealDetail?.bankDetails?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IFSC Code</span>
                <span>{dealDetail?.bankDetails?.ifscCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Bank</span>
                <span>{dealDetail?.bankDetails?.bankName}</span>
              </div>
            </div>
          )}

          {/* UPI ID */}
          {dealDetail?.bankDetails?.upi && (
            <div className="py-4 space-y-1 text-sm border-b">
              <div className="flex justify-between">
                <span className="text-gray-500">UPI ID</span>
                <span>{dealDetail?.bankDetails?.upi}</span>
              </div>
            </div>
          )}

          {/* Receipt and Actions */}
          <div className="flex flex-col pt-7 gap-5">
            <img
              src={dealDetail?.buyerReceipt}
              alt="Receipt Preview"
              className="w-full h-32 object-contain border rounded cursor-pointer"
              onClick={() => setZoomOpen(true)}
            />

            <div className="flex m-auto gap-4">
              <button
                className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded"
                onClick={() => updateOrderStatus('CONFIRMED')}
              >
                CONFIRM
              </button>
              <button
                className="bg-[var(--button-light)] text-[var(--blue)] px-4 py-1 rounded"
                onClick={() => updateOrderStatus('REJECTED')}
              >
                REJECTED
              </button>
            </div>
          </div>
        </div>

        {zoomOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setZoomOpen(false)}
          >
            <img
              src={dealDetail?.buyerReceipt}
              alt="Zoomed Receipt"
              className="max-w-[90%] max-h-[90%] rounded shadow-lg"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BuyerPaymentCard;
