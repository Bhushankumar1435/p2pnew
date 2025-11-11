import React, { useState } from 'react';
import ExchangeIcon from '../assets/images/exchnage.png'
import UsdtIcon from '../assets/images/usdt.png'

const DealModal = ({ isOpen, onClose, onDealConfirmed , dealDetail }) => {
  const [amountInINR] = useState(9200);
  const usdtRate = 92; // ₹92 per USDT
  const amountInUSDT = (amountInINR / usdtRate).toFixed(2);

  const handleDeal = () => {
    onDealConfirmed(); // ✅ trigger parent update
    onClose();         // ✅ close modal after confirming
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-[99] bg-opacity-50">
      <div className="bg-white w-full max-w-xs mx-auto rounded-xl p-5 relative shadow-lg">
        <div className='flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-light)]'>
            <h2 className="text-base font-medium text-center tracking-wide">Please enter the amount {dealDetail?.seller?.name}</h2>
            <button
          onClick={onClose}
          className="right-3 top-3 bg-gray-100 w-6 h-6 leading-6 flex items-center justify-center text-gray-400 hover:text-black text-base"
        >
          ✕
        </button>
        </div>
        

        

        {/* Currency selector row */}
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-[var(--button-light)] text-blue-600 font-medium rounded-lg px-3 py-2 text-sm flex-1">
            <span className='text-[var(--text-color)] font-semibold text-sm'>From</span>
            <span className="text-black text-sm"><span className='text-[var(--link-color)]'>₹</span> Rupees</span>
          </div>
          <img src={ExchangeIcon} />
          <div className="flex items-center gap-1  bg-[var(--button-light)] text-green-600 font-medium rounded-lg px-3 py-2 text-sm flex-1">
            <span className='text-[var(--text-color)] font-semibold text-sm mr-2'>To</span>
            <span className="text-black text-sm flex items-center gap-1"><img src={UsdtIcon} /> USDT</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-2">
          <label className="block text-sm text-gray-600 mb-1">Amount</label>
          <div className="border-b border-[var(--border-light)] text-base text-black rounded-0">
            <span className='text-[var(--text-color)]'>₹</span> {amountInINR.toLocaleString()}
          </div>
        </div>

        {/* Converted Amount */}
        <div className="mb-4 mt-4 flex justify-between text-sm text-[var(--text-color)]">
          Amount in USDT <span className="text-black ml-2">${amountInUSDT}</span>
        </div>

        {/* Deal Button */}
        <button
          onClick={handleDeal}
          className="w-full py-2 mt-6 rounded-lg bg-[var(--bg-color)] text-white font-normal text-base hover:bg-blue-700"
        >
          Deal
        </button>
      </div>
    </div>
  );
};

export default DealModal;
